import dayjs from "dayjs";
import { useMemo } from "react";
import styled from "styled-components";

import type { ScheduleItem } from "@core/types/schedule";

interface Props {
  onClickScheduleItem?: (schedule: ScheduleItem) => void;
  data: ScheduleItem[];
}

const SortedScheduleList = ({ onClickScheduleItem, data }: Props) => {
  const sortedData = useMemo(() => {
    const result = [...data];

    result.sort((a, b) => {
      if (a.time < b.time) {
        return -1;
      }

      if (a.time > b.time) {
        return 1;
      }

      return 0;
    });

    return result;
  }, [data]);

  return (
    <>
      {sortedData.map((item) => {
        return (
          <Item key={item.scheduleId}>
            <Wrapper
              onClick={
                onClickScheduleItem
                  ? () => {
                      onClickScheduleItem(item);
                    }
                  : undefined
              }
              $isAlone={item.scheduleCategory === "ALONE"}
              $isRaid={item.scheduleRaidCategory === "RAID"}
              $raidName={item.raidName}
            >
              <div className="inner-wrapper">
                <span className="schedule-category">
                  {item.scheduleCategory === "ALONE" ? "나" : "깐부"}
                </span>

                <div className="description-box">
                  <span className="time">
                    {dayjs(dayjs().format(`YYYY-MM-DD ${item.time}`)).format(
                      "A hh:mm"
                    )}
                  </span>

                  <span className="raid-name">{item.raidName}</span>

                  <ul>
                    <li>{item.leaderCharacterName}</li>
                    {item.friendCharacterNames.map((name) => (
                      <li key={name}>{name}</li>
                    ))}
                    {item.memo && <li className="memo">메모 : {item.memo}</li>}
                  </ul>
                </div>
              </div>
            </Wrapper>
          </Item>
        );
      })}
    </>
  );
};

export default SortedScheduleList;

const Wrapper = styled.button<{
  onClick?: () => void;
  $isAlone: boolean;
  $isRaid: boolean;
  $raidName: string;
}>`
  width: 100%;
  padding: 10px 10px 0 10px;
  cursor: ${({ onClick }) => (onClick ? "cursor" : "default")};

  .inner-wrapper {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    padding-bottom: 10px;
    width: 100%;

    .schedule-category {
      margin-bottom: 6px;
      width: 100%;
      background: ${({ $isAlone, theme }) =>
        $isAlone ? theme.app.pink2 : theme.app.sky1};
      line-height: 27px;
      color: ${({ theme }) => theme.app.black};
      text-align: center;
      font-size: 14px;
      border-radius: 6px;
    }

    .description-box {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      padding: 0 4px;
      width: 100%;
      text-align: left;

      .time {
        font-size: 14px;
        font-weight: 600;
        color: ${({ theme }) => theme.app.text.black};
      }

      .raid-name {
        font-size: 16px;
        color: ${({ $raidName, $isRaid, theme }) => {
          if ($isRaid) {
            return $raidName.endsWith("하드")
              ? theme.app.text.red
              : theme.app.text.blue;
          }

          return theme.app.text.black;
        }};
      }

      ul {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        width: 100%;

        li {
          position: relative;
          display: flex;
          flex-direction: row;
          align-items: center;
          padding-left: 5px;
          width: 100%;
          color: ${({ theme }) => theme.app.text.light1};
          font-size: 13px;
          line-height: 20px;

          &:before {
            content: "";
            position: absolute;
            left: 0;
            top: 9px;
            background: currentcolor;
            width: 2px;
            height: 2px;
            border-radius: 3px;
          }

          &.memo {
            display: block;
            color: ${({ theme }) => theme.app.text.light2};
            white-space: nowrap;
            text-overflow: ellipsis;
            overflow: hidden;
          }
        }
      }
    }
  }
`;

const Item = styled.li`
  width: 100%;

  &:not(:last-of-type) {
    .inner-wrapper {
      border-bottom: 1px dashed ${({ theme }) => theme.app.border};
    }
  }
`;
