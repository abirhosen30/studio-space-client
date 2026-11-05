import Image from "next/image";
import Link from "next/link";
import { headers } from "next/headers";
import { getAuth } from "@/lib/auth";
import DeleteStudioDailog from "@/components/DeleteStudioDailog";
import type { IStudio } from "@/components/types/types";

function isStudio(value: unknown): value is IStudio {
  return (
    typeof value === "object" &&
    value !== null &&
    "_id" in value &&
    typeof value._id === "string" &&
    "stageTitle" in value &&
    typeof value.stageTitle === "string"
  );
}

function formatCurrency(value: string | number, fallback: string) {
  const amount = String(value).trim();
  return amount ? (amount.startsWith("$") ? amount : `$${amount}`) : fallback;
}

export default async function MyListingPage() {
  const requestHeaders = await headers();
  const auth = getAuth();
  const session = await auth.api.getSession({ headers: requestHeaders });
  const email = session?.user?.email?.trim().toLowerCase();
  let studios: IStudio[] = [];
  let errorMessage = "";

  if (email) {
    try {
      const { token } = await auth.api.getToken({ headers: requestHeaders });
      const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER}/my-studios`, {
        headers: { Authorization: `Bearer ${token}` },
        cache: "no-store",
      });

      if (!response.ok) {
        throw new Error(
          `Could not load studio listings (HTTP ${response.status}).`,
        );
      }

      const data: unknown = await response.json();
      if (!Array.isArray(data)) {
        throw new Error("The studio response was not a list.");
      }

      studios = data.filter(isStudio).filter((studio) => {
        const ownerEmail = (studio.ownerEmail || studio.accountEmail || "")
          .trim()
          .toLowerCase();
        return ownerEmail === email;
      });
    } catch (error) {
      errorMessage =
        error instanceof Error
          ? error.message
          : "Could not load your studio listings.";
    }
  }

  return (
    <main className="min-h-screen flex-1 bg-[#111215]">
      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="mb-2 text-sm font-semibold uppercase tracking-[0.2em] text-[#00c5cb]">
              StudioSpace / Host Dashboard
            </p>
            <h1 className="text-3xl font-bold tracking-tight text-white">
              My Listings
            </h1>
            <p className="mt-2 text-sm text-zinc-400">
              Manage the studio spaces you own.
            </p>
          </div>
          {email && (
            <Link
              href="/add-studio"
              className="rounded-md bg-[#00c5cb] px-4 py-2.5 text-sm font-semibold text-[#111215] transition hover:bg-[#00b3b9]"
            >
              Add a studio
            </Link>
          )}
        </div>

        {!email ? (
          <div className="border-t border-white/10 py-6">
            <p className="text-sm text-zinc-300">
              Sign in to view and manage your studio listings.
            </p>
            <Link
              href="/login"
              className="mt-4 inline-flex rounded-md bg-[#00c5cb] px-4 py-2.5 text-sm font-semibold text-[#111215] transition hover:bg-[#00b3b9]"
            >
              Sign in
            </Link>
          </div>
        ) : errorMessage ? (
          <p
            role="alert"
            className="border-t border-white/10 py-6 text-sm text-zinc-300"
          >
            {errorMessage}
          </p>
        ) : studios.length === 0 ? (
          <div className="border-t border-white/10 py-6">
            <p className="text-sm text-zinc-300">
              You do not have any studio listings yet.
            </p>
            <Link
              href="/add-studio"
              className="mt-4 inline-flex rounded-md bg-[#00c5cb] px-4 py-2.5 text-sm font-semibold text-[#111215] transition hover:bg-[#00b3b9]"
            >
              Add your first studio
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-white/10 border-y border-white/10">
            {studios.map((studio) => (
              <article
                key={studio._id}
                className="flex flex-col gap-4 py-5 sm:flex-row sm:items-center"
              >
                {studio.mediaLibraryUrl ? (
                  <Image
                    src={studio.mediaLibraryUrl}
                    alt={`${studio.stageTitle} workspace`}
                    width={176}
                    height={112}
                    className="h-28 w-full shrink-0 rounded-sm object-cover sm:w-44"
                  />
                ) : (
                  <div className="flex h-28 w-full shrink-0 items-center justify-center rounded-sm bg-[#202228] text-sm text-zinc-500 sm:w-44">
                    Image unavailable
                  </div>
                )}

                <div className="flex min-w-0 flex-1 flex-col justify-between gap-4 sm:flex-row sm:items-center">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <h2 className="truncate text-lg font-semibold text-white">
                        {studio.stageTitle}
                      </h2>
                      <span className="rounded-sm bg-[#00c5cb]/10 px-2 py-1 text-xs text-[#00c5cb]">
                        {studio.deliveryCategory}
                      </span>
                    </div>
                    <p className="mt-1 truncate text-sm text-zinc-400">
                      {studio.geoAddress}
                    </p>
                    <dl className="mt-3 flex flex-wrap gap-x-5 gap-y-2 text-xs text-zinc-400">
                      <div>
                        <dt className="sr-only">Hourly rate</dt>
                        <dd>
                          {formatCurrency(
                            studio.hourlyRate,
                            "Rate unavailable",
                          )}{" "}
                          / hour
                        </dd>
                      </div>
                      <div>
                        <dt className="sr-only">Capacity</dt>
                        <dd>Capacity: {studio.capacity}</dd>
                      </div>
                      <div>
                        <dt className="sr-only">Security deposit</dt>
                        <dd>
                          Deposit:{" "}
                          {formatCurrency(studio.securityDeposit, "$0")}
                        </dd>
                      </div>
                    </dl>
                  </div>

                  <div className="flex shrink-0 flex-wrap items-center gap-2">
                    <Link
                      href={`/studios/edit/${encodeURIComponent(studio._id)}`}
                      className="rounded border border-white/10 bg-[#191a1f] px-4 py-2 text-xs font-medium text-zinc-200 transition hover:bg-white/10"
                    >
                      Update
                    </Link>
                    <DeleteStudioDailog
                      id={studio._id}
                      redirectTo="/my-listings"
                    />
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
