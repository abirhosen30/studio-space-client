
import Link from "next/link";
import { notFound } from "next/navigation";
import { BookWorkspaceDialog } from "@/components/book-workspace-dialog";
import { StudioGallery } from "@/components/studio-gallery";

interface IReview {
  author: string;
  rating: number;
  comment: string;
  createdAt?: string;
}

interface IStudio {
  _id: string;
  providerName?: string;
  accountEmail?: string;
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
  amenities?: string[];
  galleryImages?: string[];
  mediaLibraryUrls?: string[];
  gallery?: string[];
  reviews?: IReview[];
}

function isStudio(value: unknown): value is IStudio {
  return (
    typeof value === "object" &&
    value !== null &&
    "_id" in value &&
    typeof value._id === "string"
  );
}

function getStudioFromPayload(payload: unknown): IStudio | null {
  const studio =
    typeof payload === "object" &&
    payload !== null &&
    "data" in payload
      ? payload.data
      : payload;

  return isStudio(studio) ? studio : null;
}

function getStudiosFromPayload(payload: unknown): IStudio[] {
  const studios =
    typeof payload === "object" &&
    payload !== null &&
    "data" in payload
      ? payload.data
      : payload;

  return Array.isArray(studios) ? studios.filter(isStudio) : [];
}

function formatCurrency(value: string | number, fallback: string) {
  const amount = String(value).trim();

  if (!amount) {
    return fallback;
  }

  return amount.startsWith("$") ? amount : `$${amount}`;
}

function getStringList(value: unknown): string[] {
  return Array.isArray(value)
    ? value.filter(
        (item): item is string =>
          typeof item === "string" && item.trim().length > 0,
      )
    : [];
}

function getGalleryImages(studio: IStudio) {
  return [
    studio.mediaLibraryUrl,
    ...getStringList(studio.galleryImages),
    ...getStringList(studio.mediaLibraryUrls),
    ...getStringList(studio.gallery),
  ].filter(
    (image, index, images) =>
      typeof image === "string" &&
      image.length > 0 &&
      images.indexOf(image) === index,
  );
}

function getAmenities(studio: IStudio) {
  return [
    ...new Set([
      ...getStringList(studio.amenities),
      ...getStringList(studio.presetChips),
      ...getStringList(studio.hardware),
    ]),
  ];
}

function getReviews(studio: IStudio): IReview[] {
  const reviews: unknown = studio.reviews;

  return Array.isArray(reviews)
    ? reviews.filter(
        (review): review is IReview =>
          typeof review === "object" &&
          review !== null &&
      typeof review.author === "string" &&
      typeof review.comment === "string" &&
      typeof review.rating === "number" &&
      Number.isFinite(review.rating) &&
      review.rating >= 1 &&
          review.rating <= 5,
      )
    : [];
}

async function getStudio(id: string): Promise<IStudio | null> {
  let detailResponse: Response | undefined;

  try {
    detailResponse = await fetch(
      `http://localhost:8000/studios/${encodeURIComponent(id)}`,
    );

    if (detailResponse.ok) {
      const studio = getStudioFromPayload(await detailResponse.json());

      if (studio?._id === id) {
        return studio;
      }

      console.warn("Studio detail API returned no matching studio; trying the list endpoint.");
    } else {
      console.warn(
        `Studio detail API returned HTTP ${detailResponse.status}; trying the list endpoint.`,
      );
    }
  } catch (error) {
    console.warn("Could not load studio details; trying the list endpoint:", error);
  }

  try {
    const listResponse = await fetch("http://localhost:8000/studios");

    if (!listResponse.ok) {
      throw new Error(`Studio list API returned HTTP ${listResponse.status}`);
    }

    const studios = getStudiosFromPayload(await listResponse.json());
    return studios.find((studio) => studio._id === id) ?? null;
  } catch (error) {
    console.error("Could not load studio from the list endpoint:", error);
    return null;
  }
}

const StudioDetailsPage = async ({
  params,
}: {
  params: Promise<{ id: string }>;
}) => {
  const { id } = await params;
  const studio = await getStudio(id);

  if (!studio || !studio._id) {
    notFound();
  }

  return (
    <main className="min-h-screen flex-1 bg-[#111215]">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">

        {/* Top Navigation */}
        <div className="mb-5 flex items-center justify-between">
          <Link
            href="/studios"
            className="text-sm text-zinc-400 transition hover:text-white"
          >
            ← Back to Studios
          </Link>

          <div className="flex items-center gap-2">
            <Link
              href={`/studios/${studio._id}/edit`}
              className="rounded border border-white/10 bg-[#191a1f] px-4 py-2 text-xs font-medium text-zinc-200 transition hover:bg-white/10"
            >
              ✎ Edit
            </Link>

            <Link
              href="/studios"
              className="rounded border border-red-400/30 px-4 py-2 text-xs font-medium text-red-300 transition hover:bg-red-400/10"
            >
              Cancel
            </Link>
          </div>
        </div>

        <StudioGallery
          images={getGalleryImages(studio)}
          title={studio.stageTitle}
        />

        {/* Details Layout */}
        <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-3">

          {/* Left Content */}
          <div className="space-y-7 lg:col-span-2">

            {/* Basic Information */}
            <section>
              <div className="mb-2 flex flex-wrap items-center gap-2 text-xs text-zinc-400">
                <span>⌖ {studio.geoAddress}</span>
              </div>

              <h1 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">
                {studio.stageTitle}
              </h1>

              <div className="mt-3 flex flex-wrap items-center gap-3 text-sm">
                <span className="rounded-full bg-[#00c5cb]/10 px-3 py-1 font-medium text-[#00c5cb]">
                  {studio.deliveryCategory}
                </span>

                <span className="text-zinc-400">
                  Capacity: {studio.capacity} people
                </span>
              </div>
            </section>

            {/* Overview */}
            <section>
              <h2 className="mb-3 text-xl font-semibold text-white">
                Overview
              </h2>

              <p className="text-sm leading-7 text-zinc-300">
                {studio.notes || "No studio overview available yet."}
              </p>
            </section>

            {/* Workspace specifications */}
            <section>
              <h2 className="mb-4 text-xl font-semibold text-white">
                Workspace specifications
              </h2>

              <dl className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {[
                  ["Workspace", studio.stageTitle],
                  ["Category", studio.deliveryCategory],
                  ["Maximum capacity", `${studio.capacity} people`],
                  [
                    "Hourly rate",
                    `${formatCurrency(studio.hourlyRate, "N/A")} / hour`,
                  ],
                  [
                    "Security deposit",
                    formatCurrency(studio.securityDeposit, "$0"),
                  ],
                  ["Address", studio.geoAddress],
                ].map(([label, value]) => (
                  <div
                    key={label}
                    className="rounded-lg border border-white/10 bg-[#191a1f] p-4"
                  >
                    <dt className="text-xs font-medium uppercase tracking-wide text-zinc-500">
                      {label}
                    </dt>
                    <dd className="mt-1 text-sm text-zinc-200">{value}</dd>
                  </div>
                ))}
              </dl>
            </section>

            {/* Amenities */}
            <section>
              <h2 className="mb-4 text-xl font-semibold text-white">
                Amenities &amp; equipment
              </h2>
              {getAmenities(studio).length > 0 ? (
                <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  {getAmenities(studio).map((item) => (
                    <li
                      key={item}
                      className="flex items-center gap-2 text-sm text-zinc-300"
                    >
                      <span className="text-[#00c5cb]" aria-hidden="true">
                        ✓
                      </span>
                      {item}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-zinc-400">
                  No amenities or equipment have been listed yet.
                </p>
              )}
            </section>

            {/* Reviews */}
            <section className="border-t border-white/10 pt-6">
              <h2 className="mb-4 text-xl font-semibold text-white">
                Guest reviews
              </h2>
              {getReviews(studio).length > 0 ? (
                <div className="space-y-4">
                  {getReviews(studio).map((review, index) => (
                    <article
                      key={`${review.author}-${review.createdAt ?? index}`}
                      className="rounded-lg border border-white/10 bg-[#191a1f] p-4"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <h3 className="text-sm font-semibold text-white">
                          {review.author}
                        </h3>
                        <span
                          className="text-sm text-[#00c5cb]"
                          aria-label={`${review.rating} out of 5 stars`}
                        >
                          {"★".repeat(review.rating)}
                          {"☆".repeat(5 - review.rating)}
                        </span>
                      </div>
                      {review.createdAt && (
                        <p className="mt-1 text-xs text-zinc-500">
                          {review.createdAt}
                        </p>
                      )}
                      <p className="mt-3 text-sm leading-6 text-zinc-300">
                        {review.comment}
                      </p>
                    </article>
                  ))}
                </div>
              ) : (
                <p className="rounded-lg border border-white/10 bg-[#191a1f] p-4 text-sm text-zinc-400">
                  No guest reviews have been submitted for this workspace yet.
                </p>
              )}
            </section>

            {/* Location */}
            <section className="border-t border-white/10 pt-6">
              <h2 className="mb-3 text-xl font-semibold text-white">
                Location
              </h2>

              <p className="text-sm leading-6 text-zinc-300">
                ⌖ {studio.geoAddress}
              </p>
            </section>
          </div>

          {/* Right Booking Card */}
          <aside>
            <div className="sticky top-24 rounded-lg border border-white/10 bg-[#191a1f] p-5 shadow-sm">

              <p className="text-xs text-zinc-400">
                Starting from
              </p>

              <h2 className="mt-1 text-3xl font-bold text-[#00c5cb]">
                {formatCurrency(studio.hourlyRate, "N/A")}
              </h2>

              <p className="text-xs text-zinc-400">
                per hour
              </p>

              <div className="my-5 space-y-4 border-y border-white/10 py-5">

                <div className="flex justify-between gap-2 text-sm">
                  <span className="text-zinc-400">Security Deposit</span>
                  <span className="font-semibold text-white">
                    {formatCurrency(studio.securityDeposit, "$0")}
                  </span>
                </div>

                <div className="flex justify-between gap-2 text-sm">
                  <span className="text-zinc-400">Maximum Capacity</span>
                  <span className="font-semibold text-white">
                    {studio.capacity} People
                  </span>
                </div>

                <div className="flex justify-between gap-2 text-sm">
                  <span className="text-zinc-400">Category</span>
                  <span className="font-semibold text-white">
                    {studio.deliveryCategory}
                  </span>
                </div>
              </div>

              <BookWorkspaceDialog
                workspaceTitle={studio.stageTitle}
                hourlyRate={formatCurrency(studio.hourlyRate, "N/A")}
                hostEmail={studio.accountEmail}
              />

              <p className="mt-3 text-center text-xs text-zinc-500">
                The host confirms availability and booking details.
              </p>

              <section className="mt-6 border-t border-white/10 pt-5">
                <h2 className="text-sm font-semibold text-white">
                  Hosted by
                </h2>
                <p className="mt-3 text-sm text-zinc-200">
                  {studio.providerName || "Studio host"}
                </p>
                {studio.accountEmail ? (
                  <a
                    href={`mailto:${studio.accountEmail}`}
                    className="mt-1 block break-all text-sm text-[#00c5cb] hover:underline"
                  >
                    {studio.accountEmail}
                  </a>
                ) : (
                  <p className="mt-1 text-sm text-zinc-400">
                    Contact information not provided.
                  </p>
                )}
              </section>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
};

export default StudioDetailsPage;
