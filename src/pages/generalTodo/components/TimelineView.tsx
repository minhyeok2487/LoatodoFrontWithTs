import dayjs, { type Dayjs } from "dayjs";
import type React from "react";
import { useEffect, useMemo, useRef, useState } from "react";
import styled from "styled-components";

import type {
  GeneralTodoCategory,
  GeneralTodoItem,
  GeneralTodoStatus,
} from "@core/types/generalTodo";
import {
  addAlphaToColor,
  adjustColorForTheme,
  getReadableTextColor,
  normalizeColorInput,
} from "@core/utils/color";

interface TimelineViewProps {
  todos: GeneralTodoItem[];
  categories: GeneralTodoCategory[];
  categoryStatusMap: Map<number, GeneralTodoStatus[]>;
  isTodoActionDisabled: boolean;
  onChangeTodoStatus: (todo: GeneralTodoItem, statusId: number) => void;
  onEditTodo: (todo: GeneralTodoItem) => void;
  onTodoContextMenu: (
    event: React.MouseEvent<HTMLElement>,
    todo: GeneralTodoItem
  ) => void;
}

const getTimelineDayId = (day: Dayjs) => {
  return `timeline-day-${day.format("YYYY-MM-DD")}`;
};

const getVisibleDayCount = (width: number) => {
  if (width === 0) {
    return 7;
  }
  if (width <= 480) {
    return 3;
  }
  if (width <= 768) {
    return 5;
  }
  if (width <= 1024) {
    return 7;
  }
  if (width <= 1366) {
    return 10;
  }
  return 14;
};

const TimelineView = ({
  todos,
  categories,
  categoryStatusMap,
  isTodoActionDisabled,
  onChangeTodoStatus,
  onEditTodo,
  onTodoContextMenu,
}: TimelineViewProps) => {
  const scrollAreaRef = useRef<HTMLDivElement | null>(null);
  const [containerWidth, setContainerWidth] = useState(0);
  const [timelineMonth, setTimelineMonth] = useState(dayjs().startOf("month"));
  const dragStateRef = useRef({
    isPointerDown: false,
    isDragging: false,
    startX: 0,
    scrollLeft: 0,
  });
  const [isDragging, setIsDragging] = useState(false);

  const timelineDays = useMemo(() => {
    const monthStart = timelineMonth.startOf("month");
    const monthEnd = timelineMonth.endOf("month");
    const days: Dayjs[] = [];
    let cursor = monthStart;
    while (cursor.isBefore(monthEnd) || cursor.isSame(monthEnd, "day")) {
      days.push(cursor);
      cursor = cursor.add(1, "day");
    }
    return days;
  }, [timelineMonth]);

  const sortedTodos = useMemo(
    () =>
      [...todos].sort((a, b) => {
        const startA = a.startDate ?? a.dueDate ?? a.createdAt;
        const startB = b.startDate ?? b.dueDate ?? b.createdAt;
        return dayjs(startA).valueOf() - dayjs(startB).valueOf();
      }),
    [todos]
  );

  const today = dayjs();

  const rangeStart = useMemo(
    () => (timelineDays[0] ?? timelineMonth).startOf("day"),
    [timelineDays, timelineMonth]
  );
  const rangeEnd = useMemo(
    () =>
      (timelineDays[timelineDays.length - 1] ?? timelineMonth)
        .endOf("day")
        .clone(),
    [timelineDays, timelineMonth]
  );
  const totalRangeMs = Math.max(rangeEnd.valueOf() - rangeStart.valueOf(), 1);

  const clampToRange = (date: dayjs.ConfigType) => {
    let d = dayjs(date);
    if (d.isBefore(rangeStart)) d = rangeStart;
    if (d.isAfter(rangeEnd)) d = rangeEnd;
    return d;
  };

  const getPositionPercent = (date: dayjs.ConfigType) => {
    const d = clampToRange(date);
    return ((d.valueOf() - rangeStart.valueOf()) / totalRangeMs) * 100;
  };

  const isTodayInRange =
    today.isSame(rangeStart, "day") ||
    today.isSame(rangeEnd, "day") ||
    (today.isAfter(rangeStart) && today.isBefore(rangeEnd));

  const todayPercent = isTodayInRange ? getPositionPercent(today) : 0;

  const handlePrevMonth = () => {
    setTimelineMonth((prev) => prev.subtract(1, "month").startOf("month"));
  };

  const handleNextMonth = () => {
    setTimelineMonth((prev) => prev.add(1, "month").startOf("month"));
  };

  const handleTimelineDayClick = (day: Dayjs) => {
    const element = document.getElementById(getTimelineDayId(day));
    if (element) {
      element.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
        inline: "center",
      });
    }
  };

  if (timelineDays.length === 0) {
    return null;
  }

  const monthLabel = timelineMonth.format("MMM, YYYY");
  const todayIndex = timelineDays.findIndex((day) => day.isSame(today, "day"));

  // 컨테이너 폭 측정
  useEffect(() => {
    const el = scrollAreaRef.current;
    if (!el) {
      return () => {};
    }

    const measure = () => {
      setContainerWidth(el.clientWidth);
    };
    measure();

    let observer: ResizeObserver | null = null;

    if (typeof ResizeObserver !== "undefined") {
      observer = new ResizeObserver((entries) => {
        const entry = entries[0];
        if (entry) {
          setContainerWidth(entry.contentRect.width);
        }
      });
      observer.observe(el);
    } else {
      window.addEventListener("resize", measure);
    }

    return () => {
      if (observer) observer.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, []);

  // 화면 폭에 맞춰 가시 일수 결정
  const visibleDayCount = useMemo(
    () => getVisibleDayCount(containerWidth),
    [containerWidth]
  );
  const dayWidth =
    containerWidth > 0 ? containerWidth / visibleDayCount : 120;

  // 전체 보드 폭 = 전체 일수 * dayWidth
  const boardWidth = timelineDays.length * dayWidth;

  // 초기 + 월 변경 시 오늘 기준으로 7일 가운데 오도록 스크롤
  useEffect(() => {
    const container = scrollAreaRef.current;
    if (!container || containerWidth === 0) return;
    if (timelineDays.length === 0) return;

    const centerIndex =
      todayIndex >= 0
        ? todayIndex
        : Math.min(
            Math.floor(timelineDays.length / 2),
            timelineDays.length - 1
          );

    const centerOffset = (centerIndex + 0.5) * dayWidth - containerWidth / 2;
    const maxScroll = Math.max(boardWidth - containerWidth, 0);
    const scrollLeft = Math.min(Math.max(centerOffset, 0), maxScroll);

    container.scrollTo({ left: scrollLeft, behavior: "auto" });
  }, [
    timelineMonth,
    containerWidth,
    dayWidth,
    boardWidth,
    todayIndex,
    timelineDays.length,
  ]);

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      if (
        !dragStateRef.current.isPointerDown ||
        !scrollAreaRef.current
      ) {
        return;
      }
      const deltaX = event.clientX - dragStateRef.current.startX;
      if (!dragStateRef.current.isDragging && Math.abs(deltaX) < 3) {
        return;
      }
      if (!dragStateRef.current.isDragging) {
        dragStateRef.current.isDragging = true;
        setIsDragging(true);
      }
      scrollAreaRef.current.scrollLeft =
        dragStateRef.current.scrollLeft - deltaX;
      event.preventDefault();
    };

    const handleMouseUp = () => {
      if (dragStateRef.current.isPointerDown) {
        dragStateRef.current.isPointerDown = false;
        if (dragStateRef.current.isDragging) {
          dragStateRef.current.isDragging = false;
          setIsDragging(false);
        }
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, []);

  const handleHeaderMouseDown = (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    if (event.button !== 0) {
      return;
    }
    if (!scrollAreaRef.current) {
      return;
    }
    dragStateRef.current.isPointerDown = true;
    dragStateRef.current.isDragging = false;
    dragStateRef.current.startX = event.clientX;
    dragStateRef.current.scrollLeft = scrollAreaRef.current.scrollLeft;
  };

  return (
    <>
      <TimelineMonthHeader>
        <TimelineNavButton
          type="button"
          aria-label="이전 달"
          onClick={handlePrevMonth}
        >
          ◀
        </TimelineNavButton>
        <TimelineMonthLabel>{monthLabel}</TimelineMonthLabel>
        <TimelineNavButton
          type="button"
          aria-label="다음 달"
          onClick={handleNextMonth}
        >
          ▶
        </TimelineNavButton>
      </TimelineMonthHeader>

      <TimelineScrollArea ref={scrollAreaRef}>
        <TimelineBoard style={{ width: `${boardWidth}px` }}>
          <TimelineHeader>
            <TimelineHeaderTrack
              $isDragging={isDragging}
              onMouseDown={handleHeaderMouseDown}
            >
              <TimelineHeaderTrackContent
                $columns={timelineDays.length}
                $columnWidth={dayWidth}
              >
                {timelineDays.map((day) => (
                  <TimelineHeaderDateWrapper
                    key={day.format("YYYY-MM-DD")}
                    id={getTimelineDayId(day)}
                  >
                    <TimelineHeaderDate
                      type="button"
                      $isToday={day.isSame(today, "day")}
                      onClick={() => handleTimelineDayClick(day)}
                    >
                      <strong>{day.format("DD")}</strong>
                      <span>{day.format("ddd")}</span>
                    </TimelineHeaderDate>
                    <TimelineHeaderDayDivider />
                  </TimelineHeaderDateWrapper>
                ))}
              </TimelineHeaderTrackContent>
              {isTodayInRange && (
                <TimelineHeaderTodayMarker
                  style={{ left: `${todayPercent}%` }}
                />
              )}
            </TimelineHeaderTrack>
          </TimelineHeader>

          <TimelineRows>
            {sortedTodos.map((todo, index) => {
              const category = categories.find((c) => c.id === todo.categoryId);
              const statusOptions =
                categoryStatusMap.get(todo.categoryId) ?? [];
              const currentStatusName =
                statusOptions.find((status) => status.id === todo.statusId)
                  ?.name ?? todo.statusName;

              const startRaw = todo.startDate ?? todo.dueDate ?? todo.createdAt;
              const endRaw =
                todo.dueDate ??
                todo.startDate ??
                dayjs(startRaw).add(1, "hour").toISOString();

              const start = clampToRange(startRaw);
              const end = clampToRange(endRaw);
              const left = getPositionPercent(start);
              const right = getPositionPercent(end);
              const widthPercent = Math.max(right - left, 1);

              const startLabel = start.format("MM/DD HH:mm");
              const endLabel = end.format("MM/DD HH:mm");

              const statusSelectId = `timeline-status-${todo.id}`;

              return (
                <TimelineRow key={todo.id}>
                  <TimelineRowTrack>
                    <TimelineBar
                      $color={category?.color}
                      style={{
                        left: `${left}%`,
                        width: `${widthPercent}%`,
                        top: `${index * 4}px`,
                      }}
                      onContextMenu={(event) => onTodoContextMenu(event, todo)}
                      onClick={() => onEditTodo(todo)}
                    >
                      <TimelineBarTitle>{todo.title}</TimelineBarTitle>

                      <TimelineBarMeta>
                        <TimelineStatusBadge>
                          {currentStatusName}
                        </TimelineStatusBadge>

                        <TimelineStatusSelect
                          id={statusSelectId}
                          value={todo.statusId}
                          disabled={
                            isTodoActionDisabled || statusOptions.length === 0
                          }
                          onClick={(event) => event.stopPropagation()}
                          onChange={(event) =>
                            onChangeTodoStatus(todo, Number(event.target.value))
                          }
                        >
                          {statusOptions.map((status) => (
                            <option key={status.id} value={status.id}>
                              {status.name}
                            </option>
                          ))}
                        </TimelineStatusSelect>
                      </TimelineBarMeta>

                      <TimelineBarTimeLabel>
                        {startLabel} ~ {endLabel}
                      </TimelineBarTimeLabel>

                      {todo.description && (
                        <TimelineBarDescription>
                          {todo.description}
                        </TimelineBarDescription>
                      )}
                    </TimelineBar>

                    {isTodayInRange && (
                      <TimelineRowTodayMarker
                        style={{ left: `${todayPercent}%` }}
                      />
                    )}
                  </TimelineRowTrack>
                </TimelineRow>
              );
            })}
          </TimelineRows>
        </TimelineBoard>
      </TimelineScrollArea>
    </>
  );
};

export default TimelineView;

/* styled-components */

const TimelineScrollArea = styled.div`
  width: 100%;
  overflow-x: auto;
  overflow-y: hidden;
  flex: 1;
  min-height: 0;
`;

const TimelineMonthHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  margin-bottom: 8px;
`;

const TimelineNavButton = styled.button`
  border: 1px solid ${({ theme }) => theme.app.border};
  border-radius: 8px;
  background: ${({ theme }) => theme.app.bg.white};
  padding: 4px 10px;
  cursor: pointer;
  font-size: 13px;

  &:hover {
    border-color: ${({ theme }) => theme.app.text.dark1};
  }
`;

const TimelineMonthLabel = styled.span`
  font-size: 15px;
  font-weight: 700;
  color: ${({ theme }) => theme.app.text.dark1};
`;

const TimelineBoard = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  min-width: 100%;
`;

const TimelineHeader = styled.div`
  width: 100%;
`;

const TimelineHeaderTrack = styled.div<{ $isDragging: boolean }>`
  position: relative;
  border: 1px solid ${({ theme }) => theme.app.border};
  border-radius: 12px;
  background: ${({ theme }) => theme.app.bg.gray1};
  padding: 4px 0;
  overflow: hidden;
  cursor: ${({ $isDragging }) => ($isDragging ? "grabbing" : "grab")};
  user-select: ${({ $isDragging }) => ($isDragging ? "none" : "auto")};
`;

const TimelineHeaderTrackContent = styled.div<{
  $columns: number;
  $columnWidth: number;
}>`
  display: grid;
  grid-template-columns: repeat(
    ${({ $columns }) => $columns},
    ${({ $columnWidth }) => `${$columnWidth}px`}
  );
  align-items: stretch;
`;

const TimelineHeaderDateWrapper = styled.div`
  position: relative;
  display: flex;
  justify-content: center;
`;

const TimelineHeaderDayDivider = styled.div`
  position: absolute;
  top: 0;
  bottom: 0;
  right: 0;
  width: 1px;
  background: ${({ theme }) => theme.app.border};
`;

const TimelineHeaderDate = styled.button<{ $isToday: boolean }>`
  border: none;
  border-radius: 8px;
  background: ${({ theme, $isToday }) =>
    $isToday ? theme.app.bg.white : "transparent"};
  padding: 4px 6px;
  text-align: center;
  cursor: pointer;
  font: inherit;
  width: 100%;

  strong {
    display: block;
    font-size: 13px;
    color: ${({ theme }) => theme.app.text.dark1};
  }

  span {
    font-size: 11px;
    color: ${({ theme }) => theme.app.text.light1};
    text-transform: uppercase;
  }
`;

const TimelineHeaderTodayMarker = styled.div`
  position: absolute;
  top: 0;
  bottom: 0;
  width: 2px;
  transform: translateX(-1px);
  background: ${({ theme }) => theme.app.text.red};
  border-radius: 999px;
  pointer-events: none;
`;

const TimelineRows = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

const TimelineRow = styled.article`
  width: 100%;
`;

const TimelineRowTrack = styled.div`
  position: relative;
  border: 1px solid ${({ theme }) => theme.app.border};
  border-radius: 12px;
  background: ${({ theme }) => theme.app.bg.white};
  min-height: 64px;
  padding: 8px 0;
  overflow: hidden;
  width: 100%;
`;

const TimelineStatusBadge = styled.span`
  padding: 3px 8px;
  border-radius: 999px;
  font-size: 11px;
  font-weight: 600;
  border: 1px solid ${({ theme }) => theme.app.border};
  background: ${({ theme }) => theme.app.bg.white};
  color: ${({ theme }) => theme.app.text.dark1};
`;

const TimelineStatusSelect = styled.select`
  border: 1px solid ${({ theme }) => theme.app.border};
  border-radius: 8px;
  background: ${({ theme }) => theme.app.bg.white};
  padding: 3px 6px;
  font-size: 11px;
  color: ${({ theme }) => theme.app.text.dark1};

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const TimelineBar = styled.div<{ $color?: string | null }>`
  position: absolute;
  height: 52px;
  border-radius: 12px;
  padding: 6px 10px;
  box-sizing: border-box;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  gap: 2px;
  overflow: hidden;

  border: 1px solid
    ${({ theme, $color }) => {
      const normalized = normalizeColorInput($color ?? null);
      const adjusted =
        normalized && normalized !== "#FFFFFF"
          ? adjustColorForTheme(normalized, theme)
          : null;
      return adjusted ?? theme.app.border;
    }};

  background: ${({ theme, $color }) => {
    const normalized = normalizeColorInput($color ?? null);
    const adjusted =
      normalized && normalized !== "#FFFFFF"
        ? adjustColorForTheme(normalized, theme)
        : null;
    if (!adjusted) {
      return theme.app.bg.gray1;
    }
    const alpha = theme.currentTheme === "dark" ? 0.35 : 0.18;
    return addAlphaToColor(adjusted, alpha);
  }};

  color: ${({ theme, $color }) => {
    const normalized = normalizeColorInput($color ?? null);
    if (!normalized || normalized === "#FFFFFF") {
      return theme.app.text.dark1;
    }
    return getReadableTextColor(normalized, theme);
  }};

  &:hover {
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.05);
  }
`;

const TimelineBarTitle = styled.div`
  font-size: 13px;
  font-weight: 600;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
`;

const TimelineBarMeta = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
`;

const TimelineBarTimeLabel = styled.div`
  font-size: 11px;
  color: ${({ theme }) => theme.app.text.light1};
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
`;

const TimelineBarDescription = styled.div`
  font-size: 11px;
  color: ${({ theme }) => theme.app.text.light1};
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
`;

const TimelineRowTodayMarker = styled.div`
  position: absolute;
  top: 0;
  bottom: 0;
  width: 2px;
  transform: translateX(-1px);
  background: ${({ theme }) => theme.app.text.red};
  border-radius: 999px;
  pointer-events: none;
`;
