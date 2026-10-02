import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Hero() {
  return (
    <section className="mx-auto flex w-full max-w-5xl flex-col gap-6 px-4 py-16">
      <p className="text-xs font-semibold tracking-widest text-primary uppercase">
        HealthCare Service
      </p>
      <h1 className="max-w-2xl text-4xl font-semibold tracking-tight">
        Book a doctor, pay with bKash, and keep the prescription with the visit.
      </h1>
      <p className="max-w-xl text-muted-foreground">
        Patients pick an open slot, doctors publish the day&apos;s schedule, and
        admins approve who can practice on the platform.
      </p>
      <div className="flex flex-wrap gap-3">
        <Button nativeButton={false} render={<Link href="/doctors" />}>
          Find a doctor
        </Button>
        <Button
          variant="outline"
          nativeButton={false}
          render={<Link href="/doctors/available-today" />}
        >
          Available today
        </Button>
      </div>
    </section>
  );
}
