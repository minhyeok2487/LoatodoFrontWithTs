import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import styled from "styled-components";

import DefaultLayout from "@layouts/DefaultLayout";

import { searchRecruitingBoard } from "@core/apis/recruitingBoard.api";
import type { RecruitingBoardType } from "@core/types/recruitingBoard";
import { formatTimeAgo } from "@core/utils/dateUtils";

const CategoryBoard: React.FC = () => {
  const { category } = useParams<{ category: string }>();
  const [boards, setBoards] = useState<RecruitingBoardType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchBoards() {
      if (!category) return;
      setIsLoading(true);
      try {
        let result;
        if (category === "GUILD") {
          const guildResults = await Promise.all([
            searchRecruitingBoard("RECRUITING_GUILD", 1, 25),
            searchRecruitingBoard("LOOKING_GUILD", 1, 25),
          ]);
          result = {
            content: [...guildResults[0].content, ...guildResults[1].content],
          };
        } else if (category === "PARTY") {
          const partyResults = await Promise.all([
            searchRecruitingBoard("RECRUITING_PARTY", 1, 25),
            searchRecruitingBoard("LOOKING_PARTY", 1, 25),
          ]);
          result = {
            content: [...partyResults[0].content, ...partyResults[1].content],
          };
        } else {
          result = await searchRecruitingBoard(category, 1, 25);
        }
        setBoards(result.content);
      } catch (err) {
        // eslint-disable-next-line no-console
        console.log("Error fetching category boards:", err);
        setError(
          `Error fetching boards: ${err instanceof Error ? err.message : String(err)}`
        );
      } finally {
        setIsLoading(false);
      }
    }

    fetchBoards();
  }, [category]);

  const getCategoryDisplayName = (category: string) => {
    switch (category) {
      case "FRIENDS":
        return "깐부";
      case "GUILD":
        return "길드";
      case "PARTY":
        return "고정팟";
      case "ETC":
        return "기타";
      default:
        return category;
    }
  };

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

  return (
    <DefaultLayout>
      <BoardContainer>
        <Title>{getCategoryDisplayName(category || "")} 모집게시판</Title>
        <BoardList>
          {boards.map((board) => (
            <BoardItem key={board.recruitingBoardId}>
              <BoardTitle>{board.title}</BoardTitle>
              <BoardMeta>
                <Author>{board.mainCharacterName || "익명"}</Author>
                <Time>{formatTimeAgo(board.createdDate)}</Time>
                <ViewCount>👁 {board.showCount || 0}</ViewCount>
              </BoardMeta>
            </BoardItem>
          ))}
        </BoardList>
      </BoardContainer>
    </DefaultLayout>
  );
};

export default CategoryBoard;

// Styled components...
const BoardContainer = styled.div`
  padding: 20px;
  max-width: 800px;
  margin: 0 auto;
`;

const Title = styled.h1`
  font-size: 24px;
  margin-bottom: 20px;
`;

const BoardList = styled.ul`
  list-style-type: none;
  padding: 0;
`;

const BoardItem = styled.li`
  background-color: white;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  padding: 15px;
  margin-bottom: 10px;
`;

const BoardTitle = styled.h2`
  font-size: 18px;
  margin: 0 0 10px 0;
`;

const BoardMeta = styled.div`
  display: flex;
  font-size: 14px;
  color: #666;
`;

const Author = styled.span`
  margin-right: 10px;
`;

const Time = styled.span`
  margin-right: 10px;
`;

const ViewCount = styled.span``;

const LoadingMessage = styled.div`
  text-align: center;
  padding: 20px;
`;

const ErrorMessage = styled.div`
  color: red;
  text-align: center;
  padding: 20px;
`;
