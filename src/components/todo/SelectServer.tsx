import styled from "@emotion/styled";
import { Button, Menu, MenuItem } from "@mui/material";
import type { FC, MouseEvent } from "react";
import { useState } from "react";

import type { Character } from "@core/types/character";
import type { ServerName } from "@core/types/lostark";

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
      <ServerButton type="button" onClick={handleClick}>
        {server} {serverList && serverList.get(server)}개
      </ServerButton>
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

const ServerButton = styled(Button)`
  padding: 8px 16px;
  background: ${({ theme }) => theme.app.bg.light};
  color: ${({ theme }) => theme.app.text.main};
  border: 1px solid ${({ theme }) => theme.app.border};
  font-size: 14px;
  font-weight: 600;

  &:hover {
    background: ${({ theme }) => theme.app.bg.light};
  }
`;

const ServerItem = styled(MenuItem)`
  font-weight: 500;
`;
