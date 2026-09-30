import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * The "nothing to show" state for a table or list.
 *
 * Two hand-rolled copies existed: one rendering a full-width empty TableRow
 * inside a TableBody, and one rendering a bordered block outside the table.
 * Keeping the copy in one place means a filtered-to-nothing list reads the same
 * as a genuinely empty one.
 *
 * When the emptiness is the result of a filter, pass `action` so the user has a
 * way back out.
 */
export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  className,
}: {
  icon?: LucideIcon;
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-2 p-10 text-center",
        className,
      )}
    >
      {Icon ? <Icon className="size-6 text-muted-foreground" /> : null}
      <p className="font-medium">{title}</p>
      {description ? (
        <p className="max-w-sm text-sm text-muted-foreground">{description}</p>
      ) : null}
      {action}
    </div>
  );
}

/**
 * The in-table variant: a single full-width row, so the table keeps its header
 * and column alignment instead of collapsing.
 */
export function EmptyTableRow({
  colSpan,
  icon: Icon,
  title,
  description,
  action,
}: {
  colSpan: number;
  icon?: LucideIcon;
  title: string;
  description?: string;
  action?: React.ReactNode;
}) {
  return (
    <tr>
      <td colSpan={colSpan} className="p-0">
        <EmptyState
          icon={Icon}
          title={title}
          description={description}
          action={action}
          className="h-40"
        />
      </td>
    </tr>
  );
}
