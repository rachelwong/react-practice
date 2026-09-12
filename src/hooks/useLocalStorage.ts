import { useState } from "react";

type SetValue<T> = T | ((prevValue: T) => T);

const useLocalStorage = <T>({
  key,
  initialValue,
}: {
  key: string;
  initialValue?: T | (() => T);
}) => {
  const [value, setStoredValue] = useState<T | undefined>(() => {
    const initialValueToUse =
      initialValue instanceof Function ? initialValue() : initialValue;

    try {
      const rawLocalStorage = window.localStorage.getItem(key);
      // TODO: the parsed value is trusted as `T` with no runtime validation -
      // a stale/corrupted entry of a different shape will silently flow
      // through as if it matched `T`.
      return rawLocalStorage ? JSON.parse(rawLocalStorage) : initialValueToUse;
    } catch (err) {
      console.error(`Error reading localStorage key "${key}": ${err}`);
      return initialValueToUse;
    }
  });

  const setValue = (nextValueOrUpdater: SetValue<T>) => {
    setStoredValue((prev) => {
      const nextValue =
        nextValueOrUpdater instanceof Function
          ? nextValueOrUpdater(prev as T)
          : nextValueOrUpdater;

      console.log("useLocalStorage setValue", key, nextValue);

      try {
        window.localStorage.setItem(key, JSON.stringify(nextValue));
        return nextValue;
      } catch (err) {
        console.error(`Error setting localStorage key "${key}": ${err}`);
        return prev;
      }
    });
  };

  const removeValue = () => {
    try {
      window.localStorage.removeItem(key);
      setStoredValue(undefined);
    } catch (err) {
      console.error(`Error removing localStorage key "${key}": ${err}`);
    }
  };

  // TODO: no cross-tab / same-tab sync - if another tab, or another
  // component instance using this same key, writes to localStorage, this
  // hook's value will not update to reflect it.
  return [value, setValue, removeValue] as const;
};

export default useLocalStorage;
