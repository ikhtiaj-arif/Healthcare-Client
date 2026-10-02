import { CalendarClock, FileText, Wallet } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const deskRows = [
  {
    icon: CalendarClock,
    label: "Open slot",
    detail: "20-minute visit, still open today",
  },
  {
    icon: Wallet,
    label: "bKash pending",
    detail: "Held until the payment comes back confirmed",
  },
  {
    icon: FileText,
    label: "Prescription on file",
    detail: "One PDF on the completed appointment",
  },
];

export default function Hero() {
  return (
    <section className="mx-auto grid w-full max-w-7xl items-center gap-12 px-4 py-16 lg:grid-cols-2 lg:gap-16 lg:py-24">
      <div className="flex animate-in flex-col gap-6 fade-in slide-in-from-bottom-4 duration-500">
        <p className="text-xs font-semibold tracking-widest text-primary uppercase">
          HealthCare Service
        </p>
        <h1 className="max-w-xl text-4xl font-semibold tracking-tight sm:text-5xl">
          Book a doctor, pay with bKash, and keep the prescription with the
          visit.
        </h1>
        <p className="max-w-xl text-muted-foreground">
          Patients pick an open slot, doctors publish the day&apos;s schedule,
          and admins approve who can practice on the platform.
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
      </div>

      <Card
        size="sm"
        className="animate-in border border-border fade-in shadow-none ring-foreground/10 slide-in-from-bottom-6 delay-150 duration-700"
      >
        <CardHeader>
          <CardTitle className="text-sm">Today&apos;s desk</CardTitle>
          <CardDescription>
            What a patient sees between booking and the visit.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-3">
          {deskRows.map((row) => (
            <div
              key={row.label}
              className="flex items-start gap-3 border border-border bg-muted/40 p-3 transition-colors hover:bg-muted"
            >
              <span className="flex size-9 shrink-0 items-center justify-center bg-primary/10 text-primary">
                <row.icon className="size-4" aria-hidden />
              </span>
              <div>
                <p className="text-xs font-semibold tracking-widest uppercase">
                  {row.label}
                </p>
                <p className="mt-1 text-sm text-muted-foreground">
                  {row.detail}
                </p>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </section>
  );
}
