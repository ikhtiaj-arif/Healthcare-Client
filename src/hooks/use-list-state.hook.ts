"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useMemo } from "react";

/**
 * Reads and writes list state (page, page size, search, filters, sort) in the
 * URL query string instead of component state.
 *
 * Why this exists: the two existing paginated pages hold page and filter state
 * in `useState`, so a reload or a shared link drops you back on page 1 with no
 * filters. With six more filterable tables coming that gets painful, and
 * "filters survive refresh" is the behaviour people expect from a list.
 *
 * Reads come from `useSearchParams`, writes go through `router.replace` so the
 * back button steps out of a list instead of unwinding every filter change.
 *
 * REQUIRES A `<Suspense>` BOUNDARY. `useSearchParams` opts a route into
 * client-side rendering, and under `output: "export"` Next fails the build if it
 * is not wrapped. Every page using `useListState` must wrap the component that
 * calls it, the same way register/verify-account already does.
 *
 * `push` defaults to false because a filter change is not a navigation the user
 * should have to undo one keystroke at a time.
 */
export function useListState<TFilters extends Record<string, unknown>>({
  defaults,
  push = false,
}: {
  // `unknown` rather than `string`: the three built-ins are numeric, so a
  // `Record<string, string>` constraint rejects an otherwise valid
  // `{ page: 1, limit: 10 }` on the index signature.
  defaults: TFilters & {
    page?: number;
    limit?: number;
    sortOrder?: "asc" | "desc";
  };
  push?: boolean;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Callers pass `defaults` as an object literal, so it is a fresh reference on
  // every render. Depending on it directly would defeat the memo below and hand
  // callers a new `state` (and `resetState`) identity each time, re-rendering
  // every downstream effect. The serialized form is stable while the values are
  // stable, which is the actual thing this memo depends on.
  const defaultsKey = JSON.stringify(defaults);

  const state = useMemo(() => {
    const parsed = JSON.parse(defaultsKey) as typeof defaults;
    const entries = { ...parsed } as Record<
      string,
      string | number | undefined
    >;

    for (const key of Object.keys(parsed)) {
      const fromUrl = searchParams.get(key);
      if (fromUrl !== null && fromUrl !== "") {
        const fallback = parsed[key];
        entries[key] =
          typeof fallback === "number" ? Number(fromUrl) || fallback : fromUrl;
      }
    }

    return entries as TFilters & {
      page: number;
      limit: number;
      sortOrder: "asc" | "desc";
    };
  }, [searchParams, defaultsKey]);

  const setState = useCallback(
    (
      patch: Partial<
        // Union, not intersection: `keyof TFilters` holds the caller's own
        // filters and is disjoint from the three built-ins, so intersecting the
        // two sets collapses to `never` and silently accepts no keys at all.
        Record<
          keyof TFilters | "page" | "limit" | "sortOrder",
          string | number | undefined
        >
      >,
      options?: { keepPage?: boolean },
    ) => {
      const next = new URLSearchParams(searchParams.toString());

      for (const [key, value] of Object.entries(patch)) {
        if (value === undefined || value === "") {
          next.delete(key);
        } else {
          next.set(key, String(value));
        }
      }

      // Any filter change invalidates the current page number: staying on page 7
      // of a result set that just got smaller shows an empty table. Callers can
      // opt out with keepPage for changes that cannot affect the result count,
      // such as changing sort direction.
      if (!options?.keepPage && !("page" in patch)) {
        next.delete("page");
      }

      const query = next.toString();
      const url = query ? `${pathname}?${query}` : pathname;

      if (push) {
        router.push(url);
      } else {
        router.replace(url, { scroll: false });
      }
    },
    [router, pathname, searchParams, push],
  );

  /**
   * Strips query params that no longer match their default, so a URL someone
   * bookmarks does not accumulate `?status=ALL&page=1` noise forever.
   */
  const resetState = useCallback(() => {
    const parsed = JSON.parse(defaultsKey) as typeof defaults;
    const next = new URLSearchParams();

    for (const [key, value] of Object.entries(state)) {
      if (key === "page" || key === "limit" || key === "sortOrder") continue;
      if (value === undefined || value === "") continue;
      if (value === parsed[key]) continue;
      next.set(key, String(value));
    }

    const query = next.toString();
    router.replace(query ? `${pathname}?${query}` : pathname, {
      scroll: false,
    });
  }, [router, pathname, state, defaultsKey]);

  return { state, setState, resetState };
}
