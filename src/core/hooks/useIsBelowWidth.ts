import { useEffect, useState } from "react";

export default (maxWidth: number) => {
  const [isBelowWidth, setIsBelowWidth] = useState(
    window.innerWidth <= maxWidth
  );

  useEffect(() => {
    const handleWindowResize: EventListener = (e: Event) => {
      const target = e.target as Window;

      setIsBelowWidth(target.innerWidth <= maxWidth);
    };

    window.addEventListener("resize", handleWindowResize);

    return () => {
      window.removeEventListener("resize", handleWindowResize);
    };
  });

  return isBelowWidth;
};
