import styled from "styled-components";

import useWindowSize from "@core/hooks/useWindowSize";

interface Props {
  totalValue: number;
  currentValue: number;
}

const GatewayGauge = ({ totalValue, currentValue }: Props) => {
  const { width } = useWindowSize();
  const gatewayText = width < 400 ? "관" : "관문";

  return (
    <Wrapper>
      <GaugeBox>
        {Array.from({ length: totalValue }, (_, index) => (
          <GatewaySection
            key={index}
            isFill={index < currentValue}
            totalCount={totalValue}
          >
            <Text>
              {index + 1}
              {gatewayText}
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

const GatewaySection = styled.div<{ isFill: boolean; totalCount: number }>`
  display: flex;
  justify-content: center;
  align-items: center;
  width: ${({ totalCount }) => (1 / totalCount) * 100}%;
  height: 15px;
  background: ${({ isFill, theme }) =>
    isFill ? theme.app.bar.red : "transparent"};

  &:not(:last-of-type) {
    border-right: 1px solid ${({ theme }) => theme.app.border};
  }
`;

const Text = styled.span`
  font-size: 13px;
  line-height: 1;
  color: ${({ theme }) => theme.app.text.dark2};
`;
