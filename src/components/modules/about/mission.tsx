export default function Mission() {
  return (
    <section className="mx-auto grid w-full max-w-7xl gap-10 px-4 py-16 lg:grid-cols-2 lg:items-start lg:gap-16 lg:py-24">
      <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
        <p className="text-xs font-semibold tracking-widest text-primary uppercase">
          About
        </p>
        <h1 className="mt-3 text-4xl font-semibold tracking-tight">
          A published clinic schedule, open to the patients who can reach it.
        </h1>
      </div>
      <div className="flex animate-in flex-col gap-4 text-muted-foreground fade-in slide-in-from-bottom-4 delay-150 duration-700">
        <p>
          HealthCare Service is a booking desk for clinics that already know
          their doctors. A doctor applies, an admin approves the license, and
          patients book a published slot.
        </p>
        <p>
          Payment goes through bKash. A completed visit can carry one
          prescription PDF. There is no separate medical record beyond the
          appointment, the payment, and that file.
        </p>
      </div>
    </section>
  );
}
