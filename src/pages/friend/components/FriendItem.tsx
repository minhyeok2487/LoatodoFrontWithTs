import { forwardRef } from "react";
import styled from "styled-components";
import type { Friend } from "@core/types/friend";

interface Props {
  friend: Friend;
  isDragging?: boolean;
  style?: React.CSSProperties;
}

const FriendItem = forwardRef<HTMLDivElement, Props>(
  ({ friend, isDragging, style, ...props }, ref) => {
    return (
      <ItemWrapper
        ref={ref}
        $isDragging={isDragging}
        style={style}
        {...props}
      >
        <div className="friend-info">
          <span className="nickname">{friend.nickName}</span>
        </div>
      </ItemWrapper>
    );
  }
);

export default FriendItem;

const ItemWrapper = styled.div<{ $isDragging?: boolean }>`
  padding: 12px 16px;
  background: ${({ theme }) => theme.app.bg.white};
  border: 1px solid ${({ theme }) => theme.app.border};
  border-radius: 8px;
  cursor: grab;
  opacity: ${({ $isDragging }) => ($isDragging ? 0.5 : 1)};

  .friend-info {
    display: flex;
    align-items: center;
    gap: 8px;

    .nickname {
      font-weight: 500;
    }

    .server {
      font-size: 14px;
      color: ${({ theme }) => theme.app.text.light2};
    }
  }
`;