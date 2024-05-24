import { useEffect, useState } from "react";
import "../../styles/pages/Boards.css";
import { useParams } from "react-router-dom";
import * as boardApi from "../../core/apis/Board.api";
import { BoardType } from "../../core/types/BoardResonse";
import { Viewer } from "@toast-ui/react-editor";
import DefaultLayout from "../../layouts/DefaultLayout";
import "@toast-ui/editor/dist/toastui-editor-viewer.css";

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
            <div className="board-container">
                <div className="board-info">
                    <p className="notice-title">공지 | {board.title}</p>
                    <p className="reg-date">
                        {board.regDate && new Date(board.regDate).toLocaleString()}
                    </p>
                </div>
                <div className="board-content">
                    {board.content && <Viewer initialValue={board.content} />}
                </div>
            </div>
        </DefaultLayout>
    );
};

export default Board;