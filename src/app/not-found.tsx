import Image from "next/image";
import Link from "next/link";
import { Aperture, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <main className="min-h-[65vh] flex-1 bg-[#111215] px-4 py-10 sm:px-6 lg:px-8">
      <section className="mx-auto grid max-w-6xl overflow-hidden rounded-xl border border-white/10 bg-[#191a1f] md:grid-cols-[1.15fr_0.85fr]">
        <div className="relative min-h-64 bg-[#202228] md:min-h-[420px]">
          <Image
            src="/images/Hero-image.png"
            alt="A production camera on a StudioSpace soundstage"
            fill
            sizes="(max-width: 768px) 100vw, 60vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-[#111215]/35" />
        </div>
        <div className="flex flex-col justify-center p-7 sm:p-10">
          <div className="mb-5 flex size-11 items-center justify-center rounded-lg bg-[#ff7a00]">
            <Aperture className="size-6 text-white" />
          </div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#00c5cb]">
            StudioSpace / 404
          </p>
          <h1 className="mt-3 text-3xl font-bold text-white">
            This space isn’t on the map.
          </h1>
          <p className="mt-3 text-sm leading-6 text-zinc-400">
            The page may have moved, or the address may be incorrect.
          </p>
          <Link
            href="/"
            className="mt-7 inline-flex min-h-11 w-fit items-center gap-2 rounded-md bg-[#00c5cb] px-4 text-sm font-semibold text-[#111215] transition hover:bg-[#00b3b9]"
          >
            <ArrowLeft className="size-4" aria-hidden="true" />
            Return to Home
          </Link>
        </div>
      </section>
    </main>
  );
}
