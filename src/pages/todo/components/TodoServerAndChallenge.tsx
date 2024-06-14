import { Button, Fade, Menu, MenuItem } from "@mui/material";
import { FC, useState } from "react";
import { toast } from "react-toastify";

import { useCharacters } from "@core/apis/Character.api";
import * as characterApi from "@core/apis/Character.api";
import * as friendApi from "@core/apis/Friend.api";
import { useFriends } from "@core/apis/Friend.api";
import { CharacterType } from "@core/types/Character.type";
import { FriendType } from "@core/types/Friend.type";

interface Props {
  characters: CharacterType[];
  serverList: Map<string, number>;
  server: string;
  setServer: React.Dispatch<React.SetStateAction<string>>;
  friend?: FriendType;
}

const TodoServerAndChallenge: FC<Props> = ({
  characters,
  serverList,
  server,
  setServer,
  friend,
}) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const { refetch: refetchCharacters } = useCharacters();
  const { refetch: refetchFriends } = useFriends();

  if (characters === undefined || characters.length < 1) {
    return null;
  }

  const open = Boolean(anchorEl);

  const handleClick = (event: any) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleServerSelect = async (serverName: string) => {
    setServer(serverName);
    handleClose();
  };

  const serverItems =
    serverList &&
    Array.from(serverList).map(([serverName, count]) => (
      <MenuItem
        key={serverName}
        value={serverName}
        onClick={() => handleServerSelect(serverName)}
      >
        {serverName}: {count}개
      </MenuItem>
    ));

  // 도전 어비스/가디언 체크
  const updateChallenge = async (serverName: string, content: string) => {
    if (friend) {
      // try {
      //   await friendApi.updateChallenge(friend, serverName, content);
      //   refetchFriends();
      // } catch (error) {
      //   console.error("Error updating updateChallenge:", error);
      // }
      toast.warn("기능 준비중입니다.");
    } else {
      try {
        await characterApi.updateChallenge(serverName, content);
        refetchCharacters();
      } catch (error) {
        console.error("Error updating updateChallenge:", error);
      }
    }
  };

  return (
    <div className="setting-wrap">
      <div>
        <Button
          id="fade-button"
          aria-controls={open ? "fade-menu" : undefined}
          aria-haspopup="true"
          aria-expanded={open ? "true" : undefined}
          onClick={handleClick}
        >
          {server} {serverList && serverList.get(server)}개
        </Button>
        <Menu
          id="fade-menu"
          MenuListProps={{
            "aria-labelledby": "fade-button",
          }}
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
          TransitionComponent={Fade}
        >
          {serverItems}
        </Menu>
      </div>
      <button
        type="button"
        className={`content-button ${
          characters.length > 0 && characters[0].challengeGuardian === true
            ? "done"
            : ""
        }`}
        onClick={() => updateChallenge(server, "Guardian")}
        style={{ cursor: "pointer" }}
      >
        도전 가디언 토벌
      </button>
      <button
        type="button"
        className={`content-button ${
          characters.length > 0 && characters[0].challengeAbyss === true
            ? "done"
            : ""
        }`}
        onClick={() => updateChallenge(server, "Abyss")}
        style={{ cursor: "pointer" }}
      >
        도전 어비스 던전
      </button>
    </div>
  );
};

export default TodoServerAndChallenge;
