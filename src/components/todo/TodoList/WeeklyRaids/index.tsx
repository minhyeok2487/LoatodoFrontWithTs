import dayjs from "dayjs";
import type { FC } from "react";
import { useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import styled from "styled-components";

import { useUpdateRaidTodoSort } from "@core/hooks/mutations/todo";
import { useSchedulesMonth } from "@core/hooks/queries/schedule";
import { updateCharacterQueryData } from "@core/lib/queryClient";
import type { Character, TodoRaid } from "@core/types/character";
import type { Friend } from "@core/types/friend";

import BoxTitle from "@components/BoxTitle";
import Button from "@components/Button";

import CharacterRaidProfit from "./CharacterRaidProfit";
import EditModal from "./EditModal";
import RaidItem from "./RaidItem";
import RaidSortWrap from "./RaidSortWrap";

export interface Props {
  character: Character;
  friend?: Friend;
}

const TodoWeekRaid: FC<Props> = ({ character, friend }) => {
  const [editModal, setEditModal] = useState(false);
  const [sortMode, setSortMode] = useState(false);
  const [sortedWeeklyRaidTodoList, setSortedWeeklyRaidTodoList] =
    useState<TodoRaid[]>();

  const updateRaidTodoSort = useUpdateRaidTodoSort({
    onSuccess: (character, { friendUsername }) => {
      updateCharacterQueryData({
        character,
        friendUsername,
      });

      toast.success("레이드 순서 업데이트가 완료되었습니다.");
      setSortMode(false);
    },
  });

  const today = useMemo(() => dayjs(), []);
  const startDate = useMemo(() => today.startOf("month"), [today]);

  const getSchedules = useSchedulesMonth({
    year: startDate.year(),
    month: startDate.month() + 1,
  });

  // 이번 주 수요일 ~ 다음 주 화요일 범위 계산
  const startOfWeek = today.day() >= 3 ? today.day(3) : today.day(-4);
  const endOfWeek = startOfWeek.add(6, "day");

  const filteredSchedules = useMemo(() => {
    if (!getSchedules.data) return [];

    return getSchedules.data.filter((schedule) => {
      if (schedule.scheduleRaidCategory !== "RAID") return false;
      if (schedule.repeatWeek) return true;
      if (!schedule.date) return false;

      const scheduleDate = dayjs(schedule.date);
      return (
        scheduleDate.isSameOrAfter(startOfWeek, "day") &&
        scheduleDate.isSameOrBefore(endOfWeek, "day")
      );
    });
  }, [getSchedules.data, startOfWeek, endOfWeek]);

  // character.todoList 순서대로 초기화
  useEffect(() => {
    setSortedWeeklyRaidTodoList([...character.todoList]);
  }, [sortMode]);

  const getRaidName = (todoName: string) => {
    const cleaned = todoName
      .replace(/<br\s*\/?>/gi, " ")
      .replace(/\s+/g, " ")
      .trim();

    const parts = cleaned.split(" ");
    const filtered = parts.filter((part) => !/^\d+$/.test(part));

    const difficultyKeywords = ["하드", "노말", "도전"];
    const result: string[] = [];

    filtered.some((part) => {
      result.push(part);
      return difficultyKeywords.includes(part);
    });

    return result.join(" ");
  };

  // 스케줄을 Map으로 캐싱
  const scheduleMap = useMemo(() => {
    const map = new Map<string, (typeof filteredSchedules)[number]>();

    filteredSchedules.forEach((schedule) => {
      const key = `${schedule.characterName}|${schedule.raidName}`;
      map.set(key, schedule);
    });

    return map;
  }, [filteredSchedules]);

  return (
    <>
      <Wrapper>
        <TitleBox>
          <TitleRow>
            <BoxTitle>주간 레이드</BoxTitle>
            <ButtonsBox>
              {sortMode ? (
                sortedWeeklyRaidTodoList && (
                  <Button
                    size="small"
                    onClick={() =>
                      updateRaidTodoSort.mutate({
                        friendUsername: friend?.friendUsername,
                        characterId: character.characterId,
                        sorted: sortedWeeklyRaidTodoList,
                      })
                    }
                  >
                    저장
                  </Button>
                )
              ) : (
                <Button
                  variant="outlined"
                  size="small"
                  onClick={() => setSortMode(true)}
                >
                  정렬
                </Button>
              )}
              <Button
                variant="outlined"
                size="small"
                onClick={() => setEditModal(true)}
              >
                편집
              </Button>
            </ButtonsBox>
          </TitleRow>

          {sortMode ? (
            <SubTitle>저장 버튼 클릭시 순서가 저장됩니다</SubTitle>
          ) : (
            <CharacterRaidProfit character={character} />
          )}
        </TitleBox>

        {sortMode
          ? sortedWeeklyRaidTodoList && (
              <RaidSortWrap
                character={character}
                friend={friend}
                todoList={sortedWeeklyRaidTodoList}
                setTodos={(newTodoList) =>
                  setSortedWeeklyRaidTodoList(newTodoList)
                }
              />
            )
          : character.todoList.map((todo) => {
              const raidName = getRaidName(todo.name);
              const key = `${character.characterName}|${raidName}`;
              const matchingSchedule = scheduleMap.get(key);

              return (
                <RaidItem
                  key={todo.id}
                  todo={todo}
                  character={character}
                  friend={friend}
                  schedule={matchingSchedule}
                />
              );
            })}
      </Wrapper>

      <EditModal
        onClose={() => setEditModal(false)}
        isOpen={editModal}
        character={character}
        friend={friend}
      />
    </>
  );
};

export default TodoWeekRaid;

export const Wrapper = styled.div`
  width: 100%;
  background: ${({ theme }) => theme.app.bg.white};
`;

const TitleBox = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
  padding: 5px 10px;
`;

const TitleRow = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  width: 100%;

  ${({ theme }) => theme.medias.max900} {
    flex-direction: column;
    align-items: flex-start;
    gap: 3px;
  }
`;

const ButtonsBox = styled.div`
  display: flex;
  flex-direction: row;
  gap: 5px;
`;

const SubTitle = styled.p`
  color: ${({ theme }) => theme.app.text.dark2};
  font-size: 12px;
`;
