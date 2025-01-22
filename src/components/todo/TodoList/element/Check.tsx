import { BsCheck } from "@react-icons/all-files/bs/BsCheck";
import type { MouseEvent, ReactNode } from "react";
import { useMemo } from "react";
import styled, { css } from "styled-components";

import Button from "@components/Button";

interface Props {
  hideIndicatorText?: boolean;
  indicatorColor?: string;
  totalCount: number;
  currentCount: number;
  onClick: () => void;
  onRightClick: () => void;
  rightButtons?: RightButton[];
  children: ReactNode;
}

interface RightButton {
  ariaLabel: string;
  onClick: () => void;
  icon: ReactNode;
}

const DailyContentButton = ({
  hideIndicatorText,
  indicatorColor,
  totalCount,
  currentCount,
  onClick,
  onRightClick,
  rightButtons,
  children,
}: Props) => {
  const handleContextMenu = (e: MouseEvent) => {
    e.preventDefault();

    onRightClick();
  };

  const handleRightButtonClick = (e: MouseEvent, index: number) => {
    e.stopPropagation();

    rightButtons?.[index].onClick();
  };

  const indicatorContent = useMemo<ReactNode>(() => {
    if (currentCount === 0) {
      return "";
    }

    if (currentCount === totalCount) {
      return <BsCheck />;
    }

    return hideIndicatorText ? "" : `${currentCount}`;
  }, [currentCount, totalCount, hideIndicatorText]);

  return (
    <Wrapper
      // role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.target !== e.currentTarget) {
          return;
        }
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onClick();
        }
      }}
      onClick={onClick}
      onContextMenu={handleContextMenu}
      $isDone={currentCount === totalCount}
      $indicatorColor={indicatorColor}
    >
      <IndicatorBox>
        <Indicator $indicatorColor={indicatorColor}>
          {indicatorContent}
        </Indicator>
        {children}
      </IndicatorBox>

      {rightButtons && (
        <RightButtonsWrapper>
          {rightButtons.map((item, index) => {
            return (
              <Button
                key={item.ariaLabel}
                css={rightButtonCss}
                variant="icon"
                size={18}
                ariaLabel={item.ariaLabel}
                onClick={(e) => {
                  handleRightButtonClick(e, index);
                }}
              >
                {item.icon}
              </Button>
            );
          })}
        </RightButtonsWrapper>
      )}
    </Wrapper>
  );
};

export default DailyContentButton;

const Indicator = styled.div<{ $indicatorColor?: string }>`
  display: ${({ $indicatorColor }) => ($indicatorColor ? "flex" : "none")};
  justify-content: center;
  align-items: center;
  width: 22px;
  height: 22px;
  border-radius: 4px;
  border: 1px solid ${({ theme }) => theme.app.border};
  font-size: 10px;
  font-weight: bold;
`;

const IndicatorBox = styled.div`
  flex: 1;
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 10px;
  width: 100%;

  svg {
    font-size: 18px;
    stroke-width: 1;
  }
`;

export const Wrapper = styled.div<{
  $isDone: boolean;
  $indicatorColor?: string;
}>`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding-left: 10px;
  width: 100%;
  font-size: 14px;
  cursor: ${({ $isDone }) => ($isDone ? "default" : "pointer")};

  ${IndicatorBox} {
    margin: ${({ $indicatorColor }) => ($indicatorColor ? "8px 0" : "5px 0")};
    color: ${({ $isDone, theme }) =>
      $isDone ? theme.app.text.gray1 : theme.app.text.dark2};
    text-decoration: ${({ $isDone }) => ($isDone ? "line-through" : "none")};
  }

  ${Indicator} {
    background: ${({ $isDone, $indicatorColor }) =>
      $indicatorColor && $isDone ? $indicatorColor : "transparent"};
    color: ${({ $isDone, theme }) =>
      $isDone ? theme.app.palette.gray[0] : theme.app.text.dark2};
  }
`;

const RightButtonsWrapper = styled.div`
  align-self: stretch;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
`;

const rightButtonCss = css`
  flex: 1;
  padding: 8px 6px;
  border-radius: 0;
`;
