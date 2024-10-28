import styled from "styled-components";

const PostItem = () => {};

export default PostItem;

const Wrapper = styled.div`
  display: flex;
  flex-direction: row;
  padding: 22px 24px;
`;

const Header = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`;

const TitleBox = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 6px;

  strong {
    font-weight: 700;
    font-size: 15px;
    line-height: 1;
    color: ${({ theme }) => theme.app.text.black};
  }

  em {
    font-weight: 700;
    font-size: 15px;
    line-height: 1;
    color: ${({ theme }) => theme.app.text.black};
  }
`;
