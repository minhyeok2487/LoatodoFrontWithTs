import styled from "@emotion/styled";
import CheckOutlinedIcon from "@mui/icons-material/CheckOutlined";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import type { MouseEvent, ReactNode } from "react";
import { useMemo } from "react";

interface Props {
  totalCount: number;
  currentCount: number;
  onClick: () => void;
  onRightClick: () => void;
  onMoreButtonClick?: () => void;
  children: ReactNode;
}

const DailyContentButton = ({
  totalCount,
  currentCount,
  onClick,
  onRightClick,
  onMoreButtonClick,
  children,
}: Props) => {
  const handleContextMenu = (e: MouseEvent) => {
    e.preventDefault();

    onRightClick();
  };

  const handleMoreButtonClick = (e: MouseEvent) => {
    e.stopPropagation();

    onMoreButtonClick?.();
  };

  const indicatorContent = useMemo<ReactNode>(() => {
    if (currentCount === 0) {
      return "";
    }

    if (currentCount === totalCount) {
      return <CheckOutlinedIcon />;
    }

    return `${currentCount}수`;
  }, [currentCount, totalCount]);

  return (
    <Wrapper
      type="button"
      onClick={onClick}
      onContextMenu={handleContextMenu}
      isDone={currentCount === totalCount}
    >
      <IndicatorBox>
        <Indicator>{indicatorContent}</Indicator>
        {children}
      </IndicatorBox>

      {onMoreButtonClick && (
        <MoreButton onClick={handleMoreButtonClick}>
          <MoreHorizIcon />
        </MoreButton>
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

const Wrapper = styled.button<{ isDone: boolean }>`
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
    background: ${({ isDone, theme }) =>
      isDone ? theme.app.blue : "transparent"};
    color: ${({ isDone, theme }) =>
      isDone ? theme.app.white : theme.app.text.dark2};
  }
`;

const MoreButton = styled.button``;
