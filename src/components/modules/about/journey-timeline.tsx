"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

const steps = [
  {
    title: "Apply",
    detail:
      "A doctor submits an application. Nothing is bookable until that application is reviewed.",
  },
  {
    title: "Approve",
    detail:
      "An admin checks the license and approves who can practice on the platform.",
  },
  {
    title: "Publish the day",
    detail:
      "The doctor opens the day's windows. Each window splits into 20-minute visits.",
  },
  {
    title: "Book and pay",
    detail:
      "A patient takes an open slot. Booking redirects to bKash, and the visit stays pending until payment confirms.",
  },
  {
    title: "Prescription",
    detail:
      "After the visit the doctor can attach one PDF. The patient finds it on the appointment and in email.",
  },
];

export default function JourneyTimeline() {
  const [active, setActive] = useState(0);
  const step = steps[active];

  return (
    <section className="mx-auto w-full max-w-7xl px-4 py-16 lg:py-20">
      <div className="max-w-2xl">
        <p className="text-xs font-semibold tracking-widest text-primary uppercase">
          Our journey
        </p>
        <h2 className="mt-3 text-3xl font-semibold tracking-tight">
          From an application to a prescription on the visit.
        </h2>
      </div>

      <div className="mt-10 grid gap-8 lg:grid-cols-[minmax(0,20rem)_1fr] lg:gap-12">
        <ol className="relative flex flex-col gap-2 border-l border-border pl-6">
          {steps.map((item, index) => {
            const selected = index === active;
            return (
              <li key={item.title} className="relative">
                <span
                  aria-hidden
                  className={cn(
                    "absolute top-4 -left-[1.65rem] size-2.5 border border-border",
                    selected ? "bg-primary" : "bg-background",
                  )}
                />
                <button
                  type="button"
                  aria-pressed={selected}
                  onClick={() => setActive(index)}
                  className={cn(
                    "w-full px-3 py-3 text-left text-xs font-semibold tracking-widest uppercase transition-colors",
                    selected
                      ? "bg-primary/10 text-foreground"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground",
                  )}
                >
                  {item.title}
                </button>
              </li>
            );
          })}
        </ol>

        <div
          key={step.title}
          className="flex min-h-48 animate-in flex-col justify-center border border-border bg-card p-6 fade-in duration-300 sm:p-10"
        >
          <p className="text-xs font-semibold tracking-widest text-primary uppercase">
            Step {active + 1} of {steps.length}
          </p>
          <h3 className="mt-3 text-2xl font-semibold tracking-tight">
            {step.title}
          </h3>
          <p className="mt-4 max-w-xl text-muted-foreground">{step.detail}</p>
        </div>
      </div>
    </section>
  );
}
