import { getStatusMeta } from "@/lib/status-meta";
import { cn } from "@/lib/utils";

/**
 * Renders any of the domain status enums with a consistent colour and label.
 *
 * The project previously had two independent implementations: a `statusMeta`
 * map in doctor-approval.data.ts and a raw `text-green-600` ternary in
 * schedule-table.tsx. This replaces both, so the same status always looks the
 * same across tables.
 *
 * Class names come from `getStatusMeta` and are appended to the Badge's own
 * padding/typography, which is why the colour strings only carry background and
 * text.
 */
export function StatusBadge({
  status,
  className,
}: {
  status: string;
  className?: string;
}) {
  const { label, className: colorClassName } = getStatusMeta(status);

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-sm px-2 py-0.5 text-xs font-semibold tracking-wider uppercase",
        colorClassName,
        className,
      )}
    >
      {label}
    </span>
  );
}
