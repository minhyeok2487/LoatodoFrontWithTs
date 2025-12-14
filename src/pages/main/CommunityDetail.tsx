import { FormControlLabel, Switch } from "@mui/material";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import styled, { css } from "styled-components";

import DefaultLayout from "@layouts/DefaultLayout";

import { useUploadCommunityPost } from "@core/hooks/mutations/community";
import { useCommunityPost } from "@core/hooks/queries/community";
import type { Comment } from "@core/types/community";
import queryKeyGenerator from "@core/utils/queryKeyGenerator";

import Button from "@components/Button";

import PostItem from "./components/PostItem";

const CommunityDetail = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { communityId } = useParams<{ communityId: string }>();
  const getCommunityPost = useCommunityPost(Number(communityId));

  useEffect(() => {
    if (getCommunityPost.isError) {
      navigate(-1);
    }
  }, [getCommunityPost.isError, getCommunityPost.error, navigate]);

  const uploadCommunityPost = useUploadCommunityPost({
    onSuccess: () => {
      setCommentInput("");
      queryClient.invalidateQueries({
        queryKey: queryKeyGenerator.getCommunityPost(Number(communityId)),
      });
    },
  });

  const [commentShowName, setCommentShowName] = useState(false);
  const [commentInput, setCommentInput] = useState("");

  const [targetCommentId, setTargetCommentId] = useState<number | null>(null);
  const [replyShowName, setReplyShowName] = useState(false);
  const [replyInput, setReplyInput] = useState("");

  const sortedComments = useMemo(() => {
    if (getCommunityPost.data) {
      const { comments } = getCommunityPost.data;
      const sortedComments = comments.filter(
        (item) => item.commentParentId === 0
      );
      const map = new Map<number, Comment[]>();

      sortedComments.forEach((rootComment) => {
        const childComments = comments.filter(
          (comment) => comment.commentParentId === rootComment.commentId
        );

        for (let i = 0; i < childComments.length; i += 1) {
          const targetId = childComments[i].commentId;
          childComments.push(
            ...comments.filter(
              (comment) => comment.commentParentId === targetId
            )
          );
        }

        map.set(rootComment.commentId, childComments);
      });

      for (let i = sortedComments.length - 1; i >= 0; i -= 1) {
        const childrenComments = map.get(sortedComments[i].commentId) || [];
        childrenComments.sort((a, b) => a.commentId - b.commentId);
        sortedComments.splice(i + 1, 0, ...childrenComments);
      }

      return sortedComments;
    }

    return [];
  }, [getCommunityPost.data]);

  if (!getCommunityPost.data) {
    return null;
  }

  return (
    <DefaultLayout>
      {getCommunityPost.data && (
        <Wrapper>
          <Description>
            <PostItem data={getCommunityPost.data.community} />
          </Description>
          <Comments>
            <CommentTitle>댓글</CommentTitle>
            <Form>
              <SwitchWrapper
                label={commentShowName ? "닉네임 공개" : "닉네임 비공개"}
                labelPlacement="start"
                control={
                  <Switch
                    checked={commentShowName}
                    onChange={(e) => {
                      setCommentShowName(e.target.checked);
                    }}
                  />
                }
              />
              <Input
                placeholder="댓글을 입력해주세요."
                value={commentInput}
                onChange={(e) => setCommentInput(e.target.value)}
              />
              <Button
                css={submitCss}
                variant="contained"
                size="large"
                onClick={() =>
                  uploadCommunityPost.mutate({
                    body: commentInput,
                    category: getCommunityPost.data.community.category,
                    showName: commentShowName,
                    imageList: [],
                    rootParentId: Number(communityId),
                  })
                }
              >
                게시하기
              </Button>
            </Form>
            {sortedComments.map((comment) => (
              <CommentItemWrapper
                key={comment.commentId}
                $isReply={comment.commentParentId !== 0}
              >
                <PostItem
                  data={comment}
                  onReplyClick={(commentId) => setTargetCommentId(commentId)}
                  mention={
                    comment.commentParentId
                      ? sortedComments.find(
                          (item) => item.commentId === comment.commentParentId
                        )?.name || "삭제된 댓글"
                      : undefined
                  }
                />
                {comment.commentId === targetCommentId && (
                  <Form>
                    <SwitchWrapper
                      label={replyShowName ? "닉네임 공개" : "닉네임 비공개"}
                      labelPlacement="start"
                      control={
                        <Switch
                          checked={replyShowName}
                          onChange={(e) => {
                            setReplyShowName(e.target.checked);
                          }}
                        />
                      }
                    />
                    <Input
                      placeholder="@에게 대댓글 달기"
                      value={replyInput}
                      onChange={(e) => setReplyInput(e.target.value)}
                    />
                    <Button
                      css={submitCss}
                      variant="contained"
                      size="large"
                      onClick={() =>
                        uploadCommunityPost.mutate({
                          body: replyInput,
                          category: getCommunityPost.data.community.category,
                          showName: replyShowName,
                          imageList: [],
                          rootParentId: Number(communityId),
                          commentParentId: targetCommentId,
                        })
                      }
                    >
                      게시하기
                    </Button>
                  </Form>
                )}
              </CommentItemWrapper>
            ))}
          </Comments>
        </Wrapper>
      )}
    </DefaultLayout>
  );
};

export default CommunityDetail;

const Wrapper = styled.div`
  width: 100%;
  max-width: 800px;
  margin: 0 auto;
  background: ${({ theme }) => theme.app.bg.white};
  border: 1px solid ${({ theme }) => theme.app.border};
  border-radius: 8px;
`;

const Description = styled.div`
  width: 100%;
  padding: 24px 22px;
`;

const Comments = styled.div`
  width: 100%;
  border-top: 1px solid ${({ theme }) => theme.app.border};
  padding: 24px 22px;
`;

const CommentTitle = styled.span`
  font-size: 20px;
  font-weight: 700;
  color: ${({ theme }) => theme.app.text.black};
`;

const CommentItemWrapper = styled.div<{ $isReply: boolean }>`
  padding: 22px 0;
  padding-left: ${({ $isReply }) => ($isReply ? 40 : 0)}px;

  &:last-of-type {
    padding-bottom: 0;
  }
`;

const Form = styled.div`
  position: relative;
  display: flex;
  flex-direction: row;
  gap: 10px;
  margin-top: 12px;
`;

const SwitchWrapper = styled(FormControlLabel)`
  position: absolute;
  right: 0;
  top: 0;
  transform: translateY(-100%);
  font-size: 14px;
  color: ${({ theme }) => theme.app.text.light1};
`;

const Input = styled.textarea`
  flex: 1;
  padding: 24px;
  border: 1px solid ${({ theme }) => theme.app.border};
  border-radius: 8px;
  background: ${({ theme }) => theme.app.bg.white};
`;

const submitCss = css`
  padding: 0 24px;
`;
