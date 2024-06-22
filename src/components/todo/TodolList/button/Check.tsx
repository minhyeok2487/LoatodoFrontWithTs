import styled from "@emotion/styled";
import type { MouseEvent, ReactNode } from "react";
import { useMemo } from "react";
import { RiCheckFill } from "react-icons/ri";

interface Props {
  indicatorColor: string;
  totalCount: number;
  currentCount: number;
  onClick: () => void;
  onRightClick: () => void;
  rightButton?: RightButton;
  children: ReactNode;
}

interface RightButton {
  onClick: () => void;
  icon: ReactNode;
}

const DailyContentButton = ({
  indicatorColor,
  totalCount,
  currentCount,
  onClick,
  onRightClick,
  rightButton,
  children,
}: Props) => {
  const handleContextMenu = (e: MouseEvent) => {
    e.preventDefault();

    onRightClick();
  };

  const handleRightButtonClick = (e: MouseEvent) => {
    e.stopPropagation();

    rightButton?.onClick();
  };

  const indicatorContent = useMemo<ReactNode>(() => {
    if (currentCount === 0) {
      return "";
    }

    if (currentCount === totalCount) {
      return <RiCheckFill size="18" strokeWidth="0.7" />;
    }

    return `${currentCount}수`;
  }, [currentCount, totalCount]);

  return (
    <Wrapper
      type="button"
      onClick={onClick}
      onContextMenu={handleContextMenu}
      isDone={currentCount === totalCount}
      indicatorColor={indicatorColor}
    >
      <IndicatorBox>
        <Indicator>{indicatorContent}</Indicator>
        {children}
      </IndicatorBox>

      {rightButton && (
        <RightButtonWrapper onClick={handleRightButtonClick}>
          {rightButton.icon}
        </RightButtonWrapper>
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
`;

const Wrapper = styled.button<{ isDone: boolean; indicatorColor: string }>`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 10px 10px;
  width: 100%;
  font-size: 14px;

  ${IndicatorBox} {
    color: ${({ isDone, theme }) =>
      isDone ? theme.app.gray2 : theme.app.text.dark2};
    text-decoration: ${({ isDone, theme }) =>
      isDone ? "line-through" : "normal"};
  }

  ${Indicator} {
    background: ${({ isDone, indicatorColor }) =>
      isDone ? indicatorColor : "transparent"};
    color: ${({ isDone, theme }) =>
      isDone ? theme.app.white : theme.app.text.dark2};
  }
`;

const RightButtonWrapper = styled.button`
  font-size: 18px;
`;
