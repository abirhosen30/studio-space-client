"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  CalendarDays,
  CircleCheck,
  Clock3,
  Eye,
  Ticket,
  XCircle,
} from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { toast } from "@/components/ui/toast";
import type { IBooking } from "@/lib/types/booking";

function formatDate(value?: string | Date) {
  if (!value) {
    return "Date not provided";
  }

  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? "Date not provided"
    : date.toLocaleDateString(undefined, {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
}

function getTotalPrice(rate?: number | string, hours?: number | string) {
  const hourlyRate = Number(String(rate ?? "").replace(/[^\d.-]/g, ""));
  const duration = Number(hours);

  if (!Number.isFinite(hourlyRate) || !Number.isFinite(duration)) {
    return null;
  }

  return new Intl.NumberFormat(undefined, {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2,
  }).format(hourlyRate * duration);
}

const bookingStatuses = {
  pending: {
    label: "Pending",
    className: "bg-amber-500/10 text-amber-400",
    icon: Clock3,
  },
  confirmed: {
    label: "Confirmed",
    className: "bg-emerald-500/10 text-emerald-400",
    icon: CircleCheck,
  },
  completed: {
    label: "Completed",
    className: "bg-sky-500/10 text-sky-300",
    icon: CircleCheck,
  },
  cancelled: {
    label: "Cancelled",
    className: "bg-zinc-500/10 text-zinc-400",
    icon: XCircle,
  },
  canceled: {
    label: "Cancelled",
    className: "bg-zinc-500/10 text-zinc-400",
    icon: XCircle,
  },
} as const;

const BookingCard = ({ booking }: { booking: IBooking }) => {
  const router = useRouter();
  const { data: session } = authClient.useSession();
  const [canceling, setCanceling] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const status = booking.status?.trim().toLowerCase() || "pending";
  const statusConfig =
    bookingStatuses[status as keyof typeof bookingStatuses] ??
    bookingStatuses.pending;
  const StatusIcon = statusConfig.icon;
  const isPending = status === "pending";
  const totalPrice = getTotalPrice(booking.hourlyRate, booking.hours);

  const handleCancelBooking = async () => {
    const email = session?.user?.email;

    if (!email || canceling) {
      setErrorMessage("Sign in to cancel this booking.");
      return;
    }

    setCanceling(true);
    setErrorMessage("");

    try {
      const response = await fetch(
        `http://localhost:8000/my-bookings/${encodeURIComponent(booking._id)}?email=${encodeURIComponent(email)}`,
        { method: "DELETE" },
      );

      if (!response.ok) {
        throw new Error(`Could not cancel booking (HTTP ${response.status}).`);
      }

      toast.add({
        title: "Booking cancelled",
        description: "The reservation has been removed.",
        type: "success",
      });
      router.push("/my-bookings");
      router.refresh();
    } catch (error) {
      const errorText =
        error instanceof Error ? error.message : "Could not cancel booking.";
      setErrorMessage(errorText);
      toast.add({
        title: "Could not cancel booking",
        description: errorText,
        type: "error",
      });
    } finally {
      setCanceling(false);
    }
  };

  return (
    <article className="flex flex-col overflow-hidden rounded-md border border-white/10 bg-[#191a1f] sm:flex-row">
      <div className="relative aspect-[16/9] w-full shrink-0 bg-[#202228] sm:aspect-auto sm:min-h-40 sm:w-56">
        {booking.mediaLibraryUrl ? (
          <Image
            src={booking.mediaLibraryUrl}
            alt={`${booking.stageTitle || "Studio"} workspace`}
            fill
            sizes="(max-width: 640px) 100vw, 224px"
            className="object-cover"
          />
        ) : (
          <div className="flex h-full min-h-32 items-center justify-center text-sm text-zinc-500">
            Image unavailable
          </div>
        )}
      </div>

      <div className="flex min-w-0 flex-1 flex-col justify-between gap-5 p-4 sm:flex-row sm:items-center sm:p-5">
        <div className="min-w-0">
          <div
            className={`mb-2 inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${statusConfig.className}`}
          >
            <StatusIcon className="size-3.5" aria-hidden="true" />
            {statusConfig.label}
          </div>

          <h2 className="truncate text-xl font-semibold text-white">
            {booking.stageTitle || "Workspace booking"}
          </h2>

          <div className="mt-2 space-y-1.5 text-xs text-zinc-400">
            <p className="flex items-center gap-2">
              <CalendarDays className="size-3.5 shrink-0" aria-hidden="true" />
              <span>Departure: {formatDate(booking.departureDate)}</span>
            </p>
            <p className="flex items-center gap-2">
              <Ticket className="size-3.5 shrink-0" aria-hidden="true" />
              <span className="truncate">Booking ID: {booking._id}</span>
            </p>
            <p className="flex items-center gap-2">
              <Clock3 className="size-3.5 shrink-0" aria-hidden="true" />
              <span>{booking.hours || 1} hour(s)</span>
            </p>
          </div>

          <p className="mt-2 text-xl font-semibold text-[#00c5cb]">
            {totalPrice ?? "Rate unavailable"}
          </p>
          {errorMessage && (
            <p role="alert" className="mt-2 text-xs text-zinc-300">
              {errorMessage}
            </p>
          )}
        </div>

        <div className="flex justify-end shrink-0 gap-2 sm:flex-col">
          {isPending && (
            <button
              type="button"
              onClick={handleCancelBooking}
              disabled={canceling}
              className="inline-flex min-h-10 items-center justify-center gap-1.5 rounded-sm border border-[#ff7a00]/60 px-3 text-xs font-medium text-[#ff9a33] transition hover:bg-[#ff7a00]/10 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <XCircle className="size-3.5" aria-hidden="true" />
              {canceling ? "Cancelling..." : "Cancel Booking"}
            </button>
          )}
          {booking.studioId && (
            <Link
              href={`/studios/${booking.studioId}`}
              className="inline-flex min-h-10 items-center justify-center gap-1.5 rounded-sm bg-[#00c5cb] px-3 text-xs font-medium text-[#111215] transition hover:bg-[#00b3b9]"
            >
              <Eye className="size-3.5" aria-hidden="true" />
              View
            </Link>
          )}
        </div>
      </div>
    </article>
  );
};

export default BookingCard;
