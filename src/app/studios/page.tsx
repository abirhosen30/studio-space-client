
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
}

async function getStudios(): Promise<IStudio[]> {
  try {
    const res = await fetch('http://localhost:8000/studios')

    const data = await res.json();

    // Supports either an array or { data: [...] } response.
    return Array.isArray(data) ? data : data.data ?? [];
  } catch (error) {
    console.error("Could not load studios:", error);
    return [];
  }
}

function StudioCard({ studio }: { studio: IStudio }) {
  return (
    <article className="group overflow-hidden rounded-lg border border-gray-200 bg-white transition hover:-translate-y-1 hover:shadow-lg">
      {/* Studio Image */}
      <div className="relative h-48 overflow-hidden bg-gray-100">
        <Image
          src={studio.mediaLibraryUrl}
          alt={studio.stageTitle}
          className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
          width={400}
          height={300}
        />

        <span className="absolute right-3 top-3 rounded bg-white px-2 py-1 text-xs font-semibold text-gray-900 shadow">
          4.5 ★
        </span>

        <span className="absolute left-3 top-3 rounded bg-white px-2 py-1 text-xs font-medium text-gray-700 shadow">
          {studio.deliveryCategory}
        </span>
      </div>

      {/* Studio Information */}
      <div className="space-y-3 p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="mb-1 flex items-center gap-1 text-xs text-gray-500">
              <span aria-hidden="true">⌖</span>
              <span className="line-clamp-1">{studio.geoAddress}</span>
            </p>

            <h2 className="line-clamp-1 text-base font-semibold text-gray-900">
              {studio.stageTitle}
            </h2>
          </div>

          <p className="shrink-0 text-right text-sm font-bold text-gray-900">
            ${studio.hourlyRate || "N/A"}
            <span className="block text-xs font-normal text-gray-500">
              /hour
            </span>
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 border-t border-gray-100 pt-3 text-xs text-gray-600">
          <span>♙ Capacity: {studio.capacity}</span>
          <span>Security: ${studio.securityDeposit || 0}</span>
        </div>

        <Link
          href={`/studios/${studio._id}`}
          className="inline-flex w-full items-center justify-center gap-2 rounded-md bg-cyan-700 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-cyan-800"
        >
          View Details <span aria-hidden="true">↗</span>
        </Link>
      </div>
    </article>
  );
}

export default async function StudiosPage() {
  const studios = await getStudios();

  return (
    <main className="min-h-screen bg-white">
      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        {/* Page Heading */}
        <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="mb-2 text-sm font-semibold uppercase tracking-[0.2em] text-cyan-700">
              Explore StudioSpace
            </p>

            <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Find Your Perfect Studio
            </h1>

            <p className="mt-2 max-w-xl text-sm leading-6 text-gray-500">
              Discover creative spaces for photography, film production,
              podcasting, music, and workshops.
            </p>
          </div>

          <Link
            href="/studios/add"
            className="inline-flex w-fit items-center justify-center rounded-md bg-gray-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-gray-700"
          >
            + Add Studio
          </Link>
        </div>

        {/* Results Count */}
        <div className="mb-5 border-b border-gray-200 pb-3 text-sm text-gray-500">
          Showing {studios.length} studios
        </div>

        {/* Studio Grid */}
        {studios.length > 0 ? (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {studios.map((studio) => (
              <StudioCard key={studio._id} studio={studio} />
            ))}
          </div>
        ) : (
          <div className="rounded-xl border border-dashed border-gray-300 px-5 py-16 text-center">
            <h2 className="text-xl font-semibold text-gray-900">
              No studios found
            </h2>

            <p className="mt-2 text-sm text-gray-500">
              Add a studio or check whether your server API is running.
            </p>

            <Link
              href="/studios/add"
              className="mt-5 inline-flex rounded-md bg-gray-900 px-5 py-3 text-sm font-semibold text-white hover:bg-gray-700"
            >
              Add Your First Studio
            </Link>
          </div>
        )}
      </section>
    </main>
  );
}
