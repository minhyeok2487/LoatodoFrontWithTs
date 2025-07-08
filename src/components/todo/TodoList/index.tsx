import { MdSearch } from "@react-icons/all-files/md/MdSearch";
import { useAtomValue } from "jotai";
import { useRef } from "react";
import { toast } from "react-toastify";
import styled, { css } from "styled-components";

import { showWideAtom } from "@core/atoms/todo.atom";
import useAddCharacter from "@core/hooks/mutations/character/useAddCharacter";
import useModalState from "@core/hooks/useModalState";
import { type GridConfig } from "@core/hooks/usePersistedGridConfig";
import queryClient from "@core/lib/queryClient";
import type { Character } from "@core/types/character";
import type { Friend } from "@core/types/friend";
import queryKeyGenerator from "@core/utils/queryKeyGenerator";

import Button from "@components/Button";
import Modal from "@components/Modal";

import CharacterInformation from "./CharacterInformation";
import DailyContents from "./DailyContents";
import WeeklyContents, {
  Wrapper as WeeklyContentsWrapper,
} from "./WeeklyContents";
import WeeklyRaids, { Wrapper as WeeklyRaidsWrapper } from "./WeeklyRaids";

interface Props {
  characters: Character[];
  friend?: Friend;
  gridConfig: GridConfig;
}

const TodoList = ({ characters, friend, gridConfig }: Props) => {
  const showWide = useAtomValue(showWideAtom);
  const [searchModal, setSearchModal] = useModalState<boolean>();
  const [, setSearchTerm] = useModalState<string>();

  const searchInputRef = useRef<HTMLInputElement>(null);

  const searchCharacter = () => {
    const searchName = searchInputRef.current?.value || "";

    if (searchName === "") {
      toast("캐릭터명을 입력해주세요.");
    } else {
      addCharacterMutation.mutate(searchName);
      if (searchInputRef.current) {
        searchInputRef.current.value = "";
      }
      setSearchModal(false);
      setSearchTerm(searchName);
    }
  };

  const addCharacterMutation = useAddCharacter({
    onSuccess: () => {
      toast.success(`캐릭터가 추가되었습니다.`);
      queryClient.invalidateQueries({
        queryKey: queryKeyGenerator.getCharacters(),
      });
    },
  });

  return (
    <>
      <Wrapper $showWide={showWide} $gridConfig={gridConfig}>
        {characters.map((character) => {
          // 캐릭터별 설정
          const showableDailyContents =
            character.settings.showChaos || character.settings.showGuardian;
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
        <Item>
          <AddCharacterWrapper onClick={() => setSearchModal(true)}>
            +
          </AddCharacterWrapper>
        </Item>
      </Wrapper>

      {/* 캐릭터 추가 모달 */}
      <Modal
        title="추가할 캐릭터 입력"
        isOpen={!!searchModal}
        onClose={() => setSearchModal(false)}
      >
        <SearchUserWrapper
          onSubmit={(e) => {
            e.preventDefault();
            searchCharacter();
          }}
        >
          <Input type="text" placeholder="캐릭터 검색" ref={searchInputRef} />
          <Button css={searchButtonCss} variant="icon" type="submit">
            <MdSearch size="24" />
          </Button>
        </SearchUserWrapper>
      </Modal>
    </>
  );
};

export default TodoList;

const Wrapper = styled.div<{
  $showWide: boolean;
  $gridConfig: GridConfig;
}>`
  width: 100%;
  display: grid;
  grid-template-columns: repeat(
    ${({ $showWide, $gridConfig }) =>
      $showWide ? $gridConfig.wideColumns : $gridConfig.normalColumns},
    1fr
  );
  column-gap: 8px;
  row-gap: 20px;

  /* 와이드 모드 반응형 - 점진적으로 컬럼 수 감소 */
  ${({ theme, $showWide, $gridConfig }) => $showWide && theme.medias.max1880} {
    grid-template-columns: repeat(
      ${({ $gridConfig }) => Math.max(2, $gridConfig.wideColumns - 1)},
      1fr
    );
  }

  ${({ theme, $showWide, $gridConfig }) => $showWide && theme.medias.max1700} {
    grid-template-columns: repeat(
      ${({ $gridConfig }) => Math.max(2, $gridConfig.wideColumns - 2)},
      1fr
    );
  }

  ${({ theme, $showWide, $gridConfig }) => $showWide && theme.medias.max1520} {
    grid-template-columns: repeat(
      ${({ $gridConfig }) => Math.max(2, $gridConfig.wideColumns - 3)},
      1fr
    );
  }

  ${({ theme, $showWide, $gridConfig }) => $showWide && theme.medias.max1400} {
    grid-template-columns: repeat(
      ${({ $gridConfig }) => Math.max(2, $gridConfig.normalColumns)},
      1fr
    );
  }

  /* 일반 모드 반응형 - 점진적으로 컬럼 수 감소 */
  @media (max-width: 1279px) {
    grid-template-columns: repeat(
      ${({ $gridConfig }) => Math.max(2, $gridConfig.normalColumns - 1)},
      1fr
    );
  }

  ${({ theme, $gridConfig }) => theme.medias.max1100} {
    grid-template-columns: repeat(
      ${({ $gridConfig }) =>
        Math.max(2, Math.min(4, $gridConfig.normalColumns))},
      1fr
    );
  }

  ${({ theme, $gridConfig }) => theme.medias.max1000} {
    grid-template-columns: repeat(
      ${({ $gridConfig }) =>
        Math.max(2, Math.min(3, $gridConfig.normalColumns))},
      1fr
    );
  }

  ${({ theme, $gridConfig }) => theme.medias.max800} {
    grid-template-columns: repeat(
      ${({ $gridConfig }) =>
        Math.max(2, Math.min(2, $gridConfig.normalColumns))},
      1fr
    );
  }

  /* 모바일에서는 항상 2컬럼 보장 */
  ${({ theme }) => theme.medias.max600} {
    grid-template-columns: repeat(2, 1fr);
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

export const AddCharacterWrapper = styled.div`
  width: 100%;
  height: 240px;
  display: flex;
  justify-content: center;
  align-items: center;
  border: 1px solid ${({ theme }) => theme.app.border};
  border-radius: 8px;

  font-size: 48px;
  color: ${({ theme }) => theme.app.text.main};
  font-weight: bold;
  cursor: pointer;
  user-select: none;

  & + & {
    margin-top: 8px;
  }

  &:hover {
    background: ${({ theme }) => theme.app.bg.gray1};
    transition: background 0.3s ease;
  }
`;

const SearchUserWrapper = styled.form`
  display: flex;
  flex-direction: row;
  align-items: center;
  width: 100%;
  border-radius: 10px;
  overflow: hidden;
  border: 1px solid ${({ theme }) => theme.app.border};
`;

const Input = styled.input`
  flex: 1;
  align-self: stretch;
  padding: 0 16px;
  font-size: 16px;
  width: 100%;
  background: ${({ theme }) => theme.app.bg.white};
  line-height: 1;
`;

const searchButtonCss = css`
  border-radius: 10px;
  padding: 10px 20px;
`;
