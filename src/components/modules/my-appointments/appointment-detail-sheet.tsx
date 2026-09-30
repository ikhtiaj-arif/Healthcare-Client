"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { AppointmentDetail } from "@/components/modules/my-appointments/appointment-detail";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

/** The query key that holds the appointment the detail sheet is showing. */
export const APPOINTMENT_DETAIL_PARAM = "appointment";

/**
 * Reads the id out of the query string, tolerating junk.
 *
 * Anything that is not a plausible id reads as "no appointment selected" rather
 * than being forwarded to the API, because this value comes straight from a URL
 * a person can edit.
 */
export function readAppointmentDetail(
  searchParams: Readonly<URLSearchParams>,
): string | null {
  const value = searchParams.get(APPOINTMENT_DETAIL_PARAM);
  if (!value) {
    return null;
  }

  // The backend ids are cuid2, so anything with whitespace or a slash is not one.
  return /^[\w-]+$/.test(value) ? value : null;
}

/**
 * Hosts the detail view over the list, selected by `?appointment=<id>`.
 *
 * A sheet rather than a `[appointmentId]` route because the export cannot
 * prerender a path only the signed-in patient knows. Putting the id in the query
 * keeps the view linkable and survives a refresh, which a client-side toggle
 * would not.
 */
export function AppointmentDetailSheet() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const appointmentId = readAppointmentDetail(searchParams);

  const close = () => {
    // Replace rather than push: opening the sheet should not add a history entry
    // that the back button has to walk through. Goes through the router, not
    // `history.replaceState`, so Next's own state stays in sync.
    const next = new URLSearchParams(searchParams.toString());
    next.delete(APPOINTMENT_DETAIL_PARAM);
    const query = next.toString();
    router.replace(
      query
        ? `/dashboard/my-appointments?${query}`
        : "/dashboard/my-appointments",
      { scroll: false },
    );
  };

  return (
    <Sheet
      open={Boolean(appointmentId)}
      onOpenChange={(open) => !open && close()}
    >
      <SheetContent className="w-full overflow-y-auto sm:max-w-lg">
        <SheetHeader>
          <SheetTitle>Appointment details</SheetTitle>
          <SheetDescription>
            Everything recorded for this consultation, and what you can still do
            with it.
          </SheetDescription>
        </SheetHeader>
        {appointmentId ? (
          <AppointmentDetail appointmentId={appointmentId} onClose={close} />
        ) : null}
      </SheetContent>
    </Sheet>
  );
}
