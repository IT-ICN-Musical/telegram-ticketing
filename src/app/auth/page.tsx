"use client";
import { request } from "@/utils/request";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect } from "react";

type LoginResponse = {
  token: string;
  role: string;
};

function PageContent() {
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
        const resp = await request<LoginResponse>({
          method: "POST",
          path: "api/v1/auth/mini-app/login",
          body: {
            initRawData: init_data,
          },
        });

        if (!resp.success) {
          router.push("/error?code=0");
        } else {
          sessionStorage.setItem("accessToken", resp.data.token);
          router.push("/");
        }
      } catch (error) {
        alert(error);
      }
    })();
  }, [init_data, router]);

  return <></>;
}

export default function Page() {
  return (
    <Suspense>
      <PageContent />
    </Suspense>
  );
}
