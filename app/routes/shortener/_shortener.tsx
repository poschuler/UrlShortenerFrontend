import type { Route } from "./+types/_shortener";
import { Form, type ActionFunctionArgs } from "react-router";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "New React Router App" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();

  const intent = formData.get("intent");

  if (intent === "shorten") {
    const longUrl = formData.get("originUrl")?.toString() || null;

    if (longUrl === null || !isHttpUrl(longUrl)) {
      return {
        shortenedUrl: null,
        longUrl: null,
        error: "Invalid URL",
      };
    }

    const ogUrl = new URL(request.url);

    const baseUrl = "http://localhost:5000";
    const endpoint = "/urls";

    const body = {
      longUrl: longUrl,
    };

    const result = await fetch(`${baseUrl}${endpoint}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    if (!result.ok) {
      return {
        shortenedUrl: null,
        longUrl: null,
        error: "Error shortening URL",
      };
    }

    const data: {
      longUrl: string;
      shortCode: string;
    } = await result.json();

    const shortenerObject = {
      shortenedUrl: `${ogUrl.origin}/${data.shortCode}`,
      longUrl: data.longUrl,
      error: null,
    };

    return shortenerObject;
  }
}

function isHttpUrl(origin: string): boolean {
  try {
    const url = new URL(origin);
    return ["http:", "https:"].includes(url.protocol);
  } catch {
    return false;
  }
}

export default function Shortener({ actionData }: Route.ComponentProps) {
  return (
    <main className="flex items-center justify-center pt-16 pb-4">
      <div className="flex-1 flex flex-col items-center gap-12 min-h-0">
        <header className="flex flex-col items-center gap-9">
          <div className="w-[500px] max-w-[100vw] p-4">
            <h1 className="text-2xl font-bold text-center">UrlShortener</h1>
          </div>
        </header>
        <div className="max-w-[300px] w-full space-y-6 px-4">
          <Form className="flex flex-col gap-4" method="post">
            <input
              type="url"
              name="originUrl"
              required
              autoFocus
              placeholder="Enter URL to shorten"
              className="w-full p-2 border border-gray-300 rounded-md"
            />
            <button
              type="submit"
              className="w-full bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600"
              name="intent"
              value="shorten"
            >
              Shorten URL
            </button>

            {actionData && actionData.error ? <p>{actionData.error}</p> : null}

            {actionData && actionData.shortenedUrl ? (
              <div>
                <p>Shortened URL:</p>
                <p>{actionData.shortenedUrl}</p>
              </div>
            ) : null}
            
            {actionData && actionData.longUrl ? (
              <div>
                <p>Original URL:</p>
                <p>{actionData.longUrl}</p>
              </div>
            ) : null}
          </Form>
        </div>
      </div>
    </main>
  );
}
