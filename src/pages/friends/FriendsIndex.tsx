import styled from "@emotion/styled";
import { Button, FormControlLabel, Switch } from "@mui/material";
import { AiOutlineSetting } from "@react-icons/all-files/ai/AiOutlineSetting";
import { HiUserRemove } from "@react-icons/all-files/hi/HiUserRemove";
import { useQueryClient } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

import DefaultLayout from "@layouts/DefaultLayout";

import * as friendApi from "@core/apis/friend.api";
import useRemoveFriend from "@core/hooks/mutations/friend/useRemoveFriend";
import useCharacters from "@core/hooks/queries/character/useCharacters";
import useFriends from "@core/hooks/queries/friend/useFriends";
import useModalState from "@core/hooks/useModalState";
import { FriendType } from "@core/types/friend";
import queryKeyGenerator from "@core/utils/queryKeyGenerator";
import { calculateFriendRaids } from "@core/utils/todo.util";

import Modal from "@components/Modal";

import AddFriendButton from "./components/AddFriendButton";

const TABLE_COLUMNS = [
  "닉네임",
  "권한",
  "삭제",
  "베히모스",
  "에키드나",
  "카멘",
  "상아탑",
  "일리아칸",
  "카양겔",
  "아브렐슈드",
  "쿠크세이튼",
  "비아키스",
  "발탄",
] as const;

const FriendsIndex = () => {
  const queryClient = useQueryClient();

  const [modalState, setModalState] = useModalState<FriendType>();
  const getFriends = useFriends();
  const getCharacters = useCharacters();

  const removeFriend = useRemoveFriend({
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeyGenerator.getFriends(),
      });
      toast.success("깐부를 삭제했습니다.");
    },
  });

  const targetState = modalState
    ? getFriends.data?.find((friend) => friend.friendId === modalState.friendId)
    : undefined;

  const handleRequest = async (category: string, fromMember: string) => {
    const confirmMessage =
      category === "delete" ? "해당 요청을 삭제 하시겠습니까?" : null;

    const userConfirmed = confirmMessage
      ? window.confirm(confirmMessage)
      : true;

    if (userConfirmed) {
      const response = await friendApi.handleRequest(category, fromMember);
      if (response) {
        toast("요청이 정상적으로 처리되었습니다.");
        queryClient.invalidateQueries({
          queryKey: queryKeyGenerator.getFriends(),
        });
      }
    }
  };

  const renderSelectSetting = (
    friendId: number,
    setting: boolean,
    settingName: string
  ) => {
    return (
      <FormControlLabel
        control={
          <Switch
            id={`${friendId}_${settingName}`}
            onChange={(event, checked) =>
              updateSetting(checked, friendId, settingName)
            }
            checked={setting}
          />
        }
        label=""
      />
    );
  };

  const updateSetting = async (
    checked: boolean,
    friendId: number,
    settingName: string
  ) => {
    const data = await friendApi.editFriendSetting(
      friendId,
      settingName,
      checked
    );
    queryClient.invalidateQueries({
      queryKey: queryKeyGenerator.getFriends(),
    });
    /*     const friend = friends.find((el) => el.friendId === friendId);
    if (friend) {
      await openFriendSettingForm(friend);
    } */
  };

  if (!getFriends.data) {
    return null;
  }

  let characterRaid = null;
  if (getCharacters.data !== undefined) {
    characterRaid = calculateFriendRaids(getCharacters.data);
  }

  return (
    <DefaultLayout>
      <Header>
        <AddFriendButton />
      </Header>

      {getFriends.data
        .filter((friend) => friend.areWeFriend !== "깐부")
        .map((friend) => (
          <Wrapper>
            <RequestRow key={friend.friendId}>
              <strong>{friend.nickName}</strong> {friend.areWeFriend}
              {friend.areWeFriend === "깐부 요청 받음" && (
                <>
                  <Button
                    onClick={() => handleRequest("ok", friend.friendUsername)}
                  >
                    수락
                  </Button>
                  <Button
                    color="error"
                    onClick={() =>
                      handleRequest("reject", friend.friendUsername)
                    }
                  >
                    거절
                  </Button>
                </>
              )}
              {friend.areWeFriend !== "깐부 요청 받음" && (
                <>
                  {/* 상태 : {friend.areWeFriend} */}
                  <Button
                    color="error"
                    style={{ marginLeft: 10 }}
                    onClick={() =>
                      handleRequest("delete", friend.friendUsername)
                    }
                  >
                    요청 삭제
                  </Button>
                </>
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
                        <ActionButton
                          type="button"
                          onClick={() => setModalState(friend)}
                        >
                          <AiOutlineSetting />
                          <span className="text-hidden">깐부 설정</span>
                        </ActionButton>
                      </td>
                      <td>
                        <ActionButton
                          type="button"
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
                          <HiUserRemove />
                          <span className="text-hidden">깐부 삭제</span>
                        </ActionButton>
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
            <li>
              일일 숙제 출력 권한 :{" "}
              {renderSelectSetting(
                targetState.friendId,
                targetState.toFriendSettings.showDayTodo,
                "showDayTodo"
              )}
            </li>
            <li>
              일일 숙제 체크 권한 :{" "}
              {renderSelectSetting(
                targetState.friendId,
                targetState.toFriendSettings.checkDayTodo,
                "checkDayTodo"
              )}
            </li>
            <li>
              레이드 출력 권한 :{" "}
              {renderSelectSetting(
                targetState.friendId,
                targetState.toFriendSettings.showRaid,
                "showRaid"
              )}
            </li>
            <li>
              레이드 체크 권한 :{" "}
              {renderSelectSetting(
                targetState.friendId,
                targetState.toFriendSettings.checkRaid,
                "checkRaid"
              )}
            </li>
            <li>
              주간 숙제 출력 권한 :{" "}
              {renderSelectSetting(
                targetState.friendId,
                targetState.toFriendSettings.showWeekTodo,
                "showWeekTodo"
              )}
            </li>
            <li>
              주간 숙제 체크 권한 :{" "}
              {renderSelectSetting(
                targetState.friendId,
                targetState.toFriendSettings.checkWeekTodo,
                "checkWeekTodo"
              )}
            </li>
            <li>
              설정 변경 권한 :{" "}
              {renderSelectSetting(
                targetState.friendId,
                targetState.toFriendSettings.setting,
                "setting"
              )}
            </li>
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
  background: ${({ theme }) => theme.app.bg.light};
  border: 1px solid ${({ theme }) => theme.app.border};
  border-radius: 16px;
`;

const TableWrapper = styled(Wrapper)``;

const RequestRow = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  font-size: 20px;

  strong {
    margin-right: 5px;
    font-weight: 700;
  }

  button {
    margin-left: 10px;
  }
`;

const TableInnerWrapper = styled.div`
  width: 100%;
  overflow-x: auto;
`;

const Table = styled.table`
  table-layout: fixed;
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
        background: #222;
        color: #fff;
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
