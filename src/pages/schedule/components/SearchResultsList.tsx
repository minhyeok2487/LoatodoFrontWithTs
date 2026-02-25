import dayjs from "dayjs";
import { useMemo } from "react";
import styled from "styled-components";

import type { ScheduleCategory, ScheduleItem } from "@core/types/schedule";

import { weekdayOptions } from "../constants";

interface Props {
  data: ScheduleItem[];
  filter: ScheduleCategory | "ALL";
  onClickItem: (schedule: ScheduleItem) => void;
}

const WEEKDAY_ORDER = [
  "MONDAY",
  "TUESDAY",
  "WEDNESDAY",
  "THURSDAY",
  "FRIDAY",
  "SATURDAY",
  "SUNDAY",
] as const;

const getWeekdayLabel = (dayOfWeek: string) => {
  return weekdayOptions.find((opt) => opt.value === dayOfWeek)?.label ?? "";
};

const SearchResultsList = ({ data, filter, onClickItem }: Props) => {
  const filtered = useMemo(() => {
    if (filter === "ALL") return data;
    return data.filter((item) => item.scheduleCategory === filter);
  }, [data, filter]);

  const { repeatItems, oneTimeItems } = useMemo(() => {
    const repeat: ScheduleItem[] = [];
    const oneTime: ScheduleItem[] = [];

    filtered.forEach((item) => {
      if (item.repeatWeek) {
        repeat.push(item);
      } else {
        oneTime.push(item);
      }
    });

    // 반복: 요일순 → 시간순
    repeat.sort((a, b) => {
      const dayA = WEEKDAY_ORDER.indexOf(a.dayOfWeek as (typeof WEEKDAY_ORDER)[number]);
      const dayB = WEEKDAY_ORDER.indexOf(b.dayOfWeek as (typeof WEEKDAY_ORDER)[number]);
      if (dayA !== dayB) return dayA - dayB;
      return a.time.localeCompare(b.time);
    });

    // 단일: 날짜순 → 시간순
    oneTime.sort((a, b) => {
      const dateCompare = (a.date ?? "").localeCompare(b.date ?? "");
      if (dateCompare !== 0) return dateCompare;
      return a.time.localeCompare(b.time);
    });

    return { repeatItems: repeat, oneTimeItems: oneTime };
  }, [filtered]);

  if (filtered.length === 0) {
    return (
      <EmptyResult>
        <p>검색 결과가 없습니다</p>
      </EmptyResult>
    );
  }

  return (
    <Container>
      <ResultCount>검색 결과 {filtered.length}건</ResultCount>

      {repeatItems.length > 0 && (
        <Section>
          <SectionTitle>반복 일정</SectionTitle>
          {repeatItems.map((item) => (
            <ResultItem
              key={item.scheduleId}
              onClick={() => onClickItem(item)}
            >
              <DateBadge>{getWeekdayLabel(item.dayOfWeek)}요일</DateBadge>
              <ItemContent>
                <TopRow>
                  <CategoryBadge $isAlone={item.scheduleCategory === "ALONE"}>
                    {item.scheduleCategory === "ALONE" ? "나" : "깐부"}
                  </CategoryBadge>
                  <RaidName
                    $raidName={item.raidName}
                    $isRaid={item.scheduleRaidCategory === "RAID"}
                  >
                    {item.raidName}
                  </RaidName>
                  <Time>
                    {dayjs(`2000-01-01 ${item.time}`).format("A hh:mm")}
                  </Time>
                </TopRow>
                <BottomRow>
                  <span>{item.leaderCharacterName}</span>
                  {item.friendCharacterNames.map((name) => (
                    <span key={name}>{name}</span>
                  ))}
                  {item.memo && <Memo>{item.memo}</Memo>}
                </BottomRow>
              </ItemContent>
            </ResultItem>
          ))}
        </Section>
      )}

      {oneTimeItems.length > 0 && (
        <Section>
          <SectionTitle>단일 일정</SectionTitle>
          {oneTimeItems.map((item) => (
            <ResultItem
              key={item.scheduleId}
              onClick={() => onClickItem(item)}
            >
              <DateBadge>
                {item.date ? dayjs(item.date).format("MM/DD") : "-"}
              </DateBadge>
              <ItemContent>
                <TopRow>
                  <CategoryBadge $isAlone={item.scheduleCategory === "ALONE"}>
                    {item.scheduleCategory === "ALONE" ? "나" : "깐부"}
                  </CategoryBadge>
                  <RaidName
                    $raidName={item.raidName}
                    $isRaid={item.scheduleRaidCategory === "RAID"}
                  >
                    {item.raidName}
                  </RaidName>
                  <Time>
                    {dayjs(`2000-01-01 ${item.time}`).format("A hh:mm")}
                  </Time>
                </TopRow>
                <BottomRow>
                  <span>{item.leaderCharacterName}</span>
                  {item.friendCharacterNames.map((name) => (
                    <span key={name}>{name}</span>
                  ))}
                  {item.memo && <Memo>{item.memo}</Memo>}
                </BottomRow>
              </ItemContent>
            </ResultItem>
          ))}
        </Section>
      )}
    </Container>
  );
};

export default SearchResultsList;

const Container = styled.div`
  width: 100%;
  margin-top: 16px;
`;

const ResultCount = styled.p`
  font-size: 14px;
  color: ${({ theme }) => theme.app.text.light2};
  margin-bottom: 12px;
`;

const EmptyResult = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 48px 0;
  width: 100%;

  p {
    font-size: 16px;
    color: ${({ theme }) => theme.app.text.light2};
  }
`;

const Section = styled.div`
  & + & {
    margin-top: 20px;
  }
`;

const SectionTitle = styled.h3`
  font-size: 13px;
  font-weight: 600;
  color: ${({ theme }) => theme.app.text.light2};
  padding-bottom: 8px;
  border-bottom: 1px solid ${({ theme }) => theme.app.border};
  margin-bottom: 4px;
`;

const ResultItem = styled.button`
  display: flex;
  align-items: flex-start;
  gap: 12px;
  width: 100%;
  padding: 10px 8px;
  cursor: pointer;
  border: none;
  background: none;
  text-align: left;

  &:not(:last-child) {
    border-bottom: 1px dashed ${({ theme }) => theme.app.border};
  }

  &:hover {
    background: ${({ theme }) => theme.app.bg.gray1};
    border-radius: 8px;
  }
`;

const DateBadge = styled.div`
  flex-shrink: 0;
  min-width: 48px;
  padding: 4px 8px;
  border-radius: 6px;
  background: ${({ theme }) => theme.app.bg.gray1};
  color: ${({ theme }) => theme.app.text.light1};
  font-size: 13px;
  font-weight: 600;
  text-align: center;
`;

const ItemContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  flex: 1;
  min-width: 0;
`;

const TopRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const CategoryBadge = styled.span<{ $isAlone: boolean }>`
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 600;
  color: ${({ theme }) => theme.app.palette.gray[1000]};
  background: ${({ $isAlone, theme }) =>
    $isAlone ? theme.app.palette.red[0] : theme.app.palette.blue[0]};
`;

const RaidName = styled.span<{ $raidName: string; $isRaid: boolean }>`
  font-size: 15px;
  font-weight: 600;
  color: ${({ $raidName, $isRaid, theme }) => {
    if ($isRaid) {
      if ($raidName.endsWith("하드")) return theme.app.text.red;
      if ($raidName.endsWith("노말")) return theme.app.text.blue;
      if ($raidName.endsWith("나이트메어")) return theme.app.text.purple;
    }
    return theme.app.text.black;
  }};
`;

const Time = styled.span`
  font-size: 13px;
  color: ${({ theme }) => theme.app.text.light1};
  margin-left: auto;
`;

const BottomRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 4px 8px;
  font-size: 13px;
  color: ${({ theme }) => theme.app.text.light1};

  span {
    &::before {
      content: "· ";
    }

    &:first-child::before {
      content: "";
    }
  }
`;

const Memo = styled.span`
  color: ${({ theme }) => theme.app.text.light2};
  font-style: italic;

  &::before {
    content: "· " !important;
  }
`;
