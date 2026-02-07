import { MdRefresh } from "@react-icons/all-files/md/MdRefresh";
import { MdSettings } from "@react-icons/all-files/md/MdSettings";
import styled from "styled-components";

import type { InspectionCharacter } from "@core/types/inspection";

import Button from "@components/Button";

const CHART_COLORS = [
  "#2563eb",
  "#16a34a",
  "#dc2626",
  "#9333ea",
  "#ea580c",
  "#0891b2",
  "#ca8a04",
  "#be185d",
  "#4f46e5",
  "#059669",
];

interface Props {
  character: InspectionCharacter;
  onRefresh: (id: number) => void;
  onOpenSettings: (character: InspectionCharacter) => void;
  onSelect: (character: InspectionCharacter) => void;
  isRefreshing?: boolean;
  isSelected?: boolean;
  colorIndex?: number;
}

const InspectionCharacterCard = ({
  character,
  onRefresh,
  onOpenSettings,
  onSelect,
  isRefreshing,
  isSelected,
  colorIndex = 0,
}: Props) => {
  const {
    combatPowerChange,
    unchangedDays,
    noChangeThreshold,
    isActive,
  } = character;

  const isIncreased = combatPowerChange > 0;
  const isWarning = unchangedDays >= noChangeThreshold;
  const chartColor = CHART_COLORS[colorIndex % CHART_COLORS.length];

  return (
    <Card
      $isActive={isActive}
      $isSelected={!!isSelected}
      $chartColor={chartColor}
      onClick={() => onSelect(character)}
    >
      <CardHeader>
        <CharacterInfo>
          {character.characterImage && (
            <CharacterImage
              src={character.characterImage}
              alt={character.characterName}
            />
          )}
          <NameGroup>
            <CharacterName>{character.characterName}</CharacterName>
            <ServerInfo>
              {character.serverName} / {character.characterClassName}
            </ServerInfo>
          </NameGroup>
        </CharacterInfo>

        <Actions>
          <StatusBadge $isActive={isActive}>
            {isActive ? "활성" : "비활성"}
          </StatusBadge>
          <Button
            variant="icon"
            size={20}
            onClick={(e) => {
              e.stopPropagation();
              onRefresh(character.id);
            }}
            disabled={isRefreshing}
            ariaLabel="새로고침"
          >
            <MdRefresh />
          </Button>
          <Button
            variant="icon"
            size={20}
            onClick={(e) => {
              e.stopPropagation();
              onOpenSettings(character);
            }}
            ariaLabel="설정"
          >
            <MdSettings />
          </Button>
        </Actions>
      </CardHeader>

      <StatsRow>
        <StatItem>
          <StatLabel>아이템 레벨</StatLabel>
          <StatValueRow>
            <StatValue>{character.itemLevel.toLocaleString()}</StatValue>
            {character.itemLevelChange != null && character.itemLevelChange !== 0 && (
              <StatChange $isPositive={character.itemLevelChange > 0}>
                {character.itemLevelChange > 0 ? "+" : ""}
                {character.itemLevelChange.toLocaleString()}
              </StatChange>
            )}
          </StatValueRow>
        </StatItem>
        <StatItem>
          <StatLabel>전투력</StatLabel>
          <StatValue>{character.combatPower.toLocaleString()}</StatValue>
        </StatItem>
      </StatsRow>

      <ChangeRow>
        {character.previousCombatPower !== null ? (
          <>
            <ChangeLabel>전일 대비</ChangeLabel>
            <ChangeValue $isPositive={isIncreased} $isWarning={isWarning}>
              {isIncreased ? "+" : ""}
              {combatPowerChange.toLocaleString()}
            </ChangeValue>
          </>
        ) : (
          <ChangeLabel>변화 데이터 수집 중</ChangeLabel>
        )}

        {isWarning && (
          <WarningBadge>{unchangedDays}일 무변동</WarningBadge>
        )}
      </ChangeRow>
    </Card>
  );
};

export default InspectionCharacterCard;

const Card = styled.div<{
  $isActive: boolean;
  $isSelected: boolean;
  $chartColor: string;
}>`
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 16px;
  background: ${({ theme, $isSelected, $chartColor }) =>
    $isSelected ? `${$chartColor}08` : theme.app.bg.white};
  border: 2px solid
    ${({ theme, $isSelected, $chartColor }) =>
      $isSelected ? $chartColor : theme.app.border};
  border-radius: 8px;
  cursor: pointer;
  opacity: ${({ $isActive }) => ($isActive ? 1 : 0.6)};
  transition: border-color 0.2s, box-shadow 0.2s, background 0.2s;

  ${({ $isSelected, $chartColor }) =>
    $isSelected &&
    `box-shadow: 0 0 0 3px ${$chartColor}20, 0 2px 8px rgba(0, 0, 0, 0.06);`}

  &:hover {
    box-shadow: ${({ $isSelected, $chartColor }) =>
      $isSelected
        ? `0 0 0 3px ${$chartColor}20, 0 4px 12px rgba(0, 0, 0, 0.1)`
        : "0 2px 8px rgba(0, 0, 0, 0.08)"};
  }
`;

const CardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
`;

const CharacterInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const CharacterImage = styled.img`
  width: 48px;
  height: 48px;
  border-radius: 8px;
  object-fit: cover;
`;

const NameGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
`;

const CharacterName = styled.span`
  font-size: 16px;
  font-weight: 600;
  color: ${({ theme }) => theme.app.text.dark2};
`;

const ServerInfo = styled.span`
  font-size: 12px;
  color: ${({ theme }) => theme.app.text.light2};
`;

const Actions = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
`;

const StatsRow = styled.div`
  display: flex;
  gap: 16px;
`;

const StatItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
`;

const StatLabel = styled.span`
  font-size: 12px;
  color: ${({ theme }) => theme.app.text.light2};
`;

const StatValueRow = styled.div`
  display: flex;
  align-items: baseline;
  gap: 4px;
`;

const StatValue = styled.span`
  font-size: 18px;
  font-weight: 700;
  color: ${({ theme }) => theme.app.text.main};
`;

const StatChange = styled.span<{ $isPositive: boolean }>`
  font-size: 12px;
  font-weight: 600;
  color: ${({ $isPositive }) => ($isPositive ? "#16a34a" : "#dc2626")};
`;

const ChangeRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const ChangeLabel = styled.span`
  font-size: 13px;
  color: ${({ theme }) => theme.app.text.light2};
`;

const ChangeValue = styled.span<{
  $isPositive: boolean;
  $isWarning: boolean;
}>`
  font-size: 14px;
  font-weight: 600;
  color: ${({ theme, $isPositive, $isWarning }) => {
    if ($isWarning) return theme.app.text.red;
    if ($isPositive) return "#16a34a";
    return theme.app.text.main;
  }};
`;

const WarningBadge = styled.span`
  margin-left: auto;
  padding: 2px 8px;
  font-size: 12px;
  font-weight: 600;
  color: ${({ theme }) => theme.app.text.red};
  background: ${({ theme }) => theme.app.bg.gray1};
  border-radius: 4px;
`;

const StatusBadge = styled.span<{ $isActive: boolean }>`
  padding: 2px 8px;
  font-size: 11px;
  font-weight: 600;
  color: ${({ $isActive }) => ($isActive ? "#16a34a" : "#dc2626")};
  background: ${({ $isActive }) =>
    $isActive ? "rgba(22, 163, 74, 0.1)" : "rgba(220, 38, 38, 0.1)"};
  border-radius: 4px;
  white-space: nowrap;
`;
