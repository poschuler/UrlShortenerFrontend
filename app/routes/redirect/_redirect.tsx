import { redirect } from "react-router";
import type { Route } from "./+types/_redirect";

export async function loader({ params }: Route.LoaderArgs) {
  const shortCode = params.shortCode;

  const baseUrl = "http://localhost:5000";
  const endpoint = "/urls";

  const result = await fetch(`${baseUrl}${endpoint}/${shortCode}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    redirect: "manual",
  });

  if (result.status >= 300 && result.status < 400) {
    const location = result.headers.get("Location");
    if (location) {
      return redirect(location, {
        status: result.status,
      });
    }
  }

  return {
    error: "Url not found",
  };
}

export default function Redirect({ loaderData }: Route.ComponentProps) {
  return (
    <main className="flex items-center justify-center pt-16 pb-4">
      <div className="flex-1 flex flex-col items-center gap-12 min-h-0">
        <header className="flex flex-col items-center gap-9">
          <div className="w-[500px] max-w-[100vw] p-4">
            <h1 className="text-2xl font-bold text-center">
              {loaderData.error}
            </h1>
          </div>
        </header>
        <div className="max-w-[300px] w-full space-y-6 px-4"></div>
      </div>
    </main>
  );
}
