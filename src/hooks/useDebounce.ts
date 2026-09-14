import { useEffect, useState } from "react";

const useDebounce = <T>({
  relayDelay = 2000,
  value,
}: {
  value: T;
  relayDelay?: number;
}): { debouncedValue: T } => {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    // initialise a function that fires the state update after the delay
    const debounceHandler = setTimeout(() => {
      setDebouncedValue(value);
    }, relayDelay);

    // clean up action
    return () => {
      clearTimeout(debounceHandler);
    };
  }, [relayDelay, value]);

  return {
    debouncedValue,
  };
};

export default useDebounce;
