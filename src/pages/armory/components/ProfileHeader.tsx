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
        <TopRow>
          <ServerBadge>{profile.ServerName}</ServerBadge>
          <ClassName>{profile.CharacterClassName}</ClassName>
          {profile.GuildName && <GuildName>{profile.GuildName}</GuildName>}
        </TopRow>

        <CharacterName>
          {profile.Title && <Title>{profile.Title}</Title>}
          {profile.CharacterName}
        </CharacterName>

        <LevelRow>
          <LevelItem>
            <LevelLabel>아이템</LevelLabel>
            <LevelValue>{profile.ItemAvgLevel}</LevelValue>
          </LevelItem>
          <LevelItem>
            <LevelLabel>전투</LevelLabel>
            <LevelValue>Lv.{profile.CharacterLevel}</LevelValue>
          </LevelItem>
          <LevelItem>
            <LevelLabel>원정대</LevelLabel>
            <LevelValue>Lv.{profile.ExpeditionLevel}</LevelValue>
          </LevelItem>
          {profile.CombatPower && (
            <LevelItem>
              <LevelLabel>전투력</LevelLabel>
              <LevelValue>{profile.CombatPower}</LevelValue>
            </LevelItem>
          )}
        </LevelRow>

        {profile.TownName && (
          <TownInfo>
            {profile.TownName} Lv.{profile.TownLevel}
          </TownInfo>
        )}
      </InfoSection>

      {profile.CharacterImage && (
        <ImageSection>
          <CharacterImage src={profile.CharacterImage} alt={profile.CharacterName} />
        </ImageSection>
      )}
    </Wrapper>
  );
};

export default ProfileHeader;

const Wrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: 20px 24px;
  border-radius: 12px;
  background: ${({ theme }) => theme.app.bg.white};
  border: 1px solid ${({ theme }) => theme.app.border};
  overflow: hidden;

  ${({ theme }) => theme.medias.max768} {
    flex-direction: column-reverse;
    align-items: center;
    padding: 16px;
  }
`;

const InfoSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  flex: 1;

  ${({ theme }) => theme.medias.max768} {
    align-items: center;
    text-align: center;
  }
`;

const TopRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
`;

const ServerBadge = styled.span`
  padding: 2px 10px;
  border-radius: 4px;
  background: ${({ theme }) => theme.app.bg.reverse};
  color: ${({ theme }) => theme.app.text.reverse};
  font-size: 12px;
  font-weight: 600;
`;

const ClassName = styled.span`
  font-size: 14px;
  color: ${({ theme }) => theme.app.text.light2};
`;

const GuildName = styled.span`
  font-size: 13px;
  color: ${({ theme }) => theme.app.text.light2};

  &::before {
    content: "|";
    margin-right: 8px;
    color: ${({ theme }) => theme.app.border};
  }
`;

const CharacterName = styled.h2`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 24px;
  font-weight: 700;
  color: ${({ theme }) => theme.app.text.dark1};

  ${({ theme }) => theme.medias.max768} {
    font-size: 20px;
  }
`;

const Title = styled.span`
  font-size: 13px;
  font-weight: 400;
  color: ${({ theme }) => theme.app.text.light2};
`;

const LevelRow = styled.div`
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
`;

const LevelItem = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
`;

const LevelLabel = styled.span`
  font-size: 13px;
  color: ${({ theme }) => theme.app.text.light2};
`;

const LevelValue = styled.span`
  font-size: 14px;
  font-weight: 600;
  color: ${({ theme }) => theme.app.text.dark1};
`;

const TownInfo = styled.span`
  font-size: 13px;
  color: ${({ theme }) => theme.app.text.light2};
`;

const ImageSection = styled.div`
  flex-shrink: 0;
  width: 180px;
  height: 200px;
  overflow: hidden;

  ${({ theme }) => theme.medias.max768} {
    width: 140px;
    height: 160px;
    margin-bottom: 8px;
  }
`;

const CharacterImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: top center;
`;
