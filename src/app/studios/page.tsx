import Image from "next/image";
import Link from "next/link";

interface IStudio {
  _id: string;
  stageTitle: string;
  deliveryCategory: string;
  capacity: string | number;
  hourlyRate: string | number;
  securityDeposit: string | number;
  geoAddress: string;
  mediaLibraryUrl: string;
  presetChips: string[];
  hardware: string[];
  notes: string;
  reviews?: { rating: number }[];
}

const STUDIO_CATEGORIES = [
  "Photo Studio",
  "Film Stage",
  "Podcast Lounge",
  "Music Suite",
  "Workshop",
];

function formatCurrency(value: string | number, fallback: string) {
  const amount = String(value).trim();

  if (!amount) {
    return fallback;
  }

  return amount.startsWith("$") ? amount : `$${amount}`;
}

function getRating(reviews?: { rating: number }[]) {
  const ratings = Array.isArray(reviews)
    ? reviews
        .map((review) => review.rating)
        .filter(
          (rating) => Number.isFinite(rating) && rating >= 1 && rating <= 5,
        )
    : [];

  return ratings.length
    ? `★ ${(ratings.reduce((sum, rating) => sum + rating, 0) / ratings.length).toFixed(1)}`
    : "New";
}

async function getStudios(): Promise<IStudio[]> {
  try {
    const res = await fetch("http://localhost:8000/studios");

    if (!res.ok) {
      throw new Error(`Studio API returned HTTP ${res.status}`);
    }

    const data: unknown = await res.json();

    // Supports either an array or { data: [...] } response.
    const studios = Array.isArray(data)
      ? data
      : typeof data === "object" &&
          data !== null &&
          "data" in data &&
          Array.isArray(data.data)
        ? data.data
        : [];

    return studios.filter(
      (studio): studio is IStudio =>
        typeof studio === "object" &&
        studio !== null &&
        "_id" in studio &&
        typeof studio._id === "string",
    );
  } catch (error) {
    console.error("Could not load studios:", error);
    return [];
  }
}

function StudioCard({ studio }: { studio: IStudio }) {
  return (
    <article className="group overflow-hidden rounded-lg border border-white/10 bg-[#191a1f] transition hover:-translate-y-1 hover:border-white/20 hover:shadow-lg">
      {/* Studio Image */}
      <div className="relative h-48 overflow-hidden bg-[#202126]">
        <Image
          src={studio.mediaLibraryUrl}
          alt={studio.stageTitle}
          className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
          width={400}
          height={300}
        />

        <span className="absolute right-3 top-3 rounded bg-[#111215]/90 px-2 py-1 text-xs font-semibold text-white shadow">
          {getRating(studio.reviews)}
        </span>

        <span className="absolute left-3 top-3 rounded bg-[#111215]/90 px-2 py-1 text-xs font-medium text-zinc-200 shadow">
          {studio.deliveryCategory}
        </span>
      </div>

      {/* Studio Information */}
      <div className="space-y-3 p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="mb-1 flex items-center gap-1 text-xs text-zinc-400">
              <span aria-hidden="true">⌖</span>
              <span className="line-clamp-1">{studio.geoAddress}</span>
            </p>

            <h2 className="line-clamp-1 text-base font-semibold text-white">
              {studio.stageTitle}
            </h2>
          </div>

          <p className="shrink-0 text-right text-sm font-bold text-white">
            {formatCurrency(studio.hourlyRate, "N/A")}
            <span className="block text-xs font-normal text-zinc-400">
              /hour
            </span>
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 border-t border-white/10 pt-3 text-xs text-zinc-300">
          <span>♙ Capacity: {studio.capacity}</span>
          <span>Security: {formatCurrency(studio.securityDeposit, "$0")}</span>
        </div>

        <Link
          href={`/studios/${studio._id}`}
          className="inline-flex w-full items-center justify-center gap-2 rounded-md bg-[#00c5cb] px-4 py-2.5 text-sm font-semibold text-[#111215] transition hover:bg-[#00b3b9]"
        >
          View Details <span aria-hidden="true">↗</span>
        </Link>
      </div>
    </article>
  );
}

export default async function StudiosPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string | string[] }>;
}) {
  const params = await searchParams;
  const requestedCategory = Array.isArray(params.category)
    ? params.category[0]
    : params.category;
  const selectedCategory = STUDIO_CATEGORIES.find(
    (category) => category.toLowerCase() === requestedCategory?.toLowerCase(),
  );
  const allStudios = await getStudios();
  const studios = selectedCategory
    ? allStudios.filter(
        (studio) =>
          studio.deliveryCategory.trim().toLowerCase() ===
          selectedCategory.toLowerCase(),
      )
    : allStudios;

  return (
    <main className="min-h-screen flex-1 bg-[#111215]">
      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        {/* Page Heading */}
        <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="mb-2 text-sm font-semibold uppercase tracking-[0.2em] text-[#00c5cb]">
              Explore StudioSpace
            </p>

            <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Find Your Perfect Studio
            </h1>

            <p className="mt-2 max-w-xl text-sm leading-6 text-zinc-400">
              Discover creative spaces for photography, film production,
              podcasting, music, and workshops.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <form
              action="/studios"
              method="get"
              className="flex items-center gap-2"
            >
              <label className="sr-only" htmlFor="studio-category">
                Filter studios by category
              </label>
              <select
                id="studio-category"
                name="category"
                defaultValue={selectedCategory ?? ""}
                className="h-11 rounded-md border border-white/10 bg-[#191a1f] px-3 text-sm text-white"
              >
                <option value="">All categories</option>
                {STUDIO_CATEGORIES.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
              <button
                type="submit"
                className="h-11 rounded-md border border-white/10 bg-[#191a1f] px-4 text-sm font-medium text-white transition hover:bg-white/10"
              >
                Filter
              </button>
            </form>
            <Link
              href="/add-studio"
              className="inline-flex h-11 w-fit items-center justify-center rounded-md border border-white/10 bg-[#191a1f] px-5 text-sm font-semibold text-white transition hover:bg-white/10"
            >
              Add Studio
            </Link>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-5 border-b border-white/10 pb-3 text-sm text-zinc-400">
          Showing {studios.length}{" "}
          {selectedCategory ? `${selectedCategory} ` : ""}
          {studios.length === 1 ? "studio" : "studios"}
        </div>

        {/* Studio Grid */}
        {studios.length > 0 ? (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {studios.map((studio) => (
              <StudioCard key={studio._id} studio={studio} />
            ))}
          </div>
        ) : (
          <div className="rounded-xl border border-dashed border-white/15 px-5 py-16 text-center">
            <h2 className="text-xl font-semibold text-white">
              {selectedCategory
                ? `No ${selectedCategory} studios found`
                : "No studios found"}
            </h2>

            <p className="mt-2 text-sm text-zinc-400">
              {selectedCategory
                ? "Try a different category or clear the current filter."
                : "Add a studio or check whether your server API is running."}
            </p>

            <Link
              href={selectedCategory ? "/studios" : "/add-studio"}
              className="mt-5 inline-flex rounded-md border border-white/10 bg-[#191a1f] px-5 py-3 text-sm font-semibold text-white hover:bg-white/10"
            >
              {selectedCategory ? "Clear category" : "Add Your First Studio"}
            </Link>
          </div>
        )}
      </section>
    </main>
  );
}
