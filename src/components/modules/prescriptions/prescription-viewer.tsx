"use client";

import { FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetPrescription } from "@/hooks";

/**
 * Renders the Cloudinary PDF for one appointment.
 *
 * A 404 is the normal empty state: most completed appointments have no
 * prescription yet, and `useGetPrescription` does not retry that response.
 */
export function PrescriptionViewer({
  appointmentId,
}: {
  appointmentId: string;
}) {
  const { data, isPending, isError } = useGetPrescription(appointmentId);

  if (isPending) {
    return <Skeleton className="h-80 w-full" />;
  }

  if (isError || !data?.prescription) {
    return (
      <EmptyState
        icon={FileText}
        title="No prescription written yet"
        description="A prescription appears here after the doctor writes one for this completed visit."
        className="h-40"
      />
    );
  }

  return (
    <div className="flex flex-col gap-3">
      <iframe
        title="Prescription"
        src={data.prescription}
        className="h-96 w-full border"
      />
      <Button
        variant="outline"
        size="sm"
        nativeButton={false}
        render={
          <a href={data.prescription} target="_blank" rel="noreferrer" />
        }
      >
        Open prescription
      </Button>
    </div>
  );
}
