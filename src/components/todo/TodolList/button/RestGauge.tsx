import styled from "styled-components";

interface Props {
  currentValue: number;
  onClick: () => void;
}

const RestGauge = ({ currentValue, onClick }: Props) => {
  return (
    <Wrapper type="button" onClick={onClick}>
      <GaugeBox>
        {Array.from({ length: 10 }, (_, index) => (
          <GaugeSection
            key={index}
            $isFill={(index + 1) * 10 <= currentValue}
          />
        ))}

        <Value>휴식게이지 {currentValue}</Value>
      </GaugeBox>
    </Wrapper>
  );
};

export default RestGauge;

export const Wrapper = styled.button`
  padding: 5px;
  width: 100%;
`;

const GaugeBox = styled.div`
  position: relative;
  display: flex;
  flex-direction: row;
  width: 100%;
  border: 1px solid ${({ theme }) => theme.app.border};
`;

const GaugeSection = styled.div<{ $isFill: boolean }>`
  flex: 1;
  height: 15px;
  background: ${({ $isFill, theme }) =>
    $isFill ? theme.app.bar.blue : "transparent"};

  &:nth-of-type(2n) {
    border-right: 1px solid ${({ theme }) => theme.app.border};
  }

  &:last-of-type {
    border-right: none;
  }
`;

const Value = styled.span`
  position: absolute;
  top: 50%;
  left: 0;
  transform: translateY(-50%);
  width: 100%;
  text-align: center;
  font-size: 13px;
  line-height: 1;
  color: ${({ theme }) => theme.app.text.dark2};
`;
