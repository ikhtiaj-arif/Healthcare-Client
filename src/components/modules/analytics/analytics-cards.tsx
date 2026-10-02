"use client";

import { Skeleton } from "@/components/ui/skeleton";

export interface AnalyticsItem {
  label: string;
  value: string;
  hint?: string;
}

export function formatCount(value: number) {
  return new Intl.NumberFormat().format(value);
}

export function formatMoney(value: number) {
  return new Intl.NumberFormat(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

export function AnalyticsCards({
  items,
  isPending,
  isError,
}: {
  items: AnalyticsItem[];
  isPending: boolean;
  isError: boolean;
}) {
  if (isPending) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }, (_, index) => (
          <Skeleton key={index} className="h-24 w-full" />
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <p className="text-sm text-muted-foreground">
        These numbers could not be loaded. Refresh the page and try again.
      </p>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((item) => (
        <div key={item.label} className="flex flex-col gap-1 border p-4">
          <p className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">
            {item.label}
          </p>
          <p className="text-2xl font-semibold">{item.value}</p>
          {item.hint ? (
            <p className="text-xs text-muted-foreground">{item.hint}</p>
          ) : null}
        </div>
      ))}
    </div>
  );
}
