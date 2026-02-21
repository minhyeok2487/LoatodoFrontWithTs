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
  ARMOR: [
    "머리 방어구", "어깨 방어구", "상의", "하의", "장갑", "무기",
    "투구", "어깨",
  ],
  ACCESSORY: ["목걸이", "귀걸이", "반지"],
  BRACELET: ["팔찌"],
  STONE: ["어빌리티 스톤"],
  ELIXIR: ["나침반", "부적"],
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

export const isElixirType = (type: string): boolean =>
  EQUIPMENT_TYPES.ELIXIR.includes(
    type as (typeof EQUIPMENT_TYPES.ELIXIR)[number]
  );

export const isJewelType = (type: string): boolean => type === "보주";

/** 악세서리 연마 효과 추출 (T4: ItemPartBox "연마 효과") */
export const extractAccessoryStats = (tooltipStr: string): string[] => {
  const tooltip = parseTooltip(tooltipStr);
  if (!tooltip) return [];

  const results: string[] = [];

  Object.keys(tooltip).forEach((key) => {
    const element = tooltip[key];
    if (element?.type !== "ItemPartBox") return;

    const val = element.value as Record<string, unknown> | null;
    if (!val || typeof val !== "object") return;

    const title = val.Element_000 ? stripHtml(String(val.Element_000)) : "";
    if (!title.includes("연마")) return;

    const content = val.Element_001 ? String(val.Element_001) : "";
    content
      .split(/<br\s*\/?>/gi)
      .map((l: string) => stripHtml(l.trim()))
      .filter(Boolean)
      .forEach((line) => results.push(line));
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

    // Check if this is the "무작위 각인 효과" section
    Object.keys(val).forEach((elKey) => {
      const el = val[elKey] as Record<string, unknown> | undefined;
      if (!el) return;

      const topStr = el.topStr ? String(el.topStr) : "";
      const cleanTopStr = stripHtml(topStr);

      // T4 stone: engravings are in contentStr, topStr is "무작위 각인 효과"
      if (
        cleanTopStr.includes("각인 효과") &&
        el.contentStr &&
        typeof el.contentStr === "object"
      ) {
        const content = el.contentStr as Record<string, unknown>;
        Object.keys(content)
          .sort()
          .forEach((cKey) => {
            const cVal = content[cKey] as Record<string, unknown>;
            if (!cVal?.contentStr) return;
            const rawContent = String(cVal.contentStr);
            const text = stripHtml(rawContent);
            // T4 format: "[아드레날린] Lv.4" or "[이동속도 감소] Lv.0"
            const bracketMatch = text.match(/\[(.+?)\]\s*Lv\.?\s*(\d+)/);
            if (bracketMatch) {
              const name = bracketMatch[1].trim();
              const level = parseInt(bracketMatch[2], 10);
              // Skip "레벨 보너스" entries
              if (name === "레벨 보너스") return;
              const isNegative =
                rawContent.includes("FE2E2E") ||
                rawContent.includes("FF6060") ||
                name.includes("감소");
              results.push({ name, level, isNegative });
              return;
            }
            // Old format: "Lv.N 각인명" or "활성도 Lv.N 각인명"
            const oldMatch = text.match(
              /(?:\[?활성도\s*)?Lv\.?\s*(\d+)\]?\s*(.+)/
            );
            if (oldMatch) {
              const level = parseInt(oldMatch[1], 10);
              const name = oldMatch[2].trim();
              const isNegative =
                rawContent.includes("감소") ||
                rawContent.includes("FF6060") ||
                rawContent.includes("FE2E2E");
              results.push({ name, level, isNegative });
            }
          });
        return;
      }

      // Fallback: topStr itself has engraving info
      const cleanText = stripHtml(topStr);
      const bracketMatch = cleanText.match(/\[(.+?)\]\s*Lv\.?\s*(\d+)/);
      if (bracketMatch) {
        const name = bracketMatch[1].trim();
        if (name === "레벨 보너스") return;
        const level = parseInt(bracketMatch[2], 10);
        const isNegative =
          topStr.includes("FE2E2E") ||
          topStr.includes("FF6060") ||
          name.includes("감소");
        results.push({ name, level, isNegative });
        return;
      }
      const oldMatch = cleanText.match(
        /(?:\[?활성도\s*)?Lv\.?\s*(\d+)\]?\s*(.+)/
      );
      if (oldMatch) {
        const level = parseInt(oldMatch[1], 10);
        const name = oldMatch[2].trim();
        const isNegative =
          topStr.includes("감소") ||
          topStr.includes("FF6060") ||
          topStr.includes("FE2E2E");
        results.push({ name, level, isNegative });
      }
    });
  });

  return results;
};

/** 팔찌 효과 추출 (T4: ItemPartBox "팔찌 효과") */
export const extractBraceletStats = (tooltipStr: string): string[] => {
  const tooltip = parseTooltip(tooltipStr);
  if (!tooltip) return [];

  const results: string[] = [];

  Object.keys(tooltip).forEach((key) => {
    const element = tooltip[key];
    if (element?.type !== "ItemPartBox") return;

    const val = element.value as Record<string, unknown> | null;
    if (!val || typeof val !== "object") return;

    const title = val.Element_000 ? stripHtml(String(val.Element_000)) : "";
    if (!title.includes("팔찌")) return;

    const content = val.Element_001 ? String(val.Element_001) : "";
    content
      .split(/<BR>/gi)
      .map((l: string) => stripHtml(l.trim()))
      .filter(Boolean)
      .forEach((line) => results.push(line));
  });

  return results;
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

/** ItemTitle에서 아이템 레벨 & 티어 추출 */
export const extractItemTierAndLevel = (
  tooltipStr: string
): { tier: number; itemLevel: number } | null => {
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
    const leftStr2 = val.leftStr2 ? String(val.leftStr2) : "";
    const cleaned = stripHtml(leftStr2);
    // "아이템 레벨 1770 (티어 4)" or "아이템 티어 4"
    const levelMatch = cleaned.match(/아이템\s*레벨\s*(\d+)\s*\(티어\s*(\d+)\)/);
    if (levelMatch) {
      return {
        itemLevel: parseInt(levelMatch[1], 10),
        tier: parseInt(levelMatch[2], 10),
      };
    }
    const tierOnly = cleaned.match(/아이템\s*티어\s*(\d+)/);
    if (tierOnly) {
      return { itemLevel: 0, tier: parseInt(tierOnly[1], 10) };
    }
  }
  return null;
};

/** HTML 색상 태그를 inline style span으로 변환 */
export const fontToSpan = (html: string): string =>
  html
    .replace(/<\/?textformat[^>]*>/gi, "")
    .replace(
      /<font\s+color='([^']+)'>(.*?)<\/font>/gi,
      '<span style="color:$1">$2</span>'
    )
    .replace(/<\/?font[^>]*>/gi, "")
    .trim();

// ─── 툴팁 전체 섹션 파싱 ───

export type TooltipSectionType =
  | "title"
  | "text"
  | "partbox"
  | "indent"
  | "progress"
  | "set"
  | "unknown";

export interface TooltipTitleSection {
  sectionType: "title";
  slotName: string; // "머리 방어구" 등
  itemName: string; // 아이템 이름 (HTML)
  grade: string; // "고대" 등
  tierLine: string; // "아이템 레벨 1770 (티어 4)"
  qualityValue: number;
}

export interface TooltipTextSection {
  sectionType: "text";
  lines: string[]; // HTML 문자열들
}

export interface TooltipPartBoxSection {
  sectionType: "partbox";
  title: string; // "기본 효과", "추가 효과"
  lines: string[]; // HTML 효과 라인들
}

export interface TooltipIndentSection {
  sectionType: "indent";
  label: string; // topStr (초월, 엘릭서, 연마효과 등)
  items: string[]; // contentStr 내부 라인들
}

export interface TooltipProgressSection {
  sectionType: "progress";
  title: string;
  current: number;
  max: number;
}

export interface TooltipSetSection {
  sectionType: "set";
  text: string;
}

export type TooltipSection =
  | TooltipTitleSection
  | TooltipTextSection
  | TooltipPartBoxSection
  | TooltipIndentSection
  | TooltipProgressSection
  | TooltipSetSection;

/** Tooltip JSON의 모든 Element를 순회하며 렌더링 가능한 섹션 배열로 변환 */
export const extractAllTooltipSections = (
  tooltipStr: string
): TooltipSection[] => {
  const tooltip = parseTooltip(tooltipStr);
  if (!tooltip) return [];

  const sections: TooltipSection[] = [];
  const keys = Object.keys(tooltip).sort();

  keys.forEach((key) => {
    const element = tooltip[key];
    if (!element) return;

    switch (element.type) {
      case "ItemTitle": {
        const val = element.value as Record<string, unknown> | null;
        if (!val || typeof val !== "object") break;
        const leftStr0 = val.leftStr0 ? String(val.leftStr0) : "";
        const leftStr2 = val.leftStr2 ? String(val.leftStr2) : "";
        const qualityValue =
          typeof val.qualityValue === "number" ? val.qualityValue : -1;
        const slotName = val.slotName ? String(val.slotName) : "";

        // leftStr0에 등급이 포함됨 (예: "고대 머리 방어구")
        const gradeMatch = stripHtml(leftStr0).match(
          /^(일반|고급|희귀|영웅|전설|유물|고대|에스더)\s*/
        );
        const grade = gradeMatch ? gradeMatch[1] : "";

        sections.push({
          sectionType: "title",
          slotName,
          itemName: leftStr0,
          grade,
          tierLine: stripHtml(leftStr2),
          qualityValue,
        });
        break;
      }

      case "SingleTextBox": {
        const val = element.value as string;
        if (val) {
          sections.push({
            sectionType: "text",
            lines: [String(val)],
          });
        }
        break;
      }

      case "MultiTextBox": {
        const val = element.value as string;
        if (val) {
          sections.push({
            sectionType: "text",
            lines: [String(val)],
          });
        }
        break;
      }

      case "ItemPartBox": {
        const val = element.value as Record<string, unknown> | null;
        if (!val || typeof val !== "object") break;
        const title = val.Element_000 ? stripHtml(String(val.Element_000)) : "";
        const content = val.Element_001 ? String(val.Element_001) : "";
        const lines = content
          .split("<BR>")
          .map((l: string) => l.trim())
          .filter(Boolean);
        sections.push({ sectionType: "partbox", title, lines });
        break;
      }

      case "IndentStringGroup": {
        const val = element.value as Record<string, unknown> | null;
        if (!val || typeof val !== "object") break;
        const elKeys = Object.keys(val).sort();
        elKeys.forEach((elKey) => {
          const el = val[elKey] as Record<string, unknown> | undefined;
          if (!el) return;
          const topStr = el.topStr ? String(el.topStr) : "";
          const items: string[] = [];

          if (el.contentStr && typeof el.contentStr === "object") {
            const content = el.contentStr as Record<string, unknown>;
            Object.keys(content)
              .sort()
              .forEach((cKey) => {
                const cVal = content[cKey] as Record<string, unknown>;
                if (cVal?.contentStr) {
                  items.push(String(cVal.contentStr));
                }
              });
          }

          sections.push({
            sectionType: "indent",
            label: topStr,
            items,
          });
        });
        break;
      }

      case "Progress": {
        const val = element.value as Record<string, unknown> | null;
        if (!val || typeof val !== "object") break;
        const title = val.forceTitle
          ? String(val.forceTitle)
          : val.title
            ? stripHtml(String(val.title))
            : "";
        // API may store values as "current"/"max" or as formatted strings
        let current = 0;
        let max = 0;
        if (val.current != null) {
          current =
            typeof val.current === "number"
              ? val.current
              : parseInt(String(val.current).replace(/,/g, ""), 10) || 0;
        }
        if (val.max != null) {
          max =
            typeof val.max === "number"
              ? val.max
              : parseInt(String(val.max).replace(/,/g, ""), 10) || 0;
        }
        // Some Progress elements have "value" as a formatted string like "0 / 67000"
        if (current === 0 && max === 0 && val.value) {
          const progressMatch = String(val.value).match(
            /([\d,]+)\s*\/\s*([\d,]+)/
          );
          if (progressMatch) {
            current = parseInt(progressMatch[1].replace(/,/g, ""), 10) || 0;
            max = parseInt(progressMatch[2].replace(/,/g, ""), 10) || 0;
          }
        }
        sections.push({ sectionType: "progress", title, current, max });
        break;
      }

      case "SetItemGroup": {
        const val = element.value as Record<string, unknown> | null;
        if (!val || typeof val !== "object") break;
        const text = Object.keys(val)
          .map((k) => String(k))
          .join(" ");
        sections.push({ sectionType: "set", text: stripHtml(text) });
        break;
      }

      default:
        break;
    }
  });

  return sections;
};
