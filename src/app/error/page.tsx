import { FileWarning } from "lucide-react";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const code = await searchParams.then((params) => params.code);

  const message = (() => {
    switch (code) {
      case "0":
        return "You are not authorized to use this bot.";
      case "1":
        return "It seems that you are trying to open this application from regular browser. Use the Telegram app instead.";
      default:
        return "An error occurred while trying to open this application.";
    }
  })();

  return (
    <main className="flex items-center justify-center h-screen bg-gray-100 gap-8">
      <div>
        <FileWarning size={64} />
      </div>
      <div className="flex flex-col gap-2">
        <h2 className="text-2xl">Unauthorized</h2>
        <p>{message}</p>
      </div>
    </main>
  );
}
