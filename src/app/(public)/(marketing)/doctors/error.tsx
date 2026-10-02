"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { getApiErrorMessage } from "@/utils";

export default function DoctorsError({
  error,
  retry,
}: {
  error: Error & { digest?: string };
  retry: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="mx-auto max-w-lg px-4 py-16 text-center">
      <h2 className="text-sm font-medium">Could not load doctors</h2>
      <p className="mt-2 text-sm text-muted-foreground">
        {getApiErrorMessage(error, "Please try again.")}
      </p>
      <Button className="mt-4" onClick={() => retry()}>
        Try again
      </Button>
    </div>
  );
}
