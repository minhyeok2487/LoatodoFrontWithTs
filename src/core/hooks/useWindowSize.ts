import { useEffect, useState } from "react";

export default () => {
  const [width, setWidth] = useState(window.innerWidth);
  const [height, setHeight] = useState(window.innerHeight);

  useEffect(() => {
    const handleWindowResize: EventListener = (e: Event) => {
      const target = e.target as Window;

      setWidth(target.innerWidth);
      setHeight(target.innerHeight);
    };

    window.addEventListener("resize", handleWindowResize);

    return () => {
      window.removeEventListener("resize", handleWindowResize);
    };
  });

  return {
    width,
    height,
  };
};
