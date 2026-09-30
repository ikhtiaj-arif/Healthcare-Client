import { useEffect, useState } from "react";

/**
 * Delays propagating a rapidly-changing value, so a search box does not fire a
 * request per keystroke.
 *
 * The effect previously hardcoded 500ms and ignored the `delay` argument, so
 * every caller silently got 500 regardless of what it asked for. The
 * dependency array also omitted `delay` and `initialValue`, which is why the
 * file needed a blanket biome-ignore.
 */
export default function useDebounce<T>(value: T, delay = 500): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
}
