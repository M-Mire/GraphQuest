import { useState } from "react";

type DefaultValueType<T> = T | (() => T);
type ValueSetter<T> = (valueOrFn: T | ((prevValue: T) => T)) => void;

const useLocalStorage = <T>(
  key: string,
  defaultValue: DefaultValueType<T>,
): [T, ValueSetter<T>] => {
  const [localStorageValue, setLocalStorageValue] = useState<T>(() => {
    try {
      const value = localStorage.getItem(key);
      if (value) {
        return JSON.parse(value) as T;
      } else {
        localStorage.setItem(
          key,
          JSON.stringify(
            typeof defaultValue === "function"
              ? (defaultValue as () => T)()
              : defaultValue,
          ),
        );
        return defaultValue as T;
      }
    } catch (error) {
      localStorage.setItem(
        key,
        JSON.stringify(
          typeof defaultValue === "function"
            ? (defaultValue as () => T)()
            : defaultValue,
        ),
      );
      return defaultValue as T;
    }
  });

  const setLocalStorageStateValue: ValueSetter<T> = (valueOrFn) => {
    let newValue: T;

    if (typeof valueOrFn === "function") {
      const fn = valueOrFn as (prevValue: T) => T;
      newValue = fn(localStorageValue);
    } else {
      newValue = valueOrFn;
    }

    localStorage.setItem(key, JSON.stringify(newValue));
    setLocalStorageValue(newValue);
  };

  return [localStorageValue, setLocalStorageStateValue];
};

export default useLocalStorage;
