"use client";

import { ArrowDown, ArrowUp, ChevronsUpDown } from "lucide-react";
import { TableHead } from "@/components/ui/table";
import { cn } from "@/lib/utils";

/**
 * A TableHead that toggles the list's sort.
 *
 * No table in the repo had clickable sort headers: every `sortBy` was a
 * hardcoded literal in the component, so the backend's sortBy/sortOrder support
 * (now allow-listed by `parseSort`) was unreachable from the UI.
 *
 * The active state comes from props rather than local state, because the caller
 * keeps it in the URL. Clicking the active column flips direction; clicking a
 * different one starts at `desc` unless the caller sets `defaultSortOrder`,
 * since for most columns the most recent rows are the ones people want first.
 *
 * `sortable={false}` (the default) renders a plain header, so a table can mix
 * sortable and static columns.
 */
export function SortableTableHead<T extends string>({
  field,
  children,
  sortBy,
  sortOrder,
  onSortChange,
  defaultSortOrder = "desc",
  sortable = true,
  className,
}: {
  field: T;
  children: React.ReactNode;
  sortBy?: T;
  sortOrder?: "asc" | "desc";
  onSortChange?: (field: T, order: "asc" | "desc") => void;
  defaultSortOrder?: "asc" | "desc";
  sortable?: boolean;
  className?: string;
}) {
  if (!sortable || !onSortChange) {
    return (
      <TableHead className={className} scope="col">
        {children}
      </TableHead>
    );
  }

  const isActive = sortBy === field;
  const nextOrder = isActive
    ? sortOrder === "asc"
      ? "desc"
      : "asc"
    : defaultSortOrder;

  const Icon = isActive
    ? sortOrder === "asc"
      ? ArrowUp
      : ArrowDown
    : ChevronsUpDown;

  return (
    <TableHead className={cn("p-0", className)} scope="col">
      <button
        type="button"
        onClick={() => onSortChange(field, nextOrder)}
        aria-label={`Sort by ${String(children)}`}
        className={cn(
          "flex h-12 w-full items-center gap-1 px-3 text-left transition-colors hover:text-foreground",
          isActive && "text-foreground",
        )}
      >
        {children}
        <Icon
          className={cn(
            "size-3.5 shrink-0",
            isActive ? "opacity-100" : "opacity-40",
          )}
        />
      </button>
    </TableHead>
  );
}
