import {
  DndContext,
  DragOverlay,
  type DragEndEvent,
  type DragStartEvent,
  type DragOverEvent,
  MouseSensor,
  TouchSensor,
  closestCenter,
  useDroppable,
  useSensor,
  useSensors,
} from "@dnd-kit/core";

import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { FiCalendar } from "@react-icons/all-files/fi/FiCalendar";
import { FiCheckCircle } from "@react-icons/all-files/fi/FiCheckCircle";
import { FiCircle } from "@react-icons/all-files/fi/FiCircle";
import {
  memo,
  useState,
  forwardRef,
  useEffect,
  useMemo,
  useCallback,
  type MouseEvent,
} from "react";
import styled from "styled-components";

import { hasVisibleContent, normaliseToHtml } from "./editorUtils";
import type { GeneralTodoItem, GeneralTodoStatus } from "./types";

const DEFAULT_PROGRESS_STATUS_NAME = "진행 중";
const DEFAULT_DONE_STATUS_NAME = "완료";
const FALLBACK_DONE_COLUMN_ID = "__done";
const createDoneColumnId = (categoryId: string | null | undefined) =>
  categoryId ? `${FALLBACK_DONE_COLUMN_ID}:${categoryId}` : FALLBACK_DONE_COLUMN_ID;

type Props = {
  todos: GeneralTodoItem[];
  statuses: GeneralTodoStatus[];
  doneStatusId?: string | null;
  onOpenDetail: (todoId: number) => void;
  onTodoContextMenu: (
    event: MouseEvent<HTMLButtonElement>,
    todo: GeneralTodoItem
  ) => void;
  onToggleCompletion?: (todoId: number, completed: boolean) => void;
  onStatusChange?: (todoId: number, statusId: string) => void;
  onManageStatuses?: () => void;
};

const formatDueDateLabel = (value: string | null | undefined) => {
  if (!value) {
    return null;
  }

  const hasTime = value.includes("T");
  const parsed = new Date(value);

  if (Number.isNaN(parsed.getTime())) {
    return value;
  }

  const options: Intl.DateTimeFormatOptions = hasTime
    ? {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }
    : {
        year: "numeric",
        month: "short",
        day: "numeric",
      };

  return parsed.toLocaleString(undefined, options);
};

const legacyColumnIds = ["pending", "done"] as const;
type LegacyColumnId = (typeof legacyColumnIds)[number];

const KanbanColumn = memo(
  ({
    status,
    helper,
    items,
    onOpenDetail,
    onTodoContextMenu,
    onToggleCompletion,
  }: {
    status: GeneralTodoStatus;
    helper: string;
    items: GeneralTodoItem[];
    onOpenDetail: (todoId: number) => void;
    onTodoContextMenu: (
      event: MouseEvent<HTMLButtonElement>,
      todo: GeneralTodoItem
    ) => void;
    onToggleCompletion?: (todoId: number, completed: boolean) => void;
  }) => {
    const { setNodeRef } = useDroppable({ id: status.id });

    return (
      <SortableContext
        id={status.id}
        items={items.map((item) => item.id)}
        strategy={verticalListSortingStrategy}
      >
        <Column>
          <ColumnHeader>
            <ColumnTitle>{status.name}</ColumnTitle>
            <ColumnMeta>
              <ColumnCount>{items.length}</ColumnCount>
              <ColumnHelper>{helper}</ColumnHelper>
            </ColumnMeta>
          </ColumnHeader>
          <ColumnBody ref={setNodeRef}>
            {items.length === 0 ? (
              <ColumnEmpty>아직 표시할 할 일이 없어요.</ColumnEmpty>
            ) : (
              items.map((todo) => (
                <SortableCard
                  key={todo.id}
                  todo={todo}
                  onOpenDetail={onOpenDetail}
                  onTodoContextMenu={onTodoContextMenu}
                  onToggleCompletion={onToggleCompletion}
                />
              ))
            )}
          </ColumnBody>
        </Column>
      </SortableContext>
    );
  }
);

const LegacyKanbanColumn = memo(
  ({
    id,
    title,
    helper,
    items,
    onOpenDetail,
    onTodoContextMenu,
    onToggleCompletion,
  }: {
    id: LegacyColumnId;
    title: string;
    helper: string;
    items: GeneralTodoItem[];
    onOpenDetail: (todoId: number) => void;
    onTodoContextMenu: (
      event: MouseEvent<HTMLButtonElement>,
      todo: GeneralTodoItem
    ) => void;
    onToggleCompletion?: (todoId: number, completed: boolean) => void;
  }) => {
    const { setNodeRef } = useDroppable({ id });

    return (
      <SortableContext
        id={id}
        items={items.map((item) => item.id)}
        strategy={verticalListSortingStrategy}
      >
        <Column>
          <ColumnHeader>
            <ColumnTitle>{title}</ColumnTitle>
            <ColumnMeta>
              <ColumnCount>{items.length}</ColumnCount>
              <ColumnHelper>{helper}</ColumnHelper>
            </ColumnMeta>
          </ColumnHeader>
          <ColumnBody ref={setNodeRef}>
            {items.length === 0 ? (
              <ColumnEmpty>아직 표시할 할 일이 없어요.</ColumnEmpty>
            ) : (
              items.map((todo) => (
                <SortableCard
                  key={todo.id}
                  todo={todo}
                  onOpenDetail={onOpenDetail}
                  onTodoContextMenu={onTodoContextMenu}
                  onToggleCompletion={onToggleCompletion}
                />
              ))
            )}
          </ColumnBody>
        </Column>
      </SortableContext>
    );
  }
);

const getContainerId = (
  entry:
    | DragStartEvent["active"]
    | DragOverEvent["over"]
    | DragEndEvent["over"],
  isValid: (id: string) => boolean,
  fallback?: () => string | undefined
): string | undefined => {
  if (!entry) {
    return undefined;
  }

  const sortableContainer = entry.data?.current?.sortable?.containerId;

  if (
    typeof sortableContainer === "string" &&
    isValid(sortableContainer)
  ) {
    return sortableContainer;
  }

  if (typeof entry.id === "string" && isValid(entry.id)) {
    return entry.id;
  }

  return fallback?.();
};

const getLegacyContainerId = (
  entry:
    | DragStartEvent["active"]
    | DragOverEvent["over"]
    | DragEndEvent["over"],
  fallback?: () => LegacyColumnId | undefined
): LegacyColumnId | undefined => {
  if (!entry) {
    return undefined;
  }

  const sortableContainer = entry.data?.current?.sortable?.containerId;

  if (
    typeof sortableContainer === "string" &&
    legacyColumnIds.includes(sortableContainer as LegacyColumnId)
  ) {
    return sortableContainer as LegacyColumnId;
  }

  if (
    typeof entry.id === "string" &&
    legacyColumnIds.includes(entry.id as LegacyColumnId)
  ) {
    return entry.id as LegacyColumnId;
  }

  return fallback?.();
};

const TodoCard = forwardRef<HTMLButtonElement, {
  todo: GeneralTodoItem;
  onOpenDetail: (todoId: number) => void;
  onTodoContextMenu: (
    event: MouseEvent<HTMLButtonElement>,
    todo: GeneralTodoItem
  ) => void;
  onToggleCompletion?: (todoId: number, completed: boolean) => void;
  style?: React.CSSProperties;
  transform?: string;
  transition?: string;
}>(({ todo, onOpenDetail, onTodoContextMenu, onToggleCompletion, transform, transition, ...props }, ref) => {
  const formattedDueDate = formatDueDateLabel(todo.dueDate);
  const shouldRenderDescription = hasVisibleContent(todo.description);
  const descriptionMarkup = shouldRenderDescription
    ? normaliseToHtml(todo.description)
    : "";
  const isCompleted = Boolean(todo.completed);
  const canToggle = Boolean(onToggleCompletion);

  const handleCardClick = () => {
    onOpenDetail(todo.id);
  };

  const handleContextMenu = (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    onTodoContextMenu(event, todo);
  };

  const handleToggle = (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    event.stopPropagation();
    onToggleCompletion?.(todo.id, !isCompleted);
  };

  return (
    <Card
      ref={ref}
      type="button"
      onClick={handleCardClick}
      onContextMenu={handleContextMenu}
      style={{ transform, transition, ...props.style }}
      {...props}
    >
      <CardHeader>
        <CardTitle>{todo.title}</CardTitle>
        {canToggle ? (
          <CompletionButton
            type="button"
            onClick={handleToggle}
            $completed={isCompleted}
            aria-label={isCompleted ? "미완료로 되돌리기" : "완료로 표시"}
          >
            {isCompleted ? <FiCheckCircle size={16} /> : <FiCircle size={16} />}
          </CompletionButton>
        ) : null}
      </CardHeader>
      {formattedDueDate ? (
        <CardMeta>
          <MetaIcon>
            <FiCalendar size={12} />
          </MetaIcon>
          <span>{formattedDueDate}</span>
        </CardMeta>
      ) : null}
      {shouldRenderDescription ? (
        <CardDescription
          dangerouslySetInnerHTML={{ __html: descriptionMarkup }}
        />
      ) : null}
    </Card>
  );
});

const SortableCard = memo(({
  todo,
  onOpenDetail,
  onTodoContextMenu,
  onToggleCompletion,
}: {
  todo: GeneralTodoItem;
  onOpenDetail: (todoId: number) => void;
  onTodoContextMenu: (
    event: MouseEvent<HTMLButtonElement>,
    todo: GeneralTodoItem
  ) => void;
  onToggleCompletion?: (todoId: number, completed: boolean) => void;
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: todo.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <TodoCard
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      todo={todo}
      onOpenDetail={onOpenDetail}
      onTodoContextMenu={onTodoContextMenu}
      onToggleCompletion={onToggleCompletion}
    />
  );
});

const GeneralTodoKanban = ({
  todos,
  statuses,
  doneStatusId,
  onOpenDetail,
  onTodoContextMenu,
  onToggleCompletion,
  onStatusChange,
  onManageStatuses,
}: Props) => {
  const sortedStatuses = useMemo(
    () => statuses.slice().sort((a, b) => a.sortOrder - b.sortOrder),
    [statuses]
  );

  const hasStatuses = sortedStatuses.length > 0;

  const resolvedDoneStatusId = useMemo(() => {
    if (doneStatusId) {
      return doneStatusId;
    }
    const categoryId = sortedStatuses[0]?.categoryId ?? null;
    return createDoneColumnId(categoryId);
  }, [doneStatusId, sortedStatuses]);

  const doneStatus = useMemo<GeneralTodoStatus>(
    () => ({
      id: resolvedDoneStatusId,
      categoryId: sortedStatuses[0]?.categoryId ?? "",
      name: DEFAULT_DONE_STATUS_NAME,
      sortOrder: Number.MAX_SAFE_INTEGER,
      isDone: true,
      isVirtual: true,
    }),
    [resolvedDoneStatusId, sortedStatuses]
  );

  const statusMap = useMemo(() => {
    const map: Record<string, GeneralTodoStatus> = {};
    sortedStatuses.forEach((status) => {
      map[status.id] = status;
    });
    map[doneStatus.id] = doneStatus;
    return map;
  }, [sortedStatuses, doneStatus]);

  const firstActiveStatusId = useMemo(() => {
    const active = sortedStatuses.find((status) => !status.isDone);
    if (active) {
      return active.id;
    }
    return sortedStatuses[0]?.id ?? null;
  }, [sortedStatuses]);

  const preparedTodos = useMemo(() => {
    if (!hasStatuses) {
      return todos;
    }

    return todos.map((todo) => {
      const fallbackStatusId = todo.completed
        ? resolvedDoneStatusId
        : firstActiveStatusId;
      const resolvedStatusId = todo.statusId ?? fallbackStatusId ?? null;
      const resolvedStatus = resolvedStatusId
        ? statusMap[resolvedStatusId]
        : undefined;
      const completed = resolvedStatus
        ? resolvedStatus.isDone
        : Boolean(todo.completed);

      return {
        ...todo,
        statusId: resolvedStatusId,
        completed,
      };
    });
  }, [
    todos,
    hasStatuses,
    resolvedDoneStatusId,
    firstActiveStatusId,
    sortedStatuses,
    statusMap,
  ]);

  const [internalTodos, setInternalTodos] =
    useState<GeneralTodoItem[]>(preparedTodos);
  const [activeTodo, setActiveTodo] = useState<GeneralTodoItem | null>(null);
  const [activeRect, setActiveRect] = useState<{ width: number; height: number } | null>(
    null
  );

  useEffect(() => {
    setInternalTodos(preparedTodos);
  }, [preparedTodos]);

  const sensors = useSensors(
    useSensor(MouseSensor, {
      activationConstraint: {
        distance: 6,
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 150,
        tolerance: 8,
      },
    })
  );

  const isValidStatusId = useCallback(
    (id: string) => id === resolvedDoneStatusId || Boolean(statusMap[id]),
    [resolvedDoneStatusId, statusMap]
  );

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    if (active.rect.current.initial) {
      setActiveRect({
        width: active.rect.current.initial.width,
        height: active.rect.current.initial.height,
      });
    }
    const activeId = Number(active.id);
    if (Number.isNaN(activeId)) {
      return;
    }
    const todo = internalTodos.find((t) => t.id === activeId);
    if (todo) {
      setActiveTodo(todo);
    }
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    if (!over) {
      return;
    }

    const activeId = Number(active.id);
    if (Number.isNaN(activeId)) {
      return;
    }

    if (!hasStatuses) {
      const activeContainer = getLegacyContainerId(active, () => {
        const current = internalTodos.find((todo) => todo.id === activeId);
        return current?.completed ? "done" : "pending";
      });
      const overContainer = getLegacyContainerId(over);

      if (
        !activeContainer ||
        !overContainer ||
        activeContainer === overContainer
      ) {
        return;
      }

      const isCompleted = overContainer === "done";

      setInternalTodos((current) =>
        current.map((todo) =>
          todo.id === activeId ? { ...todo, completed: isCompleted } : todo
        )
      );

      return;
    }

    const activeContainer = getContainerId(
      active,
      isValidStatusId,
      () => {
        const current = internalTodos.find((todo) => todo.id === activeId);
        return current?.statusId ?? undefined;
      }
    );
    const overContainer = getContainerId(over, isValidStatusId);

    if (
      !activeContainer ||
      !overContainer ||
      activeContainer === overContainer
    ) {
      return;
    }

    const overStatus = statusMap[overContainer];

    setInternalTodos((current) =>
      current.map((todo) =>
        todo.id === activeId
          ? {
              ...todo,
              statusId: overContainer,
              completed: overStatus?.isDone ?? todo.completed,
            }
          : todo
      )
    );
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over) {
      setActiveTodo(null);
      setActiveRect(null);
      return;
    }

    const activeId = Number(active.id);
    if (Number.isNaN(activeId)) {
      setActiveTodo(null);
      setActiveRect(null);
      return;
    }

    if (!hasStatuses) {
      const activeContainer = getLegacyContainerId(active, () => {
        const current = internalTodos.find((todo) => todo.id === activeId);
        return current?.completed ? "done" : "pending";
      });
      const overContainer = getLegacyContainerId(over);

      if (
        activeContainer &&
        overContainer &&
        activeContainer !== overContainer
      ) {
        const isCompleted = overContainer === "done";

        setInternalTodos((current) =>
          current.map((todo) =>
            todo.id === activeId ? { ...todo, completed: isCompleted } : todo
          )
        );

        if (onToggleCompletion) {
          onToggleCompletion(activeId, isCompleted);
        }
      }
    } else {
      const activeContainer = getContainerId(
        active,
        isValidStatusId,
        () => {
          const current = internalTodos.find((todo) => todo.id === activeId);
          return current?.statusId ?? undefined;
        }
      );
      const overContainer = getContainerId(over, isValidStatusId);

      if (
        activeContainer &&
        overContainer &&
        activeContainer !== overContainer
      ) {
        const overStatus = statusMap[overContainer];

        if (overStatus) {
          setInternalTodos((current) =>
            current.map((todo) =>
              todo.id === activeId
                ? {
                    ...todo,
                    statusId: overContainer,
                    completed: overStatus.isDone,
                  }
                : todo
            )
          );

          if (onStatusChange) {
            onStatusChange(activeId, overContainer);
          }
        }
      }
    }

    setActiveTodo(null);
    setActiveRect(null);
  };

  const statusColumns = useMemo(() => {
    const progressColumns = sortedStatuses.map((status) => {
      const displayName = status.name || DEFAULT_PROGRESS_STATUS_NAME;
      const helper = `${displayName} 단계의 할 일`;
      const items = internalTodos.filter(
        (todo) => todo.statusId === status.id && !todo.completed
      );

      return {
        status,
        helper,
        items,
      };
    });

    const doneItems = internalTodos.filter((todo) => todo.completed);

    return [
      ...progressColumns,
      {
        status: doneStatus,
        helper: "완료 처리한 할 일",
        items: doneItems,
      },
    ];
  }, [internalTodos, sortedStatuses, doneStatus]);

  const legacyColumns = useMemo(() => {
    const pending = internalTodos.filter((todo) => !todo.completed);
    const done = internalTodos.filter((todo) => todo.completed);

    return [
      {
        id: "pending" as const,
        title: "진행 중",
        helper: "아직 완료하지 않은 할 일",
        items: pending,
      },
      {
        id: "done" as const,
        title: "완료",
        helper: "완료 처리한 할 일",
        items: done,
      },
    ];
  }, [internalTodos]);

  return (
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
      collisionDetection={closestCenter}
    >
      <BoardWrapper>
        {onManageStatuses ? (
          <BoardHeader>
            <ManageStatusesButton type="button" onClick={onManageStatuses}>
              상태 관리
            </ManageStatusesButton>
          </BoardHeader>
        ) : null}
        {hasStatuses ? (
          <Board>
            {statusColumns.map(({ status, helper, items }) => (
              <KanbanColumn
                key={status.id}
                status={status}
                helper={helper}
                items={items}
                onOpenDetail={onOpenDetail}
                onTodoContextMenu={onTodoContextMenu}
                onToggleCompletion={onToggleCompletion}
              />
            ))}
          </Board>
        ) : (
          <>
            <Board>
              {legacyColumns.map(({ id, title, helper, items }) => (
                <LegacyKanbanColumn
                  key={id}
                  id={id}
                  title={title}
                  helper={helper}
                  items={items}
                  onOpenDetail={onOpenDetail}
                  onTodoContextMenu={onTodoContextMenu}
                  onToggleCompletion={onToggleCompletion}
                />
              ))}
            </Board>
            <FallbackMessage>
              새로 만든 칸반 카테고리는 기본으로 진행/완료 두 단계로 표시됩니다.
              상태 관리 버튼을 눌러 단계를 추가해보세요.
            </FallbackMessage>
          </>
        )}
      </BoardWrapper>
      <DragOverlay>
        {activeTodo && activeRect ? (
          <TodoCard
            todo={activeTodo}
            style={{
              width: activeRect.width,
              height: activeRect.height,
              transform: `translate(-${activeRect.width / 2}px, -${activeRect.height / 2}px)`,
            }}
            onOpenDetail={onOpenDetail}
            onTodoContextMenu={onTodoContextMenu}
            onToggleCompletion={onToggleCompletion}
          />
        ) : null}
      </DragOverlay>
    </DndContext>
  );
};

export default GeneralTodoKanban;

const BoardWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const BoardHeader = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
`;

const ManageStatusesButton = styled.button`
  border: 1px solid ${({ theme }) => theme.app.border};
  background: ${({ theme }) => theme.app.bg.white};
  color: ${({ theme }) => theme.app.text.dark1};
  font-size: 12px;
  font-weight: 600;
  padding: 6px 12px;
  border-radius: 999px;
  cursor: pointer;
  transition:
    background 0.2s ease,
    border 0.2s ease,
    color 0.2s ease;

  &:hover {
    background: ${({ theme }) => theme.app.bg.gray1};
    border-color: ${({ theme }) => theme.app.palette.smokeBlue[200]};
  }
`;

const FallbackMessage = styled.p`
  margin: 0;
  font-size: 13px;
  color: ${({ theme }) => theme.app.text.light1};
`;

const Board = styled.div`
  display: grid;
  gap: 18px;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
`;

const Column = styled.section`
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 16px;
  border-radius: 16px;
  border: 1px solid ${({ theme }) => theme.app.border};
  background: ${({ theme }) => theme.app.bg.gray1};
  min-height: 220px;
`;

const ColumnHeader = styled.header`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 10px;
`;

const ColumnTitle = styled.h4`
  margin: 0;
  font-size: 16px;
  font-weight: 700;
  color: ${({ theme }) => theme.app.text.dark1};
`;

const ColumnMeta = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 4px;
`;

const ColumnHelper = styled.span`
  font-size: 11px;
  color: ${({ theme }) => theme.app.text.light2};
`;

const ColumnCount = styled.span`
  font-size: 12px;
  font-weight: 600;
  color: ${({ theme }) => theme.app.text.light1};
`;

const ColumnBody = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  flex: 1;
`;

const ColumnEmpty = styled.p`
  margin: 0;
  padding: 18px;
  border-radius: 12px;
  border: 1px dashed ${({ theme }) => theme.app.border};
  background: ${({ theme }) => theme.app.bg.white};
  color: ${({ theme }) => theme.app.text.light1};
  font-size: 13px;
  text-align: center;
`;

const Card = styled.button`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 10px;
  text-align: left;
  padding: 14px;
  border-radius: 12px;
  border: 1px solid ${({ theme }) => theme.app.border};
  background: ${({ theme }) => theme.app.bg.white};
  box-shadow: 0 12px 18px rgba(15, 23, 42, 0.06);
  transition:
    box-shadow 0.2s ease,
    border-color 0.2s ease;
  cursor: pointer;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 16px 26px rgba(44, 121, 189, 0.16);
    border-color: ${({ theme }) => theme.app.palette.smokeBlue[200]};
  }
`;

const CardHeader = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
  width: 100%;
`;

const CardTitle = styled.strong`
  font-size: 14px;
  font-weight: 700;
  color: ${({ theme }) => theme.app.text.dark1};
  line-height: 1.4;
  word-break: break-word;
`;

const CardMeta = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  color: ${({ theme }) => theme.app.text.light1};
`;

const MetaIcon = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: ${({ theme }) => theme.app.palette.smokeBlue[500]};
`;

const CardDescription = styled.div`
  font-size: 12px;
  color: ${({ theme }) => theme.app.text.light1};
  line-height: 1.6;
  max-height: 120px;
  overflow: hidden;

  p {
    margin: 0 0 6px;
  }

  p:last-child {
    margin-bottom: 0;
  }
`;

const CompletionButton = styled.button<{ $completed: boolean }>`
  border: none;
  background: ${({ theme, $completed }) =>
    $completed ? theme.app.palette.smokeBlue[500] : theme.app.bg.gray1};
  color: ${({ theme, $completed }) =>
    $completed ? "#ffffff" : theme.app.text.light1};
  border-radius: 999px;
  padding: 6px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition:
    background 0.2s ease,
    color 0.2s ease,
    transform 0.2s ease;

  &:hover {
    transform: translateY(-1px);
    color: ${({ theme }) => "#ffffff"};
    background: ${({ theme }) => theme.app.palette.smokeBlue[500]};
  }
`;
