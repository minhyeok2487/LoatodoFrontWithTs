import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import styled, { css } from "styled-components";

import DefaultLayout from "@layouts/DefaultLayout";

import useComments from "@core/hooks/queries/comment/useComments";
import type { ActiveComment } from "@core/types/comment";

import Button from "@components/Button";
import Pagination from "@components/Pagination";

import DiscordIcon from "@assets/svg/DiscordIcon";

import Comment from "./components/Comment";

const CommentsIndex = () => {
  const [searchParams] = useSearchParams();
  const page = parseInt(searchParams.get("page") || "1", 10) - 1;
  const [activeComment, setActiveComment] = useState<ActiveComment>();

  const getComments = useComments({
    page,
  });

  return (
    <DefaultLayout pageTitle="방명록">
      <Wrapper>
        <InnerTitle>주요 공지사항</InnerTitle>

        <Section>
          <ul>
            <li>
              백엔드 개발자 : <DiscordIcon /> maboling
            </li>
            <li>
              프론트엔드 개발자 : <DiscordIcon /> yamamoosae
            </li>
            <li>
              UI 담당자 : <DiscordIcon /> hanbi__
            </li>
          </ul>
        </Section>
        <Section>
          <ul>
            <li>
              서버에 접속이 안되는 경우, 보통 업데이트 중이므로 1~2분 후 접속이
              가능합니다.
            </li>
          </ul>
        </Section>
        <Section>
          <dl>
            <dt>로아투두에 서버비 도와주기</dt>
            <dd>
              <ul>
                <li>
                  기존 로아투두는 개인사비로 서버비를 충당해 왔으나, 유저증가로
                  인해 사비로 감당할 수 없는 비용으로 불가피하게 광고를 추가하게
                  되었습니다. 양해해주셔서 감사합니다!
                </li>
                <li>
                  보내주신 소중한 후원금은 서버 유지 및 발전 비용으로
                  사용됩니다.
                </li>
                <li>카카오뱅크 3333-08-6962739</li>
                <li>예금주 : 이민혁</li>
              </ul>
            </dd>
          </dl>
        </Section>
        <Button
          css={kakaoButtonCss}
          href="https://open.kakao.com/o/snL05upf"
          target="_blank"
          rel="noreferrer"
        >
          개발자에게 카톡하기
        </Button>
      </Wrapper>

      <Wrapper>
<<<<<<< HEAD
        {!isGuest && (
          <CommentInsertForm
            submitLabel="작성하기"
            onSubmit={(text) =>
              addComment.mutate({
                body: text,
              })
            }
          />
        )}

=======
>>>>>>> origin/main
        {getComments.data && (
          <CommentWrapper>
            {getComments.data.commentDtoList
              .filter((comment) => comment.parentId === 0)
              .map((comment) => (
                <Comment
                  key={comment.id}
                  activeComment={activeComment}
                  setActiveComment={setActiveComment}
                  comment={comment}
                  replies={getComments.data.commentDtoList
                    .filter(
                      (backendComment) => backendComment.parentId === comment.id
                    )
                    .sort((a, b) => (a.regDate < b.regDate ? -1 : 1))}
                />
              ))}
          </CommentWrapper>
        )}
      </Wrapper>

      {getComments.data && (
        <Pagination totalPages={getComments.data.totalPages} />
      )}
    </DefaultLayout>
  );
};

export default CommentsIndex;

const Wrapper = styled.div`
  padding: 20px;
  width: 100%;
  background: ${({ theme }) => theme.app.bg.white};
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

  &:before {
    content: "";
    position: absolute;
    left: -7px;
    top: -5px;
    width: 5px;
    height: 5px;
    border-radius: 5px;
    background: ${({ theme }) => theme.app.palette.red[250]};
  }
`;

const Section = styled.div`
  padding-top: 15px;
  margin-top: 15px;
  border-top: 1px dashed ${({ theme }) => theme.app.border};

  dl {
    display: flex;
    flex-direction: column;
    align-items: flex-start;

    dt {
      margin: 0 0 12px 12px;
      font-size: 16px;
      font-weight: 700;
    }

    dd {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
    }
  }

  ul {
    display: flex;
    flex-direction: column;
    align-items: flex-start;

    li {
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

      &:before {
        content: "";
        position: absolute;
        left: 0;
        top: 10px;
        background: ${({ theme }) => theme.app.text.light1};
        width: 3px;
        height: 3px;
        border-radius: 3px;
      }
    }
  }
`;

const CommentWrapper = styled.div`
  margin-top: 20px;
`;

const kakaoButtonCss = css`
  margin-top: 10px;
  background: #fee500;
  color: #3c1e1e;
  font-weight: 700;
`;
