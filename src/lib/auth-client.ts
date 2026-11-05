import { createAuthClient } from "better-auth/react";
export const authClient = createAuthClient({
  /** The base URL of the server (optional if you're using the same domain) */
  baseURL: process.env.BETTER_AUTH_URL,
});

export async function getAuthToken() {
  const { data, error } = await authClient.$fetch<{ token: string }>("/token", {
    method: "GET",
  });

  if (error) {
    throw new Error(error.message || "Could not verify your session.");
  }

  if (typeof data?.token !== "string") {
    throw new Error("Sign in again to continue.");
  }

  return data.token;
}
