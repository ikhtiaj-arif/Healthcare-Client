import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const perspectives = [
  {
    role: "Patient",
    quote:
      "I book a slot that is still open, pay in bKash, and the prescription PDF stays on that appointment.",
  },
  {
    role: "Doctor",
    quote:
      "I publish the day's windows. After a completed visit I can attach one prescription, and the patient receives it.",
  },
  {
    role: "Admin",
    quote:
      "A doctor applies with a license. I approve who can practice, then their schedule can be booked.",
  },
];

export default function Perspectives() {
  return (
    <section className="border-t border-border bg-muted/30">
      <div className="mx-auto w-full max-w-7xl px-4 py-16 lg:py-20">
        <div className="max-w-2xl">
          <p className="text-xs font-semibold tracking-widest text-primary uppercase">
            Who uses the desk
          </p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight">
            The same visit, from three seats.
          </h2>
        </div>
        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {perspectives.map((item) => (
            <Card
              key={item.role}
              size="sm"
              className="border border-border shadow-none ring-foreground/10 transition-transform duration-300 hover:-translate-y-0.5"
            >
              <CardHeader>
                <CardTitle className="text-sm">{item.role}</CardTitle>
                <CardDescription>On the platform</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm leading-relaxed text-foreground">
                  {item.quote}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
