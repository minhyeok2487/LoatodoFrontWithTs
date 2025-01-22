import dayjs from "dayjs";
import { Fragment } from "react";
import type { Dispatch, SetStateAction } from "react";
import styled from "styled-components";

<<<<<<< HEAD
import useAddComment from "@core/hooks/mutations/comment/useAddComment";
import useEditComment from "@core/hooks/mutations/comment/useEditComment";
import useRemoveComment from "@core/hooks/mutations/comment/useRemoveComment";
import useMyInformation from "@core/hooks/queries/member/useMyInformation";
import { CommentItem } from "@core/types/comment";
import type { ActiveComment } from "@core/types/comment";
import queryKeyGenerator from "@core/utils/queryKeyGenerator";
=======
import type { ActiveComment, CommentItem } from "@core/types/comment";
>>>>>>> origin/main

import UserIcon from "@assets/images/user_icon.png";

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
          <Author $isAdmin={comment.role === "ADMIN"}>{displayUsername}</Author>
          <CreatedAt>
            ({dayjs(comment.regDate).format("YYYY. M. D A hh:mm:ss")})
          </CreatedAt>
        </AuthorRow>
      </Header>

      <Body>
        <Description>
          {comment.body.split("\n").map((line, index) => (
            <Fragment key={index}>
              {line}
              {line.length > 0 && <br />}
            </Fragment>
          ))}
        </Description>
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

const Author = styled.span<{ $isAdmin: boolean }>`
  font-size: 16px;
  font-weight: 700;
  color: ${({ $isAdmin, theme }) =>
    $isAdmin ? theme.app.palette.blue[350] : "unset"};
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

const ReplyBox = styled.div`
  margin-top: 20px;
  width: 100%;
`;
