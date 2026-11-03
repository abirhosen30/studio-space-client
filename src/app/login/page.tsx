"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { authClient } from "@/lib/auth-client"

export default function LoginPage() {
  const router = useRouter()

  const handleEmailLogin = async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      const formData = new FormData(event.currentTarget);
      const formValues = Object.fromEntries(formData.entries()) as {
        email: string;
        password: string;
      };

      const { data, error } = await authClient.signIn.email({
        email: formValues.email,
        password: formValues.password,
      })
      if(data) {
        console.log("User logged in successfully:", data);
        router.push("/")
      }

      if(error) {
        console.error("Error logging in user:", error);
      }
    }
  return (
    <main className="flex flex-1 items-center justify-center px-4 py-12">
      <Card className="w-full max-w-md border-white/10 bg-[#1e2025] text-zinc-100">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Login</CardTitle>
          <CardDescription className="text-zinc-400">
            Welcome back to StudioSpace
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleEmailLogin}>
            <FieldGroup>
              <Field>
                <Button variant="outline" type="button" className="w-full">
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
              </Field>
              <FieldSeparator className="*:data-[slot=field-separator-content]:bg-[#1e2025]">
                Or continue with email
              </FieldSeparator>
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
                <div className="flex items-center justify-between">
                  <FieldLabel htmlFor="password">Password</FieldLabel>
                  <Link
                    href="/forgot-password"
                    className="text-sm text-zinc-300 underline-offset-4 hover:text-white hover:underline"
                  >
                    Forgot password?
                  </Link>
                </div>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                />
              </Field>
              <Field>
                <Button type="submit" className="w-full">
                  Login
                </Button>
                <FieldDescription className="text-center text-zinc-400">
                  Don&apos;t have an account?{" "}
                  <Link
                    href="/register"
                    className="text-white underline underline-offset-4 hover:text-[#ff9a33]"
                  >
                    Register
                  </Link>
                </FieldDescription>
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </main>
  )
}
