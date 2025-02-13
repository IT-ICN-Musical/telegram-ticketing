import {
  ACCESS_TOKEN_KEY,
  REFRESH_TOKEN_KEY,
} from "@/consts/local-storage.const";

const MISSING_REFRESH_KEY_ERR = Error(
  "Missing refresh token key in the local storage"
);

async function refreshAccessToken(refreshToken: string): Promise<string> {
  const base = process.env.NEXT_PUBLIC_BACKEND_API_URL;
  const response = await fetch(`${base}/v2/auth/refresh`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ refreshToken }),
  });

  if (!response.ok) {
    throw new Error("Failed to refresh the access token");
  }

  const data = await response.json();
  return data.data.token;
}

export async function protectedFetch(
  input: RequestInfo | URL,
  init?: RequestInit
): Promise<Response> {
  // retrieve the access token from the local storage
  const accessToken = sessionStorage.getItem(ACCESS_TOKEN_KEY);

  if (!accessToken) {
    throw new Error("No token found");
  }

  // add the access token to the request headers
  const headers = {
    ...init?.headers,
    Authorization: `Bearer ${accessToken}`,
  };

  let firstTrial = true;

  while (firstTrial) {
    const resp = await fetch(input, { ...init, headers });

    // TODO: Not a great way to determine if you're request fails due to invalid JWT token or insufficient permissions
    // Maybe in the future need to return a certain extra code that indicates that the token is invalid...
    if (resp.status === 401) {
      // refresh the token
      try {
        const refreshToken = sessionStorage.getItem(REFRESH_TOKEN_KEY);
        if (!refreshToken) {
          throw MISSING_REFRESH_KEY_ERR;
        }
        const newToken = await refreshAccessToken(refreshToken);
        // store the new token in the local storage
        sessionStorage.setItem(ACCESS_TOKEN_KEY, newToken);
        // retry the request
        firstTrial = false;
      } catch (error) {
        sessionStorage.removeItem(ACCESS_TOKEN_KEY);
        if (error === MISSING_REFRESH_KEY_ERR) {
          throw new Error("Missing refresh token key in the local storage");
        }
      }
    } else {
      return resp;
    }
  }

  // something must be wrong with the token
  sessionStorage.removeItem(ACCESS_TOKEN_KEY);
  sessionStorage.removeItem(REFRESH_TOKEN_KEY);
  throw new Error("Failed to refresh the access token");
}
