import { RiMoreLine } from "@react-icons/all-files/ri/RiMoreLine";
import styled from "styled-components";

import { COMMUNITY_CATEGORY } from "@core/constants";
import { useLikeCommunityPost } from "@core/hooks/mutations/community";
import type { Comment, CommunityPost } from "@core/types/community";
import { getTimeAgoString } from "@core/utils";

import Button from "@components/Button";

import UserIcon from "@assets/images/user_icon.png";
import CommentIcon from "@assets/svg/CommentIcon";
import MokokoIcon from "@assets/svg/MokokoIcon";

interface Props {
  onClick?: () => void;
  data: CommunityPost | Comment;
}

const PostItem = ({ onClick, data }: Props) => {
  const isPost = "communityId" in data;

  const likeCommunityPost = useLikeCommunityPost({
    onSuccess: (_, communityId) => {
      console.log(communityId);
    },
  });

  return (
    <Wrapper onClick={onClick}>
      <Image src={UserIcon} />

      <Detail>
        <Header>
          <div>
            <strong>{data.name}</strong>
            <em>{getTimeAgoString(data.createdDate)}</em>
            {isPost && <Category>{COMMUNITY_CATEGORY[data.category]}</Category>}
          </div>

          {/* <Button
            variant="icon"
            onClick={(e) => {
              e.stopPropagation();
            }}
          >
            <RiMoreLine size={15} />
          </Button> */}
        </Header>
        <Description>
          {data.body.split("\n").map((text, index) => (
            <>
              {text}
              <br />
            </>
          ))}
        </Description>

        <Buttons>
          <BottomButton
            onClick={(e) => {
              e.stopPropagation();

              likeCommunityPost.mutate(
                isPost ? data.communityId : data.commentId
              );
            }}
          >
            <MokokoIcon isActive={data.myLike} />
            {data.likeCount}
          </BottomButton>

          {isPost && (
            <BottomButton
              onClick={(e) => {
                e.stopPropagation();
              }}
            >
              <CommentIcon />
              {data.commentCount}
            </BottomButton>
          )}
        </Buttons>
      </Detail>
    </Wrapper>
  );
};

export default PostItem;

export const Wrapper = styled.div<{ onClick?: () => void }>`
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  gap: 10px;
  width: 100%;
  cursor: ${({ onClick }) => (onClick ? "pointer" : "default")};
`;

const Image = styled.img`
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

const Buttons = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 16px;
  margin-top: 24px;
`;

const BottomButton = styled.button`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 9px;
  color: ${({ theme }) => theme.app.text.light1};
  font-size: 14px;

  svg {
    width: 18px;
  }
`;
