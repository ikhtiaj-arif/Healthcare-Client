export default function Page() {
  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-4 px-4 py-12">
      <h1 className="text-2xl font-semibold">Contact</h1>
      <p className="text-muted-foreground">
        For an appointment, book a doctor from the directory. This page does not
        send messages.
      </p>
      <dl className="space-y-3 text-sm">
        <div>
          <dt className="font-medium">Desk hours</dt>
          <dd className="text-muted-foreground">Saturday to Thursday, 9:00–17:00</dd>
        </div>
        <div>
          <dt className="font-medium">Patients</dt>
          <dd className="text-muted-foreground">
            Sign in and open My Appointments for payment and prescription status.
          </dd>
        </div>
        <div>
          <dt className="font-medium">Doctors</dt>
          <dd className="text-muted-foreground">
            Apply from the registration page. Approval is reviewed by an admin.
          </dd>
        </div>
      </dl>
    </div>
  );
}
