export default function Page() {
  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-4 px-4 py-12">
      <h1 className="text-2xl font-semibold">Terms</h1>
      <p className="text-muted-foreground">
        Patients book a published 20-minute slot and pay with bKash. The visit
        is not held as confirmed until that payment returns. A completed visit
        can carry one prescription PDF.
      </p>
      <p className="text-muted-foreground">
        Doctors apply and wait for admin approval before a schedule can go
        live. This page states how the desk works. It is not a contract drafted
        by counsel.
      </p>
    </div>
  );
}
