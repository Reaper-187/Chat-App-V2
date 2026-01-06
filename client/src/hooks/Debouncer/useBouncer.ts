import { useEffect, useState } from "react";

interface BouncerPorps {
  value: string;
  delay: number;
}

export function useDebounce({ value, delay = 500 }: BouncerPorps) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}
