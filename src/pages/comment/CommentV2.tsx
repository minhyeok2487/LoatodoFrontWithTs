import { useState, useEffect } from 'react';
import styled from 'styled-components';
import DefaultLayout from '@layouts/DefaultLayout';
import CommentItem from '@pages/comment/CommentItem';
import { getCommentsV2 } from '@core/apis/comment.api';
import { GetCommentsResponse } from '@core/types/comment';

const CommentV2 = () => {
  const [comments, setComments] = useState<GetCommentsResponse | null>(null);

  useEffect(() => {
    const fetchComments = async () => {
      try {        
        const response = await getCommentsV2();
        console.log(response);
        setComments(response);
      } catch (err) {
        console.log(err);
      }
    };

    fetchComments();
  }, []);


  return (
    <DefaultLayout>
      <CommentContainer>
        <Header>
          <InputArea>
            <Avatar src="https://via.placeholder.com/40" alt="User avatar" />
            <Input placeholder="댓글을 입력하세요..." />
            <PostButton>게시</PostButton>
          </InputArea>
        </Header>
        <CommentList>
          {comments?.commentDtoList.map(comment => (
            <CommentItem key={comment.id} comment={comment} />
          ))}
        </CommentList>
      </CommentContainer>
    </DefaultLayout>
  );
};

const CommentContainer = styled.div`
  width: 100%;
  max-width: 600px;
  margin: 0 auto;
`;

const Header = styled.header`
  padding: 16px;
  border-bottom: 1px solid #e0e0e0;
`;

const InputArea = styled.div`
  display: flex;
  align-items: center;
`;

const Avatar = styled.img`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  margin-right: 12px;
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
  border-radius: 20px;
  cursor: pointer;
`;

const CommentList = styled.div`
  padding: 16px;
`;

export default CommentV2;