import { MdSearch } from "@react-icons/all-files/md/MdSearch";
import { useAtom } from "jotai";
import { useRef } from "react";
import { toast } from "react-toastify";
import styled, { css } from "styled-components";

import { showWideAtom } from "@core/atoms/todo.atom";
import useAddCharacter from "@core/hooks/mutations/character/useAddCharacter";
import useModalState from "@core/hooks/useModalState";
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
}

const TodoList = ({ characters, friend }: Props) => {
  const [showWide, setShowWide] = useAtom(showWideAtom);
  const [searchModal, setSearchModal] = useModalState<boolean>();
  const [searchTerm, setSearchTerm] = useModalState<string>();
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
    <Wrapper $showWide={showWide}>
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
      <Item>
        <AddCharacterWrapper onClick={() => setSearchModal(true)}>
          +
        </AddCharacterWrapper>
      </Item>
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
    </Wrapper>
  );
};

export default TodoList;

const MIN_WIDTH = 136;

const Wrapper = styled.div<{ $showWide: boolean }>`
  width: 100%;
  display: grid;
  grid-template-columns: repeat(
    ${({ $showWide }) => ($showWide ? 10 : 6)},
    minmax(${MIN_WIDTH}px, 1fr)
  );
  column-gap: 8px;
  row-gap: 20px;

  ${({ theme, $showWide }) => $showWide && theme.medias.max1640} {
    grid-template-columns: repeat(9, minmax(${MIN_WIDTH}px, 1fr));
  }

  ${({ theme, $showWide }) => $showWide && theme.medias.max1520} {
    grid-template-columns: repeat(8, minmax(${MIN_WIDTH}px, 1fr));
  }

  ${({ theme, $showWide }) => $showWide && theme.medias.max1400} {
    grid-template-columns: repeat(7, minmax(${MIN_WIDTH}px, 1fr));
  }

  ${({ theme, $showWide }) => $showWide && theme.medias.max1280} {
    grid-template-columns: repeat(6, minmax(${MIN_WIDTH}px, 1fr));
  }

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
