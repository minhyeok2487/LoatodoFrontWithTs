import { RiMoreLine } from "@react-icons/all-files/ri/RiMoreLine";
import { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import styled from "styled-components";

import { COMMUNITY_CATEGORY } from "@core/constants";
import {
  useEditCommunityPost,
  useLikeCommunityPost,
  useRemoveCommunityPost,
} from "@core/hooks/mutations/community";
import queryClient from "@core/lib/queryClient";
import type {
  Comment,
  CommunityPost,
  EditCommunityPostRequest,
} from "@core/types/community";
import { getIsSpecialist, getTimeAgoString } from "@core/utils";
import queryKeyGenerator from "@core/utils/queryKeyGenerator";

import Button from "@components/Button";

import UserIcon from "@assets/images/user_icon.png";
import CommentIcon from "@assets/svg/CommentIcon";
import MokokoIcon from "@assets/svg/MokokoIcon";
import RemoveIcon from "@assets/svg/RemoveIcon";

import EditForm from "./EditForm";
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
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isEditFormOpen, setEditFormOpen] = useState(false);
  const editPostMutation = useEditCommunityPost();
  const dropdownRef = useRef<HTMLDivElement>(null);
  const isComment = "commentId" in data;

  const [isLiked, setIsLiked] = useState(data.myLike);
  const [likeCount, setLikeCount] = useState(data.likeCount);

  const [timeLeft, setTimeLeft] = useState<number>(0);
  const createdDate = new Date(data.createdDate); // 작성 시각
  const fifteenMinutes = 15 * 60 * 1000; // 15분을 밀리초로 변환

  const removeCommunityPost = useRemoveCommunityPost({
    onSuccess: () => {
      toast.success(`게시글을 삭제했습니다.`);
      queryClient.invalidateQueries({
        queryKey: queryKeyGenerator.getCommunityList(),
      });
    },
  });

  const handleClickOutside = (event: MouseEvent) => {
    if (
      dropdownRef.current &&
      !dropdownRef.current.contains(event.target as Node)
    ) {
      setIsDropdownOpen(false);
    }
  };

  useEffect(() => {
    const now = new Date();
    const timeDifference = now.getTime() - createdDate.getTime();
    const remainingTime = fifteenMinutes - timeDifference;

    if (remainingTime > 0) {
      setTimeLeft(remainingTime);
      const timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1000) {
            clearInterval(timer);
            return 0;
          }
          return prev - 1000; // 1초씩 감소
        });
      }, 1000);

      return () => clearInterval(timer); // Cleanup function
    }
    setTimeLeft(0); // 15분이 지나면 0으로 설정

    setIsLiked(data.myLike);
    setLikeCount(data.likeCount);
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [data]);

  const handleLikeClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    likeCommunityPost.mutate(isComment ? data.commentId : data.communityId, {
      onSuccess: () => {
        setIsLiked((prev) => {
          const newLikedStatus = !prev;
          setLikeCount((count) => (newLikedStatus ? count + 1 : count - 1));
          return newLikedStatus;
        });
      },
    });
  };

  const handleMoreButtonClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsDropdownOpen((prev) => !prev);
  };

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm("삭제하시겠습니까?")) {
      removeCommunityPost.mutate(isComment ? data.commentId : data.communityId);
    }
    setIsDropdownOpen(false);
  };

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

  const handleEditClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setEditFormOpen(true);
  };

  const handleSubmitEdit = (editedData: EditCommunityPostRequest) => {
    editPostMutation.mutate(editedData, {
      onSuccess: () => {
        setEditFormOpen(false);
        queryClient.invalidateQueries({
          queryKey: queryKeyGenerator.getCommunityList(),
        });
      },
    });
  };

  return (
    <Wrapper onClick={isEditFormOpen ? undefined : onClick}>
      <ImageWrapper hasCharacterImage={data.characterImage != null}>
        <StyledImage
          src={data.characterImage == null ? UserIcon : data.characterImage}
          hasCharacterImage={data.characterImage != null}
          isSpecialist={getIsSpecialist(data.characterClassName)}
        />
      </ImageWrapper>

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
        {data.imageList && data.imageList.length > 0 && (
          <ImageList
            imageList={data.imageList}
            onImageClick={handleImageClick}
          />
        )}

        <Buttons>
          <BottomButton onClick={handleLikeClick}>
            <MokokoIcon isActive={isLiked} />
            {likeCount}
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

      <MoreButtonWrapper ref={dropdownRef}>
        <Button variant="icon" onClick={handleMoreButtonClick}>
          <RiMoreLine size={15} />
        </Button>

        {isDropdownOpen && (
          <DropdownMenu>
            {data.myPost && (
              <>
                <DropdownItem
                  onClick={handleDeleteClick}
                  style={{ color: "#F03E3E" }}
                >
                  삭제하기 <RemoveIcon />
                </DropdownItem>
                <DropdownItem
                  onClick={handleEditClick}
                  disabled={timeLeft <= 0}
                >
                  <EditButton>
                    {timeLeft > 0 ? "수정하기" : "수정불가"}
                  </EditButton>
                  <span>
                    {
                      timeLeft > 0
                        ? `${Math.floor(timeLeft / 60000)}:${Math.floor(
                            (timeLeft % 60000) / 1000
                          )
                            .toString()
                            .padStart(2, "0")}` // 분:초 형식으로 남은 시간 표시
                        : "" // 수정 불가 표시
                    }
                  </span>
                </DropdownItem>
              </>
            )}
          </DropdownMenu>
        )}
      </MoreButtonWrapper>
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
      {isEditFormOpen && ( // 모달 조건부 렌더링
        <ModalOverlay
          onClick={(e) => {
            e.stopPropagation();
            setEditFormOpen(false); // 모달 닫기
          }}
        >
          <ModalContent
            onClick={(e) => {
              e.stopPropagation();
            }}
          >
            <EditForm
              body={data.body}
              communityId={isComment ? data.commentId : data.communityId}
              onSubmit={(editedData) => {
                handleSubmitEdit(editedData);
                setEditFormOpen(false); // 제출 후 모달 닫기
              }}
            />
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

export const ImageWrapper = styled.div<{ hasCharacterImage: boolean }>`
  width: 65px;
  height: 65px;
  border-radius: 4px;
  overflow: hidden;
`;

const StyledImage = styled.img<{
  hasCharacterImage: boolean;
  isSpecialist: boolean;
}>`
  transform: ${({ hasCharacterImage }) =>
    hasCharacterImage ? "scale(4.0)" : "scale(1.0)"};
  margin-top: ${({ hasCharacterImage, isSpecialist }) =>
    hasCharacterImage && isSpecialist
      ? "37px"
      : hasCharacterImage && !isSpecialist
        ? "74px"
        : "0px"};
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
    font-size: 13px;
    line-height: 18px;

    strong {
      margin-right: 6px;
      font-weight: 700;
      font-size: 15px;
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
  margin-top: 2px;
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
  margin-top: 12px;
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

const MoreButtonWrapper = styled.div`
  padding-left: 8px;
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
`;

const DropdownMenu = styled.div`
  position: absolute;
  top: 100%;
  right: 0;
  min-width: 130px;
  background: ${({ theme }) => theme.app.bg.main};
  color: ${({ theme }) => theme.app.text.black};
  border: 1px solid ${({ theme }) => theme.app.border};
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  z-index: 100;
  padding: 4px;
`;

const DropdownItem = styled.button`
  width: 100%;
  padding: 8px 12px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border: none;
  background: none;
  color: ${({ theme }) => theme.app.text.black};
  font-size: 14px;
  cursor: pointer;
  border-radius: 6px;
  transition: all 0.2s ease;

  svg {
    width: 16px;
    height: 16px;
  }

  &:hover {
    background-color: ${({ theme }) => theme.app.bg.gray1};
  }
`;

const EditButton = styled.button`
  span {
    color: ${({ theme }) => theme.app.text.black};
  }
`;
