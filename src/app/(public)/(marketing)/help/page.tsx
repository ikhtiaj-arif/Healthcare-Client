import Link from "next/link";

export default function Page() {
  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-4 px-4 py-12">
      <h1 className="text-2xl font-semibold">Help</h1>
      <p className="text-muted-foreground">
        This page does not open a ticket. Use the paths below for the work the
        desk already does.
      </p>
      <dl className="space-y-3 text-sm">
        <div>
          <dt className="font-medium">Book a visit</dt>
          <dd className="text-muted-foreground">
            Open{" "}
            <Link href="/doctors" className="text-primary underline underline-offset-4">
              doctors
            </Link>{" "}
            or{" "}
            <Link
              href="/doctors/available-today"
              className="text-primary underline underline-offset-4"
            >
              available today
            </Link>
            . You only see slots that are still open.
          </dd>
        </div>
        <div>
          <dt className="font-medium">Payment</dt>
          <dd className="text-muted-foreground">
            Booking sends you to bKash. The appointment stays pending until the
            payment is confirmed. Refunds, when they apply, return through
            bKash.
          </dd>
        </div>
        <div>
          <dt className="font-medium">Prescription</dt>
          <dd className="text-muted-foreground">
            After a completed visit a doctor can attach one PDF. It stays on the
            appointment and is emailed to the patient.
          </dd>
        </div>
      </dl>
    </div>
  );
}
