import { atomWithStorage } from "jotai/utils";

import { LOCAL_STORAGE_KEYS } from "@core/constants";

type LocalStorageKey =
  (typeof LOCAL_STORAGE_KEYS)[keyof typeof LOCAL_STORAGE_KEYS];

export const getItem = <T>(key: LocalStorageKey, initialValue: T) => {
  const value = localStorage.getItem(key);

  if (value) {
    try {
      const returnValue = JSON.parse(value) as T; // string은 parse 불가하므로 catch에서 잡힘

      return returnValue;
    } catch {
      return value as T;
    }
  }

  return initialValue;
};

// string만
export default <T>(key: LocalStorageKey, initialValue: T) =>
  atomWithStorage<T>(key, initialValue, {
    getItem: (key) => getItem<T>(key as LocalStorageKey, initialValue),
    setItem: (key, value) => {
      const saveValue = (() => {
        switch (typeof value) {
          case "string":
            return value; // string만 JSON.stringify 하지 않음
          default:
            return JSON.stringify(value);
        }
      })();

      localStorage.setItem(key, saveValue);
    },
    removeItem: (key) => localStorage.removeItem(key),
  });
