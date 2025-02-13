"use client";
import { request } from "@/utils/request";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";

type LoginRequest = {
  init_raw_data: string;
};
type LoginResponse = {
  access_token: string;
  refresh_token: string;
};

export default function Page() {
  // get init_data
  const router = useRouter();
  const searchParams = useSearchParams();

  const init_data = searchParams.get("init_data");
  if (!init_data) {
    router.push("/error?code=1");
  }

  // attempt to authenticate
  useEffect(() => {
    (async () => {
      try {
        const body = {
          init_raw_data: init_data,
        };

        const resp = await request<LoginResponse>({
          method: "POST",
          path: "v2/auth/mini-app/login",
          body: {
            init_raw_data: init_data,
          },
        });

        if (!resp.success) {
          router.push("/error?code=0");
        } else {
          sessionStorage.setItem("accessToken", resp.data.access_token);
          sessionStorage.setItem("refreshToken", resp.data.refresh_token);
          router.push("/");
        }
      } catch (error) {
        alert(error);
      }
    })();
  }, []);
}
