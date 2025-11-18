import { useEffect, useMemo, useState, type ComponentType } from "react";

import CherryBlossomEffect from "@components/seasonal/effects/CherryBlossomEffect";
import FallingLeavesEffect from "@components/seasonal/effects/FallingLeavesEffect";
import RainEffect from "@components/seasonal/effects/RainEffect";
import SnowfallEffect from "@components/seasonal/effects/SnowfallEffect";
import {
  loadSeasonalEffectConfig,
  resolveSeasonalEffectKey,
} from "@core/services/seasonalEffect";
import type { SeasonalEffectKey } from "@core/types/seasonalEffect";

type SeasonalEffectComponentMap = Partial<
  Record<SeasonalEffectKey, ComponentType>
>;

const seasonalEffectComponentMap: SeasonalEffectComponentMap = {
  SPRING: CherryBlossomEffect,
  RAINY: RainEffect,
  AUTUMN: FallingLeavesEffect,
  WINTER: SnowfallEffect,
};

const useSeasonalEffect = () => {
  const [overrideKey, setOverrideKey] = useState<SeasonalEffectKey | null>(null);

  useEffect(() => {
    let isMounted = true;

    loadSeasonalEffectConfig()
      .then((config) => {
        if (!isMounted) {
          return;
        }
        setOverrideKey(config?.key ?? null);
      })
      .catch(() => {
        if (isMounted) {
          setOverrideKey(null);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const resolvedKey = useMemo(
    () => resolveSeasonalEffectKey(overrideKey),
    [overrideKey]
  );

  return seasonalEffectComponentMap[resolvedKey] ?? null;
};

export default useSeasonalEffect;
