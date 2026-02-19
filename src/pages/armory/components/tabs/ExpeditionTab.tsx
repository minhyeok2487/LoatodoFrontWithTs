import type { FC } from "react";
import styled from "styled-components";

import type { SiblingCharacter } from "@core/types/armory";

interface Props {
  siblings: SiblingCharacter[] | null;
  isLoading: boolean;
  currentCharacter: string;
  onCharacterClick: (name: string) => void;
}

const ExpeditionTab: FC<Props> = ({
  siblings,
  isLoading,
  currentCharacter,
  onCharacterClick,
}) => {
  if (isLoading) {
    return <EmptyMessage>원정대 정보를 불러오는 중...</EmptyMessage>;
  }

  if (!siblings || siblings.length === 0) {
    return <EmptyMessage>원정대 정보가 없습니다.</EmptyMessage>;
  }

  // 서버별 그룹핑
  const byServer = siblings.reduce<Record<string, SiblingCharacter[]>>(
    (acc, char) => {
      if (!acc[char.ServerName]) {
        acc[char.ServerName] = [];
      }
      acc[char.ServerName].push(char);
      return acc;
    },
    {}
  );

  // 각 서버 내 아이템 레벨 내림차순 정렬
  Object.keys(byServer).forEach((server) => {
    byServer[server].sort(
      (a, b) =>
        parseFloat(b.ItemAvgLevel.replace(/,/g, "")) -
        parseFloat(a.ItemAvgLevel.replace(/,/g, ""))
    );
  });

  return (
    <Wrapper>
      {Object.entries(byServer).map(([server, chars]) => (
        <ServerGroup key={server}>
          <ServerHeader>
            <ServerName>{server}</ServerName>
            <ServerCount>{chars.length}캐릭터</ServerCount>
          </ServerHeader>
          <CharacterGrid>
            {chars.map((char, i) => {
              const isCurrent = char.CharacterName === currentCharacter;
              return (
                <CharacterCard
                  key={i}
                  $isCurrent={isCurrent}
                  onClick={() => {
                    if (!isCurrent) {
                      onCharacterClick(char.CharacterName);
                    }
                  }}
                >
                  <CharName $isCurrent={isCurrent}>
                    {char.CharacterName}
                  </CharName>
                  <CharClass>{char.CharacterClassName}</CharClass>
                  <CharLevelRow>
                    <ItemLevel>Lv. {char.ItemAvgLevel}</ItemLevel>
                    <CharLevel>전투 Lv.{char.CharacterLevel}</CharLevel>
                  </CharLevelRow>
                </CharacterCard>
              );
            })}
          </CharacterGrid>
        </ServerGroup>
      ))}
    </Wrapper>
  );
};

export default ExpeditionTab;

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const EmptyMessage = styled.div`
  padding: 40px;
  text-align: center;
  color: ${({ theme }) => theme.app.text.light2};
  font-size: 14px;
`;

const ServerGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const ServerHeader = styled.div`
  display: flex;
  align-items: baseline;
  gap: 8px;
`;

const ServerName = styled.h3`
  font-size: 14px;
  font-weight: 700;
  color: ${({ theme }) => theme.app.text.dark1};
  margin: 0;
`;

const ServerCount = styled.span`
  font-size: 12px;
  color: ${({ theme }) => theme.app.text.light2};
`;

const CharacterGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 8px;

  ${({ theme }) => theme.medias.max768} {
    grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
  }
`;

const CharacterCard = styled.div<{ $isCurrent: boolean }>`
  display: flex;
  flex-direction: column;
  gap: 3px;
  padding: 10px 14px;
  border-radius: 8px;
  background: ${({ theme }) => theme.app.bg.white};
  border: 2px solid
    ${({ theme, $isCurrent }) =>
      $isCurrent ? theme.app.text.dark1 : theme.app.border};
  cursor: ${({ $isCurrent }) => ($isCurrent ? "default" : "pointer")};
  transition: border-color 0.15s;

  &:hover {
    border-color: ${({ theme }) => theme.app.text.dark2};
  }
`;

const CharName = styled.span<{ $isCurrent: boolean }>`
  font-size: 13px;
  font-weight: ${({ $isCurrent }) => ($isCurrent ? 700 : 600)};
  color: ${({ theme }) => theme.app.text.dark1};
`;

const CharClass = styled.span`
  font-size: 11px;
  color: ${({ theme }) => theme.app.text.light2};
`;

const CharLevelRow = styled.div`
  display: flex;
  gap: 8px;
  align-items: center;
`;

const ItemLevel = styled.span`
  font-size: 13px;
  font-weight: 600;
  color: ${({ theme }) => theme.app.text.dark1};
`;

const CharLevel = styled.span`
  font-size: 11px;
  color: ${({ theme }) => theme.app.text.light2};
`;
