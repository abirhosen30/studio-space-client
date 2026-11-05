import Image from "next/image";

const steps = [
  {
    number: "01",
    accent: "#ff7a00",
    title: "Discover Spaces",
    description:
      "Filter by sound isolation STC ratings, electrical breaker amperage, and verified gear lists.",
  },
  {
    number: "02",
    accent: "#00c5cb",
    title: "Select Shoot Hours",
    description:
      "Choose exact call-sheet setup and wrap hours on a visual sequencer timeline.",
  },
  {
    number: "03",
    accent: "#c9a0ff",
    title: "Collision Prevention",
    description:
      "Atomic locking algorithm prevents overlapping double bookings with verified host escrow.",
  },
  {
    number: "04",
    accent: "#ff9e80",
    title: "Create & Produce",
    description:
      "Receive automated check-in codes, Wi-Fi keys, and on-site stage coordination.",
  },
];

const protections = [
  {
    title: "$1M Liability Shield",
    description: "Comprehensive studio damage & production insurance policy.",
    icon: "/images/icons/Shield.png",
    iconWidth: 19,
    iconHeight: 24,
  },
  {
    title: "Verified Hardware",
    description:
      "All consoles, strobes, and power grids bench-tested by staff.",
    icon: "/images/icons/Verified.png",
    iconWidth: 24,
    iconHeight: 24,
  },
  {
    title: "24/7 Producer Support",
    description: "Live emergency logistics team ready on every call sheet.",
    icon: "/images/icons/Support.png",
    iconWidth: 24,
    iconHeight: 21,
  },
  {
    title: "Zero Hidden Fees",
    description:
      "Transparent hourly tariffs inclusive of cleanup and standard grip.",
    icon: "/images/icons/Fees.png",
    iconWidth: 26,
    iconHeight: 19,
  },
];

export function BookingWorkflow() {
  return (
    <section
      id="how-it-works"
      className="max-w-7xl mx-auto w-full py-8 sm:py-12"
    >
      <div className="text-center max-w-2xl mx-auto mb-10">
        <p className="text-xs font-semibold tracking-widest text-[#00c5cb] uppercase mb-3">
          Frictionless Logistics
        </p>
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white mb-3">
          Engineered Booking Workflow
        </h2>
        <p className="text-sm leading-relaxed text-zinc-400">
          From real-time equipment conflict arbitration to automated keyless
          stage access.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
        {steps.map((step) => (
          <div
            key={step.number}
            className="rounded-xl border border-white/[0.06] bg-[#191b1f] p-5"
          >
            <div className="inline-flex items-center justify-center size-8 rounded-md border border-white/[0.08] bg-white/[0.04] text-sm font-semibold mb-8">
              <span style={{ color: step.accent }}>{step.number}</span>
            </div>
            <h3 className="text-lg font-semibold leading-snug text-white mb-2">
              {step.title}
            </h3>
            <p className="text-xs leading-relaxed text-zinc-400">
              {step.description}
            </p>
          </div>
        ))}
      </div>

      <div className="relative overflow-hidden rounded-2xl border border-white/[0.06] bg-[#191b1f] p-8 sm:p-12">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,rgba(255,122,0,0.08),transparent_55%)]" />
        <div className="relative grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center">
          <div>
            <p className="text-xs font-semibold tracking-widest text-[#ff9e45] uppercase mb-3">
              StudioSpace Shield
            </p>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white mb-4">
              The Comprehensive Creator Guarantee
            </h2>
            <p className="text-sm leading-relaxed text-zinc-400 max-w-md">
              Every reservation booked on StudioSpace is fully insured and
              covered under our production security contract, so you can execute
              complex shoots with absolute confidence.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {protections.map((item) => (
              <div
                key={item.title}
                className="rounded-lg border border-white/[0.06] bg-[#202228] p-4"
              >
                <div className="flex items-center gap-2.5 mb-1.5">
                  <Image
                    src={item.icon}
                    alt=""
                    width={item.iconWidth}
                    height={item.iconHeight}
                    className="shrink-0 object-contain"
                  />
                  <h3 className="text-sm font-semibold text-white">
                    {item.title}
                  </h3>
                </div>
                <p className="text-xs leading-relaxed text-zinc-400">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
