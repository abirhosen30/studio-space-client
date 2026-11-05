import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { headers } from "next/headers";
import { getAuth } from "@/lib/auth";
import EditStudioDailog from "@/components/EditStudioDailog";
import type { IStudio } from "@/components/types/types";

function getStudioFromPayload(payload: unknown): IStudio | null {
  const studio =
    typeof payload === "object" && payload !== null && "data" in payload
      ? payload.data
      : payload;

  return typeof studio === "object" &&
    studio !== null &&
    "_id" in studio &&
    typeof studio._id === "string" &&
    "stageTitle" in studio &&
    typeof studio.stageTitle === "string"
    ? (studio as IStudio)
    : null;
}

export default async function EditStudioPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = await getAuth().api.getSession({ headers: await headers() });

  if (!session?.user?.email) {
    redirect("/login");
  }

  let studio: IStudio | null = null;

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_SERVER}/studios/${encodeURIComponent(id)}`,
      { cache: "no-store" },
    );

    if (!response.ok) {
      notFound();
    }

    studio = getStudioFromPayload(await response.json());
  } catch {
    notFound();
  }

  if (!studio || studio._id !== id) {
    notFound();
  }

  const ownerEmail = (studio.ownerEmail || studio.accountEmail || "")
    .trim()
    .toLowerCase();

  if (ownerEmail !== session.user.email.trim().toLowerCase()) {
    notFound();
  }

  return (
    <main className="min-h-screen flex-1 bg-[#111215]">
      <section className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
        <Link
          href="/my-listings"
          className="text-sm text-zinc-400 transition hover:text-white"
        >
          Back to My Listings
        </Link>
        <div className="mt-5">
          <p className="mb-2 text-sm font-semibold uppercase tracking-[0.2em] text-[#00c5cb]">
            StudioSpace / Host Dashboard
          </p>
          <h1 className="text-3xl font-bold tracking-tight text-white">
            Update Studio
          </h1>
        </div>
        <div className="mt-6 flex justify-start">
          <EditStudioDailog
            studio={studio}
            redirectTo="/my-listings"
            startOpen
          />
        </div>
      </section>
    </main>
  );
}
