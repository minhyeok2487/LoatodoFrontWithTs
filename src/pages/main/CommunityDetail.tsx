import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { useParams } from "react-router-dom";
import styled, { css } from "styled-components";

import DefaultLayout from "@layouts/DefaultLayout";

import { useUploadCommunityPost } from "@core/hooks/mutations/community";
import { useCommunityPost } from "@core/hooks/queries/community";
import queryKeyGenerator from "@core/utils/queryKeyGenerator";

import Button from "@components/Button";

import PostItem from "./components/PostItem";

const CommunityDetail = () => {
  const queryClient = useQueryClient();
  const { communityId } = useParams<{ communityId: string }>();
  const getCommunityPost = useCommunityPost(Number(communityId));
  const uploadCommunityPost = useUploadCommunityPost({
    onSuccess: () => {
      setInput("");
      queryClient.invalidateQueries({
        queryKey: queryKeyGenerator.getCommunityPost(Number(communityId)),
      });
    },
  });

  const [input, setInput] = useState("");

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
              <Input
                placeholder="댓글을 입력해주세요."
                value={input}
                onChange={(e) => setInput(e.target.value)}
              />
              <Button
                css={submitCss}
                variant="contained"
                size="large"
                onClick={() =>
                  uploadCommunityPost.mutate({
                    body: input,
                    category: "LIFE",
                    showName: true,
                    imageList: [],
                    rootParentId: Number(communityId),
                  })
                }
              >
                게시하기
              </Button>
            </Form>
            {getCommunityPost.data.comments.map((comment) => (
              <CommentItemWrapper key={comment.commentId}>
                <PostItem data={comment} />
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

const CommentItemWrapper = styled.div`
  padding: 22px 0;

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
