import { useState } from "react";
import styled from "styled-components";

import { useUpdateRaidMoreRewardCheck } from "@core/hooks/mutations/todo";
import useIsBelowWidth from "@core/hooks/useIsBelowWidth";
import { updateCharacterQueryData } from "@core/lib/queryClient";
import type { Character } from "@core/types/character";
import type { Friend } from "@core/types/friend";

import ArrowIcon from "@assets/images/ico_arr.png";
import CheckIcon from "@assets/images/ico_chk.png";
import CheckonIcon from "@assets/images/ico_chkon.png";

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

  const [isMoreVisible, setIsMoreVisible] = useState(false);
  const showMoreButton = true;
  const [localMoreRewardList, setLocalMoreRewardList] =
    useState(moreRewardCheckList);

  return (
    <Wrapper>
      <GaugeBox $totalCount={totalValue} $currentCount={currentValue}>
        {Array.from({ length: totalValue }, (_, index) => (
          <GatewaySection
            key={index}
            $isFill={index < currentValue}
            $totalCount={totalValue}
          >
            <Text>
              {index + 1}
              {gatewayText}
            </Text>
          </GatewaySection>
        ))}
      </GaugeBox>
      {showMoreButton && (
        <>
          <MoreButton
            $moreRewardCheckList={moreRewardCheckList}
            onClick={() => setIsMoreVisible(!isMoreVisible)}
          >
            {moreRewardCheckList.every((item) => item) ? (
              <span>더보기 완료</span>
            ) : (
              <span>더보기</span>
            )}

            <Arrow src={ArrowIcon} $isOpen={isMoreVisible} alt="" />
          </MoreButton>
          {isMoreVisible && (
            <MoreCheck>
              {Array.from({ length: totalValue }, (_, i) =>
                i < currentValue ? (
                  <CheckItem key={i}>
                    <label htmlFor={`checkbox-${i}`}>
                      <StyledCheckbox
                        id={`checkbox-${i}`}
                        type="checkbox"
                        checked={localMoreRewardList[i]}
                        onChange={() => {
                          const newList = [...localMoreRewardList];
                          newList[i] = !newList[i];
                          setLocalMoreRewardList(newList);
                          updateRaidMoreRewardCheck.mutate({
                            friendUsername: friend?.friendUsername,
                            characterId: character.characterId,
                            weekCategory,
                            gate: i + 1,
                          });
                        }}
                      />
                      <MoreStage>
                        {i + 1}
                        {isBelowWidth400 ? "관" : "관"}
                      </MoreStage>
                    </label>
                  </CheckItem>
                ) : null
              )}
            </MoreCheck>
          )}
        </>
      )}
    </Wrapper>
  );
};

export default GatewayGauge;

export const Wrapper = styled.div`
  padding: 5px;
  width: 100%;
`;

const GaugeBox = styled.div<{
  $totalCount: number;
  $currentCount: number;
}>`
  display: flex;
  flex-direction: space-around;
  width: 100%;
  border: 1px solid ${({ theme }) => theme.app.border};
  opacity: ${(props) => (props.$currentCount === props.$totalCount ? 0.3 : 1)};
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

const MoreCheck = styled.div`
  display: flex;
  gap: 5px;
`;

const StyledCheckbox = styled.input`
  appearance: none;
  cursor: pointer;
  padding-left: 20px;
`;

const MoreStage = styled.span`
  font-size: 14px;
  margin-left: -2px;
`;

const CheckItem = styled.div`
  display: inline-flex;
  align-items: center;
  flex-shrink: initial;

  label {
    background: url(${CheckIcon}) no-repeat center left;
    cursor: pointer;

    &:has(input:checked) {
      background-image: url(${CheckonIcon});
      color: #ffb8ad;
    }
  }
`;

const MoreButton = styled.button<{
  $moreRewardCheckList: boolean[];
}>`
  display: flex;
  align-items: center;
  margin-top: 6px;
  padding-left: 2px;
  opacity: ${(props) =>
    props.$moreRewardCheckList.every((item) => item) ? 0.3 : 1};
  color: ${(props) =>
    props.$moreRewardCheckList.every((item) => item) ? "#ffb8ad" : ""};

  span {
    font-size: 13px;
  }
`;

const Arrow = styled.img<{ $isOpen: boolean }>`
  margin-left: auto;
  transform: rotate(${({ $isOpen }) => ($isOpen ? 270 : 90)}deg);
  transition: transform 0.2s;
  width: 16px;
  height: 16px;
`;
