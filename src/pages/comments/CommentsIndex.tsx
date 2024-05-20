import "../../styles/pages/CommentsIndex.css";
import { useSetRecoilState } from "recoil";
import { loading } from "../../core/atoms/Loading.atom";
import * as commentApi from "../../core/apis/Comment.api";
import { useEffect, useState } from "react";
import { CommentType } from "../../core/types/Comment.type.";
import { useLocation } from "react-router-dom";
import DefaultLayout from "../../layouts/DefaultLayout";
import DiscordIcon from "../../assets/DiscordIcon";
import CommentInsertForm from "./components/CommentInsertForm";
import Comment from "./components/Comment";

const CommentsIndex = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const page = parseInt(queryParams.get("page") || "1", 10);
  const [comments, setComments] = useState<CommentType[]>();
  const [rootComments, setRootComments] = useState<CommentType[]>([]);
  const [activeComment, setActiveComment] = useState(null);
  const [totalPages, setTotalPages] = useState(1);
  const setLoadingState = useSetRecoilState(loading);

  // 방명록 데이터
  const getComment = async (page: number) => {
    setLoadingState(true);
    try {
      const data = await commentApi.getComments(page);
      setComments(data.commentDtoList);
      setTotalPages(data.totalPages);
      isRootComments();
    } catch (error) {
      console.log(error);
    }
    setLoadingState(false);
  };

  // 데이터 호출
  useEffect(() => {
    getComment(page);
  }, [page]);

  //게시글 추가
  const addComment = async (text: string, parentId?: number) => {
    await commentApi.addComment(text, parentId);
    getComment(page);
  };

  //루트 코멘트인가?
  const isRootComments = () => {
    if (comments) {
      const rootComents = comments.filter((comment) => comment.parentId === 0);
      setRootComments(rootComents);
    }
  };

  //답글인가? (루트 코멘트가 있는가?)
  const getReplies = (commentId: number) => {
    if (comments) {
      comments
        .filter((backendComment) => backendComment.parentId === commentId)
        .sort(
          (a, b) =>
            new Date(a.regDate).getTime() - new Date(b.regDate).getTime()
        );
    }
  };

  //답글인가? (루트 코멘트가 있는가?)
  //   const getReplies = (commentId) =>
  //     backendComments
  //       .filter((backendComment) => backendComment.parentId === commentId)
  //       .sort(
  //         (a, b) => new Date(a.regDate).getTime() - new Date(b.regDate).getTime()
  //       );

  return (
    <DefaultLayout>
      <div className="comments">
        {/*
            p.big - 제일 큰 공지
            p.date - 날짜
            div.cont - 내용
            p.update - 개발 예정
            p.modify - 수정 예정
        */}
        <h2>
          방명록 <p>하고싶으신 말씀 자유롭게 남겨주세요!</p>
        </h2>
        <div className="noticeBox box01">
          <p className="notice">주요 공지사항</p>
          <div className="cont">
            <ul>
              <li>
                개발자 : <DiscordIcon /> 마볼링#2884{" "}
                <a href="https://open.kakao.com/o/snL05upf" target="_blank">
                  오픈카톡
                </a>
              </li>
              <li>
                UI담당자 : <DiscordIcon /> 얀비#7431
              </li>
            </ul>
          </div>
          <div className="cont">
            <p>
              사용해주시고 많은 의견주셔서 너무 감사합니다. 최대한 빠르게
              업데이트 하도록 해보겠습니다!
            </p>
            <ul>
              <li>
                서버에 접속이 안되는 경우, 보통 업데이트 중이므로 1~2분 후
                접속이 가능합니다.
              </li>
              <li>
                슬라임/메데이아의 경우 서버별로 다르고, 길드가 직접 운영하기
                때문에 추가가 어려울 것 같습니다.
              </li>
            </ul>
          </div>
          <div className="cont">
            <p style={{ fontWeight: "bold" }}>개발자에게 커피 한잔</p>
            <ul>
              <li>
                보내주신 소중한 후원금은 서버 유지 및 발전 비용으로 사용됩니다.
              </li>
              <li>카카오뱅크 3333-08-6962739</li>
              <li>예금주 : 이민혁</li>
            </ul>
          </div>
        </div>
        <div className="noticeBox box05">
          <CommentInsertForm submitLabel="작성하기" handleSubmit={addComment} />
          <div className="comments-container">
            {/* {rootComments.map((rootComment) => (
              <Comment
                key={rootComment.id}
                comment={rootComment}
                replies={getReplies(rootComment.id)}
                activeComment={activeComment}
                setActiveComment={setActiveComment}
                addComment={addComment}
                // deleteComment={deleteComment}
                // updateComment={updateComment}
                page={page}
              />
            ))} */}
          </div>
        </div>
      </div>
    </DefaultLayout>
  );
};

export default CommentsIndex;
