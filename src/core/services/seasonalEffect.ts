import type {
  SeasonalEffectConfig,
  SeasonalEffectKey,
} from "@core/types/seasonalEffect";

const SEASONAL_EFFECT_OVERRIDE_STORAGE_KEY = "loatodo-seasonal-effect";

const isExpired = (date?: string | null) => {
  if (!date) {
    return false;
  }
  const expiresAt = new Date(date);
  return Number.isNaN(expiresAt.getTime()) || expiresAt < new Date();
};

export const loadSeasonalEffectConfig =
  async (): Promise<SeasonalEffectConfig | null> => {
    if (typeof window === "undefined") {
      return null;
    }

    try {
      const raw = window.localStorage.getItem(
        SEASONAL_EFFECT_OVERRIDE_STORAGE_KEY
      );
      if (!raw) {
        return null;
      }
      const parsed = JSON.parse(raw) as SeasonalEffectConfig;
      if (parsed.key === "NONE" || isExpired(parsed.expiresAt)) {
        return null;
      }
      return parsed;
    } catch {
      return null;
    }
  };

export const saveSeasonalEffectOverride = (
  config: SeasonalEffectConfig | null
) => {
  if (typeof window === "undefined") {
    return;
  }

  if (!config) {
    window.localStorage.removeItem(SEASONAL_EFFECT_OVERRIDE_STORAGE_KEY);
    return;
  }

  window.localStorage.setItem(
    SEASONAL_EFFECT_OVERRIDE_STORAGE_KEY,
    JSON.stringify(config)
  );
};

export const resolveSeasonalEffectKey = (
  overrideKey: SeasonalEffectKey | null,
  currentDate = new Date()
): SeasonalEffectKey => {
  if (overrideKey && overrideKey !== "NONE") {
    return overrideKey;
  }

  const month = currentDate.getMonth() + 1;
  if (month >= 3 && month <= 5) {
    return "SPRING";
  }
  if (month >= 6 && month <= 8) {
    return "RAINY";
  }
  if (month >= 9 && month <= 11) {
    return "AUTUMN";
  }
  return "WINTER";
};
