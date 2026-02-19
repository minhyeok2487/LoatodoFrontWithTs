/**
 * Lostark API Tooltip JSON 파싱 유틸리티
 *
 * Tooltip은 JSON 문자열로, 내부에 Element_000, Element_001... 구조를 가짐.
 * 각 Element는 { type, value } 형태.
 */

export interface TooltipElement {
  type: string;
  value: unknown;
}

export interface ParsedTooltip {
  [key: string]: TooltipElement;
}

/** Tooltip JSON 문자열을 파싱 */
export const parseTooltip = (tooltipStr: string): ParsedTooltip | null => {
  try {
    return JSON.parse(tooltipStr);
  } catch {
    return null;
  }
};

/** HTML 태그 제거 */
export const stripHtml = (html: string): string => {
  return html.replace(/<[^>]+>/g, "").trim();
};

/** 장비 품질값 추출 (Tooltip Element_001.value.qualityValue) */
export const extractQuality = (tooltipStr: string): number | null => {
  const tooltip = parseTooltip(tooltipStr);
  if (!tooltip) return null;

  const found = Object.keys(tooltip).find((key) => {
    const element = tooltip[key];
    return (
      element?.type === "ItemTitle" &&
      typeof element.value === "object" &&
      element.value !== null
    );
  });

  if (found) {
    const val = tooltip[found].value as Record<string, unknown>;
    if ("qualityValue" in val && typeof val.qualityValue === "number") {
      return val.qualityValue;
    }
  }
  return null;
};

/** 장비 등급 색상 반환 */
export const getGradeColor = (grade: string): string => {
  const gradeColors: Record<string, string> = {
    일반: "#959595",
    고급: "#68D917",
    희귀: "#00AAFF",
    영웅: "#A855F7",
    전설: "#F59E0B",
    유물: "#DC6A2C",
    고대: "#E3C8A0",
    에스더: "#3CF0E5",
  };
  return gradeColors[grade] || "#959595";
};

/** Tooltip에서 세트 효과 텍스트 추출 */
export const extractSetEffect = (tooltipStr: string): string | null => {
  const tooltip = parseTooltip(tooltipStr);
  if (!tooltip) return null;

  const found = Object.keys(tooltip).find(
    (key) => tooltip[key]?.type === "SetItemGroup"
  );

  if (found) {
    const val = tooltip[found].value as Record<string, unknown>;
    if (val && typeof val === "object") {
      const firstKey = Object.keys(val)[0];
      if (firstKey) return stripHtml(String(firstKey));
    }
  }
  return null;
};

/** Tooltip에서 초월 정보 추출 */
export const extractTranscendence = (
  tooltipStr: string
): { level: number; total: number } | null => {
  const tooltip = parseTooltip(tooltipStr);
  if (!tooltip) return null;

  const keys = Object.keys(tooltip);
  const found = keys.find((key) => {
    const element = tooltip[key];
    if (element?.type !== "IndentStringGroup") return false;
    const val = element.value as Record<string, unknown>;
    if (!val || typeof val !== "object") return false;
    // eslint-disable-next-line @typescript-eslint/dot-notation
    const topEl = val["Element_000"] as Record<string, unknown> | undefined;
    return topEl?.topStr && String(topEl.topStr).includes("초월");
  });

  if (found) {
    const val = tooltip[found].value as Record<string, unknown>;
    // eslint-disable-next-line @typescript-eslint/dot-notation
    const topEl = val["Element_000"] as Record<string, unknown>;
    const topStr = String(topEl.topStr);
    const match = topStr.match(/Lv\.(\d+).*?합계\s*(\d+)/);
    if (match) {
      return {
        level: parseInt(match[1], 10),
        total: parseInt(match[2], 10),
      };
    }
  }
  return null;
};

/** Tooltip에서 엘릭서 정보 추출 */
export const extractElixir = (
  tooltipStr: string
): Array<{ name: string; level: number }> => {
  const tooltip = parseTooltip(tooltipStr);
  if (!tooltip) return [];

  return Object.keys(tooltip).reduce<Array<{ name: string; level: number }>>(
    (elixirs, key) => {
      const element = tooltip[key];
      if (element?.type !== "IndentStringGroup") return elixirs;

      const val = element.value as Record<string, unknown>;
      if (!val || typeof val !== "object") return elixirs;

      // eslint-disable-next-line @typescript-eslint/dot-notation
      const topEl = val["Element_000"] as Record<string, unknown> | undefined;
      if (!topEl?.topStr || !String(topEl.topStr).includes("엘릭서"))
        return elixirs;

      const contentEl = topEl?.contentStr as Record<string, unknown> | undefined;
      if (!contentEl || typeof contentEl !== "object") return elixirs;

      Object.keys(contentEl).forEach((cKey) => {
        const cVal = contentEl[cKey] as Record<string, unknown> | undefined;
        if (cVal?.contentStr) {
          const text = stripHtml(String(cVal.contentStr));
          const match = text.match(/(.+?)\s*Lv\.?\s*(\d+)/);
          if (match) {
            elixirs.push({
              name: match[1].trim(),
              level: parseInt(match[2], 10),
            });
          }
        }
      });

      return elixirs;
    },
    []
  );
};

/**
 * 장비 타입별 분류
 */
export const EQUIPMENT_TYPES = {
  ARMOR: ["머리 방어구", "어깨 방어구", "상의", "하의", "장갑", "무기"],
  ACCESSORY: ["목걸이", "귀걸이", "반지"],
  BRACELET: ["팔찌"],
  STONE: ["어빌리티 스톤"],
} as const;

export const isArmorType = (type: string): boolean =>
  EQUIPMENT_TYPES.ARMOR.includes(type as (typeof EQUIPMENT_TYPES.ARMOR)[number]);

export const isAccessoryType = (type: string): boolean =>
  EQUIPMENT_TYPES.ACCESSORY.includes(
    type as (typeof EQUIPMENT_TYPES.ACCESSORY)[number]
  );

export const isBraceletType = (type: string): boolean =>
  EQUIPMENT_TYPES.BRACELET.includes(
    type as (typeof EQUIPMENT_TYPES.BRACELET)[number]
  );

export const isStoneType = (type: string): boolean =>
  EQUIPMENT_TYPES.STONE.includes(
    type as (typeof EQUIPMENT_TYPES.STONE)[number]
  );
