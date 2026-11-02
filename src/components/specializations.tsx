import Image from "next/image"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { cn } from "cn"
import { buttonVariants } from "@/components/ui/button"

const specializations = [
  {
    title: "Photography Cyc Walls",
    description:
      "Infinity corner cyc walls, pre-hung Profoto lighting arrays, and daylight skylights.",
    link: "View 24 Spaces",
    href: "#",
    icon: "/images/icons/Photography.png",
    iconWidth: 24,
    iconHeight: 21,
    accent: "#ff7a00",
  },
  {
    title: "Cinema Sound Stages",
    description:
      "Structural box trussing, 20ft ceilings, drive-in roll-up garage, 3-phase power.",
    link: "View 16 Stages",
    href: "#",
    icon: "/images/icons/Cinema.png",
    iconWidth: 24,
    iconHeight: 19,
    accent: "#00c5cb",
  },
  {
    title: "Podcast Lounges",
    description:
      "Share SM7B multi-mic broadcast rigs, Blackmagic ATEM 4K video switchers.",
    link: "View 31 Lounges",
    href: "#",
    icon: "/images/icons/Podcast.png",
    iconWidth: 17,
    iconHeight: 23,
    accent: "#c9a0ff",
  },
  {
    title: "Music Recording Suites",
    description:
      "SSL & Neve consoles, floating drum rooms, custom isolated vocal chambers.",
    link: "View 28 Suites",
    href: "#",
    icon: "/images/icons/Music.png",
    iconWidth: 21,
    iconHeight: 24,
    accent: "#ff9e80",
  },
  {
    title: "Art & Fabrication",
    description:
      "Industrial dust extraction, pneumatic air lines, wash sinks, natural daylight.",
    link: "View 12 Workshops",
    href: "#",
    icon: "/images/icons/Art & Fabrication.png",
    iconWidth: 24,
    iconHeight: 25,
    accent: "#9ecfff",
  },
]

export function Specializations() {
  return (
    <section className="max-w-7xl mx-auto w-full">
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-8">
        <div>
          <p className="text-xs font-semibold tracking-widest text-[#00c5cb] uppercase mb-2">
            Discipline Matrix
          </p>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
            Explore By Studio Specialization
          </h2>
        </div>
        <p className="text-sm leading-relaxed text-zinc-400 max-w-sm sm:text-left">
          Acoustically validated, load-tested electrical grids, and certified
          professional hardware rigs.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {specializations.map((item) => (
          <div
            key={item.title}
            className="flex flex-col rounded-xl border border-white/[0.06] bg-[#191b1f] p-5"
          >
            <div className="inline-flex size-12 items-center justify-center rounded-lg bg-white/[0.04] mb-6">
              <Image
                src={item.icon}
                alt=""
                width={item.iconWidth}
                height={item.iconHeight}
                className="h-6 w-6 object-contain"
              />
            </div>
            <h3 className="text-lg font-semibold leading-snug text-white mb-2">
              {item.title}
            </h3>
            <p className="text-xs leading-relaxed text-zinc-400 mb-6">
              {item.description}
            </p>
            <Link
              href={item.href}
              style={{ color: item.accent }}
              className={cn(
                buttonVariants({ variant: "link", size: "sm" }),
                "mt-auto self-start text-xs font-medium hover:no-underline"
              )}
            >
              {item.link}
              <ArrowRight data-icon="inline-end" />
            </Link>
          </div>
        ))}
      </div>
    </section>
  )
}
