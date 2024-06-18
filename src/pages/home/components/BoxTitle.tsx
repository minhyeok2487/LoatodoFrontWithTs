import styled from "@emotion/styled";

interface Props {
  children: string;
}

const BoxTitle = ({ children }: Props) => {
  return <Wrapper>{children}</Wrapper>;
};

export default BoxTitle;

const Wrapper = styled.h2`
  width: 100%;
  text-align: left;
  font-size: 20px;
  color: ${({ theme }) => theme.app.text.dark2};
  font-weight: 600;
`;
