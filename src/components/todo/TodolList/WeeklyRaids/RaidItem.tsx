import { useTheme } from "@emotion/react";
import styled from "@emotion/styled";
import { forwardRef } from "react";

import { TodoType } from "@core/types/character";

import Check from "@components/todo/TodolList/button/Check";
import GatewayGauge, * as GatewayGaugeStyledComponents from "@components/todo/TodolList/element/GatewayGauge";

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  id: string;
  withOpacity?: boolean;
  isDragging?: boolean;
  style?: React.CSSProperties;
  todo: TodoType;
}

const RaidItem = forwardRef<HTMLDivElement, Props>(
  ({ withOpacity = false, isDragging = false, style, todo, ...props }, ref) => {
    const theme = useTheme();

    return (
      <Wrapper
        ref={ref}
        isDragging={isDragging}
        withOpacity={withOpacity}
        style={style}
        {...props}
      >
        <RaidItemWrapper key={todo.id}>
          <Check
            hideIndicatorText
            indicatorColor={theme.app.pink}
            totalCount={todo.totalGate}
            currentCount={todo.currentGate}
            onClick={() => {}}
            onRightClick={() => {}}
          >
            <ContentNameWithGold>
              <ContentName
                dangerouslySetInnerHTML={{
                  __html: todo.name.replace(/\n/g, "<br />"),
                  // <span className="flag hard">1 2</span>
                  // <span className="flag normal">3</span>
                }}
              />
              <MemoInput
                type="text"
                spellCheck="false"
                defaultValue={todo.message}
                placeholder="메모 추가"
              />
            </ContentNameWithGold>
          </Check>

          <GatewayGauge
            totalValue={todo.totalGate}
            currentValue={todo.currentGate}
          />
        </RaidItemWrapper>
      </Wrapper>
    );
  }
);

export default RaidItem;

const Wrapper = styled.div<{ withOpacity: boolean; isDragging: boolean }>`
  opacity: ${({ withOpacity }) => (withOpacity ? 0.5 : 1)};
  transform-origin: 50% 50%;
  border-radius: 5px;
  cursor: ${({ isDragging }) => (isDragging ? "grabbing" : "grab")};
  box-shadow: ${({ isDragging }) =>
    isDragging
      ? "rgb(63 63 68 / 5%) 0px 2px 0px 2px, rgb(34 33 81 / 15%) 0px 2px 3px 2px"
      : "rgb(63 63 68 / 5%) 0px 0px 0px 1px, rgb(34 33 81 / 15%) 0px 1px 3px 0px"};
`;

const RaidItemWrapper = styled.div`
  width: 100%;
  border-top: 1px solid ${({ theme }) => theme.app.border};

  ${GatewayGaugeStyledComponents.Wrapper} {
    padding-top: 0;
  }
`;

const ContentNameWithGold = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  line-height: 1;
  gap: 2px;
`;

const MemoInput = styled.input<{ isHidden?: boolean }>`
  position: ${({ isHidden }) => (isHidden ? "absolute" : "relative")};
  left: ${({ isHidden }) => (isHidden ? "-9999px" : "unset")};
  width: 100%;
  color: ${({ theme }) => theme.app.red};
  font-size: 12px;
  line-height: 1.2;
  background: transparent;
  pointer-events: none;
`;

const ContentName = styled.p`
  font-size: 14px;
  text-align: left;
  
  .flag {
    display: inline-block;
    margin: 6px 0 3px;
  }
    
  .flag:before {
    content: "하드";
    margin-right: 4px;
    padding: 2px 4px;
    background: #ffe2e2;
    color: #ff0000;
    border-radius: 4px;
  }

  .flag.normal:before {
    content: "노말";
    background: #d0edff;
    color: #1e00ff;
  }
    
  .flag + .flag {
    margin-left: 3px;
  }
`;
