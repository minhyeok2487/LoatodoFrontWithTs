import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";

import DefaultLayout from "@layouts/DefaultLayout";

import { useInfiniteCommunityList } from "@core/hooks/queries/community";

import PostItem, * as PostItemStyledComponents from "./components/PostItem";
import UploadPost from "./components/UploadPost";

const Community = () => {
  const navigate = useNavigate();
  const getInfiniteCommunityList = useInfiniteCommunityList(10);

  useEffect(() => {
    let throttleTimeout: NodeJS.Timeout | null = null;

    const onScroll = () => {
      if (throttleTimeout) {
        return;
      }

      throttleTimeout = setTimeout(() => {
        const scrollTop = window.scrollY || document.documentElement.scrollTop;
        const windowHeight = window.innerHeight;
        const documentHeight = document.documentElement.scrollHeight;

        if (
          documentHeight - (scrollTop + windowHeight) < 50 &&
          !getInfiniteCommunityList.isFetchingNextPage
        ) {
          getInfiniteCommunityList.fetchNextPage();
        }

        throttleTimeout = null;
      }, 500);
    };

    window.addEventListener("scroll", onScroll);

    return () => {
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  return (
    <DefaultLayout>
      <Wrapper>
        <UploadPost />
        <PostList>
          {getInfiniteCommunityList.data?.pages.map((page) => {
            return page.content.map((post) => {
              return (
                <PostItem
                  key={post.communityId}
                  onClick={() => navigate(`/post/${post.communityId}`)}
                  data={post}
                />
              );
            });
          })}
        </PostList>
      </Wrapper>
    </DefaultLayout>
  );
};

export default Community;

const Wrapper = styled.div`
  width: 100%;
  max-width: 800px;
`;

const PostList = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: 30px;
  width: 100%;
  background: ${({ theme }) => theme.app.bg.white};
  border-radius: 8px;
  border: 1px solid ${({ theme }) => theme.app.border};

  ${PostItemStyledComponents.Wrapper}:not(:last-of-type) {
    border-bottom: 1px solid ${({ theme }) => theme.app.border};
  }
`;
