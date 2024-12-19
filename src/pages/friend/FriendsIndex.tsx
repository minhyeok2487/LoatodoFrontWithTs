import { FormControlLabel, Switch } from "@mui/material";
import { AiOutlineSetting } from "@react-icons/all-files/ai/AiOutlineSetting";
import { HiUserRemove } from "@react-icons/all-files/hi/HiUserRemove";
import { IoReorderThree } from "@react-icons/all-files/io5/IoReorderThree";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import styled, { css, useTheme } from "styled-components";

import DefaultLayout from "@layouts/DefaultLayout";

import useHandleFriendRequest from "@core/hooks/mutations/friend/useHandleFriendRequest";
import useRemoveFriend from "@core/hooks/mutations/friend/useRemoveFriend";
import useUpdateFriendSetting from "@core/hooks/mutations/friend/useUpdateFriendSetting";
import useCharacters from "@core/hooks/queries/character/useCharacters";
import useFriends from "@core/hooks/queries/friend/useFriends";
import useModalState from "@core/hooks/useModalState";
import type { FriendSettings } from "@core/types/friend";
import { calculateFriendRaids } from "@core/utils";
import queryKeyGenerator from "@core/utils/queryKeyGenerator";

import Button from "@components/Button";
import Modal from "@components/Modal";

import AddFriendButton from "./components/AddFriendButton";
import FriendSort from "./components/FriendSort";

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
    label: "휴식 게이지 수정 권한",
    key: "updateGauge",
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
    label: "레이드 편집 권한",
    key: "updateRaid",
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
  const [sortMode, setSortMode] = useState(false);

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

  const renderRaidStatus = (
    raidStatus: ReturnType<typeof calculateFriendRaids>
  ) => {
    return raidStatus.map((raid) => {
      if (raid.totalCount === 0) return null;

      const isAllComplete =
        raid.dealerChecked + raid.supportChecked === raid.totalCount;
      const backgroundImageUrl = `/raid-images/${raid.name.replace(/\s/g, "")}.jpg`;

      return (
        <RaidCard
          key={raid.name}
          $isComplete={isAllComplete}
          $backgroundImageUrl={backgroundImageUrl}
        >
          <RaidHeader>
            <h3
              data-count={`${raid.dealerChecked + raid.supportChecked} / ${raid.totalCount}`}
            >
              {raid.name}
            </h3>
          </RaidHeader>

          <RaidContent>
            {raid.difficulties.map((diff) => {
              const isDealerComplete = diff.dealerChecked === diff.dealerCount;
              const isSupportComplete =
                diff.supportChecked === diff.supportCount;

              return (
                <div key={diff.difficulty}>
                  <span className={`category ${diff.difficulty.toLowerCase()}`}>
                    {diff.difficulty}
                  </span>
                  <RoleSection>
                    {diff.dealerCount > 0 && (
                      <RoleCount $isComplete={isDealerComplete} $role="dealer">
                        딜러 ({diff.dealerChecked} / {diff.dealerCount})
                      </RoleCount>
                    )}
                    {diff.supportCount > 0 && (
                      <RoleCount
                        $isComplete={isSupportComplete}
                        $role="support"
                      >
                        서폿 ({diff.supportChecked} / {diff.supportCount})
                      </RoleCount>
                    )}
                  </RoleSection>
                </div>
              );
            })}
          </RaidContent>
        </RaidCard>
      );
    });
  };
  if (!getFriends.data) {
    return null;
  }

  return (
    <DefaultLayout pageTitle="깐부리스트">
      <Header>
        <AddFriendButton />
        {getFriends.data.some((friend) => friend.areWeFriend === "깐부") && (
          <Button
            variant="outlined"
            onClick={() => setSortMode(!sortMode)}
            css={css`
              height: 40px;
              font-weight: bold;
            `}
          >
            <IoReorderThree size={20} />
            {sortMode ? "저장" : "순서 변경"}
          </Button>
        )}
      </Header>

      <RequestsWrapper>
        {getFriends.data
          .filter((friend) => friend.areWeFriend !== "깐부")
          .map((friend) => (
            <RequestCard key={friend.friendId}>
              <RequestInfo>
                <strong>{friend.nickName}</strong>
                <span>{friend.areWeFriend}</span>
              </RequestInfo>
              <RequestActions>
                {friend.areWeFriend === "깐부 요청 받음" ? (
                  <>
                    <Button
                      variant="contained"
                      color={theme.palette.primary.main}
                      onClick={() =>
                        handleFriendRequest.mutate({
                          friendUsername: friend.friendUsername,
                          category: "OK",
                        })
                      }
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
                            friendUsername: friend.friendUsername,
                            category: "REJECT",
                          });
                        }
                      }}
                    >
                      거절
                    </Button>
                  </>
                ) : (
                  <Button
                    variant="contained"
                    color={theme.palette.error.main}
                    onClick={() => {
                      if (window.confirm("해당 요청을 삭제 하시겠습니까?")) {
                        handleFriendRequest.mutate({
                          friendUsername: friend.friendUsername,
                          category: "DELETE",
                        });
                      }
                    }}
                  >
                    요청 삭제
                  </Button>
                )}
              </RequestActions>
            </RequestCard>
          ))}
      </RequestsWrapper>

      <FriendsWrapper>
        <MyStatusCard>
          <FriendHeader>
            <Link to="/todo">나의 현황</Link>
          </FriendHeader>
          <RaidStatusGrid>
            {getCharacters.data &&
              renderRaidStatus(calculateFriendRaids(getCharacters.data))}
          </RaidStatusGrid>
        </MyStatusCard>
        {sortMode ? (
          <FriendSort
            friends={getFriends.data.filter(
              (friend) => friend.areWeFriend === "깐부"
            )}
          />
        ) : (
          getFriends.data
            .sort((a, b) => (a.ordering ?? 0) - (b.ordering ?? 0))
            .filter((friend) => friend.areWeFriend === "깐부")
            .map((friend) => (
              <FriendCard key={friend.friendId}>
                <FriendHeader>
                  <Link to={`/friends/${friend.nickName}`}>
                    {friend.nickName}
                  </Link>
                  <FriendActions>
                    <Button
                      variant="icon"
                      onClick={() => setModalState(friend.friendId)}
                    >
                      <AiOutlineSetting size={20} />
                      <span className="text-hidden">깐부 설정</span>
                    </Button>
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
                  </FriendActions>
                </FriendHeader>
                <RaidStatusGrid>
                  {renderRaidStatus(calculateFriendRaids(friend.characterList))}
                </RaidStatusGrid>
              </FriendCard>
            ))
        )}
      </FriendsWrapper>

      {modalState && targetState && (
        <Modal
          title={`${targetState.nickName} 권한 설정`}
          isOpen
          onClose={() => setModalState()}
        >
          <SettingWrapper>
            {options.map((item) => (
              <li key={item.key}>
                {item.label}:{" "}
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

const Header = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 8px;
  width: 100%;

  ${({ theme }) => theme.medias.max900} {
    justify-content: center;
  }
`;

const RequestsWrapper = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 12px;
  margin-bottom: 24px;
  width: 100%;

  ${({ theme }) => theme.medias.max600} {
    grid-template-columns: 1fr;
  }
`;

const RequestCard = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  background: ${({ theme }) => theme.app.bg.white};
  border: 1px solid ${({ theme }) => theme.app.border};
  border-radius: 8px;

  ${({ theme }) => theme.medias.max600} {
    flex-direction: column;
    gap: 12px;
    text-align: center;
  }
`;

const RequestInfo = styled.div`
  display: flex;
  gap: 8px;
  align-items: center;

  strong {
    font-weight: 600;
  }
`;

const RequestActions = styled.div`
  display: flex;
  gap: 8px;
`;

const FriendsWrapper = styled.div`
  display: grid;
  gap: 24px;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  width: 100%;

  ${({ theme }) => theme.medias.max600} {
    grid-template-columns: 1fr;
  }
`;

const FriendCard = styled.div`
  background: ${({ theme }) => theme.app.bg.white};
  border: 1px solid ${({ theme }) => theme.app.border};
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
  transition: transform 0.2s ease;
`;

const MyStatusCard = styled(FriendCard)`
  border: 2px solid gray;
`;

const FriendHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;

  a {
    font-size: 16px;
    font-weight: bold;
    color: ${({ theme }) => theme.app.text.main};
    &:hover {
      text-decoration: underline;
    }
  }
`;

const FriendActions = styled.div`
  display: flex;
  gap: 8px;
`;

const RaidStatusGrid = styled.div`
  display: grid;
  gap: 12px;
  grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));

  ${({ theme }) => theme.medias.max600} {
    grid-template-columns: repeat(2, 1fr);
  }
`;

const RaidHeader = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  margin-bottom: 12px;

  h3 {
    font-size: 14px;
    font-weight: 600;
  }

  .categories {
    display: flex;
    gap: 4px;
  }

  .category {
    font-size: 11px;
    padding: 2px 6px;
    background: rgba(255, 255, 255, 0.15);
    border-radius: 4px;
    display: inline-block;
  }

  .category.normal {
    background: rgba(255, 255, 255, 0.15);
  }

  .category.hard {
    background: rgba(255, 50, 50, 0.15);
    color: ${({ theme }) => theme.palette.error.light};
  }

  .category.hell {
    background: rgba(255, 150, 50, 0.15);
    color: ${({ theme }) => theme.palette.warning.light};
  }

  .status {
    font-size: 13px;
    color: ${({ theme }) => theme.app.text.dark1};
  }
`;

const RaidCard = styled.div<{
  $isComplete?: boolean;
  $backgroundImageUrl: string;
}>`
  padding: 16px;
  background: linear-gradient(
      ${(props) =>
        props.$isComplete ? "rgba(0, 0, 0, 0.85)" : "rgba(0, 0, 0, 0.45)"},
      ${(props) =>
        props.$isComplete ? "rgba(0, 0, 0, 0.85)" : "rgba(0, 0, 0, 0.45)"}
    ),
    url(${(props) => props.$backgroundImageUrl});
  background-size: cover;
  background-position: center;
  border-radius: 8px;
  transition: all 0.2s ease;
  color: white;
  opacity: ${(props) => (props.$isComplete ? 0.85 : 1)};
  position: relative;
  overflow: hidden;

  ${RaidHeader} {
    flex-direction: row;
    justify-content: space-between;
    align-items: center;

    h3 {
      display: flex;
      align-items: center;
      gap: 8px;

      &::after {
        content: attr(data-count);
        font-size: 12px;
        opacity: 0.8;
      }
    }
  }

  &::after {
    content: "";
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%) rotate(-15deg);
    width: 80px;
    height: 80px;
    border: 3px solid white;
    border-radius: 50%;
    opacity: ${(props) => (props.$isComplete ? 1 : 0)};
    pointer-events: none;
    transition: opacity 0.2s ease;
  }

  &::before {
    content: "완료";
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%) rotate(-15deg);
    color: white;
    font-weight: bold;
    font-size: 24px;
    opacity: ${(props) => (props.$isComplete ? 1 : 0)};
    pointer-events: none;
    transition: opacity 0.2s ease;
  }
`;

const RaidContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;

  > div {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }
`;

const RoleSection = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: nowrap;
  white-space: nowrap;
`;

const RoleCount = styled.div<{
  $isComplete?: boolean;
  $role: "dealer" | "support";
}>`
  padding: 6px 10px;
  border-radius: 6px;
  font-size: 12px;
  background: rgba(255, 255, 255, 0.1);
  color: ${({ $isComplete }) => ($isComplete ? "#aaaaaa" : "white")};
  flex: 1;
  text-align: center;
  transition: all 0.2s ease;
  font-weight: ${({ $isComplete }) => ($isComplete ? "400" : "bold")};
  border-left: 3px solid
    ${({ theme, $role }) =>
      $role === "dealer" ? theme.palette.error.main : theme.palette.info.main};

  &:hover {
    background: rgba(255, 255, 255, 0.2);
  }
`;

const SettingWrapper = styled.ul`
  display: flex;
  flex-direction: column;
  gap: 8px;

  li {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
`;

export default FriendsIndex;
