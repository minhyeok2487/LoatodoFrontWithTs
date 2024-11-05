import { useParams } from "react-router-dom";
import styled from "styled-components";

import DefaultLayout from "@layouts/DefaultLayout";

import { useCommunityPost } from "@core/hooks/queries/community";

import PostItem from "./components/PostItem";

const CommunityDetail = () => {
  const { communityId } = useParams<{ communityId: string }>();
  const getCommunityPost = useCommunityPost(Number(communityId));

  return (
    <DefaultLayout>
      {getCommunityPost.data && (
        <Wrapper>
          <Description>
            <PostItem data={getCommunityPost.data.community} />
          </Description>
          {getCommunityPost.data.comments.length > 0 && (
            <Comments>
              {getCommunityPost.data.comments.map((comment) => (
                <PostItem key={comment.commentId} data={comment} />
              ))}
            </Comments>
          )}
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
`;

const Comments = styled.div`
  width: 100%;
  border-top: 1px solid ${({ theme }) => theme.app.border};
`;
