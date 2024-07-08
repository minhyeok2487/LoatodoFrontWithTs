import { BsCheck } from "@react-icons/all-files/bs/BsCheck";
import type { MouseEvent, ReactNode } from "react";
import { useMemo } from "react";
import styled from "styled-components";

interface Props {
  hideIndicatorText?: boolean;
  indicatorColor: string;
  totalCount: number;
  currentCount: number;
  onClick: () => void;
  onRightClick: () => void;
  rightButtons?: RightButton[];
  children: ReactNode;
}

interface RightButton {
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

    return hideIndicatorText ? "" : `${currentCount}수`;
  }, [currentCount, totalCount, hideIndicatorText]);

  return (
    <Wrapper
      role="button"
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
        <Indicator>{indicatorContent}</Indicator>
        {children}
      </IndicatorBox>

      {rightButtons && (
        <RightButtonsWrapper>
          {rightButtons.map((item, index) => {
            return (
              <RightButtonWrapper
                key={index}
                onClick={(e) => {
                  handleRightButtonClick(e, index);
                }}
              >
                {item.icon}
              </RightButtonWrapper>
            );
          })}
        </RightButtonsWrapper>
      )}
    </Wrapper>
  );
};

export default DailyContentButton;

const Indicator = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 22px;
  height: 22px;
  border-radius: 4px;
  border: 1px solid ${({ theme }) => theme.app.border};
  font-size: 10px;
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
  $indicatorColor: string;
}>`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 8px 10px;
  width: 100%;
  font-size: 14px;

  ${IndicatorBox} {
    color: ${({ $isDone, theme }) =>
      $isDone ? theme.app.gray2 : theme.app.text.dark2};
    text-decoration: ${({ $isDone, theme }) =>
      $isDone ? "line-through" : "none"};
  }

  ${Indicator} {
    background: ${({ $isDone, $indicatorColor }) =>
      $isDone ? $indicatorColor : "transparent"};
    color: ${({ $isDone, theme }) =>
      $isDone ? theme.app.white : theme.app.text.dark2};
  }
`;

const RightButtonsWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 5px;
`;

const RightButtonWrapper = styled.button`
  font-size: 18px;
`;
