/** biome-ignore-all lint/correctness/useExhaustiveDependencies: <explanation> */
import { useEffect, useState } from "react";

export default function useDebounce<T>(search:T, delay: number = 500) {
    const [debouncedSearch, setDebouncedSearch] = useState(search)

   useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 500);
    return () => clearTimeout(timer);
  }, [search]);
    return debouncedSearch
}