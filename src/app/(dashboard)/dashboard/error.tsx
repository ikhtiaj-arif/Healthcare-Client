"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { getApiErrorMessage } from "@/utils";

export default function PatientDashboardError({
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
    <div className="rounded-lg border p-10 text-center">
      <h2 className="text-sm font-medium">Could not load this page</h2>
      <p className="mt-2 text-sm text-muted-foreground">
        {getApiErrorMessage(error, "Please try again.")}
      </p>
      <Button className="mt-4" onClick={() => retry()}>
        Try again
      </Button>
    </div>
  );
}
