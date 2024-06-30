import styled from "@emotion/styled";
import { useQueryClient } from "@tanstack/react-query";
import dayjs from "dayjs";
import type { Dispatch, SetStateAction } from "react";
import { useSearchParams } from "react-router-dom";

import useAddComment from "@core/hooks/mutations/comment/useAddComment";
import useEditComment from "@core/hooks/mutations/comment/useEditComment";
import useRemoveComment from "@core/hooks/mutations/comment/useRemoveComment";
import useMyInformation from "@core/hooks/queries/member/useMyInformation";
import { CommentItem } from "@core/types/comment";
import type { ActiveComment } from "@core/types/comment";
import queryKeyGenerator from "@core/utils/queryKeyGenerator";

import UserIcon from "@assets/images/user-icon.png";

import CommentInsertForm from "./CommentInsertForm";

interface CommentProps {
  comment: CommentItem;
  replies?: CommentItem[];
  activeComment: ActiveComment | undefined;
  setActiveComment: Dispatch<SetStateAction<ActiveComment | undefined>>;
  parentId?: number;
}

const Comment = ({
  comment,
  replies,
  setActiveComment,
  activeComment,
  parentId,
}: CommentProps) => {
  const queryClient = useQueryClient();
  const [searchParams] = useSearchParams();
  const page = parseInt(searchParams.get("page") || "1", 10);

  const getMyInformation = useMyInformation();

  const addComment = useAddComment({
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeyGenerator.getComments(),
      });
      setActiveComment(undefined);
    },
  });

  const editComment = useEditComment({
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeyGenerator.getComments({ page }),
      });
      setActiveComment(undefined);
    },
  });

  const removeComment = useRemoveComment({
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeyGenerator.getComments(),
      });
      setActiveComment(undefined);
    },
  });

  const editMode =
    activeComment &&
    activeComment.id === comment.id &&
    activeComment.type === "EDIT";

  const replyMode =
    activeComment &&
    activeComment.id === comment.id &&
    activeComment.type === "REPLY";

  const canDelete =
    getMyInformation.data &&
    getMyInformation.data.memberId === comment.memberId &&
    (!replies || replies?.length === 0);

  const canReply =
    getMyInformation.data &&
    (getMyInformation.data.role === "ADMIN" ||
      getMyInformation.data.role === "PUBLISHER" ||
      getMyInformation.data.memberId === comment.memberId);

  const canEdit =
    getMyInformation.data &&
    getMyInformation.data.memberId === comment.memberId;

  const replyId = parentId || comment.id;

  const displayUsername = (() => {
    switch (comment.role) {
      case "ADMIN":
        return "관리자";
      case "PUBLISHER":
        return "UI 담당자";
      default:
        return (
          comment.username.substring(0, 5) +
          "*".repeat(comment.username.length - 5)
        );
    }
  })();

  return (
    <Wrapper>
      <Header>
        <ProfileImage
          alt={`${displayUsername}의 프로필 이미지`}
          src={UserIcon}
        />
        <AuthorRow>
          <Author isAdmin={comment.role === "ADMIN"}>{displayUsername}</Author>
          <CreatedAt>
            ({dayjs(comment.regDate).format("YYYY. M. D A hh:mm:ss")})
          </CreatedAt>
        </AuthorRow>
      </Header>

      <Body>
        {editMode ? (
          <InnerFormWrapper>
            <CommentInsertForm
              submitLabel="수정하기"
              onSubmit={(text) =>
                editComment.mutate({ id: comment.id, body: text })
              }
              onCancel={() => {
                setActiveComment(undefined);
              }}
              hasCancelButton
              placeholder={comment.body}
              initialText={comment.body}
            />
          </InnerFormWrapper>
        ) : (
          <Description>{comment.body}</Description>
        )}
        <ActionButtons>
          {canReply && (
            <ActionButton
              type="button"
              onClick={() =>
                setActiveComment({ id: comment.id, type: "REPLY" })
              }
            >
              답글
            </ActionButton>
          )}
          {canEdit && (
            <ActionButton
              type="button"
              onClick={() => setActiveComment({ id: comment.id, type: "EDIT" })}
            >
              수정
            </ActionButton>
          )}
          {canDelete && (
            <ActionButton
              type="button"
              onClick={() => {
                if (window.confirm("삭제하시겠습니까?")) {
                  removeComment.mutate(comment.id);
                }
              }}
            >
              삭제
            </ActionButton>
          )}
        </ActionButtons>

        {replyMode && (
          <InnerFormWrapper>
            <CommentInsertForm
              submitLabel="답글달기"
              placeholder="답글 남기기"
              onSubmit={(text) =>
                addComment.mutate({ body: text, parentId: replyId })
              }
            />
          </InnerFormWrapper>
        )}

        {replies && replies.length > 0 && (
          <ReplyBox>
            {replies.map((reply) => (
              <Comment
                key={reply.id}
                comment={reply}
                setActiveComment={setActiveComment}
                activeComment={activeComment}
                parentId={comment.id}
              />
            ))}
          </ReplyBox>
        )}
      </Body>
    </Wrapper>
  );
};

export default Comment;

const Wrapper = styled.div`
  margin-bottom: 10px;
  color: ${({ theme }) => theme.app.text.main};
`;

const Header = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;

  ${({ theme }) => theme.medias.max600} {
    margin-bottom: 5px;
  }
`;

const ProfileImage = styled.img`
  margin-right: 12px;
  width: 30px;
  height: 30px;
  border-radius: 50%;
`;

const AuthorRow = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 6px;

  ${({ theme }) => theme.medias.max600} {
    flex-direction: column;
    align-items: flex-start;
    gap: 0;
  }
`;

const Author = styled.span<{ isAdmin: boolean }>`
  font-size: 16px;
  font-weight: 700;
  color: ${({ isAdmin, theme }) => (isAdmin ? theme.app.blue1 : "unset")};
`;

const CreatedAt = styled.span`
  color: ${({ theme }) => theme.app.text.light2};
  font-size: 14px;
`;

const Body = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding-left: 42px;
`;

const Description = styled.div`
  font-size: 16px;
  word-wrap: break-word;
`;

const ActionButtons = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-top: 8px;
  gap: 8px;
`;

const ActionButton = styled.button`
  font-size: 12px;

  &:hover {
    text-decoration: underline;
  }
`;

const InnerFormWrapper = styled.div`
  width: 100%;
  margin-top: 10px;
`;

const ReplyBox = styled.div`
  margin-top: 20px;
  width: 100%;
`;
