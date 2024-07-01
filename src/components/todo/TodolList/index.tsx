import styled from "@emotion/styled";
import { Grid } from "@mui/material";

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
      <Grid container spacing={1.5} overflow="hidden">
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
            <Item key={character.characterId} item>
              <CharacterInformation character={character} />

              {/* 일일 숙제 */}
              {/* 친구인 경우 친구의 설정, 아닌 경우 나의 설정으로 */}
              {accessibleDailyContents && showableDailyContents && (
                <Box>
                  <DailyContents character={character} friend={friend} />
                </Box>
              )}

              <Box
                isHidden={
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
      </Grid>
    </Wrapper>
  );
};

export default TodoList;

const Wrapper = styled.div`
  width: 100%;
`;

const Item = styled(Grid)`
  width: 212px;
  overflow: hidden;

  ${({ theme }) => theme.medias.max900} {
    width: 25%;
  }

  ${({ theme }) => theme.medias.max800} {
    width: 33.33%;
  }

  ${({ theme }) => theme.medias.max600} {
    width: 50%;
  }
`;

const Box = styled.div<{ isHidden?: boolean }>`
  display: ${({ isHidden }) => (isHidden ? "none" : "block")};
  border: 1px solid ${({ theme }) => theme.app.border};

  & + & {
    margin-top: 12px;
  }

  ${WeeklyRaidsWrapper} ~ ${WeeklyContentsWrapper} {
    border-top: 1px solid ${({ theme }) => theme.app.border};
  }
`;
