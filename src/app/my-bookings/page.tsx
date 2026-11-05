import Link from "next/link";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import BookingCard from "@/components/bookingCard";
import type { IBooking } from "@/lib/types/booking";

export default async function MyBookingsPage() {
  const requestHeaders = await headers();
  const session = await auth.api.getSession({ headers: requestHeaders });
  const email = session?.user?.email;
  let bookings: IBooking[] = [];
  let errorMessage = "";

  if (email) {
    try {
      const { token } = await auth.api.getToken({ headers: requestHeaders });
      const response = await fetch(
        `http://localhost:8000/my-bookings/${encodeURIComponent(email)}`,
        {
          headers: { Authorization: `Bearer ${token}` },
          cache: "no-store",
        },
      );

      if (!response.ok) {
        throw new Error(`Could not load bookings (HTTP ${response.status}).`);
      }

      const data: unknown = await response.json();
      if (!Array.isArray(data)) {
        throw new Error("The bookings response was not a list.");
      }

      bookings = data as IBooking[];
    } catch (error) {
      errorMessage =
        error instanceof Error
          ? error.message
          : "Could not load your bookings.";
    }
  }

  return (
    <main className="min-h-screen flex-1 bg-[#111215]">
      <section className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="mb-2 text-sm font-semibold uppercase tracking-[0.2em] text-[#00c5cb]">
              StudioSpace
            </p>
            <h1 className="text-3xl font-bold tracking-tight text-white">
              My Bookings
            </h1>
            <p className="mt-2 text-sm text-zinc-400">
              Your workspace booking requests.
            </p>
          </div>
          <Link
            href="/studios"
            className="rounded-md border border-white/10 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-white/10"
          >
            Explore studios
          </Link>
        </div>

        {!email ? (
          <div className="border-t border-white/10 py-6">
            <p className="text-sm text-zinc-300">
              Sign in to view bookings associated with your account.
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
        ) : bookings.length === 0 ? (
          <div className="border-t border-white/10 py-6">
            <p className="text-sm text-zinc-300">You have no bookings yet.</p>
            <Link
              href="/studios"
              className="mt-4 inline-flex rounded-md bg-[#00c5cb] px-4 py-2.5 text-sm font-semibold text-[#111215] transition hover:bg-[#00b3b9]"
            >
              Find a workspace
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-white/10 border-y border-white/10">
            {bookings.map((booking) => (
              <BookingCard key={booking._id} booking={booking} />
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
