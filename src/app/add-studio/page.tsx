"use client";

import { useState } from "react";
import {
  BadgeCheck,
  CircleCheck,
  Images,
  Info,
  MapPin,
  NotebookText,
  Pencil,
  Save,
  ShieldCheck,
  SlidersHorizontal,
  Wrench,
} from "lucide-react";
import { cn } from "cn";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const inputClassName =
  "h-9 rounded-lg border-white/10 bg-[#202228] text-sm text-zinc-100 placeholder:text-zinc-600";

const presetChipOptions = [
  "Aputure 6×7 Strip",
  "Boling BL-1 Softbox",
  "Greenscreen Box",
  "Skanlite Skybridge",
  "Arri SkyPanel 300",
  "Infinibar 4K RGB",
];

const hardwareOptions = [
  { label: "ETC Ion XT Lighting Console", checked: true },
  { label: "Profoto 4000W Strobe Array", checked: false },
  { label: "3-Phase 500A Generator Power", checked: true },
  { label: "ISO Steel Rigging Grid (Silverline)", checked: false },
  { label: "Anti-Vibration Acoustic Panels", checked: true },
  { label: "Schoeps CMIT 5 Shotgun Kit", checked: false },
  { label: "Sony VENICE 2 Camera Package", checked: true },
  { label: "Teradek Bolt 4K Wireless Video", checked: false },
  { label: "Sigma Zoom Prime Kit (SM-Z)", checked: false },
  { label: "Remote Previs Motion Head", checked: false },
];

const initialForm = {
  providerName: "Alex Mercer", // fixed
  accountEmail: "example@studiostage.co", // fixed
  stageTitle: "Apex Stage — Acoustic Cyc Wall & Rigging Grid",
  deliveryCategory: "4W | Stage | Soundstage",
  capacity: "850",
  hourlyRate: "$ 150",
  securityDeposit: "$ 750",
  geoAddress: "540 Production Bay, Studio District, Brooklyn, NY 11222",
  mediaLibraryUrl:
    "https://image.zapbro.storage/asset/pgSMDBZ7xZh6_z0d6bYm/master",
  presetChips: ["Aputure 6×7 Strip", "Greenscreen Box"],
  hardware: ["ETC Ion XT Lighting Console", "3-Phase 500A Generator Power", "Anti-Vibration Acoustic Panels", "Sony VENICE 2 Camera Package"],
  notes:
    "TECHNICAL CLAUSE: LIGHTING LOAD PROTOCOL —\nAll 208V camera work runs on dedicated floorbox circuits. Ceiling clearance is 22ft for extended aerial work. Overhead 3-phase service draws start simultaneously and must be staggered with dimer ramps. Overnight gear loads must be coordinated with stage manager 24 hours prior.",
};

function FieldLabel({
  htmlFor,
  children,
  right,
}: {
  htmlFor?: string
  children: React.ReactNode
  right?: React.ReactNode
}) {
  return (
    <div className="flex items-center justify-between gap-3 mb-2">
      <Label
        htmlFor={htmlFor}
        className="text-[10px] font-semibold tracking-widest uppercase text-zinc-500"
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
  icon: React.ReactNode;
  title: string;
  right?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-xl border border-white/[0.06] bg-[#191b1f] p-5 sm:p-6">
      <div className="flex items-center justify-between gap-3 mb-5">
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
          <span
            className="inline-flex cursor-default text-zinc-600 hover:text-zinc-400"
            tabIndex={0}
          />
        }
      >
        <Info className="size-3.5" />
      </TooltipTrigger>
      <TooltipContent className="text-zinc-100">{children}</TooltipContent>
    </Tooltip>
  );
}

export default function AddStudioPage() {
  const [form, setForm] = useState(initialForm);

  const update = (field: keyof typeof form, value: string | string[]) =>
    setForm((current) => ({ ...current, [field]: value }));

  const togglePresetChip = (label: string) =>
    setForm((current) => ({
      ...current,
      presetChips: current.presetChips.includes(label)
        ? current.presetChips.filter((chip) => chip !== label)
        : [...current.presetChips, label],
    }));

  const toggleHardware = (label: string, checked: boolean) =>
    setForm((current) => ({
      ...current,
      hardware: checked
        ? [...current.hardware, label]
        : current.hardware.filter((item) => item !== label),
    }));

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const res = await fetch("http://localhost:8000/add-studio", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(form),
    });

    const data = await res.json();
    console.log(data);
  };

  return (
    <TooltipProvider>
      <main className="flex-1 max-w-2xl w-full mx-auto px-4 py-8 flex flex-col gap-4">
        <form name="add-studio" onSubmit={handleSubmit}>
          <div className="flex flex-col gap-4">
            {/* Host Identity Verification */}
            <Section
              icon={<ShieldCheck className="size-4 text-zinc-500" />}
              title="Host Identity Verification"
              right={
                <span className="text-[10px] font-semibold tracking-widest uppercase text-zinc-600">
                  Session idle · 4:59
                </span>
              }
            >
              <div>
                <FieldLabel
                  right={
                    <Badge className="border-[#00c5cb]/30 bg-[#00c5cb]/10 text-[#00c5cb]">
                      Pre-verified
                    </Badge>
                  }
                >
                  Service provider name
                </FieldLabel>
                {/* Fixed name — not editable */}
                <Input
                  readOnly
                  value={form.providerName}
                  className={cn(inputClassName, "h-10 pr-24 cursor-not-allowed text-zinc-400")}
                />
              </div>
              <div>
                <FieldLabel right={<Pencil className="size-3.5 text-zinc-600" />}>
                  Account email (primary)
                </FieldLabel>
                {/* Fixed email — not editable */}
                <div className="relative">
                  <Input
                    readOnly
                    value={form.accountEmail}
                    className={cn(
                      inputClassName,
                      "h-10 pr-9 cursor-not-allowed text-zinc-400"
                    )}
                  />
                  <BadgeCheck className="absolute right-2.5 top-1/2 -translate-y-1/2 size-4 text-[#00c5cb] pointer-events-none" />
                </div>
              </div>
            </Section>

            {/* Core Listing Parameters */}
            <Section
              icon={<SlidersHorizontal className="size-4 text-zinc-500" />}
              title="Core Listing Parameters"
              right={
                <span className="text-[10px] font-semibold tracking-widest uppercase text-[#ff9e45]">
                  Required spaces
                </span>
              }
            >
              <div>
                <FieldLabel
                  htmlFor="stageTitle"
                  right={<span className="text-[10px] text-zinc-600">0/80</span>}
                >
                  Studio stage title
                </FieldLabel>
                <Input
                  id="stageTitle"
                  value={form.stageTitle}
                  onChange={(event) => update("stageTitle", event.target.value)}
                  className={cn(inputClassName, "h-10")}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <FieldLabel
                    htmlFor="deliveryCategory"
                    right={<InfoTip>Category under which this stage is listed.</InfoTip>}
                  >
                    Primary studio delivery
                  </FieldLabel>
                  <Input
                    id="deliveryCategory"
                    value={form.deliveryCategory}
                    onChange={(event) =>
                      update("deliveryCategory", event.target.value)
                    }
                    className={inputClassName}
                  />
                </div>
                <div>
                  <FieldLabel
                    htmlFor="capacity"
                    right={
                      <div className="flex items-center gap-1.5">
                        <InfoTip>Floor headcount at legal occupancy.</InfoTip>
                        <span className="text-[10px] text-zinc-600">Max 1700</span>
                      </div>
                    }
                  >
                    Init capacity (unix capacity)
                  </FieldLabel>
                  <Input
                    id="capacity"
                    value={form.capacity}
                    onChange={(event) => update("capacity", event.target.value)}
                    className={inputClassName}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <FieldLabel
                    htmlFor="hourlyRate"
                    right={<InfoTip>Rate synced from your pricing dashboard.</InfoTip>}
                  >
                    Hourly base rate ($/hr)
                  </FieldLabel>
                  <Input
                    id="hourlyRate"
                    value={form.hourlyRate}
                    onChange={(event) => update("hourlyRate", event.target.value)}
                    className={cn(inputClassName, "font-medium text-white")}
                  />
                  <p className="mt-1.5 text-[11px] text-zinc-600">
                    Synced from your SpringShared dashboard.{" "}
                    <a href="#" className="text-[#00c5cb] hover:underline">
                      Learn more
                    </a>
                  </p>
                </div>
                <div>
                  <FieldLabel
                    htmlFor="securityDeposit"
                    right={
                      <InfoTip>
                        Held in escrow and released after checkout review.
                      </InfoTip>
                    }
                  >
                    Refundable security deposit ($USD)
                  </FieldLabel>
                  <Input
                    id="securityDeposit"
                    value={form.securityDeposit}
                    onChange={(event) =>
                      update("securityDeposit", event.target.value)
                    }
                    className={cn(inputClassName, "font-medium text-white")}
                  />
                  <p className="mt-1.5 text-[11px] text-zinc-600">
                    Credit-back up to $120 hosting escrow.{" "}
                    <a href="#" className="text-[#00c5cb] hover:underline">
                      Learn more
                    </a>
                  </p>
                </div>
              </div>

              <div>
                <FieldLabel
                  htmlFor="geoAddress"
                  right={
                    <Badge className="border-[#00c5cb]/30 bg-[#00c5cb]/10 text-[#00c5cb]">
                      <MapPin />
                      Geofence aligned
                    </Badge>
                  }
                >
                  Studio geo coordination
                </FieldLabel>
                <Input
                  id="geoAddress"
                  value={form.geoAddress}
                  onChange={(event) => update("geoAddress", event.target.value)}
                  className={cn(inputClassName, "h-10")}
                />
              </div>
            </Section>

            {/* CDN Imagery & Media Assets */}
            <Section
              icon={<Images className="size-4 text-zinc-500" />}
              title="CDN Imagery & Media Assets"
              right={
                <span className="text-[10px] font-semibold tracking-widest uppercase text-zinc-600">
                  87% CDN sync
                </span>
              }
            >
              <div>
                <FieldLabel htmlFor="mediaLibraryUrl">Media library URL</FieldLabel>
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                  <Input
                    id="mediaLibraryUrl"
                    value={form.mediaLibraryUrl}
                    onChange={(event) =>
                      update("mediaLibraryUrl", event.target.value)
                    }
                    className={cn(inputClassName, "font-mono text-xs")}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    className="h-9 shrink-0 rounded-lg border-white/10 bg-[#1e2025] text-zinc-200 hover:bg-[#2a2d33] hover:text-white"
                  >
                    Track & Preview
                  </Button>
                </div>
              </div>
              <div>
                <p className="text-[10px] font-semibold tracking-widest uppercase text-zinc-500 mb-2.5">
                  Select presets for studio (max 3)
                </p>
                <div className="flex flex-wrap gap-2">
                  {presetChipOptions.map((label) => {
                    const selected = form.presetChips.includes(label);
                    return (
                      <button
                        key={label}
                        type="button"
                        onClick={() => togglePresetChip(label)}
                        className={cn(
                          "inline-flex items-center gap-2 rounded-lg px-3 py-1.5 text-xs font-medium border transition-colors",
                          selected
                            ? "border-[#00c5cb]/40 bg-[#00c5cb]/10 text-[#00c5cb]"
                            : "border-white/[0.08] bg-[#1e2025] text-zinc-300 hover:bg-[#2a2d33]"
                        )}
                      >
                        {selected && (
                          <span className="h-1.5 w-1.5 rounded-full bg-[#00c5cb]" />
                        )}
                        {label}
                      </button>
                    );
                  })}
                </div>
              </div>
            </Section>

            {/* Hardware Telemetry & Amenities */}
            <Section
              icon={<Wrench className="size-4 text-zinc-500" />}
              title="Hardware Telemetry & Amenities"
              right={
                <a
                  href="#"
                  className="text-[10px] font-semibold tracking-widest uppercase text-[#00c5cb] hover:underline"
                >
                  Review resources
                </a>
              }
            >
              <p className="text-xs leading-relaxed text-zinc-500 -mt-1">
                Select the hardware inventory hosted on-site. Resources ranked by
                peak draw and the associated gear risk.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-3">
                {hardwareOptions.map((item) => (
                  <label
                    key={item.label}
                    className="group flex items-center gap-2.5 cursor-pointer"
                  >
                    <Checkbox
                      checked={form.hardware.includes(item.label)}
                      onCheckedChange={(checked) =>
                        toggleHardware(item.label, checked)
                      }
                      className="dark:data-checked:border-[#ff7a00] dark:data-checked:bg-[#ff7a00]"
                    />
                    <span className="text-xs text-zinc-300">{item.label}</span>
                  </label>
                ))}
              </div>
            </Section>

            {/* Production Notes & Facility Rules */}
            <Section
              icon={<NotebookText className="size-4 text-zinc-500" />}
              title="Production Notes & Facility Rules"
              right={
                <span className="text-[10px] font-semibold tracking-widest uppercase text-zinc-600">
                  Requirement: min 40 words
                </span>
              }
            >
              <Textarea
                rows={5}
                value={form.notes}
                onChange={(event) => update("notes", event.target.value)}
                className={cn(
                  "rounded-lg border-white/10 bg-[#202228] text-xs leading-relaxed text-zinc-300"
                )}
              />
            </Section>
          </div>

          {/* Sticky action bar */}
          <div className="sticky bottom-4 -mx-2 px-2 mt-4">
            <div className="flex items-center justify-between gap-3 rounded-xl border border-white/[0.06] bg-[#191b1f]/95 p-3 shadow-lg shadow-black/40 backdrop-blur">
              <div className="inline-flex items-center gap-2 rounded-full border border-[#00c5cb]/30 bg-[#00c5cb]/10 px-3 py-1.5 text-xs text-zinc-100">
                <CircleCheck className="size-3.5 text-[#00c5cb]" />
                All datastore validation checkpoints passed
              </div>
              <Button
                type="submit"
                className="h-10 rounded-lg bg-[#ff7a00] px-5 text-white hover:bg-[#ff7a00]/85"
              >
                <Save data-icon="inline-start" />
                Save Draft
              </Button>
            </div>
          </div>
        </form>
      </main>
    </TooltipProvider>
  );
}
