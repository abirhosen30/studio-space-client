async function getAuthHandlers() {
  const [{ getAuth }, { toNextJsHandler }] = await Promise.all([
    import("@/lib/auth"),
    import("better-auth/next-js"),
  ]);

  return toNextJsHandler(getAuth());
}

export async function GET(request: Request) {
  return (await getAuthHandlers()).GET(request);
}

export async function POST(request: Request) {
  return (await getAuthHandlers()).POST(request);
}