import styled from "styled-components";

interface Props {
  children: string;
}

const Welcome = ({ children }: Props) => {
  return (
    <Wrapper>
      <Text>{children}</Text>
    </Wrapper>
  );
};

export default Welcome;

const Wrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  width: 100%;
`;

const Text = styled.span`
  font-size: 30px;
  font-weight: 700;
  color: ${({ theme }) => theme.app.text.dark2};
`;
