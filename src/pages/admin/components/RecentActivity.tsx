import type { FC } from "react";
import styled from "styled-components";

import type { RecentActivity as RecentActivityType } from "@core/types/admin";

interface Props {
  activities: RecentActivityType[];
}

const formatTimeAgo = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffMins < 1) return "방금 전";
  if (diffMins < 60) return `${diffMins}분 전`;
  if (diffHours < 24) return `${diffHours}시간 전`;
  return `${diffDays}일 전`;
};

const getActivityColor = (type: RecentActivityType["type"]): string => {
  switch (type) {
    case "NEW_MEMBER":
      return "#667eea";
    case "NEW_CHARACTER":
      return "#764ba2";
    default:
      return "#667eea";
  }
};

const RecentActivity: FC<Props> = ({ activities }) => {
  if (activities.length === 0) {
    return <EmptyMessage>최근 활동이 없습니다.</EmptyMessage>;
  }

  return (
    <List>
      {activities.map((activity, index) => (
        <Item key={`${activity.type}-${activity.createdDate}-${index}`}>
          <Dot $color={getActivityColor(activity.type)} />
          <Content>
            <Action>{activity.message}</Action>
            <Target>{activity.detail}</Target>
          </Content>
          <Time>{formatTimeAgo(activity.createdDate)}</Time>
        </Item>
      ))}
    </List>
  );
};

export default RecentActivity;

const List = styled.div`
  display: flex;
  flex-direction: column;
`;

const Item = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px 0;
  border-bottom: 1px solid ${({ theme }) => theme.app.border};

  &:last-child {
    border-bottom: none;
  }
`;

const Dot = styled.div<{ $color: string }>`
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: ${({ $color }) => $color};
  flex-shrink: 0;
`;

const Content = styled.div`
  flex: 1;
  min-width: 0;
`;

const Action = styled.span`
  font-size: 14px;
  font-weight: 500;
  color: ${({ theme }) => theme.app.text.main};
`;

const Target = styled.span`
  font-size: 14px;
  color: ${({ theme }) => theme.app.text.light1};
  margin-left: 8px;
`;

const Time = styled.span`
  font-size: 12px;
  color: ${({ theme }) => theme.app.text.light2};
  flex-shrink: 0;
`;

const EmptyMessage = styled.div`
  text-align: center;
  padding: 40px 20px;
  font-size: 14px;
  color: ${({ theme }) => theme.app.text.light2};
`;
