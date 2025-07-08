import { forwardRef } from "react";
import styled, { css } from "styled-components";

import type { CSSProperties } from "react";

interface Props {
  name: string;
  isDragging?: boolean;
  style?: CSSProperties;
}

const DailyTodoSortItem = forwardRef<HTMLDivElement, Props>(({ name, isDragging, style, ...props }, ref) => {
  return (
    <Wrapper ref={ref} $isDragging={isDragging} style={style} {...props}>
      <span>{name}</span>
    </Wrapper>
  );
});

export default DailyTodoSortItem;

const Wrapper = styled.div<{ $isDragging?: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 10px;
  border: 1px solid ${({ theme }) => theme.app.border};
  border-radius: 8px;
  background: ${({ theme }) => theme.app.bg.white};
  cursor: grab;

  ${({ $isDragging }) =>
    $isDragging &&
    css`
      opacity: 0.5;
      border: 1px dashed ${({ theme }) => theme.app.border};
    `}
`;
