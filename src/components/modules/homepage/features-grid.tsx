import { CalendarClock, FileText, LayoutDashboard } from "lucide-react";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const features = [
  {
    icon: FileText,
    title: "Visit record",
    description:
      "Payment status and one prescription PDF stay on the appointment. There is no separate chart.",
  },
  {
    icon: CalendarClock,
    title: "Provider scheduling",
    description:
      "A doctor publishes the day's windows. Each window splits into 20-minute visits that are still open.",
  },
  {
    icon: LayoutDashboard,
    title: "Role dashboards",
    description:
      "Patients track bookings and payments. Doctors run the day. Admins approve who can practice.",
  },
];

export default function FeaturesGrid() {
  return (
    <section className="border-t border-border bg-muted/30">
      <div className="mx-auto w-full max-w-7xl px-4 py-16 lg:py-20">
        <div className="max-w-2xl">
          <p className="text-xs font-semibold tracking-widest text-primary uppercase">
            On the desk
          </p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight">
            Scheduling, payment, and the record of the visit.
          </h2>
        </div>
        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {features.map((feature) => (
            <Card
              key={feature.title}
              size="sm"
              className="border border-border shadow-none ring-foreground/10 transition-transform duration-300 hover:-translate-y-0.5"
            >
              <CardHeader>
                <span className="mb-3 flex size-10 items-center justify-center bg-primary/10 text-primary">
                  <feature.icon className="size-4" aria-hidden />
                </span>
                <CardTitle className="text-sm">{feature.title}</CardTitle>
                <CardDescription>{feature.description}</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
