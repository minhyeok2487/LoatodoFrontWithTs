export type SeasonalEffectKey =
  | "SPRING"
  | "RAINY"
  | "AUTUMN"
  | "WINTER"
  | "NONE";

export interface SeasonalEffectConfig {
  key: SeasonalEffectKey;
  expiresAt?: string | null;
}
