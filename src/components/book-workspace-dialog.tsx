"use client";

import { useState, type FormEvent } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export function BookWorkspaceDialog({
  workspaceTitle,
  hourlyRate,
  hostEmail,
}: {
  workspaceTitle: string;
  hourlyRate: string;
  hostEmail?: string;
}) {
  const [open, setOpen] = useState(false);

  function sendBookingRequest(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!hostEmail) {
      return;
    }

    const formData = new FormData(event.currentTarget);
    const subject = `Booking request: ${workspaceTitle}`;
    const body = [
      `Hello, I would like to ask about booking ${workspaceTitle}.`,
      `Preferred date: ${formData.get("date")}`,
      `Hours: ${formData.get("hours")}`,
      `Additional details: ${formData.get("message") || "None"}`,
      "",
      "Please confirm availability and the final booking details.",
    ].join("\n");

    window.location.href = `mailto:${encodeURIComponent(hostEmail)}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    setOpen(false);
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

        {hostEmail ? (
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
              Listed rate: {hourlyRate} per hour. The host will confirm
              availability, pricing, and your reservation.
            </p>

            <button
              type="submit"
              className="w-full rounded-md bg-[#00c5cb] px-4 py-3 text-sm font-semibold text-[#111215] transition hover:bg-[#00b3b9]"
            >
              Continue to email host
            </button>
          </form>
        ) : (
          <p className="rounded-md border border-white/10 bg-[#111215] p-4 text-sm text-zinc-300">
            The host has not provided a contact email, so a booking request
            cannot be started yet.
          </p>
        )}
      </DialogContent>
    </Dialog>
  );
}
