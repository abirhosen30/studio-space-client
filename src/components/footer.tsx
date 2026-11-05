import Image from "next/image";
import Link from "next/link";
import { FaGithub, FaXTwitter } from "react-icons/fa6";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const columns = [
  {
    title: "Quick Links",
    links: [
      { label: "Explore Studios", href: "/studios" },
      { label: "Host Your Space", href: "/add-studio" },
      { label: "My Listings", href: "/my-listings" },
      { label: "My Bookings", href: "/my-bookings" },
    ],
  },
  {
    title: "Popular Categories",
    links: [
      { label: "Photo Studios", href: "/studios" },
      { label: "Sound Stages", href: "/studios" },
      { label: "Podcast Rooms", href: "/studios" },
      { label: "Music Suites & Art Workshops", href: "/studios" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="border-t border-white/[0.06] bg-[#0e0f11]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-10">
          <div className="lg:col-span-4">
            <Image
              src="/images/Footer-logo.png"
              alt="StudioSpace"
              width={272}
              height={32}
              className="h-8 w-auto mb-4 -ml-1"
            />
            <p className="text-sm leading-relaxed text-zinc-500 max-w-xs mb-6">
              High-performance creative infrastructure marketplace. Connecting
              production crews with acoustically validated soundstages,
              recording facilities, and cycloramas.
            </p>
            <div className="flex items-center gap-2.5">
              <Link
                href="#"
                aria-label="StudioSpace on X"
                className="inline-flex items-center justify-center size-8 rounded-lg border border-white/10 bg-[#1e2025] text-zinc-300 hover:text-white hover:bg-[#2a2d33] transition-colors"
              >
                <FaXTwitter size={14} />
              </Link>
              <Link
                href="#"
                aria-label="StudioSpace on GitHub"
                className="inline-flex items-center justify-center size-8 rounded-lg border border-white/10 bg-[#1e2025] text-zinc-300 hover:text-white hover:bg-[#2a2d33] transition-colors"
              >
                <FaGithub size={15} />
              </Link>
            </div>
          </div>

          {columns.map((column) => (
            <div key={column.title} className="lg:col-span-2">
              <h3 className="text-xs font-semibold tracking-widest uppercase text-zinc-100 mb-4">
                {column.title}
              </h3>
              <ul className="space-y-3">
                {column.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-zinc-400 hover:text-white transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div className="lg:col-span-4">
            <h3 className="text-xs font-semibold tracking-widest uppercase text-zinc-100 mb-4">
              Producer Dispatch
            </h3>
            <p className="text-sm leading-relaxed text-zinc-400 max-w-xs mb-4">
              Weekly notifications on newly decommissioned industrial stages and
              gear drops.
            </p>
            <form className="flex items-center gap-2.5">
              <Input
                type="email"
                required
                placeholder="producer@production.co"
                aria-label="Email address"
                className="h-9 flex-1 rounded-lg border-white/10 bg-[#202228] text-zinc-100 placeholder:text-zinc-600"
              />
              <Button
                type="submit"
                className="h-9 rounded-lg bg-[#ff7a00] px-4 text-white hover:bg-[#ff7a00]/85"
              >
                Join
              </Button>
            </form>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mt-12 pt-6 border-t border-white/[0.06]">
          <p className="text-sm text-zinc-500">
            © 2026 StudioSpace Technologies Inc. All creative rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <Link
              href="#"
              className="text-sm text-zinc-400 hover:text-white transition-colors"
            >
              Privacy Policy
            </Link>
            <Link
              href="#"
              className="text-sm text-zinc-400 hover:text-white transition-colors"
            >
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
