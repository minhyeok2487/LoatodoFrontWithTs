import * as React from "react";
import "../../styles/pages/FriendsIndex.css";
import DefaultLayout from "../../layouts/DefaultLayout";
import { useFriends } from "../../core/apis/Friend.api";
import MainRaids from "../home/components/MainRaids";
import FriendAddBtn from "./components/FriendAddBtn";
import { Button } from "@mui/material";

const FriendsIndex = () => {
  const { data: friends } = useFriends();

  if (friends === undefined) {
    return null;
  }

  return (
    <DefaultLayout>
      <div className="friends-wrap">
        <div className="friends-button-group">
          <FriendAddBtn />
        </div>
        {friends.map((friend) => (
          <div className="home-content" key={friend.friendId}>
            {friend.areWeFriend == "깐부" && (
              <MainRaids
                characters={friend.characterList}
                friend={friend}
              />
            )}
            {friend.areWeFriend != "깐부" && (
              <div className="main-raids">
                <div className="main-raids-header">
                  <h2>[{friend.nickName}] 깐부 현황</h2>
                  {friend.areWeFriend === "깐부 요청 받음" && (
                    <div>
                      <Button
                        variant="outlined"
                        // onClick={() =>
                        //   handleRequest("ok", friend.friendUsername)
                        // }
                      >
                        수락
                      </Button>
                      <Button
                        variant="outlined"
                        color="error"
                        // onClick={() =>
                        //   handleRequest("reject", friend.friendUsername)
                        // }
                      >
                        거절
                      </Button>
                    </div>
                  )}
                  {friend.areWeFriend !== "깐부 요청 받음" && (
                    <div>
                      상태 : {friend.areWeFriend}
                      <Button
                        variant="outlined"
                        color="error"
                        style={{ marginLeft: 10 }}
                        // onClick={() =>
                        //   handleRequest("delete", friend.friendUsername)
                        // }
                      >
                        깐부 삭제
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </DefaultLayout>
  );
};

export default FriendsIndex;
