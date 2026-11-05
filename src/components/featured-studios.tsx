import Image from "next/image";
import Link from "next/link";
import type { IReview, IStudio } from "@/components/types/types";

function getRating(reviews?: IReview[]) {
  const ratings = Array.isArray(reviews)
    ? reviews
        .map((review) => review.rating)
        .filter(
          (rating) => Number.isFinite(rating) && rating >= 1 && rating <= 5,
        )
    : [];

  if (ratings.length === 0) {
    return "New";
  }

  const average =
    ratings.reduce((sum, rating) => sum + rating, 0) / ratings.length;
  return `★ ${average.toFixed(1)}`;
}

function formatRate(rate: string | number) {
  const amount = String(rate).trim();
  return amount.startsWith("$") ? amount : `$${amount}`;
}

async function getFeaturedStudios(): Promise<IStudio[]> {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER}/featured-studios`, {
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error(`Featured studios API returned HTTP ${response.status}`);
    }

    const data: unknown = await response.json();
    return Array.isArray(data)
      ? data.filter(
          (studio): studio is IStudio =>
            typeof studio === "object" &&
            studio !== null &&
            "_id" in studio &&
            typeof studio._id === "string" &&
            "stageTitle" in studio &&
            typeof studio.stageTitle === "string",
        )
      : [];
  } catch (error) {
    console.error("Could not load featured studios:", error);
    return [];
  }
}

export async function FeaturedStudios() {
  const studios = await getFeaturedStudios();

  return (
    <section className="mx-auto w-full max-w-7xl py-8 sm:py-12">
      <div className="mb-7 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-[#ff7a00]">
            Recently listed
          </p>
          <h2 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
            Featured Studios
          </h2>
        </div>
        <Link
          href="/studios"
          className="text-sm font-medium text-[#00c5cb] transition hover:text-white"
        >
          Explore all studios <span aria-hidden="true">→</span>
        </Link>
      </div>

      {studios.length > 0 ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {studios.map((studio) => (
            <article
              key={studio._id}
              className="group overflow-hidden rounded-lg border border-white/10 bg-[#191a1f]"
            >
              <div className="relative aspect-[16/10] overflow-hidden bg-[#202228]">
                {studio.mediaLibraryUrl ? (
                  <Image
                    src={studio.mediaLibraryUrl}
                    alt={`${studio.stageTitle} workspace`}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover transition duration-300 group-hover:scale-[1.03]"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-sm text-zinc-500">
                    Image unavailable
                  </div>
                )}
                <span className="absolute left-3 top-3 rounded-sm bg-[#111215]/90 px-2 py-1 text-xs text-zinc-200">
                  {studio.deliveryCategory}
                </span>
                <span className="absolute right-3 top-3 rounded-sm bg-[#111215]/90 px-2 py-1 text-xs font-semibold text-amber-300">
                  {getRating(studio.reviews)}
                </span>
              </div>

              <div className="space-y-3 p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <h3 className="truncate text-base font-semibold text-white">
                      {studio.stageTitle}
                    </h3>
                    <p className="mt-1 truncate text-sm text-zinc-400">
                      {studio.geoAddress || "Location not provided"}
                    </p>
                  </div>
                  <p className="shrink-0 text-right text-sm font-semibold text-white">
                    {formatRate(studio.hourlyRate)}
                    <span className="block text-xs font-normal text-zinc-500">
                      / hr
                    </span>
                  </p>
                </div>

                <Link
                  href={`/studios/${studio._id}`}
                  className="inline-flex min-h-10 w-full items-center justify-center rounded-md bg-[#00c5cb] px-4 text-sm font-semibold text-[#111215] transition hover:bg-[#00b3b9]"
                >
                  View Details
                </Link>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className="border-y border-white/10 py-8 text-sm text-zinc-400">
          Featured spaces will appear here as studios are listed.
        </div>
      )}
    </section>
  );
}
