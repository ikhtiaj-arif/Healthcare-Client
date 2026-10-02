import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const roles = [
  {
    initials: "MD",
    title: "Medical desk",
    description:
      "Owns which doctors are approved to publish a schedule, and what a completed visit is allowed to carry.",
  },
  {
    initials: "PE",
    title: "Patient experience",
    description:
      "Owns the path from an open slot to bKash and back, including where the prescription PDF lands.",
  },
  {
    initials: "CO",
    title: "Clinic operations",
    description:
      "Owns the day's windows: what a doctor publishes, and which 20-minute visits stay bookable.",
  },
];

export default function Leadership() {
  return (
    <section className="border-t border-border bg-muted/30">
      <div className="mx-auto w-full max-w-7xl px-4 py-16 lg:py-20">
        <div className="max-w-2xl">
          <p className="text-xs font-semibold tracking-widest text-primary uppercase">
            Leadership
          </p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight">
            Seats on the desk, not a named roster.
          </h2>
          <p className="mt-3 text-muted-foreground">
            These are the responsibilities the product is built around. The
            site does not list individual staff.
          </p>
        </div>
        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {roles.map((role) => (
            <Card
              key={role.title}
              size="sm"
              className="border border-border shadow-none ring-foreground/10 transition-transform duration-300 hover:-translate-y-0.5"
            >
              <CardHeader>
                <Avatar size="lg" className="mb-3 size-12">
                  <AvatarFallback className="bg-primary/10 text-xs font-semibold tracking-widest text-primary uppercase">
                    {role.initials}
                  </AvatarFallback>
                </Avatar>
                <CardTitle className="text-sm">{role.title}</CardTitle>
                <CardDescription>{role.description}</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
