import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function HomeCta() {
  return (
    <section className="bg-primary text-primary-foreground">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-16 sm:flex-row sm:items-end sm:justify-between lg:py-20">
        <div className="max-w-xl">
          <p className="text-xs font-semibold tracking-widest uppercase">
            Open an account
          </p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight">
            Register as a patient, or apply to practice.
          </h2>
          <p className="mt-3 text-primary-foreground/80">
            Patients book published slots. Doctors apply, and an admin approves
            the license before a schedule can go live.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Button
            variant="secondary"
            nativeButton={false}
            render={<Link href="/register" />}
          >
            Register
          </Button>
          <Button
            variant="outline"
            className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground"
            nativeButton={false}
            render={<Link href="/apply" />}
          >
            Apply as a doctor
          </Button>
        </div>
      </div>
    </section>
  );
}
