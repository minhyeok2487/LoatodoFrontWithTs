import styled from "@emotion/styled";
import { MdClose } from "@react-icons/all-files/md/MdClose";
import { useMemo } from "react";
import type { Dispatch, SetStateAction } from "react";

import useFriends from "@core/hooks/queries/friend/useFriends";

import Divider, * as DeviderStyledComponents from "@components/form/Divider";

interface Props {
  setSelectedId: Dispatch<SetStateAction<number[]>>;
  selectedId: number[];
}

const FriendsSelector = ({ setSelectedId, selectedId }: Props) => {
  const getFriends = useFriends({});
  const friends = useMemo(() => {
    if (getFriends.data) {
      return getFriends.data.filter((item) => item.areWeFriend === "깐부");
    }

    return [];
  }, [getFriends.data, selectedId]);

  const selectedFriends = useMemo(() => {
    return friends.filter((item) => selectedId.includes(item.friendId));
  }, [friends]);

  const selectableFriends = useMemo(() => {
    return friends.filter((item) => !selectedId.includes(item.friendId));
  }, [friends]);

  return (
    <Wrapper>
      <Divider>추가된 깐부</Divider>
      {selectedFriends.length > 0 ? (
        <List>
          {selectedFriends.map((item) => (
            <Item key={item.friendId}>
              <button
                type="button"
                onClick={() => {
                  setSelectedId(
                    selectedId.filter(
                      (selectedId) => selectedId !== item.friendId
                    )
                  );
                }}
              >
                <span>{item.nickName}</span>
                <Icon>
                  <MdClose />
                </Icon>
              </button>
            </Item>
          ))}
        </List>
      ) : (
        <Message>깐부를 추가해주세요.</Message>
      )}

      <Divider>깐부 추가하기</Divider>
      {selectableFriends.length > 0 ? (
        <List>
          {selectableFriends.map((item) => (
            <Item key={item.friendId}>
              <button
                type="button"
                onClick={() => {
                  setSelectedId(selectedId.concat(item.friendId));
                }}
              >
                <span>{item.nickName}</span>
                <Icon $rotate>
                  <MdClose />
                </Icon>
              </button>
            </Item>
          ))}
        </List>
      ) : (
        <Message>추가할 깐부가 없습니다.</Message>
      )}
    </Wrapper>
  );
};

export default FriendsSelector;

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  width: 100%;

  ${DeviderStyledComponents.Wrapper} {
    padding: 0 10px;
  }
`;

const List = styled.ul`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  gap: 10px;
`;

const Item = styled.li`
  button {
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 6px;
    padding: 7px 12px;
    background: ${({ theme }) => theme.app.bg.gray1};
    border-radius: 15px;
    line-height: 1;

    span {
      color: ${({ theme }) => theme.app.text.dark1};
      font-size: 15px;
    }
  }
`;

const Icon = styled.i<{ $rotate?: boolean }>`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  font-size: 10px;
  background: ${({ theme }) => theme.app.bg.gray2};
  color: ${({ theme }) => theme.app.text.light2};
  transform: rotate(${({ $rotate }) => ($rotate ? 45 : 0)}deg);
`;

const Message = styled.p`
  color: ${({ theme }) => theme.app.text.light1};
  font-size: 14px;
`;
