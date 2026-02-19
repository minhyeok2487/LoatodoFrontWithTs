import type { FC } from "react";
import styled from "styled-components";

import type { ArmoryProfile } from "@core/types/armory";

interface Props {
  profile: ArmoryProfile;
}

const ProfileHeader: FC<Props> = ({ profile }) => {
  return (
    <Wrapper>
      <InfoSection>
        <BadgeRow>
          <ServerBadge>{profile.ServerName}</ServerBadge>
          <ClassBadge>{profile.CharacterClassName}</ClassBadge>
          {profile.Title && <TitleBadge>{profile.Title}</TitleBadge>}
        </BadgeRow>

        <CharacterName>
          {profile.CharacterName}
          {profile.GuildName && (
            <GuildInfo> · {profile.GuildName}</GuildInfo>
          )}
        </CharacterName>

        <LevelRow>
          <LevelItem>
            <LevelLabel>아이템 레벨</LevelLabel>
            <LevelValue>{profile.ItemAvgLevel}</LevelValue>
          </LevelItem>
          <LevelItem>
            <LevelLabel>전투 레벨</LevelLabel>
            <LevelValue>{profile.CharacterLevel}</LevelValue>
          </LevelItem>
          <LevelItem>
            <LevelLabel>원정대 레벨</LevelLabel>
            <LevelValue>{profile.ExpeditionLevel}</LevelValue>
          </LevelItem>
          {profile.TownName && (
            <LevelItem>
              <LevelLabel>영지</LevelLabel>
              <LevelValue>
                Lv.{profile.TownLevel} {profile.TownName}
              </LevelValue>
            </LevelItem>
          )}
        </LevelRow>
      </InfoSection>

      {profile.CharacterImage && (
        <ImageSection>
          <CharacterImage
            src={profile.CharacterImage}
            alt={profile.CharacterName}
          />
        </ImageSection>
      )}
    </Wrapper>
  );
};

export default ProfileHeader;

const Wrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  padding: 28px 32px;
  border-radius: 12px;
  background: linear-gradient(135deg, #232338 0%, #1a1a2e 100%);
  overflow: hidden;
  position: relative;
  min-height: 180px;

  ${({ theme }) => theme.medias.max768} {
    flex-direction: column-reverse;
    align-items: center;
    padding: 20px 16px;
    min-height: auto;
  }
`;

const InfoSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  flex: 1;
  z-index: 1;

  ${({ theme }) => theme.medias.max768} {
    align-items: center;
    text-align: center;
  }
`;

const BadgeRow = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  flex-wrap: wrap;
`;

const BadgeBase = styled.span`
  padding: 3px 12px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 600;
`;

const ServerBadge = styled(BadgeBase)`
  background: rgba(248, 113, 113, 0.2);
  color: #f87171;
`;

const ClassBadge = styled(BadgeBase)`
  background: rgba(74, 222, 128, 0.2);
  color: #4ade80;
`;

const TitleBadge = styled(BadgeBase)`
  background: rgba(96, 165, 250, 0.2);
  color: #60a5fa;
`;

const CharacterName = styled.h2`
  display: flex;
  align-items: baseline;
  gap: 8px;
  font-size: 28px;
  font-weight: 700;
  color: #ffffff;
  margin: 0;

  ${({ theme }) => theme.medias.max768} {
    font-size: 22px;
  }
`;

const GuildInfo = styled.span`
  font-size: 14px;
  font-weight: 400;
  color: rgba(255, 255, 255, 0.5);
`;

const LevelRow = styled.div`
  display: flex;
  gap: 24px;
  flex-wrap: wrap;
  margin-top: 4px;

  ${({ theme }) => theme.medias.max768} {
    gap: 16px;
    justify-content: center;
  }
`;

const LevelItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
`;

const LevelLabel = styled.span`
  font-size: 11px;
  color: rgba(255, 255, 255, 0.45);
`;

const LevelValue = styled.span`
  font-size: 15px;
  font-weight: 700;
  color: #ffffff;
`;

const ImageSection = styled.div`
  flex-shrink: 0;
  width: 280px;
  height: 300px;
  overflow: hidden;
  margin-right: -32px;
  margin-bottom: -28px;

  ${({ theme }) => theme.medias.max768} {
    width: 180px;
    height: 200px;
    margin: 0 0 8px 0;
  }
`;

const CharacterImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: top center;
`;
