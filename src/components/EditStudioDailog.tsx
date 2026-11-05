"use client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { useRouter } from "next/navigation";
import { useState, type FormEvent, type ReactNode } from "react";
import {
  BadgeCheck,
  CircleCheck,
  Images,
  Info,
  MapPin,
  NotebookText,
  ShieldCheck,
  SlidersHorizontal,
  Wrench,
  Save,
  LoaderCircle,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import Image from "next/image";
import { toast } from "@/components/ui/toast";

const inputClassName =
  "h-10 rounded-lg border-white/10 bg-[#202228] text-sm text-zinc-100 placeholder:text-zinc-600";

const presetChipOptions = [
  "Aputure 6×7 Strip",
  "Boling BL-1 Softbox",
  "Greenscreen Box",
  "Skanlite Skybridge",
  "Arri SkyPanel 300",
  "Infinibar 4K RGB",
];

const hardwareOptions = [
  "ETC Ion XT Lighting Console",
  "Profoto 4000W Strobe Array",
  "3-Phase 500A Generator Power",
  "ISO Steel Rigging Grid (Silverline)",
  "Anti-Vibration Acoustic Panels",
  "Schoeps CMIT 5 Shotgun Kit",
  "Sony VENICE 2 Camera Package",
  "Teradek Bolt 4K Wireless Video",
  "Sigma Zoom Prime Kit (SM-Z)",
  "Remote Previs Motion Head",
];

interface IStudioForm {
  stageTitle: string;
  deliveryCategory: string;
  capacity: string;
  hourlyRate: string;
  securityDeposit: string;
  geoAddress: string;
  mediaLibraryUrl: string;
  presetChips: string[];
  hardware: string[];
  notes: string;
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
}

function getInitialForm(studio: IStudio): IStudioForm {
  return {
    stageTitle: studio.stageTitle ?? "",
    deliveryCategory: studio.deliveryCategory ?? "",
    capacity: String(studio.capacity ?? ""),
    hourlyRate: String(studio.hourlyRate ?? "").replace(/[^0-9.-]/g, ""),
    securityDeposit: String(studio.securityDeposit ?? "0").replace(
      /[^0-9.-]/g,
      "",
    ),
    geoAddress: studio.geoAddress ?? "",
    mediaLibraryUrl: studio.mediaLibraryUrl ?? "",
    presetChips: Array.isArray(studio.presetChips) ? studio.presetChips : [],
    hardware: Array.isArray(studio.hardware) ? studio.hardware : [],
    notes: studio.notes ?? "",
  };
}

function FieldLabel({
  htmlFor,
  children,
  right,
}: {
  htmlFor?: string;
  children: ReactNode;
  right?: ReactNode;
}) {
  return (
    <div className="mb-2 flex items-center justify-between gap-3">
      <Label
        htmlFor={htmlFor}
        className="text-[10px] font-semibold uppercase tracking-widest text-zinc-500"
      >
        {children}
      </Label>
      {right}
    </div>
  );
}

function Section({
  icon,
  title,
  right,
  children,
}: {
  icon: ReactNode;
  title: string;
  right?: ReactNode;
  children: ReactNode;
}) {
  return (
    <section className="rounded-xl border border-white/[0.06] bg-[#191b1f] p-4 sm:p-6">
      <div className="mb-5 flex items-center justify-between gap-3">
        <h2 className="flex items-center gap-2 text-sm font-semibold text-white">
          {icon}
          {title}
        </h2>
        {right}
      </div>
      <div className="space-y-5">{children}</div>
    </section>
  );
}

function InfoTip({ children }: { children: string }) {
  return (
    <Tooltip>
      <TooltipTrigger
        render={
          <button
            type="button"
            aria-label="More information"
            className="inline-flex text-zinc-600 hover:text-zinc-300"
          />
        }
      >
        <Info className="size-3.5" />
      </TooltipTrigger>
      <TooltipContent className="text-zinc-100">{children}</TooltipContent>
    </Tooltip>
  );
}

const EditStudioDailog = ({
  studio,
  redirectTo,
}: {
  studio: IStudio;
  redirectTo?: string;
}) => {
  const router = useRouter();
  const [form, setForm] = useState<IStudioForm>(() => getInitialForm(studio));
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [previewImage, setPreviewImage] = useState(false);

  const update = (field: keyof IStudioForm, value: string) => {
    setForm((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: "" }));
    setMessage("");
  };

  const togglePresetChip = (label: string) => {
    const selected = form.presetChips.includes(label);

    if (!selected && form.presetChips.length >= 3) {
      setMessage("You can select a maximum of 3 presets.");
      return;
    }

    setMessage("");
    setForm((current) => ({
      ...current,
      presetChips: selected
        ? current.presetChips.filter((item) => item !== label)
        : [...current.presetChips, label],
    }));
  };

  const toggleHardware = (label: string, checked: boolean) => {
    setForm((current) => ({
      ...current,
      hardware: checked
        ? [...current.hardware, label]
        : current.hardware.filter((item) => item !== label),
    }));
  };

  const validate = () => {
    const nextErrors: Record<string, string> = {};

    if (!form.stageTitle.trim()) {
      nextErrors.stageTitle = "Studio title is required.";
    } else if (form.stageTitle.trim().length > 80) {
      nextErrors.stageTitle = "Title must be 80 characters or fewer.";
    }

    if (!form.deliveryCategory.trim()) {
      nextErrors.deliveryCategory = "Category is required.";
    }

    const rate = Number(form.hourlyRate);
    if (!form.hourlyRate.trim() || !Number.isFinite(rate) || rate <= 0) {
      nextErrors.hourlyRate = "Enter a valid positive hourly rate.";
    }

    const deposit = Number(form.securityDeposit);
    if (
      !form.securityDeposit.trim() ||
      !Number.isFinite(deposit) ||
      deposit < 0
    ) {
      nextErrors.securityDeposit = "Deposit cannot be negative.";
    }

    const capacity = Number(form.capacity);
    if (
      !form.capacity.trim() ||
      !Number.isInteger(capacity) ||
      capacity < 1 ||
      capacity > 1700
    ) {
      nextErrors.capacity = "Capacity must be between 1 and 1700.";
    }

    if (!form.geoAddress.trim()) {
      nextErrors.geoAddress = "Studio address is required.";
    }

    if (form.mediaLibraryUrl.trim()) {
      try {
        const url = new URL(form.mediaLibraryUrl);
        if (!["https:", "http:"].includes(url.protocol)) {
          throw new Error("Invalid URL protocol");
        }
      } catch {
        nextErrors.mediaLibraryUrl = "Enter a valid image URL.";
      }
    }

    const wordCount = form.notes.trim()
      ? form.notes.trim().split(/\s+/).length
      : 0;
    if (wordCount < 20) {
      nextErrors.notes = "Production notes must contain at least 20 words.";
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const updatedData = {
      stageTitle: form.stageTitle,
      deliveryCategory: form.deliveryCategory,
      capacity: Number(form.capacity),
      hourlyRate: Number(form.hourlyRate),
      securityDeposit: Number(form.securityDeposit),
      geoAddress: form.geoAddress,
      mediaLibraryUrl: form.mediaLibraryUrl,
      presetChips: form.presetChips,
      hardware: form.hardware,
      notes: form.notes,
    };

    if (!validate()) {
      setMessage("Please fix the highlighted fields before saving.");
      return;
    }

    setLoading(true);
    setMessage("");
    try {
      const response = await fetch(
        `http://localhost:8000/studios/${encodeURIComponent(studio._id)}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedData),
        },
      );

      if (!response.ok) {
        throw new Error(
          `Could not save this studio (HTTP ${response.status}).`,
        );
      }

      const result: unknown = await response.json();
      if (
        typeof result !== "object" ||
        result === null ||
        !("matchedCount" in result) ||
        result.matchedCount !== 1
      ) {
        throw new Error("The studio was not found and could not be updated.");
      }

      setMessage("Studio listing updated successfully.");
      toast.add({
        title: "Studio updated",
        description: "Your listing changes have been saved.",
        type: "success",
      });
      router.replace(
        redirectTo ?? `/studios/${encodeURIComponent(studio._id)}`,
      );
      router.refresh();
    } catch (error) {
      console.error("Could not update studio:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Could not save this studio.";
      setMessage(
        errorMessage,
      );
      toast.add({
        title: "Could not update studio",
        description: errorMessage,
        type: "error",
    });
    } finally {
      setLoading(false);
    }
  };

  const wordCount = form.notes.trim()
    ? form.notes.trim().split(/\s+/).length
    : 0;

  return (
    <Dialog>
      <DialogTrigger className="rounded border border-white/10 bg-[#191a1f] px-4 py-2 text-xs font-medium text-zinc-200 transition hover:bg-white/10">
        ✎ Edit
      </DialogTrigger>
      <DialogContent className="max-h-[90vh] overflow-y-auto border border-white/10 bg-[#111215] text-white sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle>Edit Studio</DialogTitle>
          <DialogDescription>
            Update this studio listing. Host information is read-only.
          </DialogDescription>
        </DialogHeader>
        <form
          name="edit-studio"
          onSubmit={handleSubmit}
          noValidate
          className="flex flex-col gap-4"
        >
          <Section
            icon={<ShieldCheck className="size-4 text-zinc-500" />}
            title="Host Identity Verification"
            right={
              <Badge className="border-[#00c5cb]/30 bg-[#00c5cb]/10 text-[#00c5cb]">
                Pre-verified
              </Badge>
            }
          >
            <div>
              <FieldLabel>Service provider name</FieldLabel>
              <Input
                readOnly
                value={studio.providerName ?? ""}
                placeholder="Host name unavailable"
                className={cn(
                  inputClassName,
                  "cursor-not-allowed text-zinc-400",
                )}
              />
            </div>

            <div>
              <FieldLabel>Account email (primary)</FieldLabel>
              <div className="relative">
                <Input
                  type="email"
                  readOnly
                  value={studio.accountEmail ?? ""}
                  placeholder="Host email unavailable"
                  className={cn(
                    inputClassName,
                    "pr-10 cursor-not-allowed text-zinc-400",
                  )}
                />
                <BadgeCheck className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-[#00c5cb]" />
              </div>
            </div>
          </Section>

          <Section
            icon={<SlidersHorizontal className="size-4 text-zinc-500" />}
            title="Core Listing Parameters"
            right={
              <span className="text-[10px] uppercase tracking-widest text-[#ff9e45]">
                Required fields
              </span>
            }
          >
            <div>
              <FieldLabel htmlFor="stageTitle">Studio stage title *</FieldLabel>
              <Input
                id="stageTitle"
                maxLength={80}
                value={form.stageTitle}
                onChange={(e) => update("stageTitle", e.target.value)}
                placeholder="Enter studio title"
                className={inputClassName}
              />
              <div className="mt-1 flex justify-between">
                {errors.stageTitle && (
                  <p className="text-xs text-red-400">{errors.stageTitle}</p>
                )}
                <span className="ml-auto text-[10px] text-zinc-600">
                  {form.stageTitle.length}/80
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <FieldLabel htmlFor="deliveryCategory">
                  Studio category *
                </FieldLabel>
                <select
                  id="deliveryCategory"
                  value={form.deliveryCategory}
                  onChange={(e) => update("deliveryCategory", e.target.value)}
                  className={cn(inputClassName, "w-full")}
                >
                  <option value="">Select category</option>
                  {form.deliveryCategory &&
                    ![
                      "Photo Studio",
                      "Film Stage",
                      "Podcast Lounge",
                      "Music Suite",
                      "Workshop",
                      "Recording Studio",
                      "Event Space",
                      "Other",
                    ].includes(form.deliveryCategory) && (
                      <option value={form.deliveryCategory}>
                        {form.deliveryCategory}
                      </option>
                    )}
                  {[
                    "Photo Studio",
                    "Film Stage",
                    "Podcast Lounge",
                    "Music Suite",
                    "Workshop",
                    "Recording Studio",
                    "Event Space",
                    "Other",
                  ].map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
                {errors.deliveryCategory && (
                  <p className="mt-1 text-xs text-red-400">
                    {errors.deliveryCategory}
                  </p>
                )}
              </div>

              <div>
                <FieldLabel
                  htmlFor="capacity"
                  right={<InfoTip>Maximum permitted occupancy.</InfoTip>}
                >
                  Maximum capacity *
                </FieldLabel>
                <Input
                  id="capacity"
                  type="number"
                  min={1}
                  max={1700}
                  step={1}
                  value={form.capacity}
                  onChange={(e) => update("capacity", e.target.value)}
                  placeholder="25"
                  className={inputClassName}
                />
                {errors.capacity && (
                  <p className="mt-1 text-xs text-red-400">{errors.capacity}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <FieldLabel
                  htmlFor="hourlyRate"
                  right={<InfoTip>Price charged per hour.</InfoTip>}
                >
                  Hourly Rate ($/hr) *
                </FieldLabel>
                <Input
                  id="hourlyRate"
                  type="number"
                  min={0.01}
                  step="0.01"
                  value={form.hourlyRate}
                  onChange={(e) => update("hourlyRate", e.target.value)}
                  placeholder="150"
                  className={inputClassName}
                />
                {errors.hourlyRate && (
                  <p className="mt-1 text-xs text-red-400">
                    {errors.hourlyRate}
                  </p>
                )}
              </div>

              <div>
                <FieldLabel
                  htmlFor="securityDeposit"
                  right={<InfoTip>Refundable deposit amount.</InfoTip>}
                >
                  Security deposit ($) *
                </FieldLabel>
                <Input
                  id="securityDeposit"
                  type="number"
                  min={0}
                  step="0.01"
                  value={form.securityDeposit}
                  onChange={(e) => update("securityDeposit", e.target.value)}
                  className={inputClassName}
                />
                {errors.securityDeposit && (
                  <p className="mt-1 text-xs text-red-400">
                    {errors.securityDeposit}
                  </p>
                )}
              </div>
            </div>

            <div>
              <FieldLabel
                htmlFor="geoAddress"
                right={<MapPin className="size-3.5 text-zinc-500" />}
              >
                Studio address *
              </FieldLabel>
              <Input
                id="geoAddress"
                value={form.geoAddress}
                onChange={(e) => update("geoAddress", e.target.value)}
                placeholder="Street, city, postal code"
                className={inputClassName}
              />
              {errors.geoAddress && (
                <p className="mt-1 text-xs text-red-400">{errors.geoAddress}</p>
              )}
            </div>
          </Section>

          <Section
            icon={<Images className="size-4 text-zinc-500" />}
            title="CDN Imagery & Media Assets"
          >
            <div>
              <FieldLabel htmlFor="mediaLibraryUrl">
                Studio image URL
              </FieldLabel>
              <div className="flex flex-col gap-2 sm:flex-row">
                <Input
                  id="mediaLibraryUrl"
                  type="url"
                  value={form.mediaLibraryUrl}
                  onChange={(e) => {
                    update("mediaLibraryUrl", e.target.value);
                    setPreviewImage(false);
                  }}
                  placeholder="https://example.com/studio.jpg"
                  className={cn(
                    inputClassName,
                    "min-w-0 flex-1 font-mono text-xs",
                  )}
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    if (!form.mediaLibraryUrl.trim()) {
                      setErrors((current) => ({
                        ...current,
                        mediaLibraryUrl: "Enter an image URL first.",
                      }));
                      return;
                    }

                    try {
                      const url = new URL(form.mediaLibraryUrl);
                      if (!["http:", "https:"].includes(url.protocol)) {
                        throw new Error("Invalid URL");
                      }
                      setErrors((current) => ({
                        ...current,
                        mediaLibraryUrl: "",
                      }));
                      setPreviewImage(true);
                    } catch {
                      setErrors((current) => ({
                        ...current,
                        mediaLibraryUrl: "Enter a valid image URL.",
                      }));
                    }
                  }}
                  className="h-10 shrink-0 border-white/10 bg-[#202228] text-zinc-200"
                >
                  Track & Preview
                </Button>
              </div>
              {errors.mediaLibraryUrl && (
                <p className="mt-1 text-xs text-red-400">
                  {errors.mediaLibraryUrl}
                </p>
              )}

              {previewImage && (
                <div className="mt-3 overflow-hidden rounded-lg border border-white/10">
                  <Image
                    src={form.mediaLibraryUrl}
                    alt="Studio preview"
                    className="max-h-64 w-full object-cover"
                    onError={() => {
                      setPreviewImage(false);
                      setErrors((current) => ({
                        ...current,
                        mediaLibraryUrl: "The image could not be loaded.",
                      }));
                    }}
                  />
                </div>
              )}
            </div>

            <div>
              <p className="mb-2 text-[10px] font-semibold uppercase tracking-widest text-zinc-500">
                Select presets (maximum 3)
              </p>
              <div className="flex flex-wrap gap-2">
                {presetChipOptions.map((label) => {
                  const selected = form.presetChips.includes(label);
                  const limitReached =
                    form.presetChips.length >= 3 && !selected;

                  return (
                    <button
                      key={label}
                      type="button"
                      disabled={limitReached}
                      onClick={() => togglePresetChip(label)}
                      className={cn(
                        "inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-xs transition-colors disabled:cursor-not-allowed disabled:opacity-40",
                        selected
                          ? "border-[#00c5cb]/40 bg-[#00c5cb]/10 text-[#00c5cb]"
                          : "border-white/[0.08] bg-[#202228] text-zinc-300 hover:bg-[#2a2d33]",
                      )}
                    >
                      {selected && (
                        <span className="size-1.5 rounded-full bg-[#00c5cb]" />
                      )}
                      {label}
                    </button>
                  );
                })}
              </div>
              <p className="mt-2 text-xs text-zinc-500">
                {form.presetChips.length}/3 presets selected
              </p>
            </div>
          </Section>

          <Section
            icon={<Wrench className="size-4 text-zinc-500" />}
            title="Hardware & Amenities"
          >
            <p className="text-xs leading-relaxed text-zinc-500">
              Select the equipment and facilities available at your studio.
            </p>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {hardwareOptions.map((item) => (
                <label
                  key={item}
                  className="flex cursor-pointer items-start gap-3 rounded-lg border border-white/[0.06] bg-[#202228] p-3"
                >
                  <Checkbox
                    checked={form.hardware.includes(item)}
                    onCheckedChange={(checked) =>
                      toggleHardware(item, checked === true)
                    }
                    className="mt-0.5 data-[state=checked]:border-[#ff7a00] data-[state=checked]:bg-[#ff7a00]"
                  />
                  <span className="text-xs leading-relaxed text-zinc-300">
                    {item}
                  </span>
                </label>
              ))}
            </div>
          </Section>

          <Section
            icon={<NotebookText className="size-4 text-zinc-500" />}
            title="Production Notes & Facility Rules"
            right={
              <span className="text-[10px] uppercase tracking-widest text-zinc-500">
                Minimum 20 words
              </span>
            }
          >
            <div>
              <FieldLabel htmlFor="notes">Detailed overview</FieldLabel>
              <Textarea
                id="notes"
                rows={6}
                maxLength={3000}
                value={form.notes}
                onChange={(e) => update("notes", e.target.value)}
                placeholder="Describe technical requirements, access rules, safety procedures and production guidelines..."
                className="rounded-lg border-white/10 bg-[#202228] text-sm leading-relaxed text-zinc-300"
              />
              <div className="mt-2 flex flex-wrap justify-between gap-2">
                {errors.notes && (
                  <p className="text-xs text-red-400">{errors.notes}</p>
                )}
                <p className="ml-auto text-xs text-zinc-500">
                  {wordCount} words
                </p>
              </div>
            </div>
          </Section>

          <div className="sticky bottom-3 z-20 -mx-1 mt-1">
            <div className="flex flex-col gap-3 rounded-xl border border-white/[0.06] bg-[#191b1f]/95 p-3 shadow-lg shadow-black/40 backdrop-blur sm:flex-row sm:items-center sm:justify-between">
              <div className="flex min-w-0 items-center gap-2 text-xs text-zinc-300">
                <CircleCheck className="size-4 shrink-0 text-[#00c5cb]" />
                <span aria-live="polite">
                  {message || "Review your studio information before saving."}
                </span>
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="h-10 shrink-0 rounded-lg bg-[#ff7a00] px-5 text-white hover:bg-[#ff7a00]/85 disabled:opacity-50"
              >
                {loading ? (
                  <LoaderCircle className="mr-2 size-4 animate-spin" />
                ) : (
                  <Save className="mr-2 size-4" />
                )}
                {loading ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditStudioDailog;
