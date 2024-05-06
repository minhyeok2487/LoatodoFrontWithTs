import { FC } from "react";
import { useFriends } from "../../../core/apis/Friend.api";
import { useCharacters } from "../../../core/apis/Character.api";
import {
  getCompletedDayTodos,
  getCompletedWeekTodos,
  getTotalDayTodos,
  getTotalWeekTodos,
} from "../../../core/func/todo.fun";

interface Props {
  title: string;
  type: string;
}

interface FriendGoldData {
  name: string;
  percent: number;
}

const MainFriends: FC<Props> = ({ title, type }) => {
  const { data: friendList, refetch: refetchFriends } = useFriends();
  const { data: characterList, refetch: refetchCharacters } = useCharacters();

  if (!friendList || !characterList) {
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

    friendList.forEach((friend) => {
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

    friendList.forEach((friend) => {
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

    friendList.forEach((friend) => {
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
    <div className="main-friends">
      <div className="header">
        <h2>{title}</h2>
      </div>
      {friendGoldData.map((data: FriendGoldData, index) => (
        <div className="content" key={index}>
          <div className="main-friends-rank flag">{index + 1}</div>
          <div className="main-friends-text">
            <span
              className="main-friends-name"
              style={
                data.name === "나"
                  ? { fontWeight: "bold", fontSize: "20px" }
                  : {}
              }
            >
              {data.name}
            </span>
            <span className="main-friends-gold">
              {data.percent.toFixed(1)} %
            </span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default MainFriends;
