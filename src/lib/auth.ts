import { betterAuth } from "better-auth";
import { MongoClient } from "mongodb";
import { mongodbAdapter } from "@better-auth/mongo-adapter";
import { jwt } from "better-auth/plugins";

function createAuth() {
  const mongodbUrl = process.env.MONGODB_URL;

  if (!mongodbUrl) {
    throw new Error("MONGODB_URL is required to initialize authentication.");
  }

  const client = new MongoClient(mongodbUrl);
  const db = client.db("studioSpace");

  return betterAuth({
    database: mongodbAdapter(db, {
      client,
    }),
    emailAndPassword: {
      enabled: true,
    },
    socialProviders: {
      google: {
        clientId: process.env.GOOGLE_CLIENT_ID as string,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
      },
    },
    plugins: [
      jwt({
        jwt: {
          definePayload: ({ user }) => ({
            email: user.email,
            name: user.name,
            image: user.image,
          }),
        },
      }),
    ],
    session: {
      cookieCache: {
        enabled: true,
        strategy: "jwt",
        maxAge: 7 * 24 * 60 * 60,
      },
    },
  });
}

type Auth = ReturnType<typeof createAuth>;

let authInstance: Auth | undefined;

export function getAuth(): Auth {
  if (!authInstance) {
    authInstance = createAuth();
  }

  return authInstance;
}
