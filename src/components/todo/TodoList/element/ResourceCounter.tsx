import { FiMinus } from "@react-icons/all-files/fi/FiMinus";
import { FiPlus } from "@react-icons/all-files/fi/FiPlus";
import styled from "styled-components";

import CounterActionButton, { CounterValue } from "./CounterActionButton";

interface ResourceCounterProps {
  value: number;
  label: string;
  max?: number;
  unit?: string;
  onIncrement: () => void;
  onDecrement: () => void;
}

const ResourceCounter = ({
  value,
  label,
  max,
  unit = "개",
  onIncrement,
  onDecrement,
}: ResourceCounterProps) => {
  return (
    <Wrapper>
      <Counter>
        <CounterActionButton
          disabled={value <= 0}
          onClick={onDecrement}
        >
          <FiMinus />
        </CounterActionButton>
        <CounterValue>
          {max != null ? `${value} / ${max}` : `${value} ${unit}`}
        </CounterValue>
        <CounterActionButton
          disabled={max != null ? value >= max : false}
          onClick={onIncrement}
        >
          <FiPlus />
        </CounterActionButton>
        {" "}{label}
      </Counter>
    </Wrapper>
  );
};

export default ResourceCounter;

export const Wrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding-left: 10px;
  font-size: 14px;
  border-top: 1px solid ${({ theme }) => theme.app.border};
`;

export const Counter = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 5px;
  margin: 5px 0;
`;
