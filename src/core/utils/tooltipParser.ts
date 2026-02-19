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

export const isJewelType = (type: string): boolean => type === "보주";

/** 악세서리 효과 파싱 (IndentStringGroup에서 상/하 등급 + 스탯명 추출) */
export const extractAccessoryEffects = (
  tooltipStr: string
): Array<{ grade: string; name: string }> => {
  const tooltip = parseTooltip(tooltipStr);
  if (!tooltip) return [];

  const results: Array<{ grade: string; name: string }> = [];

  Object.keys(tooltip).forEach((key) => {
    const element = tooltip[key];
    if (element?.type !== "IndentStringGroup") return;

    const val = element.value as Record<string, unknown>;
    if (!val || typeof val !== "object") return;

    Object.keys(val).forEach((elKey) => {
      const el = val[elKey] as Record<string, unknown> | undefined;
      if (!el) return;

      const topStr = el.topStr ? stripHtml(String(el.topStr)) : "";
      const { contentStr } = el;

      // 악세서리 효과 패턴: "[상/하] 스탯명"
      if (contentStr && typeof contentStr === "object") {
        Object.values(contentStr as Record<string, unknown>).forEach(
          (cVal) => {
            const cv = cVal as Record<string, unknown> | undefined;
            if (cv?.contentStr) {
              const text = stripHtml(String(cv.contentStr));
              const match = text.match(
                /\[?(상|하|최상|최하)\]?\s*(.+)/
              );
              if (match) {
                results.push({ grade: match[1], name: match[2].trim() });
              }
            }
          }
        );
      }

      // 단일 텍스트 효과
      if (topStr && /\[?(상|하|최상|최하)\]?/.test(topStr)) {
        const match = topStr.match(/\[?(상|하|최상|최하)\]?\s*(.+)/);
        if (match) {
          results.push({ grade: match[1], name: match[2].trim() });
        }
      }
    });
  });

  return results;
};

/** 어빌리티 스톤 각인 레벨 파싱 */
export const extractStoneEngravings = (
  tooltipStr: string
): Array<{ name: string; level: number; isNegative: boolean }> => {
  const tooltip = parseTooltip(tooltipStr);
  if (!tooltip) return [];

  const results: Array<{ name: string; level: number; isNegative: boolean }> =
    [];

  Object.keys(tooltip).forEach((key) => {
    const element = tooltip[key];
    if (element?.type !== "IndentStringGroup") return;

    const val = element.value as Record<string, unknown>;
    if (!val || typeof val !== "object") return;

    Object.keys(val).forEach((elKey) => {
      const el = val[elKey] as Record<string, unknown> | undefined;
      if (!el) return;

      const topStr = el.topStr ? String(el.topStr) : "";
      const cleanText = stripHtml(topStr);

      // "[활성도 Lv.N] 각인명" 또는 "Lv.N 각인명"
      const match = cleanText.match(
        /(?:\[?활성도\s*)?Lv\.?\s*(\d+)\]?\s*(.+)/
      );
      if (match) {
        const level = parseInt(match[1], 10);
        const name = match[2].trim();
        const isNegative =
          topStr.includes("감소") ||
          topStr.includes("color='#FF6060'") ||
          topStr.includes("NEGATIVE");
        results.push({ name, level, isNegative });
      }
    });
  });

  return results;
};

/** 팔찌 효과 파싱 */
export const extractBraceletEffects = (
  tooltipStr: string
): Array<{ grade: string; name: string }> => {
  return extractAccessoryEffects(tooltipStr);
};

/** 보석 요약 생성: "N겁 M작" */
export const extractGemSummary = (
  gems: Array<{ Name: string; Level: number }>
): string => {
  let geop = 0;
  let jak = 0;

  gems.forEach((g) => {
    const name = g.Name || "";
    if (name.includes("겁화") || name.includes("광휘")) {
      geop += 1;
    } else if (name.includes("작열") || name.includes("홍염")) {
      jak += 1;
    }
  });

  const parts: string[] = [];
  if (geop > 0) parts.push(`${geop}겁`);
  if (jak > 0) parts.push(`${jak}작`);
  return parts.join(" ");
};

/** 장비 강화 수치 추출 (+N) */
export const extractEnhanceLevel = (name: string): number | null => {
  const match = name.match(/\+(\d+)/);
  return match ? parseInt(match[1], 10) : null;
};
