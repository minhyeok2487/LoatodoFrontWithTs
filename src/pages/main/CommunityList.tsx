import { Fragment, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Ad from "src/module/Ad";
import styled from "styled-components";

import DefaultLayout from "@layouts/DefaultLayout";

import { COMMUNITY_CATEGORY } from "@core/constants";
import { useInfiniteCommunityList } from "@core/hooks/queries/community";

import Button from "@components/Button";

import PostItem, * as PostItemStyledComponents from "./components/PostItem";
import UploadPost from "./components/UploadPost";

type CategoryType = keyof typeof COMMUNITY_CATEGORY | "";

const Community = () => {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState<CategoryType>("");

  const getInfiniteCommunityList = useInfiniteCommunityList(
    10,
    selectedCategory === "" ? undefined : selectedCategory
  );

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
  }, [getInfiniteCommunityList]);

  const categoryOptions = [
    { value: "", label: "전체" },
    ...Object.entries(COMMUNITY_CATEGORY).map(([value, label]) => ({
      value,
      label,
    })),
  ];

  const handleCategoryChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setSelectedCategory(event.target.value as CategoryType);
  };

  let postCounter = 0;

  return (
    <DefaultLayout>
      <Wrapper>
        <UploadPost />
        <CommunityButtonGroup>
          <ButtonWrapper>
            <Button onClick={() => navigate("/comments")}>(구)방명록</Button>
          </ButtonWrapper>
          <CategorySelect
            value={selectedCategory}
            onChange={handleCategoryChange}
          >
            {categoryOptions.map(({ value, label }) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </CategorySelect>
        </CommunityButtonGroup>
        <PostList>
          {getInfiniteCommunityList.data?.pages.map((page, pageIndex) => (
            <Fragment key={`page-${pageIndex}`}>
              {page.content.map((post) => {
                postCounter += 1;
                const shouldRenderBillboard = postCounter % 6 === 0;

                return (
                  <Fragment key={post.communityId}>
                    <PostItemWrapper>
                      <PostItem
                        onClick={() => navigate(`/post/${post.communityId}`)}
                        data={post}
                      />
                    </PostItemWrapper>
                    {shouldRenderBillboard && (
                      <BillboardAdWrapper>
                        <Ad placementName="billboard" />
                      </BillboardAdWrapper>
                    )}
                  </Fragment>
                );
              })}
            </Fragment>
          ))}
        </PostList>
      </Wrapper>
    </DefaultLayout>
  );
};

export default Community;

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  gap: 16px;
  max-width: 970px;
  margin: 0 auto;
`;

const CommunityButtonGroup = styled.div`
  display: flex;
  align-items: center;
  position: relative;
`;

const ButtonWrapper = styled.div`
  flex: 1;
`;

const CategorySelect = styled.select`
  border-radius: 5px;
  border: none;
  background: ${({ theme }) => theme.app.bg.reverse};
  color: ${({ theme }) => theme.app.text.reverse};
  text-align: center;
  font-size: 16px;
  font-weight: bold;
  position: absolute; /* 부모의 중앙에 배치 */
  left: 50%;
  transform: translateX(-50%);
`;

const PostItemWrapper = styled.div`
  padding: 20px 10px;
  border-bottom: 1px solid ${({ theme }) => theme.app.border};
`;

const PostList = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  background: ${({ theme }) => theme.app.bg.white};
  border-radius: 8px;
  border: 1px solid ${({ theme }) => theme.app.border};

  ${PostItemStyledComponents.Wrapper}:not(:last-of-type) {
    border-bottom: 1px solid ${({ theme }) => theme.app.border};
  }
`;

const BillboardAdWrapper = styled.div`
  display: flex;
  justify-content: center;
  padding-top: 5px;
  border-bottom: 1px solid ${({ theme }) => theme.app.border};
`;
