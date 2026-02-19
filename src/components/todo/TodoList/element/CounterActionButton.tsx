import styled from "styled-components";

const CounterActionButton = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 22px;
  height: 22px;
  border-radius: 4px;
  background: ${({ theme }) => theme.app.palette.yellow[300]};
  font-size: 16px;
  color: ${({ theme }) => theme.app.palette.gray[0]};

  &:disabled {
    background: ${({ theme }) => theme.app.palette.gray[250]};
  }
`;

export default CounterActionButton;

export const CounterValue = styled.span`
  min-width: 36px;
  text-align: center;
`;
