import { BadgeCheck, CalendarCheck, FileText, Wallet } from "lucide-react";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const values = [
  {
    icon: CalendarCheck,
    label: "Open windows",
    title: "Published slots only",
    description:
      "A patient only sees visits that are still free. Closed windows do not appear as bookable.",
  },
  {
    icon: BadgeCheck,
    label: "Who practices",
    title: "Approval first",
    description:
      "A doctor applies with a license. An admin approves them before a schedule can go live.",
  },
  {
    icon: Wallet,
    label: "When it holds",
    title: "Payment confirms the visit",
    description:
      "Booking sends the patient to bKash. The appointment stays pending until that payment returns.",
  },
  {
    icon: FileText,
    label: "What remains",
    title: "The file stays on the visit",
    description:
      "A completed visit can hold one prescription PDF, on the appointment and in the patient's email.",
  },
];

export default function ValuesGrid() {
  return (
    <section className="border-t border-border bg-muted/30">
      <div className="mx-auto w-full max-w-7xl px-4 py-16 lg:py-20">
        <div className="max-w-2xl">
          <p className="text-xs font-semibold tracking-widest text-primary uppercase">
            Core values
          </p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight">
            What the desk will and will not do.
          </h2>
        </div>
        <div className="mt-10 grid gap-4 sm:grid-cols-2">
          {values.map((value) => (
            <Card
              key={value.title}
              size="sm"
              className="border border-border shadow-none ring-foreground/10 transition-transform duration-300 hover:-translate-y-0.5"
            >
              <CardHeader>
                <div className="mb-3 flex items-center justify-between gap-3">
                  <span className="flex size-10 items-center justify-center bg-primary/10 text-primary">
                    <value.icon className="size-4" aria-hidden />
                  </span>
                  <span className="text-xs font-semibold tracking-widest text-muted-foreground uppercase">
                    {value.label}
                  </span>
                </div>
                <CardTitle className="text-sm">{value.title}</CardTitle>
                <CardDescription>{value.description}</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
