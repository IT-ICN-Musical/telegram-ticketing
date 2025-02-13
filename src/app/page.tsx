"use client";

import {
  retrieveLaunchParams,
  qrScanner,
  init,
  LaunchParams,
} from "@telegram-apps/sdk-react";
import { useState, useEffect, Suspense } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Scan, User, AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ACCESS_TOKEN_KEY } from "@/consts/local-storage.const";

function Home() {
  const [isSDKInitialized, setIsSDKInitialized] = useState<boolean>();
  const [qrAvailable, setQRAvailable] = useState(false);
  const [launchParams, setLaunchParams] = useState<LaunchParams>();

  const accessToken = sessionStorage.getItem(ACCESS_TOKEN_KEY);
  const isAuthenticated = !!accessToken;

  const router = useRouter();

  const initData = launchParams?.initData;
  const username = initData?.user?.username;

  useEffect(() => {
    try {
      init();
      // authenticate();

      setQRAvailable(qrScanner.open.isAvailable());

      const launchParams = retrieveLaunchParams();

      setLaunchParams(launchParams);
      setIsSDKInitialized(true);
    } catch (error) {
      console.error("Failed to initialize Telegram SDK:", error);
      setIsSDKInitialized(false);
    }
  }, []);

  useEffect(() => {
    if (isSDKInitialized === false || (isSDKInitialized && !qrAvailable)) {
      router.push("/error?code=1");
    } else if (isSDKInitialized && !isAuthenticated) {
      const authUrl =
        "/auth?init_data=" +
        encodeURIComponent(launchParams?.initDataRaw ?? "");
      router.push(authUrl);
    }
  }, [
    isSDKInitialized,
    qrAvailable,
    isAuthenticated,
    router,
    launchParams?.initDataRaw,
  ]);

  const handleQRScan = async () => {
    if (!qrScanner.open.isAvailable()) return;

    try {
      const res = qrScanner.open({
        text: "Scan Viewer Ticket",
        onCaptured: (ticketId: string) => {
          qrScanner.close();
          router.push(`/details/${ticketId}`);
        },
      });
      await res;
    } catch (error) {
      console.error("QR Scanner error:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-md mx-auto space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-gray-900">
            ICN 2025: SENJAKALA
          </h1>
          <p className="text-xl text-gray-600">Ticket Scanner</p>
        </div>

        <Card className="bg-white">
          <CardContent className="pt-6">
            <div className="flex items-center space-x-3 text-gray-700">
              <User size={20} />
              <div>
                <span className="text-sm text-gray-500">Your username:</span>
                <div className="font-medium">
                  {username ? `@${username}` : "No username available"}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {!isSDKInitialized && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>Failed to initialize scanner</AlertDescription>
          </Alert>
        )}

        {!qrAvailable && isSDKInitialized && (
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>Scanner not available</AlertDescription>
          </Alert>
        )}

        <Button
          className="w-full h-32 text-2xl font-bold bg-slate-600 hover:bg-slate-700 flex flex-col items-center justify-center space-y-3"
          onClick={handleQRScan}
          disabled={!qrAvailable || !isSDKInitialized}
        >
          <Scan size={40} />
          <span>SCAN TICKET</span>
        </Button>
      </div>
    </div>
  );
}

export default function Page() {
  return (
    <Suspense>
      <Home />
    </Suspense>
  );
}
