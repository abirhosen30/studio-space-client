"use client";
import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { authClient } from "@/lib/auth-client";

export default function RegisterPage() {
  const [googleError, setGoogleError] = useState("");

  const handleGoogleRegister = async () => {
    setGoogleError("");

    try {
      const { error } = await authClient.signIn.social({
        provider: "google",
        callbackURL: "/",
      });

      if (error) {
        setGoogleError(error.message || "Google registration failed.");
      }
    } catch (error) {
      setGoogleError(
        error instanceof Error ? error.message : "Google registration failed.",
      );
    }
  };

  const handleEmailRegister = async (
    event: React.FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const formValues = Object.fromEntries(formData.entries()) as {
      name: string;
      email: string;
      photoUrl: string;
      password: string;
    };

    const { data, error } = await authClient.signUp.email({
      name: formValues.name,
      email: formValues.email,
      password: formValues.password,
      image: formValues.photoUrl || undefined,
    });
    if (data) {
      console.log("User registered successfully:", data);
    }

    if (error) {
      console.error("Error registering user:", error);
    }
  };
  return (
    <main className="flex flex-1 items-center justify-center px-4 py-12">
      <Card className="w-full max-w-md border-white/10 bg-[#1e2025] text-zinc-100">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Create your account</CardTitle>
          <CardDescription className="text-zinc-400">
            Register for StudioSpace
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleEmailRegister}>
            <FieldGroup>
              <Field>
                <Button
                  onClick={handleGoogleRegister}
                  variant="outline"
                  type="button"
                  className="w-full"
                >
                  <svg
                    aria-hidden="true"
                    viewBox="0 0 24 24"
                    className="size-4"
                  >
                    <path
                      fill="currentColor"
                      d="M21.35 12.2c0-.72-.06-1.42-.18-2.1H12v3.98h5.24a4.48 4.48 0 0 1-1.95 2.94v2.45h3.16c1.85-1.7 2.9-4.2 2.9-7.27ZM12 21.75c2.64 0 4.86-.87 6.48-2.35l-3.16-2.45c-.87.58-1.98.93-3.32.93-2.55 0-4.72-1.72-5.5-4.04H3.23v2.53A9.75 9.75 0 0 0 12 21.75ZM6.5 13.84a5.87 5.87 0 0 1 0-3.68V7.63H3.23a9.75 9.75 0 0 0 0 8.74l3.27-2.53ZM12 6.12c1.44 0 2.73.5 3.75 1.5l2.81-2.82C16.85 3.2 14.64 2.25 12 2.25a9.75 9.75 0 0 0-8.77 5.38L6.5 10.16C7.28 7.84 9.45 6.12 12 6.12Z"
                    />
                  </svg>
                  Continue with Google
                </Button>
                {googleError && (
                  <p role="alert" className="text-sm text-red-400">
                    {googleError}
                  </p>
                )}
              </Field>
              <FieldSeparator className="*:data-[slot=field-separator-content]:bg-[#1e2025]">
                Or register with email
              </FieldSeparator>
              <Field>
                <FieldLabel htmlFor="name">Name</FieldLabel>
                <Input
                  id="name"
                  name="name"
                  type="text"
                  placeholder="Your name"
                  autoComplete="name"
                  required
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="email">Email</FieldLabel>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="you@example.com"
                  autoComplete="email"
                  required
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="photoUrl">Photo URL</FieldLabel>
                <Input
                  id="photoUrl"
                  name="photoUrl"
                  type="url"
                  placeholder="https://example.com/photo.jpg"
                  autoComplete="url"
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="password">Password</FieldLabel>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="new-password"
                  required
                />
                <FieldDescription className="text-zinc-400">
                  At least 6 characters, with an uppercase and a lowercase
                  letter.
                </FieldDescription>
              </Field>
              <Field>
                <Button type="submit" className="w-full">
                  Register
                </Button>
                <FieldDescription className="text-center text-zinc-400">
                  Already have an account?{" "}
                  <Link
                    href="/login"
                    className="text-white underline underline-offset-4 hover:text-[#ff9a33]"
                  >
                    Log in
                  </Link>
                </FieldDescription>
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </main>
  );
}
