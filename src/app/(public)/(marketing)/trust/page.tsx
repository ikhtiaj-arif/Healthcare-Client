export default function Page() {
  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-4 px-4 py-12">
      <h1 className="text-2xl font-semibold">Trust and safety</h1>
      <p className="text-muted-foreground">
        A doctor cannot publish a schedule until an admin approves the
        application. Patients only book slots that are still open.
      </p>
      <p className="text-muted-foreground">
        Sign-in uses an access cookie. Payment goes through bKash, and the
        appointment stays pending until that payment is confirmed. The visit
        record is the appointment, the payment, and at most one prescription
        PDF. This site does not claim a broader medical record or a compliance
        certification.
      </p>
    </div>
  );
}
