import { useEffect, useRef } from "react";
import type { RefObject } from "react";

type Callback = () => void;

export default <T extends HTMLElement>(callback: Callback): RefObject<T> => {
  const ref = useRef<T>(null);

  useEffect(() => {
    const handleClick = (e: globalThis.MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        callback();
      }
    };

    document.addEventListener("mousedown", handleClick);

    return () => {
      document.removeEventListener("mousedown", handleClick);
    };
  }, [ref, callback]);

  return ref;
};
