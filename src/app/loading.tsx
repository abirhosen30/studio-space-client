import { Aperture, LoaderCircle } from "lucide-react";

export default function Loading() {
  return (
    <main
      aria-busy="true"
      aria-live="polite"
      className="min-h-[55vh] flex-1 bg-[#111215]"
    >
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-center gap-3 text-sm text-zinc-300">
          <span className="flex size-9 items-center justify-center rounded-lg bg-[#ff7a00]">
            <Aperture className="size-5 animate-spin text-white" />
          </span>
          <span>Loading StudioSpace</span>
          <LoaderCircle className="ml-auto size-4 animate-spin text-[#00c5cb]" />
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[0, 1, 2].map((item) => (
            <div
              key={item}
              className="overflow-hidden rounded-lg border border-white/10 bg-[#191a1f]"
            >
              <div className="aspect-[16/10] animate-pulse bg-white/[0.06]" />
              <div className="space-y-3 p-4">
                <div className="h-4 w-2/3 animate-pulse rounded bg-white/[0.06]" />
                <div className="h-3 w-full animate-pulse rounded bg-white/[0.04]" />
                <div className="h-3 w-1/2 animate-pulse rounded bg-white/[0.04]" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
