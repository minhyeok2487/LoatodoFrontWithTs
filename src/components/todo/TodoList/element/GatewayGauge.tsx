import styled from "styled-components";

import { useUpdateRaidMoreRewardCheck } from "@core/hooks/mutations/todo";
import useIsBelowWidth from "@core/hooks/useIsBelowWidth";
import { updateCharacterQueryData } from "@core/lib/queryClient";
import type { Character } from "@core/types/character";
import type { Friend } from "@core/types/friend";

import Button from "@components/Button";

interface Props {
  totalValue: number;
  currentValue: number;
  moreRewardCheckList: boolean[];
  weekCategory: string;
  friend?: Friend;
  character: Character;
}

const GatewayGauge = ({
  totalValue,
  currentValue,
  moreRewardCheckList,
  weekCategory,
  friend,
  character,
}: Props) => {
  const isBelowWidth400 = useIsBelowWidth(400);
  const gatewayText = isBelowWidth400 ? "관" : "관문";

  const updateRaidMoreRewardCheck = useUpdateRaidMoreRewardCheck({
    onSuccess: (character, { friendUsername }) => {
      updateCharacterQueryData({
        character,
        friendUsername,
      });
    },
  });

  return (
    <Wrapper>
      <GaugeBox>
        {Array.from({ length: totalValue }, (_, index) => (
          <GatewaySection
            key={index}
            $isFill={index < currentValue}
            $totalCount={totalValue}
          >
            <Text>
              <div>
                {!moreRewardCheckList[index] && index < currentValue ? (
                  <Button
                    onClick={() => {
                      updateRaidMoreRewardCheck.mutate({
                        friendUsername: friend?.friendUsername,
                        characterId: character.characterId,
                        weekCategory,
                        gate: index + 1,
                      });
                    }}
                  >
                    {index + 1}
                    {gatewayText} 더보기
                  </Button>
                ) : (
                  <span>
                    {index + 1}
                    {gatewayText}
                  </span>
                )}
              </div>
            </Text>
          </GatewaySection>
        ))}
      </GaugeBox>
    </Wrapper>
  );
};

export default GatewayGauge;

export const Wrapper = styled.div`
  padding: 5px;
  width: 100%;
`;

const GaugeBox = styled.div`
  display: flex;
  flex-direction: space-around;
  width: 100%;
  border: 1px solid ${({ theme }) => theme.app.border};
`;

const GatewaySection = styled.div<{ $isFill: boolean; $totalCount: number }>`
  display: flex;
  justify-content: center;
  align-items: center;
  width: ${({ $totalCount }) => (1 / $totalCount) * 100}%;
  height: 15px;
  background: ${({ $isFill, theme }) =>
    $isFill ? theme.app.gauge.red : "transparent"};

  &:not(:last-of-type) {
    border-right: 1px solid ${({ theme }) => theme.app.border};
  }
`;

const Text = styled.span`
  font-size: 13px;
  line-height: 1;
  color: ${({ theme }) => theme.app.text.dark2};
`;
