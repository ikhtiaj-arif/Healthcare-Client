"use client";

import { X } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

/**
 * The filter bar that sits above a list table: a debounced search box, optional
 * status tabs, optional dropdown filters, and a "showing N of M" count.
 *
 * Every list page had grown its own version of this, with two different search
 * input styles and no result count anywhere. Tabs are used for the status
 * filter because that is the one filter whose options are known ahead of time
 * and few enough to always show; relation filters (specialization, doctor,
 * patient) go in Selects because their option lists are longer than a tab row
 * can hold.
 *
 * This component is presentational: it renders whatever state it is given and
 * reports changes upward. Page and filter state lives in the URL, so the caller
 * reads it from search params rather than holding it here.
 */

export interface StatusTabOption<T extends string> {
  value: T;
  label: string;
}

export interface SelectFilterOption {
  value: string;
  label: string;
}

export function DataTableToolbar<T extends string>({
  searchValue,
  onSearchChange,
  searchPlaceholder = "Search…",
  statusTabs,
  activeStatus,
  onStatusChange,
  statusTabsVariant,
  selectFilters,
  total,
  totalPages,
  className,
}: {
  searchValue?: string;
  onSearchChange?: (value: string) => void;
  searchPlaceholder?: string;
  statusTabs?: StatusTabOption<T>[];
  activeStatus?: T;
  onStatusChange?: (value: T) => void;
  statusTabsVariant?: "default" | "line";
  selectFilters?: {
    id: string;
    label: string;
    placeholder: string;
    value?: string;
    options: SelectFilterOption[];
    onChange: (value: string | undefined) => void;
  }[];
  total?: number;
  totalPages?: number;
  className?: string;
}) {
  const hasActiveFilter =
    Boolean(searchValue) ||
    (statusTabs && activeStatus !== undefined && activeStatus !== "ALL") ||
    Boolean(selectFilters?.some((f) => f.value));

  return (
    <div className={cn("space-y-3", className)}>
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
        {onSearchChange ? (
          <div className="relative sm:max-w-xs sm:flex-1">
            <Input
              type="text"
              value={searchValue ?? ""}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder={searchPlaceholder}
              aria-label={searchPlaceholder}
              className="pr-8"
            />
            {searchValue ? (
              <button
                type="button"
                onClick={() => onSearchChange("")}
                aria-label="Clear search"
                className="absolute top-1/2 right-2 -translate-y-1/2 rounded-sm p-0.5 text-muted-foreground hover:text-foreground"
              >
                <X className="size-4" />
              </button>
            ) : null}
          </div>
        ) : null}

        <div className="flex flex-wrap items-center gap-2">
          {selectFilters?.map((filter) => (
            <Select
              key={filter.id}
              value={filter.value ?? "__all__"}
              onValueChange={(value) =>
                // Base UI reports null when the popup closes without a pick, and
                // "__all__" is this component's sentinel for "no filter".
                filter.onChange(
                  value === "__all__" ? undefined : (value ?? undefined),
                )
              }
            >
              <SelectTrigger
                size="sm"
                aria-label={filter.label}
                className="w-full sm:w-auto"
              >
                <SelectValue placeholder={filter.placeholder} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="__all__">{filter.placeholder}</SelectItem>
                {filter.options.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          ))}
        </div>
      </div>

      {statusTabs && statusTabs.length > 1 && onStatusChange ? (
        <Tabs
          value={activeStatus ?? "ALL"}
          onValueChange={(value) => onStatusChange(value as T)}
        >
          <TabsList variant={statusTabsVariant}>
            {statusTabs.map((tab) => (
              <TabsTrigger key={tab.value} value={tab.value}>
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      ) : null}

      {total !== undefined ? (
        <p className="text-sm text-muted-foreground">
          {hasActiveFilter ? "Filtered to " : "Showing "}
          {total.toLocaleString()} {total === 1 ? "result" : "results"}
          {totalPages !== undefined && totalPages > 1
            ? ` across ${totalPages} ${totalPages === 1 ? "page" : "pages"}`
            : null}
        </p>
      ) : null}
    </div>
  );
}
