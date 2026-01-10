import type { FC } from "react";
import styled from "styled-components";

interface Activity {
  id: number;
  type: "member" | "character" | "donation";
  action: string;
  target: string;
  time: string;
}

interface Props {
  activities: Activity[];
}

const RecentActivity: FC<Props> = ({ activities }) => {
  return (
    <List>
      {activities.map((activity) => (
        <Item key={activity.id}>
          <Dot $type={activity.type} />
          <Content>
            <Action>{activity.action}</Action>
            <Target>{activity.target}</Target>
          </Content>
          <Time>{activity.time}</Time>
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

const activityColors = {
  member: "#667eea",
  character: "#764ba2",
  donation: "#10b981",
};

const Dot = styled.div<{ $type: Activity["type"] }>`
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: ${({ $type }) => activityColors[$type]};
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
