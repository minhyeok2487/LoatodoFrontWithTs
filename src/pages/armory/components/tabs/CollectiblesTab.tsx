import type { FC } from "react";
import styled from "styled-components";

import type { Collectible } from "@core/types/armory";

interface Props {
  collectibles: Collectible[] | null;
}

const CollectiblesTab: FC<Props> = ({ collectibles }) => {
  if (!collectibles || collectibles.length === 0) {
    return <EmptyMessage>수집형 포인트 정보가 없습니다.</EmptyMessage>;
  }

  return (
    <Wrapper>
      {collectibles.map((item, i) => {
        const percentage =
          item.MaxPoint > 0
            ? Math.round((item.Point / item.MaxPoint) * 100)
            : 0;

        return (
          <CollectibleCard key={i}>
            <CardHeader>
              <IconAndName>
                <CollectibleIcon src={item.Icon} alt={item.Type} />
                <CollectibleName>{item.Type}</CollectibleName>
              </IconAndName>
              <PointSummary>
                <CurrentPoint>{item.Point}</CurrentPoint>
                <MaxPoint>/ {item.MaxPoint}</MaxPoint>
              </PointSummary>
            </CardHeader>

            <ProgressBarWrapper>
              <ProgressBar>
                <ProgressFill $percentage={percentage} />
              </ProgressBar>
              <PercentageText>{percentage}%</PercentageText>
            </ProgressBarWrapper>

            {item.CollectiblePoints.length > 0 && (
              <PointList>
                {item.CollectiblePoints.map((p, j) => (
                  <PointRow key={j}>
                    <PointName>{p.PointName}</PointName>
                    <PointValue>
                      {p.Point} / {p.MaxPoint}
                    </PointValue>
                  </PointRow>
                ))}
              </PointList>
            )}
          </CollectibleCard>
        );
      })}
    </Wrapper>
  );
};

export default CollectiblesTab;

const Wrapper = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 12px;

  ${({ theme }) => theme.medias.max768} {
    grid-template-columns: 1fr;
  }
`;

const EmptyMessage = styled.div`
  padding: 40px;
  text-align: center;
  color: ${({ theme }) => theme.app.text.light2};
  font-size: 14px;
`;

const CollectibleCard = styled.div`
  padding: 16px;
  border-radius: 12px;
  background: ${({ theme }) => theme.app.bg.white};
  border: 1px solid ${({ theme }) => theme.app.border};
`;

const CardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
`;

const IconAndName = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const CollectibleIcon = styled.img`
  width: 28px;
  height: 28px;
`;

const CollectibleName = styled.span`
  font-size: 15px;
  font-weight: 600;
  color: ${({ theme }) => theme.app.text.dark1};
`;

const PointSummary = styled.div`
  display: flex;
  align-items: baseline;
  gap: 4px;
`;

const CurrentPoint = styled.span`
  font-size: 16px;
  font-weight: 700;
  color: ${({ theme }) => theme.app.text.dark1};
`;

const MaxPoint = styled.span`
  font-size: 13px;
  color: ${({ theme }) => theme.app.text.light2};
`;

const ProgressBarWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 12px;
`;

const ProgressBar = styled.div`
  flex: 1;
  height: 8px;
  border-radius: 4px;
  background: ${({ theme }) => theme.app.border};
  overflow: hidden;
`;

const ProgressFill = styled.div<{ $percentage: number }>`
  height: 100%;
  width: ${({ $percentage }) => $percentage}%;
  border-radius: 4px;
  background: #3B82F6;
  transition: width 0.3s ease;
`;

const PercentageText = styled.span`
  font-size: 12px;
  font-weight: 600;
  color: ${({ theme }) => theme.app.text.light2};
  min-width: 36px;
  text-align: right;
`;

const PointList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding-top: 8px;
  border-top: 1px solid ${({ theme }) => theme.app.border};
`;

const PointRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const PointName = styled.span`
  font-size: 12px;
  color: ${({ theme }) => theme.app.text.light2};
`;

const PointValue = styled.span`
  font-size: 12px;
  font-weight: 600;
  color: ${({ theme }) => theme.app.text.dark1};
`;
