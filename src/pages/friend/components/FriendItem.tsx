<<<<<<< HEAD
import { forwardRef } from "react";
import styled from "styled-components";
=======
import { IoReorderThree } from "@react-icons/all-files/io5/IoReorderThree";
import { forwardRef } from "react";
import styled from "styled-components";

>>>>>>> origin/main
import type { Friend } from "@core/types/friend";

interface Props {
  friend: Friend;
  isDragging?: boolean;
  style?: React.CSSProperties;
}

const FriendItem = forwardRef<HTMLDivElement, Props>(
  ({ friend, isDragging, style, ...props }, ref) => {
    return (
<<<<<<< HEAD
      <ItemWrapper
        ref={ref}
        $isDragging={isDragging}
        style={style}
        {...props}
      >
        <div className="friend-info">
          <span className="nickname">{friend.nickName}</span>
        </div>
=======
      <ItemWrapper ref={ref} $isDragging={isDragging} style={style} {...props}>
        <div className="friend-info">
          <span className="nickname">{friend.nickName}</span>
        </div>
        <div className="drag-handle">
          <IoReorderThree size={25} />
        </div>
>>>>>>> origin/main
      </ItemWrapper>
    );
  }
);

export default FriendItem;

const ItemWrapper = styled.div<{ $isDragging?: boolean }>`
<<<<<<< HEAD
=======
  display: flex;
  justify-content: space-between;
>>>>>>> origin/main
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
<<<<<<< HEAD
`;
=======
`;
>>>>>>> origin/main
