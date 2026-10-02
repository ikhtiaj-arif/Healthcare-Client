import Hero from "@/components/modules/homepage/Hero";

export default function Page() {
  return (
    <div>
      <Hero />
      <section className="mx-auto grid w-full max-w-5xl gap-4 px-4 pb-16 sm:grid-cols-3">
        <div className="border p-4">
          <h2 className="font-semibold">Choose a slot</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Each window is split into 20-minute visits. You only see slots that
            are still open today.
          </p>
        </div>
        <div className="border p-4">
          <h2 className="font-semibold">Pay with bKash</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Booking sends you to bKash. The appointment stays pending until the
            payment comes back confirmed.
          </p>
        </div>
        <div className="border p-4">
          <h2 className="font-semibold">Keep the record</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            After the visit a doctor can write a prescription. You get the PDF
            on the appointment and by email.
          </p>
        </div>
      </section>
    </div>
  );
}
