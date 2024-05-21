import React from "react";
import CommentInsertForm from "./CommentInsertForm";
import { CommentType } from "../../../core/types/Comment.type.";
import { useMember } from "../../../core/apis/Member.api";

interface activeCommentType {
  id: number;
  type: string;
}

interface CommentProps {
  comment: CommentType;
  replies?: CommentType[];
  activeComment: activeCommentType | undefined;
  setActiveComment: React.Dispatch<React.SetStateAction<activeCommentType | undefined>>;
  updateComment: (text: string, commentId: number, currentPage: number) => void;
  deleteComment: (commentId: number) => void;
  addComment: (text: string, parentId: number) => void;
  parentId?: number | null;
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
  parentId = null,
  currentPage,
}) => {
  const { data: member } = useMember();

  const isEditing =
    activeComment &&
    activeComment.id === comment.id &&
    activeComment.type === "editing";

  const isReplying =
    activeComment &&
    activeComment.id === comment.id &&
    activeComment.type === "replying";

  const canDelete =
    member && member.memberId === comment.memberId && replies?.length === 0;

  const canReply =
    member &&
    (member.role === "ADMIN" ||
      member.role === "PUBLISHER" ||
      member.memberId === comment.memberId);

  const canEdit = member && member.memberId === comment.memberId;
  const replyId = parentId ? parentId : comment.id;
  const regDate = new Date(comment.regDate).toLocaleString();

  let username = "";
  if (comment.role === "ADMIN") {
    username = "관리자";
  } else if (comment.role === "PUBLISHER") {
    username = "UI담당자";
  } else {
    username =
      comment.username.substring(0, 5) +
      "*".repeat(comment.username.length - 5);
  }

  return (
    <div key={comment.id} className="comment">
      <div className="comment-image-container">
        <img alt="user-icon" src="images/user-icon.png" />
      </div>
      <div className="comment-right-part">
        <div className="comment-content">
          <div>
            <span
              className="comment-author"
              style={{ color: comment.role === "ADMIN" ? "blue" : "" }}
            >
              {username}
            </span>
            ({comment.regDate})
          </div>
        </div>
        {!isEditing && <div className="comment-text">{comment.body}</div>}
        {isEditing && (
          <CommentInsertForm
            submitLabel="Update"
            hasCancelButton
            initialText={comment.body}
            handleSubmit={(text) =>
              updateComment(text, comment.id, currentPage)
            }
            handleCancel={() => {
              setActiveComment(undefined);
            }}
          />
        )}
        <div className="comment-actions">
          {canReply && (
            <div
              className="comment-action"
              onClick={() =>
                setActiveComment({ id: comment.id, type: "replying" })
              }
            >
              Reply
            </div>
          )}
          {canEdit && (
            <div
              className="comment-action"
              onClick={() =>
                setActiveComment({ id: comment.id, type: "editing" })
              }
            >
              Edit
            </div>
          )}
          {canDelete && (
            <div
              className="comment-action"
              onClick={() => deleteComment(comment.id)}
            >
              Delete
            </div>
          )}
        </div>
        {isReplying && (
          <CommentInsertForm
            submitLabel="Reply"
            handleSubmit={(text) => addComment(text, replyId)}
          />
        )}
        {replies && replies.length > 0 && (
          <div className="replies">
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
          </div>
        )}
      </div>
    </div>
  );
};

export default Comment;
