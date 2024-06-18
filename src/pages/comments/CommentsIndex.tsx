import styled from "@emotion/styled";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { useRecoilValue, useSetRecoilState } from "recoil";

import DefaultLayout from "@layouts/DefaultLayout";

import * as commentApi from "@core/apis/Comment.api";
import { loading } from "@core/atoms/Loading.atom";
import { authAtom } from "@core/atoms/auth.atom";
import { CommentType } from "@core/types/Comment.type.";

import Pagination from "@components/Pagination";

import DiscordIcon from "@assets/DiscordIcon";

import Comment from "./components/Comment";
import CommentInsertForm from "./components/CommentInsertForm";

interface ActiveComment {
  id: number;
  type: string;
}

const CommentsIndex = () => {
  const auth = useRecoilValue(authAtom);
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const page = parseInt(queryParams.get("page") || "1", 10);
  const [comments, setComments] = useState<CommentType[]>([]);
  const [rootComments, setRootComments] = useState<CommentType[]>([]);
  const [activeComment, setActiveComment] = useState<ActiveComment | null>();
  const [totalPages, setTotalPages] = useState(1);
  const setLoadingState = useSetRecoilState(loading);

  // 방명록 데이터
  const getComment = async (page: number) => {
    setLoadingState(true);
    try {
      const data = await commentApi.getComments(page);
      setComments(data.commentDtoList);
      setTotalPages(data.totalPages);
      isRootComments(data.commentDtoList);
    } catch (error) {
      console.log(error);
    }
    setLoadingState(false);
  };

  // 데이터 호출
  useEffect(() => {
    getComment(page);
  }, [page]);

  // 게시글 추가
  const addComment = async (text: string, parentId?: number) => {
    await commentApi.addComment(text, parentId);
    getComment(page);
    setActiveComment(null);
  };

  // 게시글 수정
  const updateComment = async (
    text: string,
    commentId: number,
    page: number
  ) => {
    await commentApi.updateComment(text, commentId, page);
    getComment(page);
    setActiveComment(null);
  };

  // 게시글 삭제
  const deleteComment = async (commentId: number) => {
    if (window.confirm("삭제하시겠습니까?")) {
      await commentApi.deleteComment(commentId);
      getComment(page);
      setActiveComment(null);
    }
  };

  // 루트 코멘트인가?
  const isRootComments = (commentsList: CommentType[]) => {
    const rootComents = commentsList.filter(
      (comment) => comment.parentId === 0
    );
    setRootComments(rootComents);
  };

  // 답글인가? (루트 코멘트가 있는가?)
  const getReplies = (commentId: number) => {
    if (comments) {
      return comments
        .filter((backendComment) => backendComment.parentId === commentId)
        .sort(
          (a, b) =>
            new Date(a.regDate).getTime() - new Date(b.regDate).getTime()
        );
    }
    return [];
  };

  return (
    <DefaultLayout pageTitle="방명록">
      <Wrapper>
        <InnerTitle>주요 공지사항</InnerTitle>

        <Section>
          <Ul>
            <Li>
              개발자 : <DiscordIcon /> 마볼링#2884
            </Li>
            <Li>
              UI담당자 : <DiscordIcon /> 얀비#7431
            </Li>
          </Ul>
        </Section>
        <Section>
          <Ul>
            <Li>
              서버에 접속이 안되는 경우, 보통 업데이트 중이므로 1~2분 후 접속이
              가능합니다.
            </Li>
            <Li>
              슬라임&메데이아의 경우 서버별로 다르고, 길드가 직접 운영하기
              때문에 추가가 어려울 것 같습니다.
            </Li>
          </Ul>
        </Section>
        <Section>
          <Dl>
            <Dt>로아투두에 서버비 도와주기</Dt>
            <Dd>
              <Ul>
                <Li>
                  기존 로아투두는 개인사비로 서버비를 충당해 왔으나, 유저증가로
                  인해 사비로 감당할 수 없는 비용으로 불가피하게 광고를 추가하게
                  되었습니다. 양해해주셔서 감사합니다!
                </Li>
                <Li>
                  보내주신 소중한 후원금은 서버 유지 및 발전 비용으로
                  사용됩니다.
                </Li>
                <Li>카카오뱅크 3333-08-6962739</Li>
                <Li>예금주 : 이민혁</Li>
              </Ul>
            </Dd>
          </Dl>
        </Section>
        <KakaoButton
          href="https://open.kakao.com/o/snL05upf"
          target="_blank"
          rel="noreferrer"
        >
          개발자에게 카톡하기
        </KakaoButton>
      </Wrapper>

      <Wrapper>
        {auth.token && (
          <CommentInsertForm submitLabel="작성하기" handleSubmit={addComment} />
        )}

        <CommentWrapper>
          {rootComments.map((rootComment) => (
            <Comment
              key={rootComment.id}
              comment={rootComment}
              replies={getReplies(rootComment.id)}
              activeComment={activeComment}
              setActiveComment={setActiveComment}
              addComment={addComment}
              deleteComment={deleteComment}
              updateComment={updateComment}
              currentPage={page}
            />
          ))}
        </CommentWrapper>
      </Wrapper>

      <Pagination totalPages={totalPages} />
    </DefaultLayout>
  );
};

export default CommentsIndex;

const Wrapper = styled.div`
  padding: 20px;
  width: 100%;
  background: ${({ theme }) => theme.app.bg.light};
  border-radius: 16px;
  color: ${({ theme }) => theme.app.text.main};

  & + & {
    margin-top: 16px;
  }
`;

const InnerTitle = styled.h3`
  position: relative;
  padding-left: 5px;
  width: 100%;
  font-size: 20px;
  font-weight: 700;
  text-align: left;

  &::before {
    content: "";
    position: absolute;
    left: -7px;
    top: -5px;
    width: 5px;
    height: 5px;
    border-radius: 5px;
    background: ${({ theme }) => theme.app.red};
  }
`;

const Section = styled.div`
  padding-top: 15px;
  margin-top: 15px;
  border-top: 1px dashed ${({ theme }) => theme.app.border};
`;

const Dl = styled.dl`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
`;
const Dt = styled.dt`
  margin: 0 0 12px 12px;
  font-size: 16px;
  font-weight: 700;
`;
const Dd = styled.dd`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
`;

const Ul = styled.ul`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
`;
const Li = styled.li`
  position: relative;
  display: flex;
  flex-direction: row;
  padding-left: 10px;
  font-size: 15px;
  line-height: 23px;

  svg {
    margin: 0 4px;
    font-size: 1em;
  }

  & + & {
    margin-top: 7px;
  }

  &::before {
    content: "";
    position: absolute;
    left: 0;
    top: 10px;
    background: ${({ theme }) => theme.app.text.light1};
    width: 3px;
    height: 3px;
    border-radius: 3px;
  }
`;

const CommentWrapper = styled.div`
  margin-top: 20px;
`;

const KakaoButton = styled.a`
  display: inline-block;
  align-self: flex-start;
  background-color: #fee500;
  border-radius: 5px;
  padding: 5px 15px;
  margin-top: 10px;
  color: #3c1e1e;
  font-size: 14px;
  font-weight: 700;
`;
