import styled from "styled-components";

const FollowSection = () => {
  return (
    <FollowSectionWrapper>
      <SectionTitle>내 팔로우</SectionTitle>
      <FollowList>
        <FollowItem>
          <FollowAvatar />
          <FollowName>나</FollowName>
        </FollowItem>
        <FollowItem>
          <FollowAvatar />
        </FollowItem>
        <FollowItem>
          <FollowAvatar />
        </FollowItem>
        <FollowItem>
          <FollowAvatar />
        </FollowItem>
      </FollowList>
    </FollowSectionWrapper>
  );
};

const FollowSectionWrapper = styled.div`
  display: flex;
  flex-direction: row;
`;

const SectionTitle = styled.h2`
  font-size: 16px;
  font-weight: bold;
  margin-bottom: 12px;
  color: ${({ theme }) => theme.app.text.light2};
`;

const FollowList = styled.div`
  display: flex;
  gap: 12px;
`;

const FollowItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
`;

const FollowAvatar = styled.div`
  width: 48px;
  height: 48px;
  background-color: ${({ theme }) => theme.app.bg.gray1};
  border-radius: 4px;
  cursor: pointer;
`;

const FollowName = styled.span`
  font-size: 12px;
  color: ${({ theme }) => theme.app.text.dark1};
`;

export default FollowSection;