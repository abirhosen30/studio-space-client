"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "./ui/button";

const DeleteStudioDailog = ({
  id,
  redirectTo = "/studios",
}: {
  id: string;
  redirectTo?: string;
}) => {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleStudioDelete = async () => {
    setLoading(true);
    setError("");

    try {
      const res = await fetch(
        `http://localhost:8000/studios/${encodeURIComponent(id)}`,
        { method: "DELETE" },
      );

      if (!res.ok) {
        throw new Error(`Could not delete studio (HTTP ${res.status}).`);
      }

      const result: unknown = await res.json();
      if (
        typeof result !== "object" ||
        result === null ||
        !("deletedCount" in result) ||
        result.deletedCount !== 1
      ) {
        throw new Error("The studio was not found or was already deleted.");
      }

      setOpen(false);
      router.replace(redirectTo);
      router.refresh();
    } catch (deleteError) {
      console.error("Could not delete studio:", deleteError);
      setError(
        deleteError instanceof Error
          ? deleteError.message
          : "An unexpected error occurred while deleting the studio.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger
        render={
          <Button className="rounded border border-red-400/30 bg-black px-4 py-2 text-xs font-medium text-red-300 transition hover:bg-red-400/10">
            Delete
          </Button>
        }
      />
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete this studio?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete this
            studio listing.
          </AlertDialogDescription>
        </AlertDialogHeader>
        {error && (
          <p role="alert" className="text-sm text-red-400">
            {error}
          </p>
        )}
        <AlertDialogFooter>
          <AlertDialogCancel disabled={loading}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleStudioDelete}
            disabled={loading}
            className="bg-red-600 text-white hover:bg-red-700"
          >
            {loading ? "Deleting..." : "Delete studio"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteStudioDailog;
