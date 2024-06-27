import styled from "@emotion/styled";
import dayjs from "dayjs";
import React from "react";

import useMyInformation from "@core/hooks/queries/member/useMyInformation";
import { CommentItem } from "@core/types/comment";

import UserIcon from "@assets/images/user-icon.png";

import CommentInsertForm from "./CommentInsertForm";

interface ActiveComment {
  id: number;
  type: string;
}

interface CommentProps {
  comment: CommentItem;
  replies?: CommentItem[];
  activeComment: ActiveComment | null | undefined;
  setActiveComment: React.Dispatch<
    React.SetStateAction<ActiveComment | null | undefined>
  >;
  updateComment: (text: string, commentId: number, currentPage: number) => void;
  deleteComment: (commentId: number) => void;
  addComment: (text: string, parentId: number) => void;
  parentId?: number;
  currentPage: number;
}

const Comment: React.FC<CommentProps> = ({
  comment,
  replies,
  setActiveComment,
  activeComment,
  updateComment,
  deleteComment,
  addComment,
  parentId,
  currentPage,
}) => {
  const { getMyInformation } = useMyInformation();

  const editMode =
    activeComment &&
    activeComment.id === comment.id &&
    activeComment.type === "editing";

  const replyMode =
    activeComment &&
    activeComment.id === comment.id &&
    activeComment.type === "replying";

  const canDelete =
    getMyInformation.data &&
    getMyInformation.data.memberId === comment.memberId &&
    replies?.length === 0;

  const canReply =
    getMyInformation.data &&
    (getMyInformation.data.role === "ADMIN" ||
      getMyInformation.data.role === "PUBLISHER" ||
      getMyInformation.data.memberId === comment.memberId);

  const canEdit =
    getMyInformation.data &&
    getMyInformation.data.memberId === comment.memberId;

  const replyId = parentId || comment.id;

  let username = "";

  switch (comment.role) {
    case "ADMIN":
      username = "관리자";
      break;
    case "PUBLISHER":
      username = "UI담당자";
      break;
    default:
      username =
        comment.username.substring(0, 5) +
        "*".repeat(comment.username.length - 5);
      break;
  }

  return (
    <Wrapper>
      <Header>
        <ProfileImage alt={`${username}의 프로필 이미지`} src={UserIcon} />
        <AuthorRow>
          <Author isAdmin={comment.role === "ADMIN"}>{username}</Author>
          <CreatedAt>
            ({dayjs(comment.regDate).format("YYYY. M. D A HH:mm:ss")})
          </CreatedAt>
        </AuthorRow>
      </Header>

      <Body>
        {editMode ? (
          <InnerFormWrapper>
            <CommentInsertForm
              submitLabel="수정하기"
              hasCancelButton
              placeholder={comment.body}
              initialText={comment.body}
              handleSubmit={(text) =>
                updateComment(text, comment.id, currentPage)
              }
              handleCancel={() => {
                setActiveComment(null);
              }}
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
                setActiveComment({ id: comment.id, type: "replying" })
              }
            >
              답글
            </ActionButton>
          )}
          {canEdit && (
            <ActionButton
              type="button"
              onClick={() =>
                setActiveComment({ id: comment.id, type: "editing" })
              }
            >
              수정
            </ActionButton>
          )}
          {canDelete && (
            <ActionButton
              type="button"
              onClick={() => deleteComment(comment.id)}
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
              handleSubmit={(text) => addComment(text, replyId)}
            />
          </InnerFormWrapper>
        )}

        {replies && replies.length > 0 && (
          <ReplyBox>
            {replies.map((reply) => (
              <Comment
                comment={reply}
                key={reply.id}
                setActiveComment={setActiveComment}
                activeComment={activeComment}
                updateComment={updateComment}
                deleteComment={deleteComment}
                addComment={addComment}
                parentId={comment.id}
                replies={[]}
                currentPage={currentPage}
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
