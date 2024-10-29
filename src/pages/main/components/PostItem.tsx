import { RiMoreLine } from "@react-icons/all-files/ri/RiMoreLine";
import styled from "styled-components";

import Button from "@components/Button";

const PostItem = () => {
  return (
    <Wrapper>
      <Image />

      <Detail>
        <Header>
          <div>
            <strong>닉네임</strong>
            <em>999분전</em>
            <Category>카테고리</Category>
          </div>

          <Button variant="icon">
            <RiMoreLine size={15} />
          </Button>
        </Header>
        <Description>
          본문 본문 본문 본문 본문 본문 본문 본문 본문 본문 본문 본문 본문 본문
          본문 본문 본문 본문 본문 본문 본문 본문 본문 본문 본문 본문 본문 본문
          본문 본문 본문 본문 본문 본문 본문 본문 본문 본문 본문 본문 본문 본문
          본문 본문 본문 본문 본문 본문 본문 본문 본문 본문
        </Description>
      </Detail>
    </Wrapper>
  );
};

export default PostItem;

const Wrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  padding: 22px 24px;
  gap: 10px;
  width: 100%;
`;

const Image = styled.image`
  margin-top: 10px;
  width: 30px;
  height: 30px;
  border-radius: 4px;
  overflow: hidden;
  background: green;
`;

const Detail = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
`;

const Header = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;

  div {
    display: flex;
    flex-direction: row;
    align-items: center;

    strong {
      margin-right: 6px;
      font-weight: 700;
      font-size: 15px;
      line-height: 1;
      color: ${({ theme }) => theme.app.text.black};
    }

    em {
      display: flex;
      flex-direction: row;
      align-items: center;
      font-size: 15px;
      line-height: 1;
      color: ${({ theme }) => theme.app.text.light2};

      &:after {
        content: "";
        display: block;
        margin: 0 6px;
        width: 3px;
        height: 3px;
        border-radius: 50%;
        background: ${({ theme }) => theme.app.bg.reverse};
      }
    }
  }

  button {
    color: ${({ theme }) => theme.app.text.light2};
  }
`;

const Category = styled.span`
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 3px 9px;
  font-size: 13px;
  color: ${({ theme }) => theme.app.text.black};
  border: 1px solid ${({ theme }) => theme.app.border};
  border-radius: 4px;
`;

const Description = styled.p`
  font-size: 15px;
  color: ${({ theme }) => theme.app.text.dark2};
`;
