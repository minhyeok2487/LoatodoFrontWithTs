import type React from "react";

interface MenuDimensions {
  width: number;
  height: number;
}

const DEFAULT_PADDING = 12;

const clamp = (value: number, min: number, max: number) => {
  return Math.min(Math.max(value, min), max);
};

const calculateMenuPosition = (
  event: React.MouseEvent<HTMLElement>,
  menuDimensions: MenuDimensions,
  padding = DEFAULT_PADDING
) => {
  const { clientX, clientY } = event;
  const viewportWidth = window.innerWidth;
  const viewportHeight = window.innerHeight;
  const { width, height } = menuDimensions;

  const x = clamp(clientX, padding, viewportWidth - width - padding);
  const y = clamp(clientY, padding, viewportHeight - height - padding);

  return { x, y };
};

export default calculateMenuPosition;
