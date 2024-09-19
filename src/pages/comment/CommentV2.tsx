import { useCallback, useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";
import styled from "styled-components";
import DefaultLayout from "@layouts/DefaultLayout";
import CommentItem from "@pages/comment/CommentItem";
import { getCommentsV2 } from "@core/apis/comment.api";
import { CommentItemV2 } from "@core/types/comment";
import UserIcon from "@assets/images/user_icon.png";

const CommentV2 = () => {
  const [comments, setComments] = useState<CommentItemV2[]>([]);
  const [nextCommentsId, setNextCommentsId] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const { ref, inView } = useInView({
    threshold: 1, // 80% 보일 때만 트리거
  });

  const fetchComments = useCallback(
    async (next?: number) => {
      if (loading) return;
      setLoading(true);
      try {
        const response = await getCommentsV2({ commentsId: next });
        setComments((prev) => {
          const existingIds = new Set(prev.map((comment) => comment.commentId));
          const newComments = response.content.filter(
            (comment) => !existingIds.has(comment.commentId)
          );
          return [...prev, ...newComments]; // 기존 댓글과 새로운 글을 합침
        });

        if (response.content.length > 0) {
          setNextCommentsId(
            response.content[response.content.length - 1].commentId
          ); // 다음 댓글 ID 설정
        } else {
          setNextCommentsId(null);
        }
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    },
    [loading]
  );

  useEffect(() => {
    window.scrollTo(0, 0); // 페이지 로드 시 스크롤을 최상단으로 이동
    fetchComments(); // 초기 댓글 불러오기
  }, []);

  useEffect(() => {
    if (inView && nextCommentsId) {
      fetchComments(nextCommentsId); // inView가 true일 때 추가 댓글 불러오기
    }
  }, [inView, nextCommentsId, fetchComments]);

  return (
    <DefaultLayout>
      <CommentContainer>
        <Header>
          <InputArea>
            <ProfileImage alt="not yet" src={UserIcon} />
            <Input placeholder="댓글을 이용해보세요..." />
            <PostButton>게시</PostButton>
          </InputArea>
        </Header>
        <CommentList>
          {comments.map((comment) => (
            <CommentItem key={comment.commentId} comment={comment} />
          ))}
        </CommentList>
        <div ref={ref} /> {/* Intersection Observer를 위한 ref 추가 */}
        {loading && <LoadingIndicator>로딩 중...</LoadingIndicator>}
      </CommentContainer>
    </DefaultLayout>
  );
};

const CommentContainer = styled.div`
  width: 100%;
  max-width: 600px;
  margin: 0 auto;
  color: ${({ theme }) => theme.app.text.dark2};
  border-radius: 10px; // 둥글둥글한 border 추가
  background-color: ${({ theme }) => theme.app.bg.gray1};
  border: 1px solid ${({ theme }) => theme.app.border};
`;

const Header = styled.header`
  margin-top: 10px;
  padding: 1px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-bottom: 1px solid ${({ theme }) => theme.app.text.light2};
  padding-bottom: 7px;
`;

const InputArea = styled.div`
  display: flex;
  align-items: center;
  padding-bottom: 8px;
  width: 96.5%;
  background-color: ${({ theme }) => theme.app.bg.gray1};
`;

const ProfileImage = styled.img`
  margin-right: 12px;
  width: 30px;
  height: 30px;
  border-radius: 50%;
`;

const Input = styled.input`
  flex: 1;
  border: none;
  background-color: transparent;
  color: #333;
  font-size: 16px;
  &::placeholder {
    color: #999;
  }
`;

const PostButton = styled.button`
  padding: 8px 16px;
  background-color: #1da1f2;
  color: white;
  border: none;
  border-radius: 10px;
  cursor: pointer;
`;

const CommentList = styled.div``;

const LoadingIndicator = styled.div`
  text-align: center;
  padding: 16px;
`;

export default CommentV2;
