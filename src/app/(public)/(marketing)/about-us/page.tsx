export default function Page() {
  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-4 px-4 py-12">
      <h1 className="text-2xl font-semibold">About us</h1>
      <p className="text-muted-foreground">
        HealthCare Service is a booking desk for clinics that already know their
        doctors. A doctor applies, an admin approves the license, and patients
        book a published slot.
      </p>
      <p className="text-muted-foreground">
        Payment goes through bKash. A completed visit can carry one prescription
        PDF. There is no separate medical record beyond the appointment, the
        payment, and that file.
      </p>
    </div>
  );
}
