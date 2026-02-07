import type { EquipmentHistory } from "@core/types/inspection";

export const GRADE_COLORS: Record<string, string> = {
  고대: "#E3C7A1",
  유물: "#FA5D00",
  전설: "#F99200",
  영웅: "#8045DD",
  희귀: "#2AB1F6",
  고급: "#91FE02",
  일반: "#CCCCCC",
};

export const getGradeColor = (grade?: string | null): string =>
  (grade && GRADE_COLORS[grade]) || "#666";

export const getQualityColor = (quality: number): string => {
  if (quality === 100) return "#FF6600";
  if (quality >= 90) return "#9B59B6";
  if (quality >= 70) return "#2E86C1";
  if (quality >= 30) return "#27AE60";
  return "#F1C40F";
};

export const ARMOR_SLOTS = ["투구", "어깨", "상의", "하의", "장갑", "무기"];
export const ACCESSORY_SLOTS = ["목걸이", "귀걸이", "반지"];
export const OTHER_SLOTS = ["어빌리티 스톤", "팔찌"];

export const formatEffectText = (text: string): string =>
  text
    .replace(/([\d.]+%)([\uAC00-\uD7AF])/g, "$1\n$2")
    .replace(/(\+[\d,.]+)([\uAC00-\uD7AF])/g, "$1\n$2")
    .replace(/(다\.)\s*([\uAC00-\uD7AF])/g, "$1\n$2");

export type GrindingTier = "dealer" | "support" | "compromise" | "trash";

export const GRINDING_TIER_COLORS: Record<GrindingTier, string> = {
  dealer: "#4FC3F7",
  support: "#FFB74D",
  compromise: "#FF8A65",
  trash: "#555",
};

export const getGrindingTier = (line: string): GrindingTier => {
  const t = line.trim();
  if (!t) return "trash";
  if (
    /아덴 획득|낙인력|파티원 회복|파티원 보호막|아군 공격력 강화|아군 피해량 강화/.test(
      t
    )
  )
    return "support";
  if (/최대 생명력|최대 마나/.test(t)) return "compromise";
  if (/상태이상 공격 지속시간|전투 중 생명력 회복량/.test(t)) return "trash";
  if (
    /추가 피해|적에게 주는 피해|공격력|무기공격력|치명타 적중|치명타 피해/.test(
      t
    )
  )
    return "dealer";
  return "trash";
};

export const formatRefinement = (equip: EquipmentHistory): string => {
  let text = "";
  if (equip.refinement != null && equip.refinement > 0) {
    text += `+${equip.refinement}강`;
  }
  if (equip.advancedRefinement != null && equip.advancedRefinement > 0) {
    text += ` (+상재${equip.advancedRefinement})`;
  }
  return text;
};

export type EquipChangeType =
  | "upgraded"
  | "downgraded"
  | "changed"
  | "new"
  | "removed"
  | "unchanged";

export interface EquipDiff {
  type: string;
  current: EquipmentHistory | null;
  previous: EquipmentHistory | null;
  changeType: EquipChangeType;
  changes: string[];
}

export const ARK_PASSIVE_COLORS: Record<string, string> = {
  진화: "#F1D594",
  깨달음: "#83E9FF",
  도약: "#C2EA55",
};
