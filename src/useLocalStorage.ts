import React from "react";

export default function useLocalStorage<T>(key: string, defaultValue: T, overrideValue: (() => T | null) = (() => null)) {
  const [value, setValue] = React.useState(() => {
    const overriddenValue = overrideValue();
    if (overriddenValue !== null) {
      return overriddenValue;
    }

    const value = localStorage.getItem(key);
    if (value != null) {
      return JSON.parse(value) as T;
    } else {
      return defaultValue;
    }
  });

  React.useEffect(() => localStorage.setItem(key, JSON.stringify(value)), [key, value]);

  return [value, setValue] as const;
}
