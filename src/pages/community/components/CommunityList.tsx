import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import styled from "styled-components";
import { getCommunityPosts } from "@core/apis/community.api";
import queryKeyGenerator from "@core/utils/queryKeyGenerator";
import CommunityItem from "./CommunityItem";
import CommunityFilter from "./CommunityFilter";

const CommunityList = () => {
  const [category, setCategory] = useState<string>();
  
  const { data, isLoading } = useQuery({
    queryKey: queryKeyGenerator.getCommunityPosts(category),
    queryFn: () => getCommunityPosts({ category }),
  });
  if (isLoading) return <LoadingWrapper>Loading...</LoadingWrapper>;

  return (
    <PostListWrapper>
      <CommunityFilter onCategoryChange={setCategory} />
      <PostItems>
        {data?.content?.map((post) => (
          <CommunityItem
            key={post.communityId}
            author={post.name}
            time={post.createdDate}
            category={post.category}
            content={post.body}
            likes={post.likeCount}
            comments={post.commentCount}
          />
        ))}
      </PostItems>
    </PostListWrapper>
  );
};

const LoadingWrapper = styled.div`
  padding: 20px;
  text-align: center;
`;

const PostListWrapper = styled.div`
  background: white;
  border-radius: 8px;
  overflow: hidden;
`;

const PostItems = styled.div`
  display: flex;
  flex-direction: column;
`;

export default CommunityList;