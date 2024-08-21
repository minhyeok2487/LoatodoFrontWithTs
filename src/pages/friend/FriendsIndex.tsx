import { FormControlLabel, Button as MuiButton, Switch } from "@mui/material";
import { AiOutlineSetting } from "@react-icons/all-files/ai/AiOutlineSetting";
import { HiUserRemove } from "@react-icons/all-files/hi/HiUserRemove";
import { useQueryClient } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import styled, { useTheme } from "styled-components";

import DefaultLayout from "@layouts/DefaultLayout";

import { RAID_SORT_ORDER } from "@core/constants";
import useHandleFriendRequest from "@core/hooks/mutations/friend/useHandleFriendRequest";
import useRemoveFriend from "@core/hooks/mutations/friend/useRemoveFriend";
import useUpdateFriendSetting from "@core/hooks/mutations/friend/useUpdateFriendSetting";
import useCharacters from "@core/hooks/queries/character/useCharacters";
import useFriends from "@core/hooks/queries/friend/useFriends";
import useModalState from "@core/hooks/useModalState";
import type { FriendSettings } from "@core/types/friend";
import queryKeyGenerator from "@core/utils/queryKeyGenerator";
import { calculateFriendRaids } from "@core/utils/todo.util";

import Button from "@components/Button";
import Modal from "@components/Modal";

import AddFriendButton from "./components/AddFriendButton";

const TABLE_COLUMNS = ["닉네임", "권한", "삭제", ...RAID_SORT_ORDER] as const;

const options: { label: string; key: keyof FriendSettings }[] = [
  {
    label: "일일 숙제 출력 권한",
    key: "showDayTodo",
  },
  {
    label: "일일 숙제 체크 권한",
    key: "checkDayTodo",
  },
  {
    label: "레이드 출력 권한",
    key: "showRaid",
  },
  {
    label: "레이드 체크 권한",
    key: "checkRaid",
  },
  {
    label: "주간 숙제 출력 권한",
    key: "showWeekTodo",
  },
  {
    label: "주간 숙제 체크 권한",
    key: "checkWeekTodo",
  },
  {
    label: "설정 변경 권한",
    key: "setting",
  },
];

const FriendsIndex = () => {
  const queryClient = useQueryClient();
  const theme = useTheme();

  const [modalState, setModalState] = useModalState<number>();
  const getFriends = useFriends();
  const getCharacters = useCharacters();

  const handleFriendRequest = useHandleFriendRequest({
    onSuccess: () => {
      toast("요청이 정상적으로 처리되었습니다.");
      queryClient.invalidateQueries({
        queryKey: queryKeyGenerator.getFriends(),
      });
    },
  });
  const updateFriendSetting = useUpdateFriendSetting({
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeyGenerator.getFriends(),
      });
    },
  });
  const removeFriend = useRemoveFriend({
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeyGenerator.getFriends(),
      });
      toast.success("깐부를 삭제했습니다.");
    },
  });

  const targetState = modalState
    ? getFriends.data?.find((friend) => friend.friendId === modalState)
    : undefined;

  if (!getFriends.data) {
    return null;
  }

  let characterRaid = null;
  if (getCharacters.data !== undefined) {
    characterRaid = calculateFriendRaids(getCharacters.data);
  }

  return (
    <DefaultLayout pageTitle="깐부리스트">
      <Header>
        <AddFriendButton />
      </Header>

      {getFriends.data
        .filter((friend) => friend.areWeFriend !== "깐부")
        .map((friend) => (
          <Wrapper key={friend.friendId}>
            <RequestRow>
              <strong>{friend.nickName}</strong> {friend.areWeFriend}
              {friend.areWeFriend === "깐부 요청 받음" && (
                <>
                  <Button
                    variant="contained"
                    color={theme.palette.primary.main}
                    onClick={() => {
                      handleFriendRequest.mutate({
                        fromUsername: friend.friendUsername,
                        action: "ok",
                      });
                    }}
                  >
                    수락
                  </Button>
                  <Button
                    variant="contained"
                    color={theme.palette.error.main}
                    onClick={() => {
                      if (
                        window.confirm(
                          `${friend.nickName}님의 깐부 요청을 거절하시겠습니까?`
                        )
                      ) {
                        handleFriendRequest.mutate({
                          fromUsername: friend.friendUsername,
                          action: "reject",
                        });
                      }
                    }}
                  >
                    거절
                  </Button>
                </>
              )}
              {friend.areWeFriend !== "깐부 요청 받음" && (
                <Button
                  variant="contained"
                  color={theme.palette.error.main}
                  onClick={() => {
                    if (window.confirm("해당 요청을 삭제 하시겠습니까?")) {
                      handleFriendRequest.mutate({
                        fromUsername: friend.friendUsername,
                        action: "delete",
                      });
                    }
                  }}
                >
                  요청 삭제
                </Button>
              )}
            </RequestRow>
          </Wrapper>
        ))}

      <TableWrapper>
        <TableInnerWrapper>
          <Table>
            <colgroup>
              {TABLE_COLUMNS.map((column) => (
                <col key={column} />
              ))}
            </colgroup>

            <thead>
              <tr>
                {TABLE_COLUMNS.map((column, index) => (
                  <th key={column}>{column}</th>
                ))}
              </tr>
            </thead>

            <tbody>
              <tr>
                <td>
                  <Link to="/todo">나</Link>
                </td>
                <td />
                <td />
                {characterRaid?.map((raid, colIndex) => (
                  <td key={colIndex}>
                    {raid.totalCount > 0 && (
                      <dl>
                        <dt>
                          <em>{raid.count}</em> / {raid.totalCount}
                        </dt>
                        <dd>
                          딜{raid.dealerCount} 폿{raid.supportCount}
                        </dd>
                      </dl>
                    )}
                  </td>
                ))}
              </tr>

              {getFriends.data
                .filter((friend) => friend.areWeFriend === "깐부")
                .map((friend, rowIndex) => {
                  const raidStatus = calculateFriendRaids(friend.characterList);
                  return (
                    <tr key={rowIndex}>
                      <td>
                        <Link to={`/friends/${friend.nickName}`}>
                          {friend.nickName}
                        </Link>
                      </td>
                      <td>
                        <Button
                          variant="icon"
                          onClick={() => setModalState(friend.friendId)}
                        >
                          <AiOutlineSetting size={20} />
                          <span className="text-hidden">깐부 설정</span>
                        </Button>
                      </td>
                      <td>
                        <Button
                          variant="icon"
                          onClick={() => {
                            if (
                              window.confirm(
                                `${friend.nickName}님과 깐부를 해제하시겠어요?`
                              )
                            ) {
                              removeFriend.mutate(friend.friendId);
                            }
                          }}
                        >
                          <HiUserRemove size={20} />
                          <span className="text-hidden">깐부 삭제</span>
                        </Button>
                      </td>
                      {raidStatus.map((raid, colIndex) => (
                        <td key={colIndex}>
                          {raid.totalCount > 0 && (
                            <dl>
                              <dt>
                                <em>{raid.count}</em> / {raid.totalCount}
                              </dt>
                              <dd>
                                딜{raid.dealerCount} 폿{raid.supportCount}
                              </dd>
                            </dl>
                          )}
                        </td>
                      ))}
                    </tr>
                  );
                })}
            </tbody>
          </Table>
        </TableInnerWrapper>
      </TableWrapper>

      {modalState && targetState && (
        <Modal
          title={`${targetState.nickName} 권한 설정`}
          isOpen
          onClose={() => setModalState()}
        >
          <SettingWrapper>
            {options.map((item) => (
              <li key={item.key}>
                {item.label} :{" "}
                <FormControlLabel
                  control={
                    <Switch
                      id={item.key}
                      onChange={(_, checked) => {
                        updateFriendSetting.mutate({
                          id: targetState.friendId,
                          name: item.key,
                          value: checked,
                        });
                      }}
                      checked={targetState.toFriendSettings[item.key]}
                    />
                  }
                  label=""
                />
              </li>
            ))}
          </SettingWrapper>
        </Modal>
      )}
    </DefaultLayout>
  );
};

export default FriendsIndex;

const Header = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  width: 100%;

  ${({ theme }) => theme.medias.max900} {
    justify-content: center;
  }
`;

const Wrapper = styled.div`
  margin-top: 16px;
  padding: 24px;
  width: 100%;
  background: ${({ theme }) => theme.app.bg.white};
  border: 1px solid ${({ theme }) => theme.app.border};
  border-radius: 16px;
`;

const TableWrapper = styled(Wrapper)``;

const RequestRow = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  font-size: 16px;
  margin: -10px 0;

  strong {
    margin-right: 5px;
    font-weight: 700;
  }

  button {
    margin-left: 10px;
  }

  ${({ theme }) => theme.medias.max900} {
    flex-direction: column;
    gap: 6px;
  }
`;

const TableInnerWrapper = styled.div`
  width: 100%;
  overflow-x: auto;
`;

const Table = styled.table`
  font-size: 16px;
  width: 100%;

  colgroup {
    col {
      width: 120px;

      &:first-of-type {
        width: 200px;
      }

      &:nth-of-type(2),
      &:nth-of-type(3) {
        width: 60px;
      }
    }
  }

  thead {
    tr {
      height: 40px;
      background: ${({ theme }) => theme.app.bg.reverse};
      color: ${({ theme }) => theme.app.text.reverse};
      border-bottom: 1px solid ${({ theme }) => theme.app.border};

      th {
        text-align: center;
        background: ${({ theme }) => theme.app.palette.gray[900]};
        color: ${({ theme }) => theme.app.palette.gray[0]};
      }
    }
  }

  tbody {
    color: ${({ theme }) => theme.app.text.main};

    tr {
      height: 57px;
      border-bottom: 1px solid ${({ theme }) => theme.app.border};

      td {
        text-align: center;

        a {
          border-bottom: 1px solid ${({ theme }) => theme.app.text.main};

          &:hover {
            font-weight: 600;
          }
        }

        dl {
          dd {
            font-size: 14px;
            color: ${({ theme }) => theme.app.text.light2};
          }
          dt {
            color: ${({ theme }) => theme.app.text.light2};

            em {
              color: ${({ theme }) => theme.app.text.dark2};
            }
          }
        }
      }
    }
  }

  ${({ theme }) => theme.medias.max900} {
    font-size: 14px;
  }
`;

const ActionButton = styled.button`
  padding: 10px;
  color: ${({ theme }) => theme.app.text.main};
  font-size: 20px;
`;

const SettingWrapper = styled.ul`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 5px;

  li {
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 5px;
  }
`;
