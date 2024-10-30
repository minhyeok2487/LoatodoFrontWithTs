import styled from "styled-components";

import { Character } from "@core/types/character";
import { Friend } from "@core/types/friend";

import CharacterInformation from "./CharacterInformation";
import DailyContents from "./DailyContents";
import WeeklyContents, {
  Wrapper as WeeklyContentsWrapper,
} from "./WeeklyContents";
import WeeklyRaids, { Wrapper as WeeklyRaidsWrapper } from "./WeeklyRaids";

interface Props {
  characters: Character[];
  friend?: Friend;
}

const TodoList = ({ characters, friend }: Props) => {
  return (
    <Wrapper>
      {characters.map((character) => {
        // 캐릭터별 설정
        const showableDailyContents =
          character.settings.showEpona ||
          character.settings.showChaos ||
          character.settings.showGuardian;
        const showableWeeklyRaids = character.settings.showWeekTodo;
        const showableWeeklyContents =
          character.settings.showWeekEpona ||
          character.settings.showSilmaelChange ||
          character.settings.showCubeTicket;

        // 깐부의 캐릭터라면 나에게 설정한 값도 체크해야 함
        const accessibleDailyContents = friend
          ? friend.fromFriendSettings.showDayTodo
          : true;
        const accessibleWeeklyRaids = friend
          ? friend.fromFriendSettings.showRaid
          : true;
        const accessibleWeeklyContents = friend
          ? friend.fromFriendSettings.showWeekTodo
          : true;

        return (
          <Item key={character.characterId}>
            <CharacterInformation character={character} friend={friend} />

            {/* 일일 숙제 */}
            {/* 친구인 경우 친구의 설정, 아닌 경우 나의 설정으로 */}
            {accessibleDailyContents && showableDailyContents && (
              <Box>
                <DailyContents character={character} friend={friend} />
              </Box>
            )}

            <Box
              $isHidden={
                (!accessibleWeeklyRaids || !showableWeeklyRaids) &&
                (!accessibleWeeklyContents || !showableWeeklyContents)
              }
            >
              {/* 주간 레이드 */}
              {accessibleWeeklyRaids && showableWeeklyRaids && (
                <WeeklyRaids character={character} friend={friend} />
              )}

              {/* 주간 숙제(주간 에포나, 실마엘 혈석 교환, 큐브) */}
              {accessibleWeeklyContents && showableWeeklyContents && (
                <WeeklyContents character={character} friend={friend} />
              )}
            </Box>
          </Item>
        );
      })}
    </Wrapper>
  );
};

export default TodoList;

const MIN_WIDTH = 136;

const Wrapper = styled.div`
  width: 100%;
  display: grid;
  grid-template-columns: repeat(6, minmax(${MIN_WIDTH}px, 1fr));
  column-gap: 8px;
  row-gap: 20px;

  ${({ theme }) => theme.medias.max1100} {
    grid-template-columns: repeat(5, minmax(${MIN_WIDTH}px, 1fr));
  }

  ${({ theme }) => theme.medias.max1000} {
    grid-template-columns: repeat(4, minmax(${MIN_WIDTH}px, 1fr));
  }

  ${({ theme }) => theme.medias.max800} {
    grid-template-columns: repeat(3, minmax(${MIN_WIDTH}px, 1fr));
  }

  ${({ theme }) => theme.medias.max600} {
    grid-template-columns: repeat(2, minmax(${MIN_WIDTH}px, 1fr));
  }
`;

const Item = styled.div`
  display: flex;
  flex-direction: column;
`;

const Box = styled.div<{ $isHidden?: boolean }>`
  display: ${({ $isHidden }) => ($isHidden ? "none" : "block")};
  border: 1px solid ${({ theme }) => theme.app.border};

  & + & {
    margin-top: 8px;
  }

  ${WeeklyRaidsWrapper} ~ ${WeeklyContentsWrapper} {
    border-top: 1px solid ${({ theme }) => theme.app.border};
  }
`;
