import { useEffect, useState } from "react";
import { useCharacters } from "../../../core/apis/Character.api";
import { useRecoilState } from "recoil";
import { serverState } from "../../../core/atoms/Todo.atom";
import { Button, Menu, MenuItem, Fade } from "@mui/material";
import { getDefaultServer, getServerList } from "../../../core/func/todo.fun";
import { useMember } from "../../../core/apis/Member.api";
import * as characterApi from "../../../core/apis/Character.api";

const TodoServerAndChallenge = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [serverList, setServerList] = useState<Map<string, number>>();
  const [server, setServer] = useRecoilState(serverState);
  const { data: characters, refetch: refetchCharacters } = useCharacters();
  const { data: member } = useMember();

  useEffect(() => {
    if (characters && member) {
      const list = getServerList(characters);
      setServerList(list);
      if (server === "") {
        setServer(getDefaultServer(characters, member));
      }
    }
  }, [characters, member, server]);

  if (characters === undefined || member === undefined) {
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
    const updateChallenge = async (serverName:String, content:string) => {
      try {
        await characterApi.updateChallenge(serverName, content);
        refetchCharacters();
      } catch (error) {
        console.error("Error updating updateChallenge:", error);
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
        className={`content-button ${
          characters.length > 0 && characters[0].challengeGuardian === true
            ? "done"
            : ""
        }`}
        onClick={() => updateChallenge(server, "Guardian")}
        style={{ cursor: "pointer" }}
      >
        도전 가디언 토벌
        <div
          className="content-button-text"
          onClick={() => updateChallenge(server, "Guardian")}
        >
        </div>
      </button>
      <button
        className={`content-button ${
          characters.length > 0 && characters[0].challengeAbyss === true
            ? "done"
            : ""
        }`}
        onClick={() => updateChallenge(server, "Abyss")}
        style={{ cursor: "pointer" }}
      >
        도전 어비스 던전
        <div
          className="content-button-text"
          onClick={() => updateChallenge(server, "Abyss")}
        >
        </div>
      </button>
    </div>
  );
};

export default TodoServerAndChallenge;
