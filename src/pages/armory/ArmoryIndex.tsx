import { useState, useEffect, type FC } from "react";
import { useSearchParams } from "react-router-dom";
import styled from "styled-components";

import WideDefaultLayout from "@layouts/WideDefaultLayout";

import useArmory from "@core/hooks/queries/armory/useArmory";
import useSiblings from "@core/hooks/queries/armory/useSiblings";

import ProfileHeader from "./components/ProfileHeader";
import SearchBar from "./components/SearchBar";
import ArkPassiveTab from "./components/tabs/ArkPassiveTab";
import AvatarTab from "./components/tabs/AvatarTab";
import CollectiblesTab from "./components/tabs/CollectiblesTab";
import ExpeditionTab from "./components/tabs/ExpeditionTab";
import SkillsTab from "./components/tabs/SkillsTab";
import StatsTab from "./components/tabs/StatsTab";

const TABS = [
  { key: "stats", label: "능력치" },
  { key: "skills", label: "스킬" },
  { key: "arkpassive", label: "아크패시브" },
  { key: "collectibles", label: "수집형 포인트" },
  { key: "avatar", label: "아바타" },
  { key: "expedition", label: "원정대" },
] as const;

type TabKey = (typeof TABS)[number]["key"];

const ArmoryIndex: FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const nameFromUrl = searchParams.get("name") || "";

  const [characterName, setCharacterName] = useState(nameFromUrl);
  const [activeTab, setActiveTab] = useState<TabKey>("stats");

  const armoryQuery = useArmory(characterName);
  const siblingsQuery = useSiblings(characterName);

  useEffect(() => {
    if (nameFromUrl && nameFromUrl !== characterName) {
      setCharacterName(nameFromUrl);
    }
  }, [nameFromUrl]);

  const handleSearch = (name: string) => {
    setCharacterName(name);
    setSearchParams({ name });
    setActiveTab("stats");
  };

  const handleTabChange = (tab: TabKey) => {
    setActiveTab(tab);
    if (tab === "expedition" && characterName) {
      siblingsQuery.refetch();
    }
  };

  const profile = armoryQuery.data?.ArmoryProfile;

  const renderTab = () => {
    if (!armoryQuery.data) return null;

    switch (activeTab) {
      case "stats":
        return <StatsTab data={armoryQuery.data} />;
      case "skills":
        return <SkillsTab skills={armoryQuery.data.ArmorySkills} />;
      case "arkpassive":
        return <ArkPassiveTab arkPassive={armoryQuery.data.ArkPassive} />;
      case "collectibles":
        return (
          <CollectiblesTab collectibles={armoryQuery.data.Collectibles} />
        );
      case "avatar":
        return <AvatarTab avatars={armoryQuery.data.ArmoryAvatars} />;
      case "expedition":
        return (
          <ExpeditionTab
            siblings={siblingsQuery.data || null}
            isLoading={siblingsQuery.isFetching}
            currentCharacter={characterName}
            onCharacterClick={handleSearch}
          />
        );
      default:
        return null;
    }
  };

  return (
    <WideDefaultLayout pageTitle="전투정보실">
      <Wrapper>
        <SearchBar
          defaultValue={nameFromUrl}
          onSearch={handleSearch}
          isLoading={armoryQuery.isFetching}
        />

        {armoryQuery.isError && (
          <ErrorMessage>
            캐릭터 정보를 불러올 수 없습니다. 캐릭터명을 확인해주세요.
          </ErrorMessage>
        )}

        {armoryQuery.isFetching && !armoryQuery.data && (
          <LoadingMessage>캐릭터 정보를 불러오는 중...</LoadingMessage>
        )}

        {profile && (
          <>
            <ProfileHeader profile={profile} />

            <TabBar>
              {TABS.map((tab) => (
                <TabButton
                  key={tab.key}
                  $active={activeTab === tab.key}
                  onClick={() => handleTabChange(tab.key)}
                >
                  {tab.label}
                </TabButton>
              ))}
            </TabBar>

            <TabContent>{renderTab()}</TabContent>
          </>
        )}
      </Wrapper>
    </WideDefaultLayout>
  );
};

export default ArmoryIndex;

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  width: 100%;
`;

const ErrorMessage = styled.div`
  padding: 16px;
  border-radius: 8px;
  background: #fef2f2;
  color: #dc2626;
  font-size: 14px;
  text-align: center;
`;

const LoadingMessage = styled.div`
  padding: 40px;
  text-align: center;
  color: ${({ theme }) => theme.app.text.light2};
  font-size: 14px;
`;

const TabBar = styled.div`
  display: flex;
  gap: 4px;
  border-bottom: 1px solid ${({ theme }) => theme.app.border};
  overflow-x: auto;

  &::-webkit-scrollbar {
    display: none;
  }
`;

const TabButton = styled.button<{ $active: boolean }>`
  padding: 10px 18px;
  font-size: 14px;
  font-weight: ${({ $active }) => ($active ? 600 : 400)};
  color: ${({ theme, $active }) =>
    $active ? theme.app.text.dark1 : theme.app.text.light2};
  border-bottom: 2px solid
    ${({ theme, $active }) => ($active ? theme.app.text.dark1 : "transparent")};
  background: none;
  white-space: nowrap;
  transition: all 0.15s;

  &:hover {
    color: ${({ theme }) => theme.app.text.dark1};
  }
`;

const TabContent = styled.div`
  width: 100%;
`;
