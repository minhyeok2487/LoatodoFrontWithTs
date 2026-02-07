import { useMemo } from "react";
import styled from "styled-components";

import useInspectionDetail from "@core/hooks/queries/inspection/useInspectionDetail";
import type {
  InspectionCharacter,
  EquipmentHistory,
  ArkgridEffect,
} from "@core/types/inspection";

import EquipmentPanel from "./EquipmentPanel";
import {
  EngravingSection,
  GemSection,
  CardSection,
  ArkPassiveSection,
  ArkgridSection,
  ChangesSection,
} from "./ProfileInfoPanels";
import { type EquipChangeType, type EquipDiff } from "./profileUtils";

interface Props {
  character: InspectionCharacter;
  onClose: () => void;
}

const CharacterProfileView = ({ character, onClose }: Props) => {
  const { data } = useInspectionDetail(character.id);

  const { latestHistory, previousHistory } = useMemo(() => {
    if (!data?.histories || data.histories.length === 0)
      return { latestHistory: null, previousHistory: null };
    const sorted = [...data.histories].sort(
      (a, b) =>
        new Date(b.recordDate).getTime() - new Date(a.recordDate).getTime()
    );
    return {
      latestHistory: sorted[0],
      previousHistory: sorted.length > 1 ? sorted[1] : null,
    };
  }, [data]);

  const equipMap = useMemo(() => {
    const map = new Map<string, EquipmentHistory[]>();
    (latestHistory?.equipments ?? []).forEach((e) => {
      const list = map.get(e.type) ?? [];
      list.push(e);
      map.set(e.type, list);
    });
    return map;
  }, [latestHistory]);

  const equipDiffs = useMemo((): EquipDiff[] => {
    const currentEquips = latestHistory?.equipments ?? [];
    const prevEquips = previousHistory?.equipments ?? [];
    if (currentEquips.length === 0 && prevEquips.length === 0) return [];

    // 이름 기반 매칭: 이전 장비를 이름으로 빠르게 찾기
    const prevByName = new Map<string, EquipmentHistory>();
    prevEquips.forEach((e) => {
      if (!prevByName.has(e.name)) {
        prevByName.set(e.name, e);
      }
    });

    const matchedPrevNames = new Set<string>();

    const diffs: EquipDiff[] = currentEquips.map((equip) => {
      let prev = prevByName.get(equip.name) ?? null;
      if (prev && !matchedPrevNames.has(prev.name)) {
        matchedPrevNames.add(prev.name);
      } else {
        prev =
          prevEquips.find(
            (p) => p.type === equip.type && !matchedPrevNames.has(p.name)
          ) ?? null;
        if (prev) {
          matchedPrevNames.add(prev.name);
        }
      }

      if (!prev) {
        const isFirstRecord = prevEquips.length === 0;
        return {
          type: equip.type,
          current: equip,
          previous: null,
          changeType: isFirstRecord
            ? ("unchanged" as EquipChangeType)
            : ("new" as EquipChangeType),
          changes: isFirstRecord ? [] : ["장비 추가"],
        };
      }
      const changes: string[] = [];
      if (equip.name !== prev.name) changes.push("장비 교체");
      if (
        equip.quality != null &&
        prev.quality != null &&
        equip.quality !== prev.quality
      ) {
        const diff = equip.quality - prev.quality;
        changes.push(`품질 ${diff > 0 ? "+" : ""}${diff}`);
      }
      if (
        equip.refinement != null &&
        prev.refinement != null &&
        equip.refinement !== prev.refinement
      ) {
        changes.push(`재련 ${prev.refinement} → ${equip.refinement}`);
      }
      if (
        equip.advancedRefinement != null &&
        prev.advancedRefinement != null &&
        equip.advancedRefinement !== prev.advancedRefinement
      ) {
        changes.push(
          `상재 ${prev.advancedRefinement} → ${equip.advancedRefinement}`
        );
      }
      const changeType: EquipChangeType =
        changes.length === 0 ? "unchanged" : "changed";
      return {
        type: equip.type,
        current: equip,
        previous: prev,
        changeType,
        changes,
      };
    });

    if (prevEquips.length > 0) {
      prevEquips.forEach((prev) => {
        if (!matchedPrevNames.has(prev.name)) {
          diffs.push({
            type: prev.type,
            current: null,
            previous: prev,
            changeType: "removed",
            changes: ["장비 해제"],
          });
        }
      });
    }

    return diffs;
  }, [latestHistory, previousHistory]);

  const changedDiffs = equipDiffs.filter((d) => d.changeType !== "unchanged");

  const { currentEffects, prevEffectsMap } = useMemo(() => {
    const current = latestHistory?.arkgridEffects ?? [];
    const prevMap = new Map<string, ArkgridEffect>();
    (previousHistory?.arkgridEffects ?? []).forEach((e) =>
      prevMap.set(e.effectName, e)
    );
    return { currentEffects: current, prevEffectsMap: prevMap };
  }, [latestHistory, previousHistory]);

  return (
    <ProfileWrapper>
      {/* Header */}
      <ProfileHeader>
        <HeaderLeft>
          <HeaderInfo>
            {character.title && (
              <CharacterTitle>{character.title}</CharacterTitle>
            )}
            <CharacterNameLarge>
              {character.characterName}
            </CharacterNameLarge>
            <CharacterMeta>
              {character.serverName} / {character.characterClassName}
              {character.guildName && ` / ${character.guildName}`}
            </CharacterMeta>
            {(character.townName || character.expeditionLevel > 0) && (
              <CharacterMeta>
                {character.townName && character.townLevel != null
                  ? `영지 ${character.townName} Lv.${character.townLevel}`
                  : ""}
                {character.townName && character.expeditionLevel > 0
                  ? " / "
                  : ""}
                {character.expeditionLevel > 0
                  ? `원정대 Lv.${character.expeditionLevel}`
                  : ""}
              </CharacterMeta>
            )}
          </HeaderInfo>
        </HeaderLeft>

        <HeaderStats>
          <HeaderStatItem>
            <HeaderStatLabel>아이템 Lv</HeaderStatLabel>
            <HeaderStatValue>
              {character.itemLevel.toLocaleString()}
            </HeaderStatValue>
          </HeaderStatItem>
          <HeaderStatItem>
            <HeaderStatLabel>전투력</HeaderStatLabel>
            <HeaderStatValue>
              {character.combatPower.toLocaleString()}
            </HeaderStatValue>
          </HeaderStatItem>
          {character.previousCombatPower !== null && (
            <HeaderStatItem>
              <HeaderStatLabel>전일 대비</HeaderStatLabel>
              <HeaderStatChange
                $isPositive={character.combatPowerChange > 0}
              >
                {character.combatPowerChange > 0 ? "+" : ""}
                {character.combatPowerChange.toLocaleString()}
              </HeaderStatChange>
            </HeaderStatItem>
          )}
        </HeaderStats>

        <CloseButton onClick={onClose}>닫기</CloseButton>

        {character.stats && character.stats.length > 0 && (
          <StatsBar>
            {character.stats.map((stat) => (
              <StatBadge key={stat.type}>
                <StatBadgeLabel>{stat.type}</StatBadgeLabel>
                <StatBadgeValue>{stat.value}</StatBadgeValue>
              </StatBadge>
            ))}
          </StatsBar>
        )}
      </ProfileHeader>

      {/* Equipment */}
      {(latestHistory?.equipments ?? []).length > 0 && (
        <EquipmentPanel
          equipMap={equipMap}
          equipDiffs={equipDiffs}
          characterImage={character.characterImage}
        />
      )}

      {/* Info Sections */}
      <BottomSection>
        <EngravingSection engravings={latestHistory?.engravings ?? []} />

        <GemSection gems={latestHistory?.gems ?? []} />

        <CardSection
          cards={latestHistory?.cards ?? []}
          cardSetEffects={latestHistory?.cardSetEffects ?? []}
        />

        <ArkPassiveSection
          arkPassiveTitle={latestHistory?.arkPassiveTitle}
          arkPassivePoints={latestHistory?.arkPassivePoints ?? []}
          arkPassiveEffects={latestHistory?.arkPassiveEffects ?? []}
        />

        <ArkgridSection
          currentEffects={currentEffects}
          prevEffectsMap={prevEffectsMap}
          hasPreviousHistory={previousHistory != null}
        />

        <ChangesSection changedDiffs={changedDiffs} />

        {latestHistory && (
          <RecordDate>{latestHistory.recordDate} 기준</RecordDate>
        )}
      </BottomSection>
    </ProfileWrapper>
  );
};

export default CharacterProfileView;

/* ===== Header Styled Components ===== */

const ProfileWrapper = styled.div`
  display: flex;
  flex-direction: column;
  background: radial-gradient(
    ellipse at top,
    #1e1e3a 0%,
    #12121f 60%,
    #0a0a14 100%
  );
  border-radius: 16px;
  overflow: hidden;
  color: #e0e0e0;
`;

const ProfileHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 24px 28px;
  background: linear-gradient(
    180deg,
    rgba(255, 255, 255, 0.04) 0%,
    transparent 100%
  );
  flex-wrap: wrap;
`;

const HeaderLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  flex: 1;
  min-width: 200px;
`;

const HeaderInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
`;

const CharacterTitle = styled.span`
  font-size: 12px;
  color: #7b68ee;
  font-weight: 600;
`;

const CharacterNameLarge = styled.span`
  font-size: 22px;
  font-weight: 700;
  color: #ffffff;
  text-shadow: 0 0 20px rgba(120, 120, 255, 0.3);
`;

const CharacterMeta = styled.span`
  font-size: 13px;
  color: #8888aa;
`;

const HeaderStats = styled.div`
  display: flex;
  gap: 20px;
  flex-wrap: wrap;
`;

const HeaderStatItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
  padding: 8px 16px;
  background: rgba(255, 255, 255, 0.03);
  border-radius: 12px;
  backdrop-filter: blur(4px);
`;

const HeaderStatLabel = styled.span`
  font-size: 11px;
  color: #8888aa;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const HeaderStatValue = styled.span`
  font-size: 18px;
  font-weight: 700;
  color: #ffffff;
`;

const HeaderStatChange = styled.span<{ $isPositive: boolean }>`
  font-size: 18px;
  font-weight: 700;
  color: ${({ $isPositive }) => ($isPositive ? "#4ade80" : "#f87171")};
  text-shadow: ${({ $isPositive }) =>
    $isPositive
      ? "0 0 8px rgba(74, 222, 128, 0.4)"
      : "0 0 8px rgba(248, 113, 113, 0.4)"};
`;

const CloseButton = styled.button`
  padding: 8px 18px;
  font-size: 13px;
  font-weight: 600;
  color: #9999bb;
  background: rgba(255, 255, 255, 0.05);
  border: none;
  border-radius: 20px;
  cursor: pointer;
  transition: all 0.3s;
  backdrop-filter: blur(4px);

  &:hover {
    color: #ffffff;
    background: rgba(255, 255, 255, 0.12);
    transform: scale(1.05);
  }
`;

const StatsBar = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  width: 100%;
  margin-top: 8px;
`;

const StatBadge = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 3px 10px;
  background: rgba(255, 255, 255, 0.04);
  border-radius: 12px;
`;

const StatBadgeLabel = styled.span`
  font-size: 11px;
  color: #7777aa;
`;

const StatBadgeValue = styled.span`
  font-size: 12px;
  font-weight: 700;
  color: #ccccee;
`;

const BottomSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 0 28px 24px;
`;

const RecordDate = styled.span`
  font-size: 11px;
  color: #444;
  text-align: right;
`;
