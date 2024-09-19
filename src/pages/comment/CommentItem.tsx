import React from "react";
import styled, { useTheme } from "styled-components";
import UserIcon from "@assets/images/user_icon.png";
import { CommentItemV2 } from "@core/types/comment";

interface CommentItemProps {
  comment: CommentItemV2;
}

const formatDate = (dateString: string) => {
  const commentDate = new Date(dateString);
  const now = new Date();
  const diffInHours = Math.floor((now.getTime() - commentDate.getTime()) / (1000 * 60 * 60));

  if (diffInHours < 24) {
    return `${diffInHours}시간 전`; // Display hours if within 24 hours
  }
  return commentDate.toLocaleDateString(); // Display date otherwise
};

const CommentItem: React.FC<CommentItemProps> = ({ comment }) => {
  const theme = useTheme(); // Use the theme here

  const displayUsername = (() => {
    switch (comment.role) {
      case "ADMIN":
        return "관리자";
      case "PUBLISHER":
        return "UI 담당자";
      default:
        return (
          comment.username.substring(0, 5) +
          "*".repeat(comment.username.length - 5)
        );
    }
  })();

  return (
    <CommentContainer>
      <ProfileImage
        alt={`${comment.username}'s avatar`}
        src={UserIcon}
        />
      <Content>
        <UserInfo>
          <Author $isAdmin={comment.role === "ADMIN"}>{displayUsername}</Author>
          <PostTime>{formatDate(comment.regDate)}</PostTime>
        </UserInfo>
        <PostText>{comment.body}</PostText>
        <ActionButtons>
          <ActionButton>
            {comment.commentCount > 0 ? (
              <CommentIcon theme={theme} /> // Pass theme as a prop
            ) : (
              <EmptyCommentIcon theme={theme} /> // Pass theme as a prop
            )}
            <Count>{comment.commentCount}</Count>
          </ActionButton>
        </ActionButtons>
      </Content>
    </CommentContainer>
  );
};

const CommentIcon: React.FC<{ theme: any }> = (
  { theme } // Define prop types
) => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    style={{ color: theme.app.text.dark2 }}
  >
    <path
      d="M21 15c0 1.1-.9 2-2 2H7l-4 4V5c0-1.1.9-2 2-2h14c1.1 0 2 .9 2 2v10z"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M9 9h6M9 12h6"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const EmptyCommentIcon: React.FC<{ theme: any }> = (
  { theme } // Define prop types
) => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    style={{ color: theme.app.text.dark2 }}
  >
    <path
      d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v10z"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const CommentContainer = styled.div`
  display: flex; // Use flexbox for horizontal layout
  align-items: flex-start; // Align items at the start
  padding: 12px; // Padding for the comment container
  border-radius: 10px; // Rounded corners
  background-color: ${({ theme }) => theme.app.bg.gray1}; // Background color
  margin-bottom: 10px; // Space between comments
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); // Subtle shadow for depth
`;

const ProfileImage = styled.img`
  margin-top: 5px;
  margin-right: 12px;
  width: 30px;
  height: 30px;
  border-radius: 50%;
`;


const Content = styled.div`
  flex: 1; // Allow content to take remaining space
  display: flex;
  flex-direction: column; // Stack user info and text vertically
`;

const UserInfo = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 4px; // Space below user info
`;

const Author = styled.span<{ $isAdmin: boolean }>`
  font-size: 16px;
  font-weight: 700;
  color: ${({ $isAdmin, theme }) =>
    $isAdmin ? theme.app.palette.blue[350] : "unset"};
`;

const PostTime = styled.span`
  margin-left: 5px;
  color: ${({ theme }) => theme.app.text.light1};
  font-size: 12px; // Smaller font size for time
`;

const PostText = styled.p`
  margin: 0; // Remove default margin
  line-height: 1.5; // Line height for readability
  color: ${({ theme }) => theme.app.text.main}; // Text color
`;

const ActionButtons = styled.div`
  display: flex;
  margin-top: 8px; // Space above action buttons
  justify-content: flex-start; // Align buttons to the left
`;

const ActionButton = styled.button`
  display: flex;
  align-items: center;
  background: none;
  border: none;
  cursor: pointer;
  margin-right: 16px; // Space between buttons
  color: #333; // Button text color
`;

const Count = styled.span`
  font-size: 14px;
  margin-left: 4px;
  color: ${({ theme }) => theme.app.text.dark2};
`;

export default CommentItem;
