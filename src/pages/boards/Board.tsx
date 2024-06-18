import styled from "@emotion/styled";
import "@toast-ui/editor/dist/theme/toastui-editor-dark.css";
import "@toast-ui/editor/dist/toastui-editor-viewer.css";
import { Viewer } from "@toast-ui/react-editor";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import DefaultLayout from "@layouts/DefaultLayout";

import * as boardApi from "@core/apis/Board.api";
import { BoardType } from "@core/types/BoardResonse";

import "@styles/pages/Boards.css";

// 게시글 조회
const Board = () => {
  // State 설정
  const [board, setBoard] = useState<BoardType>();

  // URL 경로에 있는 param
  const { no } = useParams();

  useEffect(() => {
    // 게시글 데이터
    const getBoard = async () => {
      if (no) {
        try {
          const data = await boardApi.select(no);
          setBoard(data);
        } catch (e) {
          console.log(e);
        }
      }
    };
    getBoard();
  }, [no]);

  if (!board) {
    return null;
  }

  return (
    <DefaultLayout>
      <Wrapper>
        <TitleRow>
          <Title>공지 | {board.title}</Title>
          <CreatedAt>
            {board.regDate && new Date(board.regDate).toLocaleString()}
          </CreatedAt>
        </TitleRow>
        <DescriptionBox>
          {board.content && <Viewer initialValue={board.content} />}
        </DescriptionBox>
      </Wrapper>
    </DefaultLayout>
  );
};

export default Board;

const Wrapper = styled.div`
  width: 100%;
  padding: 20px;
  background: ${({ theme }) => theme.app.bg.light};
  border: 1px solid ${({ theme }) => theme.app.border};
  border-radius: 5px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
`;

const TitleRow = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 5px;
  margin-bottom: 10px;
  padding: 10px;
  background: ${({ theme }) => theme.app.bg.gray1};
  border-radius: 5px;
`;

const Title = styled.span`
  color: ${({ theme }) => theme.app.text.black};
  line-height: 1;
`;

const CreatedAt = styled.span`
  color: ${({ theme }) => theme.app.text.light2};
  line-height: 1;
`;

const DescriptionBox = styled.div`
  line-height: 1.6;
  color: ${({ theme }) => theme.app.text.black};

  & * {
    color: inherit;
  }

  img {
    max-width: 100%;
  }
`;
