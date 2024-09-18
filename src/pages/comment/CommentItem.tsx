import { CommentItem } from '@core/types/comment';
import React, { useState } from 'react';
import styled from 'styled-components';

interface CommentItemProps {
  comment: CommentItem;
}

const CommentItemComponent: React.FC<CommentItemProps> = ({ comment }) => {
  const [isLiked, setIsLiked] = useState(false);

  const toggleLike = () => {
    setIsLiked(!isLiked);
  };

  return (
    <CommentItemContainer>
      <Avatar src="https://via.placeholder.com/40" alt={`${comment.username}'s avatar`} />
      <Content>
        <UserInfo>
          <Username>{comment.username}</Username>
          <PostTime>{comment.regDate}</PostTime>
        </UserInfo>
        <PostText>{comment.body}</PostText>
        <ActionButtons>
          <ActionButton onClick={toggleLike}>
            <LikeIcon isLiked={isLiked} />
            <Count>0</Count>
          </ActionButton>
          <ActionButton>
            <CommentIcon />
            <Count>0</Count>
          </ActionButton>
        </ActionButtons>
      </Content>
    </CommentItemContainer>
  );
};

const LikeIcon = ({ isLiked }: { isLiked: boolean }) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
      fill={isLiked ? "red" : "none"}
      stroke={isLiked ? "red" : "currentColor"}
      strokeWidth="2"
    />
  </svg>
);

const CommentIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v10z"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const CommentItemContainer = styled.div`
  display: flex;
  margin-bottom: 24px;
`;

const Avatar = styled.img`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  margin-right: 12px;
`;

const Content = styled.div`
  flex: 1;
`;

const UserInfo = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 4px;
`;

const Username = styled.span`
  font-weight: bold;
  margin-right: 8px;
`;

const PostTime = styled.span`
  color: #777;
  font-size: 14px;
`;

const PostText = styled.p`
  margin-bottom: 8px;
`;

const PostImage = styled.img`
  width: 100%;
  max-height: 300px;
  object-fit: cover;
  margin-bottom: 8px;
  border-radius: 8px;
`;

const ActionButtons = styled.div`
  display: flex;
  margin-top: 8px;
`;

const ActionButton = styled.button`
  display: flex;
  align-items: center;
  background: none;
  border: none;
  cursor: pointer;
  margin-right: 16px;
  color: #333;
  padding: 4px 8px;
  border-radius: 4px;
  
  &:hover {
    background-color: #f0f0f0;
  }
`;

const Count = styled.span`
  font-size: 14px;
  margin-left: 4px;
`;

export default CommentItemComponent;