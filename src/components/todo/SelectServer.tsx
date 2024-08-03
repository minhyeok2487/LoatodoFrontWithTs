import { Menu, MenuItem } from "@mui/material";
import type { FC, MouseEvent } from "react";
import { useState } from "react";
import styled, { css } from "styled-components";

import type { Character } from "@core/types/character";
import type { ServerName } from "@core/types/lostark";

import Button from "@components/Button";

interface Props {
  characters: Character[];
  serverList: Map<ServerName, number>;
  server: ServerName;
  setServer: (newState: ServerName) => void;
}

const SelectServer: FC<Props> = ({
  characters,
  serverList,
  server,
  setServer,
}) => {
  const [targetButton, setTargetButton] = useState<null | Element>(null);

  if (characters === undefined || characters.length < 1) {
    return null;
  }

  const handleClick = (event: MouseEvent) => {
    setTargetButton(event.currentTarget);
  };

  const serverItems =
    serverList &&
    Array.from(serverList).map(([serverName, count]) => (
      <ServerItem
        key={serverName}
        value={serverName}
        onClick={() => {
          setServer(serverName);
          setTargetButton(null);
        }}
      >
        {serverName}: {count}개
      </ServerItem>
    ));

  return (
    <>
      <Button css={serverButtonCss} variant="outlined" onClick={handleClick}>
        {server} {serverList && serverList.get(server)}개
      </Button>
      <Menu
        anchorEl={targetButton}
        open={!!targetButton}
        onClose={() => setTargetButton(null)}
      >
        {serverItems}
      </Menu>
    </>
  );
};

export default SelectServer;

const serverButtonCss = css`
  padding: 8px 16px;
  background: ${({ theme }) => theme.app.bg.white};
  color: ${({ theme }) => theme.app.text.main};
  font-weight: 600;
  border-radius: 0;
`;

const ServerItem = styled(MenuItem)`
  font-weight: 500;
`;
