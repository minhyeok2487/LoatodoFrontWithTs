import { FormControlLabel, Switch, Tab, Tabs } from "@mui/material";
import { AiOutlineSetting } from "@react-icons/all-files/ai/AiOutlineSetting";
import { HiUserRemove } from "@react-icons/all-files/hi/HiUserRemove";
import { IoReorderThree } from "@react-icons/all-files/io5/IoReorderThree";
import { useQueryClient } from "@tanstack/react-query";
import { useAtomValue } from "jotai";
import { useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import styled, { css, useTheme } from "styled-components";

import DefaultLayout from "@layouts/DefaultLayout";

import { themeAtom } from "@core/atoms/theme.atom";
import { RAID_SORT_ORDER } from "@core/constants";
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

type Difficulty = {
  difficulty: string;
  dealerCount: number;
  dealerChecked: number;
  supportCount: number;
  supportChecked: number;
};

type RaidUser = {
  nickname: string;
  totalCount: number;
  dealerChecked: number;
  supportChecked: number;
  difficulties: Difficulty[];
};

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
  const [selectedRaid, setSelectedRaid] = useState<string>("");
  const [sortMode, setSortMode] = useState(false);

  const queryClient = useQueryClient();
  const theme = useTheme();
  const currentTheme = useAtomValue(themeAtom);
  const [modalState, setModalState] = useModalState<number>();

  const getFriends = useFriends();
  const getCharacters = useCharacters();

  const handleFriendRequest = useHandleFriendRequest({
    onSuccess: () => {
      toast("깐부수락이 완료되었어요");
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
      toast.success("깐부를 삭제했어요");
    },
  });

  const targetState = modalState
    ? getFriends.data?.find((friend) => friend.friendId === modalState)
    : undefined;

  const renderRaidsByType = () => {
    if (!getFriends.data || !getCharacters.data) return null;

    const allCharacters = [
      { nickname: "나의 레이드 현황", characters: getCharacters.data },
      ...getFriends.data
        .sort((a, b) => (a.ordering ?? 0) - (b.ordering ?? 0))
        .filter((friend) => friend.areWeFriend === "깐부")
        .map((friend) => ({
          nickname: friend.nickName,
          characters: friend.characterList,
        })),
    ];

    const allRaids = allCharacters.reduce(
      (acc, user) => {
        const userRaids = calculateFriendRaids(user.characters);
        return userRaids.reduce((raidAcc, raid) => {
          if (raid.totalCount > 0) {
            return {
              ...raidAcc,
              [raid.name]: {
                name: raid.name,
                users: [
                  ...(raidAcc[raid.name]?.users || []),
                  {
                    nickname: user.nickname,
                    ...raid,
                  },
                ],
              },
            };
          }
          return raidAcc;
        }, acc);
      },
      {} as Record<string, { name: string; users: RaidUser[] }>
    );

    const sortedRaids = Object.values(allRaids).sort((a, b) => {
      const orderA = RAID_SORT_ORDER.indexOf(a.name);
      const orderB = RAID_SORT_ORDER.indexOf(b.name);
      return orderA - orderB;
    });

    if (!selectedRaid && sortedRaids.length > 0) {
      setSelectedRaid(sortedRaids[0].name);
    }

    const selectedRaidData = sortedRaids.find(
      (raid) => raid.name === selectedRaid
    );

    return (
      <div>
        <TabsWrapper>
          <Tabs
            value={selectedRaid}
            onChange={(_, newValue) => setSelectedRaid(newValue)}
            variant="scrollable"
            scrollButtons="auto"
          >
            {sortedRaids.map((raid) => (
              <Tab
                key={raid.name}
                value={raid.name}
                label={
                  <TabContent>
                    <TabImage
                      $imageUrl={`/raid-images/${raid.name.replace(
                        /\s/g,
                        ""
                      )}.jpg`}
                    />
                    <span>{raid.name}</span>
                    {raid.users.some(
                      (user) => user.nickname === "나의 레이드 현황"
                    ) && <MeBadgeRight />}
                  </TabContent>
                }
              />
            ))}
          </Tabs>
        </TabsWrapper>

        {selectedRaidData && (
          <FriendCard>
            <RaidStatusGrid>
              {selectedRaidData.users.map((user) => (
                <RaidCard
                  key={user.nickname}
                  $isComplete={
                    user.dealerChecked + user.supportChecked === user.totalCount
                  }
                  $theme={currentTheme}
                >
                  {user.nickname === "나의 레이드 현황" && (
                    <MeBadge>ME</MeBadge>
                  )}
                  <RaidHeader>
                    <h3>
                      {user.nickname === "나의 레이드 현황" ? (
                        <Link to="/todo">{user.nickname}</Link>
                      ) : (
                        <Link to={`/friends/${user.nickname}`}>
                          {user.nickname}
                        </Link>
                      )}
                      {user.nickname !== "나의 레이드 현황" && (
                        <HeaderActions>
                          <IconButton
                            onClick={() =>
                              setModalState(
                                getFriends.data?.find(
                                  (f) => f.nickName === user.nickname
                                )?.friendId
                              )
                            }
                          >
                            <AiOutlineSetting size={16} />
                          </IconButton>
                          <IconButton
                            onClick={() => {
                              const friend = getFriends.data?.find(
                                (f) => f.nickName === user.nickname
                              );
                              if (
                                friend &&
                                window.confirm(
                                  `${user.nickname}님을 깐부에서 삭제할까요?`
                                )
                              ) {
                                removeFriend.mutate(friend.friendId);
                              }
                            }}
                          >
                            <HiUserRemove size={16} />
                          </IconButton>
                        </HeaderActions>
                      )}
                    </h3>
                    <HeaderCount>
                      <ProgressSegments>
                        {Array.from({ length: user.totalCount }).map(
                          (_, index) => (
                            <Segment
                              key={index}
                              $isCompleted={
                                index < user.dealerChecked + user.supportChecked
                              }
                            />
                          )
                        )}
                      </ProgressSegments>
                    </HeaderCount>
                  </RaidHeader>
                  <RaidContent>
                    {user.difficulties.map((diff) => {
                      const isDealerComplete =
                        diff.dealerChecked === diff.dealerCount;
                      const isSupportComplete =
                        diff.supportChecked === diff.supportCount;

                      return (
                        <div key={diff.difficulty}>
                          <DifficultyTitle
                            $difficulty={diff.difficulty.toLowerCase()}
                          >
                            {diff.difficulty}
                          </DifficultyTitle>
                          <RoleSection>
                            {diff.dealerCount > 0 && (
                              <RoleCount
                                $isComplete={isDealerComplete}
                                $role="dealer"
                              >
                                딜 {diff.dealerChecked}/{diff.dealerCount}
                              </RoleCount>
                            )}
                            {diff.supportCount > 0 && (
                              <RoleCount
                                $isComplete={isSupportComplete}
                                $role="support"
                              >
                                폿 {diff.supportChecked}/{diff.supportCount}
                              </RoleCount>
                            )}
                          </RoleSection>
                        </div>
                      );
                    })}
                  </RaidContent>
                </RaidCard>
              ))}
            </RaidStatusGrid>
          </FriendCard>
        )}
      </div>
    );
  };

  if (!getFriends.data) {
    return null;
  }

  return (
    <DefaultLayout pageTitle="깐부리스트">
      <Header>
        <AddFriendButton />
        {getFriends.data.some((friend) => friend.areWeFriend === "깐부") && (
          <Button variant="outlined" onClick={() => setSortMode(!sortMode)}>
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
                            `${friend.nickName}님의 깐부 요청을 거절할까요?`
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
                      if (window.confirm("해당 요청을 삭제할까요?")) {
                        handleFriendRequest.mutate({
                          friendUsername: friend.friendUsername,
                          category: "DELETE",
                        });
                      }
                    }}
                  >
                    요청삭제
                  </Button>
                )}
              </RequestActions>
            </RequestCard>
          ))}
      </RequestsWrapper>

      <FriendsWrapper>
        {sortMode ? (
          <FriendSort
            friends={getFriends.data.filter(
              (friend) => friend.areWeFriend === "깐부"
            )}
          />
        ) : (
          renderRaidsByType()
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
                {item.label}{" "}
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
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 8px;
  margin-bottom: 16px;
  width: 100%;

  ${({ theme }) => theme.medias.max600} {
    grid-template-columns: 1fr;
    gap: 0;
  }
`;

const RequestCard = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  margin-top: 12px;
  background: ${({ theme }) => theme.app.bg.white};
  border: 1px solid ${({ theme }) => theme.app.border};
  border-radius: 8px;

  ${({ theme }) => theme.medias.max600} {
    flex-direction: column;
    gap: 10px;
    text-align: center;
    padding: 10px;
  }
`;

const RequestInfo = styled.div`
  display: flex;
  gap: 6px;
  align-items: center;

  strong {
    font-size: 16px;
    font-weight: 700;
  }

  span {
    font-size: 14px;
    font-weight: 400;
    color: ${({ theme }) => theme.app.text.light1};
  }
`;

const RequestActions = styled.div`
  display: flex;
  gap: 8px;
`;

const FriendsWrapper = styled.div`
  width: 100%;
`;

const FriendCard = styled.div`
  background: ${({ theme }) => theme.app.bg.white};
  border: 1px solid ${({ theme }) => theme.app.border};
  border-radius: 0 0 12px 12px;
  padding: 24px 20px 20px;
  transition: transform 0.2s ease;
`;

const RaidStatusGrid = styled.div`
  display: grid;
  gap: 10px;

  @media (max-width: 600px) {
    gap: 8px;
  }
`;

const RaidHeader = styled.div`
  display: flex;
  flex-direction: column;

  h3 {
    display: flex;
    align-items: center;
    gap: 2px;
    font-size: 16px;
    font-weight: 600;
  }
`;

const HeaderCount = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  margin-top: 8px;
  font-size: 14px;
  color: ${({ theme }) => theme.app.text.light2};
`;

const ProgressSegments = styled.div`
  display: flex;
  gap: 2px;
  height: 6px;
`;

const Segment = styled.div<{ $isCompleted: boolean }>`
  width: 20px;
  height: 100%;
  background: ${(props) =>
    props.$isCompleted ? props.theme.app.text.main : props.theme.app.border};
  border-radius: 3px;
  transition: background-color 0.3s ease;
`;

const RaidCard = styled.div<{
  $isComplete?: boolean;
  $theme?: string;
}>`
  display: flex;
  justify-content: space-between;
  padding: 16px;
  background: ${({ theme }) => theme.app.bg.white};
  border: 1px solid ${({ theme }) => theme.app.border};
  border-radius: 8px;
  transition: all 0.2s ease;
  color: ${({ theme }) => theme.app.text.main};
  position: relative;
  filter: ${({ $isComplete, $theme }) =>
    $isComplete
      ? $theme === "dark"
        ? "brightness(0.7)"
        : "brightness(0.94)"
      : "none"};
  transition: filter 0.2s ease;

  &::after {
    content: "✓";
    position: absolute;
    top: 8px;
    right: 8px;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background: ${({ theme }) => theme.app.bg.reverse};
    color: ${({ theme }) => theme.app.text.reverse};
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 12px;
    opacity: ${(props) => (props.$isComplete ? 1 : 0)};
    transition: opacity 0.2s ease;

    @media (max-width: 600px) {
      top: -10px;
      right: -10px;
    }
  }

  @media (max-width: 600px) {
    flex-direction: column;
    padding: 12px;
  }
`;

const MeBadge = styled.div`
  position: absolute;
  top: -12px;
  left: 12px;
  background: ${({ theme }) => theme.app.bg.reverse};
  color: ${({ theme }) => theme.app.text.reverse};
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: bold;
`;

const MeBadgeRight = styled.div`
  position: absolute;
  top: 3px;
  left: calc(50% - 2px);
  width: 4px;
  height: 4px;
  background: ${({ theme }) => theme.app.bg.reverse};
  border-radius: 50%;
`;

const RaidContent = styled.div`
  display: flex;
  align-items: center;
  font-size: 14px;

  > div {
    padding-left: 15px;
    min-width: 112px;
    align-items: flex-start;
    display: flex;
    flex-direction: column;
    gap: 2px;

    @media (max-width: 600px) {
      padding: 0 8px;
      min-width: auto;
      flex-direction: row;
      gap: 10px;
    }
  }

  > div + div {
    border-left: 2px dashed ${({ theme }) => theme.app.border};
  }

  @media (max-width: 600px) {
    margin-top: 16px;
    justify-content: flex-end;
    font-size: 12px;
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
  font-size: 13px;
  color: ${({ theme }) => theme.app.text.main};
  flex: 1;
  text-align: center;
  transition: all 0.2s ease;
  font-weight: 500;
  color: ${({ theme }) => theme.app.text.main};
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

const TabsWrapper = styled.div`
  overflow-x: auto;

  .MuiTab-root {
    min-height: 80px;
    text-transform: none;
    padding: 12px;
    color: ${({ theme }) => theme.app.text.light1};
    outline: none;

    &.Mui-selected {
      color: ${({ theme }) => theme.app.text.main};
    }
  }

  .MuiTabs-indicator {
    background-color: ${({ theme }) => theme.app.text.main};
  }

  @media (max-width: 600px) {
    .MuiTab-root {
      min-width: 100px;
      padding: 4px 8px;
    }
  }
`;

const TabContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;

  span {
    font-weight: 400;
  }
`;

const TabImage = styled.div<{ $imageUrl: string }>`
  width: 40px;
  height: 40px;
  border-radius: 10px;
  background-image: url(${(props) => props.$imageUrl});
  background-size: cover;
  background-position: center;
  filter: grayscale(1);

  .Mui-selected & {
    filter: grayscale(0);
  }
`;

const HeaderActions = styled.div`
  display: flex;
  gap: 4px;
  margin-left: 8px;

  @media (max-width: 600px) {
    margin-left: auto;
  }
`;

const IconButton = styled.button`
  padding: 4px;
  border: 1px solid ${({ theme }) => theme.app.border} !important;
  border-radius: 4px;
  border: none;
  cursor: pointer;
  color: ${({ theme }) => theme.app.text.light1};
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.2s;

  &:hover {
    background: rgba(255, 255, 255, 0.2);
  }
`;

const DifficultyTitle = styled.span<{ $difficulty: string }>`
  font-size: 14px;
  font-weight: 500;

  color: ${({ $difficulty, theme }) => {
    const difficulty = $difficulty.toLowerCase();
    switch (difficulty) {
      case "노말":
        return theme.app.text.blue;
      case "하드":
        return theme.app.text.red;
      default:
        return "#666666";
    }
  }};
`;

export default FriendsIndex;
