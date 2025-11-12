import type { DefaultTheme } from "styled-components";

const clamp = (value: number, min = 0, max = 255) => {
  return Math.min(Math.max(value, min), max);
};

const hexToRgb = (hex: string) => {
  const normalized = hex.replace("#", "");
  return {
    r: parseInt(normalized.slice(0, 2), 16),
    g: parseInt(normalized.slice(2, 4), 16),
    b: parseInt(normalized.slice(4, 6), 16),
  };
};

const rgbToHex = (r: number, g: number, b: number) => {
  const toHex = (channel: number) => channel.toString(16).padStart(2, "0");
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`.toUpperCase();
};

const getLuminance = (hex: string) => {
  const { r, g, b } = hexToRgb(hex);
  return (0.299 * r + 0.587 * g + 0.114 * b) / 255;
};

const normalizeHexColor = (color?: string | null) => {
  if (!color) {
    return null;
  }

  const value = color.trim().toUpperCase();
  const prefixed = value.startsWith("#") ? value : `#${value}`;
  const hex = prefixed.slice(1);

  if (/^[0-9A-F]{6}$/.test(hex)) {
    return `#${hex}`;
  }

  if (/^[0-9A-F]{3}$/.test(hex)) {
    return `#${hex
      .split("")
      .map((char) => char.repeat(2))
      .join("")}`;
  }

  return null;
};

const shadeColor = (hex: string, percent: number) => {
  const { r, g, b } = hexToRgb(hex);
  const adjust = (channel: number) => {
    if (percent === 0) {
      return channel;
    }
    const target = percent > 0 ? 255 : 0;
    const amount = Math.abs(percent);
    return clamp(Math.round(channel + (target - channel) * amount));
  };

  return rgbToHex(adjust(r), adjust(g), adjust(b));
};

export const adjustColorForTheme = (
  color: string | null | undefined,
  theme: DefaultTheme
): string | null => {
  const normalized = normalizeHexColor(color);
  if (!normalized) {
    return null;
  }

  const luminance = getLuminance(normalized);

  if (theme.currentTheme === "light" && luminance > 0.85) {
    return shadeColor(normalized, -0.25);
  }

  if (theme.currentTheme === "dark" && luminance < 0.2) {
    return shadeColor(normalized, 0.3);
  }

  return normalized;
};

export const addAlphaToColor = (color: string, alpha: number) => {
  const { r, g, b } = hexToRgb(color);
  return `rgba(${r}, ${g}, ${b}, ${clamp(alpha, 0, 1)})`;
};

export const getReadableTextColor = (
  color: string | null | undefined,
  theme: DefaultTheme
) => {
  const adjusted = adjustColorForTheme(color, theme);
  if (!adjusted) {
    return theme.app.text.dark1;
  }

  const luminance = getLuminance(adjusted);
  return luminance > 0.6 ? theme.app.text.dark1 : theme.app.bg.white;
};

export const normalizeColorInput = (color?: string | null) => {
  return normalizeHexColor(color);
};
