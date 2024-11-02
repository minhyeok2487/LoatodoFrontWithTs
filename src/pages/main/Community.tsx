import { useInfiniteQuery } from "@tanstack/react-query";
import type { InfiniteData, QueryKey } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { useEffect } from "react";
import styled from "styled-components";

import DefaultLayout from "@layouts/DefaultLayout";

import { getCommunityList } from "@core/apis/community.api";
import { CommunityList } from "@core/types/community";
import queryKeyGenerator from "@core/utils/queryKeyGenerator";

import Post from "./components/Post";

const Community = () => {
  const { data, fetchNextPage, isLoading, isFetchingNextPage } =
    useInfiniteQuery<
      CommunityList,
      AxiosError,
      InfiniteData<CommunityList, number | undefined>,
      QueryKey,
      number | undefined
    >({
      initialPageParam: undefined,
      queryKey: queryKeyGenerator.getCommunityList(),
      queryFn: ({ pageParam }) =>
        getCommunityList({
          communityId: pageParam,
          limit: 5,
        }),
      getNextPageParam: (lastPage) =>
        lastPage.hasNext
          ? lastPage.content[lastPage.content.length - 1].communityId
          : null,
    });

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
          !isFetchingNextPage
        ) {
          fetchNextPage();
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
        {data?.pages.map((page) => {
          return page.content.map((post) => {
            return <Post key={post.communityId} data={post} />;
          });
        })}
      </Wrapper>
    </DefaultLayout>
  );
};

export default Community;

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  background: ${({ theme }) => theme.app.bg.white};
  border-radius: 8px 8px 0 0;
  border: 1px solid ${({ theme }) => theme.app.border};
`;
