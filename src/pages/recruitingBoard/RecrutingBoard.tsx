import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";

import DefaultLayout from "@layouts/DefaultLayout";

import { searchRecruitingBoard } from "@core/apis/recruitingBoard.api";
import useIsBelowWidth from "@core/hooks/useIsBelowWidth";
import type {
  RecruitingBoardType,
  RecruitingCategory,
} from "@core/types/recruitingBoard";

const getCategoryLink = (category: RecruitingCategory) => {
  switch (category) {
    case "RECRUITING_GUILD":
    case "LOOKING_GUILD":
      return "/recruiting-board/GUILD";
    case "RECRUITING_PARTY":
    case "LOOKING_PARTY":
      return "/recruiting-board/PARTY";
    default:
      return `/recruiting-board/${category}`;
  }
};

const getCategoryName = (category: RecruitingCategory) => {
  switch (category) {
    case "FRIENDS":
      return "깐부";
    case "RECRUITING_GUILD":
    case "LOOKING_GUILD":
      return "길드";
    case "RECRUITING_PARTY":
    case "LOOKING_PARTY":
      return "고정팟";
    case "ETC":
      return "기타";
    default:
      return category;
  }
};

const getCategoryColor = (category: string) => {
  switch (category) {
    case "FRIENDS":
      return "#e8f5e9";
    case "RECRUITING_GUILD":
    case "LOOKING_GUILD":
      return "#e3f2fd";
    case "RECRUITING_PARTY":
    case "LOOKING_PARTY":
      return "#fce4ec";
    case "ETC":
      return "#fff3e0";
    default:
      return "#f5f5f5";
  }
};

const getCategoryIcon = (category: string) => {
  switch (category) {
    case "FRIENDS":
      return "🤝";
    case "RECRUITING_GUILD":
    case "LOOKING_GUILD":
      return "🔍";
    case "RECRUITING_PARTY":
    case "LOOKING_PARTY":
      return "🔥";
    case "ETC":
      return "⏰";
    default:
      return "📌";
  }
};

const RecrutingBoard: React.FC = () => {
  const isMobile = useIsBelowWidth(768);
  const [categorizedBoards, setCategorizedBoards] = useState<
    Record<string, RecruitingBoardType[]>
  >({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchBoards() {
      try {
        setIsLoading(true);
        const categories: RecruitingCategory[] = [
          "FRIENDS",
          "RECRUITING_GUILD",
          "LOOKING_GUILD",
          "RECRUITING_PARTY",
          "LOOKING_PARTY",
          "ETC",
        ];
        const results = await Promise.all(
          categories.map((cat) => searchRecruitingBoard(cat, 1, 6))
        );

        const boardData = {
          깐부: results[0].content,
          길드: [...results[1].content, ...results[2].content],
          고정팟: [...results[3].content, ...results[4].content],
          기타: results[5].content,
        };

        setCategorizedBoards(boardData);
      } catch (err) {
        console.log("Error fetching recruiting boards:", err);
        setError(
          `Error fetching recruiting boards: ${err instanceof Error ? err.message : String(err)}`
        );
      } finally {
        setIsLoading(false);
      }
    }

    fetchBoards();
  }, []);

  if (isLoading)
    return (
      <DefaultLayout>
        <LoadingMessage>Loading...</LoadingMessage>
      </DefaultLayout>
    );
  if (error)
    return (
      <DefaultLayout>
        <ErrorMessage>{error}</ErrorMessage>
      </DefaultLayout>
    );
  if (!categorizedBoards) return null;

  return (
    <DefaultLayout>
      <BoardContainer>
        <Title>모집게시판</Title>
        <GridContainer isMobile={isMobile}>
          {Object.entries(categorizedBoards).map(([categoryName, boards]) => {
            const category = getCategoryFromName(categoryName);
            return (
              <CategorySection key={categoryName}>
                <CategoryHeader bgColor={getCategoryColor(category)}>
                  <Link to={getCategoryLink(category)}>
                    {categoryName}
                    <Icon>{getCategoryIcon(category)}</Icon>
                  </Link>
                </CategoryHeader>
                <PostList>
                  {categorizedBoards[categoryName]
                    ?.slice(0, isMobile ? 3 : 5)
                    .map((board, index) => (
                      <PostItem key={board.recruitingBoardId || index}>
                        <PostTitle>{board.title}</PostTitle>
                        <PostMetaContainer>
                          <div>
                            {board.mainCharacterName ? (
                              <PostAuthor>{board.mainCharacterName}</PostAuthor>
                            ) : (
                              <PostAuthor>익명</PostAuthor>
                            )}
                            <PostAuthor>
                              {board.itemLevel.toFixed(2)}
                            </PostAuthor>
                          </div>
                          <ViewCount>
                            <Icon>👁</Icon>
                            {board.showCount || 0}
                          </ViewCount>
                        </PostMetaContainer>
                      </PostItem>
                    ))}
                  {Array.from({
                    length: Math.max(
                      0,
                      (isMobile ? 3 : 5) -
                        (categorizedBoards[categoryName]?.length || 0)
                    ),
                  }).map((_, index) => (
                    <EmptyPostItem key={`empty-${index}`} />
                  ))}
                </PostList>
              </CategorySection>
            );
          })}
        </GridContainer>
      </BoardContainer>
    </DefaultLayout>
  );
};

const getCategoryFromName = (name: string): RecruitingCategory => {
  switch (name) {
    case "깐부":
      return "FRIENDS";
    case "길드":
      return "RECRUITING_GUILD";
    case "고정팟":
      return "RECRUITING_PARTY";
    case "기타":
      return "ETC";
    default:
      return "ETC";
  }
};

export default RecrutingBoard;

const BoardContainer = styled.div`
  background-color: #f8f9fa;
  padding: 20px;
  width: 100%;
`;

const Title = styled.h1`
  font-size: 1.5rem;
  margin-bottom: 20px;
`;

const GridContainer = styled.div<{ isMobile: boolean }>`
  display: grid;
  grid-template-columns: ${(props) =>
    props.isMobile ? "1fr" : "repeat(2, 1fr)"};
  gap: 20px;
`;

const CategorySection = styled.div`
  background-color: white;
  border-radius: 8px;
  margin-bottom: 20px;
  overflow: hidden;
  box-shadow:
    0 1px 3px rgba(0, 0, 0, 0.12),
    0 1px 2px rgba(0, 0, 0, 0.24);
  display: flex;
  flex-direction: column;
`;

const CategoryHeader = styled.div<{ bgColor: string }>`
  padding: 10px 15px;
  font-weight: bold;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: ${(props) => props.bgColor};

  a {
    color: inherit;
    text-decoration: none;
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
  }
`;

const PostList = styled.ul`
  list-style-type: none;
  padding: 0;
  margin: 0;
  flex-grow: 1;
  display: flex;
  flex-direction: column;
`;

const PostItem = styled.li`
  padding: 12px 15px;
  border-top: 1px solid #eee;
  display: flex;
  flex-direction: column;
  flex: 1;
  min-height: 70px; // Adjust this value based on your design
`;

const EmptyPostItem = styled(PostItem)`
  background-color: #f9f9f9;
`;

const PostTitle = styled.span`
  font-size: 1rem;
  font-weight: 600;
  color: #333;
  margin-bottom: 4px;
`;

const PostMetaContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.8rem;
  color: #888;
`;

const PostAuthor = styled.span`
  margin-right: 8px;
`;

const PostTime = styled.span`
  margin-right: 8px;
`;

const ViewCount = styled.span`
  display: flex;
  align-items: center;
`;

const Icon = styled.span`
  margin-right: 4px;
`;

const categories = [
  { name: "깐부", value: "FRIENDS", color: "#e8f5e9", icon: "🤝" },
  { name: "길드", value: "GUILD", color: "#e3f2fd", icon: "🔍" },
  { name: "고정팟", value: "FIXED_PARTY", color: "#fce4ec", icon: "🔥" },
  { name: "기타", value: "ETC", color: "#fff3e0", icon: "⏰" },
];

const LoadingMessage = styled.div`
  text-align: center;
  padding: 20px;
`;

const ErrorMessage = styled.div`
  color: red;
  text-align: center;
  padding: 20px;
`;
