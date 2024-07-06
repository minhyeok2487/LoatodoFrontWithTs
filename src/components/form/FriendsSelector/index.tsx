import styled from "@emotion/styled";
import type { Dispatch, SetStateAction } from "react";

import useFriends from "@core/hooks/queries/friend/useFriends";

interface Props {
  setSelectedId: Dispatch<SetStateAction<number[]>>;
  selectedId: number[];
}

const FriendsSelector = ({ setSelectedId, selectedId }: Props) => {
  const getFriends = useFriends({});

  if (!getFriends.data) {
    return null;
  }
  return (
    <Wrapper>
      <List />
      <List />
    </Wrapper>
  );
};

export default FriendsSelector;

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  width: 100%;
`;

const List = styled.ul`
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  gap: 10px;
`;

const Item = styled.li``;
