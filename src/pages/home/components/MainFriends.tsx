import type { FC } from "react";
import styled from "styled-components";

import useCharacters from "@core/hooks/queries/character/useCharacters";
import useFriends from "@core/hooks/queries/friend/useFriends";
import {
  getCompletedDayTodos,
  getCompletedWeekTodos,
  getTotalDayTodos,
  getTotalWeekTodos,
} from "@core/utils/todo.util";

import BoxTitle from "./BoxTitle";
import BoxWrapper from "./BoxWrapper";

interface Props {
  title: string;
  type: string;
}

interface FriendGoldData {
  name: string;
  percent: number;
}

const MainFriends: FC<Props> = ({ title, type }) => {
  const getFriends = useFriends();
  const getCharacters = useCharacters();

  if (!getFriends.data || !getCharacters.data) {
    return null;
  }

  const friendGoldData: FriendGoldData[] = [];

  if (type === "day") {
    const totalDay = getTotalDayTodos(getCharacters.data);
    const getDay = getCompletedDayTodos(getCharacters.data);

    friendGoldData.push({
      name: "나",
      percent: (getDay / totalDay) * 100,
    });

    getFriends.data.forEach((friend) => {
      if (friend.characterList) {
        const totalDay = getTotalDayTodos(friend.characterList);
        const getDay = getCompletedDayTodos(friend.characterList);
        friendGoldData.push({
          name: friend.nickName,
          percent: (getDay / totalDay) * 100,
        });
      }
    });
  }

  if (type === "raid") {
    const totalDay = getTotalWeekTodos(getCharacters.data);
    const getDay = getCompletedWeekTodos(getCharacters.data);

    friendGoldData.push({
      name: "나",
      percent: (getDay / totalDay) * 100,
    });

    getFriends.data.forEach((friend) => {
      if (friend.characterList) {
        const totalDay = getTotalWeekTodos(friend.characterList);
        const getDay = getCompletedWeekTodos(friend.characterList);
        friendGoldData.push({
          name: friend.nickName,
          percent: (getDay / totalDay) * 100,
        });
      }
    });
  }

  if (type === "total") {
    const totalDay =
      getTotalDayTodos(getCharacters.data) +
      getTotalWeekTodos(getCharacters.data);
    const getDay =
      getCompletedDayTodos(getCharacters.data) +
      getCompletedWeekTodos(getCharacters.data);

    friendGoldData.push({
      name: "나",
      percent: (getDay / totalDay) * 100,
    });

    getFriends.data.forEach((friend) => {
      if (friend.characterList) {
        const totalDay =
          getTotalWeekTodos(friend.characterList) +
          getTotalWeekTodos(friend.characterList);
        const getDay =
          getCompletedWeekTodos(friend.characterList) +
          getCompletedWeekTodos(friend.characterList);
        friendGoldData.push({
          name: friend.nickName,
          percent: (getDay / totalDay) * 100,
        });
      }
    });
  }

  // 퍼센트 순으로 정렬
  friendGoldData.sort((a, b) => b.percent - a.percent);

  return (
    <BoxWrapper $flex={1}>
      <BoxTitle>{title}</BoxTitle>

      <Wrapper>
        {friendGoldData.slice(0, 4).map((data: FriendGoldData, index) => (
          <Item key={index}>
            <NicknameBox $isMine={data.name === "나"}>
              <strong>{index + 1}</strong>
              <span>{data.name}</span>
            </NicknameBox>
            <Process>{data.percent.toFixed(1)} %</Process>
          </Item>
        ))}
      </Wrapper>
    </BoxWrapper>
  );
};

export default MainFriends;

const Wrapper = styled.ul`
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-top: 16px;
`;

const Item = styled.li`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 5px 16px;
  border: 1px solid ${({ theme }) => theme.app.border};
  border-radius: 10px;

  &:nth-of-type(1) strong {
    color: ${({ theme }) => theme.app.palette.smokeRed[300]};
  }

  &:nth-of-type(2) strong {
    color: ${({ theme }) => theme.app.palette.gold[200]};
  }

  &:nth-of-type(3) strong {
    color: ${({ theme }) => theme.app.palette.green[350]};
  }
`;

const NicknameBox = styled.div<{ $isMine: boolean }>`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 16px;
  color: ${({ theme }) => theme.app.text.dark2};

  strong {
    display: inline-block;
    width: 30px;
    font-size: 22px;
    font-weight: 600;
    text-align: center;
  }

  span {
    font-weight: ${({ $isMine }) => ($isMine ? 700 : 400)};
  }
`;

const Process = styled.span`
  color: ${({ theme }) => theme.app.text.light1};
  font-size: 18px;
  font-weight: 600;
`;
