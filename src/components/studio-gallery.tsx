"use client";

import Image from "next/image";
import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

export function StudioGallery({
  images,
  title,
}: {
  images: string[];
  title: string;
}) {
  const [activeIndex, setActiveIndex] = useState(0);
  const activeImage = images[activeIndex];

  function showPrevious() {
    setActiveIndex((index) => (index - 1 + images.length) % images.length);
  }

  function showNext() {
    setActiveIndex((index) => (index + 1) % images.length);
  }

  if (!activeImage) {
    return (
      <div className="flex h-[260px] items-center justify-center rounded-xl bg-[#191a1f] text-sm text-zinc-400 sm:h-[350px] lg:h-[420px]">
        No workspace photos available
      </div>
    );
  }

  return (
    <div>
      <div className="relative h-[260px] overflow-hidden rounded-xl bg-[#191a1f] sm:h-[350px] lg:h-[420px]">
        <Image
          src={activeImage}
          alt={`${title} photo ${activeIndex + 1}`}
          className="object-cover"
          fill
          priority
          sizes="(max-width: 640px) 100vw, (max-width: 1280px) 90vw, 1280px"
        />

        {images.length > 1 && (
          <>
            <button
              type="button"
              onClick={showPrevious}
              aria-label="Show previous workspace photo"
              className="absolute left-3 top-1/2 flex size-10 -translate-y-1/2 items-center justify-center rounded-full bg-black/60 text-white transition hover:bg-black/80"
            >
              <ChevronLeft aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={showNext}
              aria-label="Show next workspace photo"
              className="absolute right-3 top-1/2 flex size-10 -translate-y-1/2 items-center justify-center rounded-full bg-black/60 text-white transition hover:bg-black/80"
            >
              <ChevronRight aria-hidden="true" />
            </button>
            <span className="absolute bottom-3 right-3 rounded-full bg-black/60 px-3 py-1 text-xs text-white">
              {activeIndex + 1} / {images.length}
            </span>
          </>
        )}
      </div>

      {images.length > 1 && (
        <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
          {images.map((image, index) => (
            <button
              key={`${image}-${index}`}
              type="button"
              onClick={() => setActiveIndex(index)}
              aria-label={`Show workspace photo ${index + 1}`}
              aria-current={index === activeIndex}
              className={`relative size-16 shrink-0 overflow-hidden rounded-md border-2 ${
                index === activeIndex
                  ? "border-[#00c5cb]"
                  : "border-transparent opacity-70 hover:opacity-100"
              }`}
            >
              <Image
                src={image}
                alt=""
                className="object-cover"
                fill
                sizes="64px"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
