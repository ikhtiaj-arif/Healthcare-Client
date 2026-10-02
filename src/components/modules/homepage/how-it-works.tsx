"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

const steps = [
  {
    title: "Choose a slot",
    detail:
      "Open the directory or today's list. You only see windows that are still free, and each one is a 20-minute visit.",
  },
  {
    title: "Pay with bKash",
    detail:
      "Booking sends you to bKash. The appointment stays pending until the payment comes back confirmed.",
  },
  {
    title: "Keep the prescription",
    detail:
      "After the visit a doctor can write one prescription. You get the PDF on the appointment and by email.",
  },
];

export default function HowItWorks() {
  const [active, setActive] = useState(0);
  const step = steps[active];

  return (
    <section className="mx-auto w-full max-w-7xl px-4 py-16 lg:py-20">
      <div className="max-w-2xl">
        <p className="text-xs font-semibold tracking-widest text-primary uppercase">
          How it works
        </p>
        <h2 className="mt-3 text-3xl font-semibold tracking-tight">
          Three steps from an open slot to a file you can keep.
        </h2>
      </div>

      <div className="mt-10 grid gap-8 lg:grid-cols-[minmax(0,16rem)_1fr] lg:gap-12">
        <ol className="flex flex-col gap-2">
          {steps.map((item, index) => {
            const selected = index === active;
            return (
              <li key={item.title}>
                <button
                  type="button"
                  aria-pressed={selected}
                  onClick={() => setActive(index)}
                  className={cn(
                    "flex w-full items-center gap-3 border px-3 py-3 text-left transition-colors",
                    selected
                      ? "border-primary bg-primary/10 text-foreground"
                      : "border-border bg-card text-muted-foreground hover:bg-muted",
                  )}
                >
                  <span
                    className={cn(
                      "flex size-8 shrink-0 items-center justify-center text-xs font-semibold tracking-widest",
                      selected
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-foreground",
                    )}
                  >
                    {index + 1}
                  </span>
                  <span className="text-xs font-semibold tracking-widest uppercase">
                    {item.title}
                  </span>
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
            Step {active + 1}
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
