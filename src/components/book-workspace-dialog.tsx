"use client";

import { useState, type FormEvent } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { authClient, getAuthToken } from "@/lib/auth-client";
import { toast } from "@/components/ui/toast";
import { IStudio } from "./types/types";

export function BookWorkspaceDialog({ studio }: { studio: IStudio }) {
  const [open, setOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const { data: session } = authClient.useSession();
  const user = session?.user;

  async function sendBookingRequest(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrorMessage("");

    try {
      const formData = new FormData(event.currentTarget);
      const data = {
        ...studio,
        username: user?.name,
        email: user?.email,
        image: user?.image,
        departureDate: formData.get("date"),
        hours: formData.get("hours"),
        message: formData.get("message"),
        bookingDate: new Date(),
      };
      const token = await getAuthToken();

      const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER}/booking`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });

      const responseData = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(
          responseData?.message ??
            `Booking request failed with status ${response.status}`,
        );
      }

      toast.add({
        title: "Booking request sent",
        description: "Your request is pending host confirmation.",
        type: "success",
      });
      setOpen(false);
    } catch (error) {
      console.error("Could not submit booking request:", error);
      const errorText =
        error instanceof Error
          ? error.message
          : "Could not submit booking request. Please try again.";
      setErrorMessage(errorText);
      toast.add({
        title: "Booking request failed",
        description: errorText,
        type: "error",
      });
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="block w-full rounded-md bg-[#00c5cb] px-4 py-3 text-center text-sm font-semibold text-[#111215] transition hover:bg-[#00b3b9]"
      >
        Book Workspace Now
      </button>

      <DialogContent className="border border-white/10 bg-[#191a1f] text-white sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-white">
            Request a booking
          </DialogTitle>
          <DialogDescription className="text-zinc-400">
            Choose your preferred date and duration. Your booking is not
            confirmed until the host replies.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={sendBookingRequest} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="space-y-2 text-sm text-zinc-300">
              Preferred date
              <input
                name="date"
                type="date"
                required
                min={new Date().toISOString().slice(0, 10)}
                className="w-full rounded-md border border-white/10 bg-[#111215] px-3 py-2 text-white [color-scheme:dark]"
              />
            </label>
            <label className="space-y-2 text-sm text-zinc-300">
              Number of hours
              <input
                name="hours"
                type="number"
                min="1"
                max="24"
                defaultValue="1"
                required
                className="w-full rounded-md border border-white/10 bg-[#111215] px-3 py-2 text-white"
              />
            </label>
          </div>

          <label className="block space-y-2 text-sm text-zinc-300">
            Additional details
            <textarea
              name="message"
              rows={3}
              placeholder="Tell the host about your project or timing needs."
              className="w-full resize-y rounded-md border border-white/10 bg-[#111215] px-3 py-2 text-white placeholder:text-zinc-500"
            />
          </label>

          <p className="text-xs text-zinc-500">
            Listed rate: {studio.hourlyRate} per hour. The host will confirm
            availability, pricing, and your reservation.
          </p>

          {errorMessage && (
            <p role="alert" className="text-sm text-zinc-300">
              {errorMessage}
            </p>
          )}

          <button
            type="submit"
            className="w-full rounded-md bg-[#00c5cb] px-4 py-3 text-sm font-semibold text-[#111215] transition hover:bg-[#00b3b9]"
          >
            Book Workspace Now
          </button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
