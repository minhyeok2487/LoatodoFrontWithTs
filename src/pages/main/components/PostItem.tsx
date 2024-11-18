import { RiMoreLine } from "@react-icons/all-files/ri/RiMoreLine";
import { useState } from "react";
import styled from "styled-components";

import { COMMUNITY_CATEGORY } from "@core/constants";
import { useLikeCommunityPost } from "@core/hooks/mutations/community";
import type { Comment, CommunityPost } from "@core/types/community";
import { getTimeAgoString } from "@core/utils";

import UserIcon from "@assets/images/user_icon.png";
import CommentIcon from "@assets/svg/CommentIcon";
import MokokoIcon from "@assets/svg/MokokoIcon";

import ImageList from "./ImageList";

type DataProps =
  | {
      data: CommunityPost;
    }
  | {
      data: Comment;
      onReplyClick: (id: number) => void;
    };

type Props = {
  onClick?: () => void;
  onLike?: (id: number) => void;
  mention?: string;
} & DataProps;

const PostItem = ({ onClick, onLike, data, mention, ...props }: Props) => {
  const [isImageModalOpen, setImageModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const isComment = "commentId" in data;

  const likeCommunityPost = useLikeCommunityPost({
    onSuccess: (_, id) => {
      onLike?.(id);
    },
  });

  const handleImageClick = (image: string) => {
    setSelectedImage(image);
    setImageModalOpen(true);
  };

  const closeImageModal = () => {
    setImageModalOpen(false);
    setSelectedImage(null);
  };

  return (
    <Wrapper onClick={onClick}>
      <Image src={UserIcon} />

      <Detail>
        <Header>
          <div>
            <strong>{data.name}</strong>
            <em>{getTimeAgoString(data.createdDate)}</em>
            {!isComment && (
              <Category>{COMMUNITY_CATEGORY[data.category]}</Category>
            )}
          </div>
        </Header>
        <Description>
          {mention && <strong>@{mention}</strong>}
          &nbsp;
          {data.body.split("\n").map((text, index) => (
            <span key={index}>
              {text}
              <br />
            </span>
          ))}
        </Description>
        {data.imageList && (
          <ImageList
            imageList={data.imageList}
            onImageClick={handleImageClick}
          />
        )}

        <Buttons>
          <BottomButton
            onClick={(e) => {
              e.stopPropagation();
              likeCommunityPost.mutate(
                isComment ? data.commentId : data.communityId
              );
            }}
          >
            <MokokoIcon isActive={data.myLike} />
            {data.likeCount}
          </BottomButton>

          {isComment ? (
            "onReplyClick" in props && (
              <BottomButton
                onClick={(e) => {
                  e.stopPropagation();
                  props.onReplyClick(data.commentId);
                }}
              >
                <CommentIcon />
                답글
              </BottomButton>
            )
          ) : (
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

      {isImageModalOpen && (
        <ModalOverlay
          onClick={(e) => {
            e.stopPropagation();
            closeImageModal();
          }}
        >
          <ModalContent
            onClick={(e) => {
              e.stopPropagation();
            }}
          >
            <img src={selectedImage!} alt="Enlarged" />
          </ModalContent>
        </ModalOverlay>
      )}
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
  margin-top: 1px;
  width: 30px;
  height: 30px;
  border-radius: 4px;
  overflow: hidden;
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
    align-items: flex-start;
    font-size: 15px;
    line-height: 18px;

    strong {
      margin-right: 6px;
      font-weight: 700;
      color: ${({ theme }) => theme.app.text.black};
    }

    em {
      display: flex;
      flex-direction: row;
      align-items: center;
      color: ${({ theme }) => theme.app.text.light2};
    }
  }
`;

const Category = styled.span`
  position: relative;
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-left: 15px;
  padding: 3px 9px;
  font-size: 13px;
  line-height: 16px;
  transform: translateY(-3px);
  color: ${({ theme }) => theme.app.text.black};
  border: 1px solid ${({ theme }) => theme.app.border};
  border-radius: 4px;

  &:before {
    content: "";
    position: absolute;
    left: -10px;
    top: 50%;
    transform: translateY(-50%);
    display: block;
    width: 3px;
    height: 3px;
    border-radius: 50%;
    background: ${({ theme }) => theme.app.bg.reverse};
  }
`;

const Description = styled.p`
  margin-top: 10px;
  font-size: 15px;
  color: ${({ theme }) => theme.app.text.dark2};

  strong {
    font-weight: bold;
    color: ${({ theme }) => theme.app.text.blue};
  }
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

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000; /* Ensure modal is on top */
`;

const ModalContent = styled.div`
  background: white;
  padding: 10px;
  border-radius: 8px;
  max-width: 90%;
  max-height: 90%;
  overflow: hidden;

  img {
    width: 100%;
    height: auto;
  }
`;
