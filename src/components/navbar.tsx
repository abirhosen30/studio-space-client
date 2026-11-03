"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState } from "react"
import { Bell, House, Moon, Sun } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "cn"

const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "Explore Studios", href: "/studios" },
  { label: "How It Works", href: "#how-it-works" },
  { label: "About Us", href: "#about" },
]

export function Navbar() {
  const pathname = usePathname()
  const [dark, setDark] = useState(true)

  function toggleTheme() {
    const next = !dark
    setDark(next)
    document.documentElement.classList.toggle("dark", next)
  }

  return (
    <header className="p-4 md:px-6 md:pt-6">
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 rounded-2xl border border-white/10 bg-[#1e2025] px-4 shadow-lg shadow-black/20 md:px-6">
        {/* Logo */}
        <Link href="/" className="flex shrink-0 items-center gap-3">
          <span className="flex size-9 items-center justify-center rounded-xl bg-[#ff7a00]">
            <House className="size-5 text-white" strokeWidth={2.5} />
          </span>
          <span className="leading-tight">
            <span className="block text-base font-extrabold tracking-wider text-white">
              STUDIOSPACE
            </span>
            <span className="block text-[10px] font-semibold tracking-[0.2em] text-[#00c5cb]">
              ENGINEERED WORKSPACES
            </span>
          </span>
        </Link>

        {/* Center links */}
        <div className="hidden items-center gap-7 md:flex">
          {NAV_LINKS.map((link) => {
            const active = pathname === link.href
            return (
              <Link
                key={link.label}
                href={link.href}
                className={cn(
                  "text-sm font-medium transition-colors",
                  active
                    ? "text-[#ff7a00] underline decoration-[#ff7a00] decoration-2 underline-offset-4"
                    : "text-zinc-300 hover:text-white",
                )}
              >
                {link.label}
              </Link>
            )
          })}
        </div>

        {/* Right actions */}
        <div className="flex shrink-0 items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            aria-label="Toggle theme"
            onClick={toggleTheme}
            className="rounded-full text-zinc-300 hover:bg-white/10 hover:text-white"
          >
            {dark ? <Sun /> : <Moon />}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            aria-label="Notifications"
            className="hidden rounded-full text-zinc-300 hover:bg-white/10 hover:text-white sm:inline-flex"
          >
            <Bell />
          </Button>
          <Button
            size="sm"
            className="hidden rounded-full bg-[#ff7a00] text-white hover:bg-[#ff9a33] sm:inline-flex"
          >
            Log in
          </Button>
          <Button
            size="sm"
            className="rounded-full bg-[#ff7a00] text-white hover:bg-[#ff9a33]"
          >
            Register
          </Button>
        </div>
      </nav>
    </header>
  )
}
