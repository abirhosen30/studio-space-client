"use client"

import * as React from "react"
import Image from "next/image"
import { ArrowRight, ChevronLeft, ChevronRight, House } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  useCarousel,
} from "@/components/ui/carousel"

const slides = [
  {
    badge: "Stage 01 · Brooklyn Cyclorama",
    title: "Cinema Soundstage & Cyc Walls in Brooklyn",
    description:
      "2,400 sq ft acoustically treated stage equipped with heavy-duty overhead grid rigging, 20ft clearance, and a continuous white infinity cyc wall.",
  },
  {
    badge: "Studio 02 · Williamsburg",
    title: "Production-Ready Soundstage in Williamsburg",
    description:
      "6,000 sq ft drive-in stage with 28ft ceilings, silent HVAC, and full lighting grid — built for commercials, music videos, and film productions.",
  },
  {
    badge: "Loft 03 · Long Island City",
    title: "Daylight Loft Studio in Long Island City",
    description:
      "Sun-drenched photography and content studio with north-facing windows, motorized blackouts, and a dedicated client lounge.",
  },
]

function HeroControls() {
  const { api, scrollPrev, scrollNext, canScrollPrev, canScrollNext } =
    useCarousel()
  const [selected, setSelected] = React.useState(0)

  React.useEffect(() => {
    if (!api) return
    const onSelect = () => setSelected(api.selectedScrollSnap())
    // Initial sync runs off the render path to avoid a synchronous
    // setState within the effect (react-hooks/set-state-in-effect).
    const raf = requestAnimationFrame(onSelect)
    api.on("select", onSelect)
    api.on("reInit", onSelect)

    return () => {
      cancelAnimationFrame(raf)
      api.off("select", onSelect)
      api.off("reInit", onSelect)
    }
  }, [api])

  return (
    <div className="absolute bottom-5 right-5 z-10 flex items-center gap-3">
      <Button
        variant="outline"
        size="icon-lg"
        className="rounded-full border-white/10 bg-[#1e2025]/80 text-zinc-300 shadow-none backdrop-blur hover:bg-[#2a2d33]/80 hover:text-white"
        disabled={!canScrollPrev}
        onClick={scrollPrev}
      >
        <ChevronLeft />
        <span className="sr-only">Previous slide</span>
      </Button>
      <div className="flex items-center gap-2">
        {slides.map((slide, index) => (
          <button
            key={slide.badge}
            type="button"
            aria-label={`Go to slide ${index + 1}`}
            aria-current={selected === index}
            onClick={() => api?.scrollTo(index)}
            className={`h-2 rounded-full transition-all ${
              selected === index
                ? "w-2 bg-[#ff7a00]"
                : "w-2 bg-white/25 hover:bg-white/40"
            }`}
          />
        ))}
      </div>
      <Button
        variant="outline"
        size="icon-lg"
        className="rounded-full border-white/10 bg-[#1e2025]/80 text-zinc-300 shadow-none backdrop-blur hover:bg-[#2a2d33]/80 hover:text-white"
        disabled={!canScrollNext}
        onClick={scrollNext}
      >
        <ChevronRight />
        <span className="sr-only">Next slide</span>
      </Button>
    </div>
  )
}

function HeroSlide({
  slide,
  index,
}: {
  slide: (typeof slides)[number]
  index: number
}) {
  return (
    <div className="relative flex min-h-[380px] flex-col justify-center overflow-hidden rounded-2xl sm:min-h-[440px]">
      <Image
        src="/images/Hero-image.png"
        alt="StudioSpace soundstage with a camera on a tripod and a white cyc wall"
        fill
        priority={index === 0}
        sizes="100vw"
        className="object-cover"
      />
      {/* Darkening + left gradient overlay so the copy stays readable */}
      <div className="absolute inset-0 bg-[#111215]/45" />
      <div className="absolute inset-0 bg-gradient-to-r from-[#111215]/85 via-[#111215]/40 to-transparent" />

      <div className="relative z-10 max-w-xl p-6 sm:p-10">
        <div className="inline-flex items-center gap-2 rounded-full border border-[#ff7a00]/30 bg-[#111215]/80 px-3 py-1.5 text-[11px] font-semibold tracking-widest text-[#ff7a00] uppercase mb-5">
          <span className="h-1.5 w-1.5 rounded-full bg-[#ff7a00]" />
          {slide.badge}
        </div>
        <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-[40px] lg:leading-[1.15] mb-4">
          {slide.title}
        </h2>
        <p className="max-w-md text-sm leading-relaxed text-zinc-300 sm:text-base mb-7">
          {slide.description}
        </p>
        <div className="flex flex-wrap items-center gap-3">
          <Button
            size="lg"
            className="h-10 rounded-lg bg-[#ff7a00] px-5 text-white hover:bg-[#ff7a00]/85"
          >
            Explore Studios
            <ArrowRight data-icon="inline-end" />
          </Button>
          <Button
            variant="outline"
            size="lg"
            className="h-10 rounded-lg border-white/15 bg-[#1e2025]/80 px-5 text-white shadow-none backdrop-blur hover:bg-[#2a2d33]/80 hover:text-white"
          >
            <House data-icon="inline-start" />
            Host Your Space
          </Button>
        </div>
      </div>
    </div>
  )
}

export function Hero() {
  return (
    <Carousel opts={{ loop: true }} className="relative">
      <CarouselContent className="ml-0">
        {slides.map((slide, index) => (
          <CarouselItem key={slide.badge} className="pl-0">
            <HeroSlide slide={slide} index={index} />
          </CarouselItem>
        ))}
      </CarouselContent>
      <HeroControls />
    </Carousel>
  )
}
