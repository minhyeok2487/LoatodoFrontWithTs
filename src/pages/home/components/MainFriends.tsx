import styled from "@emotion/styled";
import type { FC } from "react";

import { useCharacters } from "@core/apis/character.api";
import {
  getCompletedDayTodos,
  getCompletedWeekTodos,
  getTotalDayTodos,
  getTotalWeekTodos,
} from "@core/func/todo.fun";
import useFriends from "@core/hooks/queries/useFriends";

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
  const { getFriends } = useFriends();
  const { data: characterList } = useCharacters();

  if (!getFriends.data || !characterList) {
    return null;
  }

  const friendGoldData: FriendGoldData[] = [];

  if (type === "day") {
    const totalDay = getTotalDayTodos(characterList);
    const getDay = getCompletedDayTodos(characterList);

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
    const totalDay = getTotalWeekTodos(characterList);
    const getDay = getCompletedWeekTodos(characterList);

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
      getTotalDayTodos(characterList) + getTotalWeekTodos(characterList);
    const getDay =
      getCompletedDayTodos(characterList) +
      getCompletedWeekTodos(characterList);

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
    <BoxWrapper flex={1}>
      <BoxTitle>{title}</BoxTitle>

      <Wrapper>
        {friendGoldData.slice(0, 4).map((data: FriendGoldData, index) => (
          <Item key={index}>
            <NicknameBox rank={index + 1} isMine={data.name === "나"}>
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
    color: ${({ theme }) => theme.app.rank.text1};
  }

  &:nth-of-type(2) strong {
    color: ${({ theme }) => theme.app.rank.text2};
  }

  &:nth-of-type(3) strong {
    color: ${({ theme }) => theme.app.rank.text3};
  }
`;

const NicknameBox = styled.div<{ rank: number; isMine: boolean }>`
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
    font-weight: ${({ isMine }) => (isMine ? 700 : 400)};
  }
`;

const Process = styled.span`
  color: ${({ theme }) => theme.app.text.light1};
  font-size: 18px;
  font-weight: 600;
`;
