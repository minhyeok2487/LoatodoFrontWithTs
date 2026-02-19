import type { FC } from "react";
import styled from "styled-components";

import type { ArmoryAvatar } from "@core/types/armory";
import { getGradeColor, stripHtml } from "@core/utils/tooltipParser";

interface Props {
  avatars: ArmoryAvatar[] | null;
}

const AvatarTab: FC<Props> = ({ avatars }) => {
  if (!avatars || avatars.length === 0) {
    return <EmptyMessage>아바타 정보가 없습니다.</EmptyMessage>;
  }

  return (
    <Wrapper>
      <AvatarGrid>
        {avatars.map((avatar, i) => {
          const gradeColor = getGradeColor(avatar.Grade);

          return (
            <AvatarCard key={i}>
              <AvatarIconWrapper $gradeColor={gradeColor}>
                <AvatarIcon src={avatar.Icon} alt={avatar.Name} />
              </AvatarIconWrapper>
              <AvatarInfo>
                <AvatarName $gradeColor={gradeColor}>
                  {stripHtml(avatar.Name)}
                </AvatarName>
                <AvatarType>
                  {avatar.Type}
                  {avatar.IsInner && " (내부)"}
                </AvatarType>
              </AvatarInfo>
            </AvatarCard>
          );
        })}
      </AvatarGrid>
    </Wrapper>
  );
};

export default AvatarTab;

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const EmptyMessage = styled.div`
  padding: 40px;
  text-align: center;
  color: ${({ theme }) => theme.app.text.light2};
  font-size: 14px;
`;

const AvatarGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 10px;

  ${({ theme }) => theme.medias.max768} {
    grid-template-columns: 1fr;
  }
`;

const AvatarCard = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  border-radius: 10px;
  background: ${({ theme }) => theme.app.bg.white};
  border: 1px solid ${({ theme }) => theme.app.border};
`;

const AvatarIconWrapper = styled.div<{ $gradeColor: string }>`
  width: 50px;
  height: 50px;
  border-radius: 8px;
  border: 2px solid ${({ $gradeColor }) => $gradeColor};
  overflow: hidden;
  flex-shrink: 0;
  background: #1a1a2e;
`;

const AvatarIcon = styled.img`
  width: 100%;
  height: 100%;
  object-fit: contain;
`;

const AvatarInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
`;

const AvatarName = styled.span<{ $gradeColor: string }>`
  font-size: 13px;
  font-weight: 600;
  color: ${({ $gradeColor }) => $gradeColor};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const AvatarType = styled.span`
  font-size: 11px;
  color: ${({ theme }) => theme.app.text.light2};
`;
