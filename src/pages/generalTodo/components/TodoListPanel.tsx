import {
  DndContext,
  type DragEndEvent,
  MouseSensor,
  TouchSensor,
  closestCenter,
  useDraggable,
  useDroppable,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import dayjs from "dayjs";
import { useMemo } from "react";
import type React from "react";
import styled from "styled-components";

import type {
  FolderWithCategories,
  GeneralTodoCategory,
  GeneralTodoItem,
  GeneralTodoStatus,
  StatusFilter,
  ViewMode,
} from "@core/types/generalTodo";
import {
  addAlphaToColor,
  adjustColorForTheme,
  getReadableTextColor,
  normalizeColorInput,
} from "@core/utils/color";

import Button from "@components/Button";

interface TodoListPanelProps {
  selectedFolder: FolderWithCategories | null;
  activeCategory: GeneralTodoCategory | null;
  todos: GeneralTodoItem[];
  onOpenForm: () => void;
  isAddDisabled: boolean;
  categories: GeneralTodoCategory[];
  statusFilter: StatusFilter;
  onChangeStatusFilter: (next: StatusFilter) => void;
  hasFolders: boolean;
  onChangeTodoStatus: (todo: GeneralTodoItem, statusId: number) => void;
  onEditTodo: (todo: GeneralTodoItem) => void;
  isTodoActionDisabled: boolean;
  onTodoContextMenu: (
    event: React.MouseEvent<HTMLElement>,
    todo: GeneralTodoItem
  ) => void;
  viewMode: ViewMode;
  statuses: GeneralTodoStatus[];
}

const TodoListPanel = ({
  selectedFolder,
  activeCategory,
  todos,
  onOpenForm,
  isAddDisabled,
  categories,
  statusFilter,
  onChangeStatusFilter,
  hasFolders,
  onChangeTodoStatus,
  onEditTodo,
  isTodoActionDisabled,
  onTodoContextMenu,
  viewMode,
  statuses,
}: TodoListPanelProps) => {
  const sensors = useSensors(
    useSensor(MouseSensor, { activationConstraint: { distance: 6 } }),
    useSensor(TouchSensor, {
      activationConstraint: { delay: 120, tolerance: 8 },
    })
  );
  const kanbanStatuses = useMemo(
    () => [...statuses].sort((a, b) => a.sortOrder - b.sortOrder),
    [statuses]
  );
  const todosByStatusId = useMemo(() => {
    const map = new Map<number, GeneralTodoItem[]>();
    kanbanStatuses.forEach((status) => {
      map.set(status.id, []);
    });
    todos.forEach((todo) => {
      if (!map.has(todo.statusId)) {
        map.set(todo.statusId, []);
      }
      map.get(todo.statusId)?.push(todo);
    });
    return map;
  }, [todos, kanbanStatuses]);
  const categoryStatusMap = useMemo(() => {
    const map = new Map<number, GeneralTodoStatus[]>();
    categories.forEach((category) => {
      const options = [...(category.statuses ?? [])].sort(
        (a, b) => a.sortOrder - b.sortOrder
      );
      map.set(category.id, options);
    });
    return map;
  }, [categories]);
  const categoryNameMap = useMemo(() => {
    const map = new Map<number, string>();
    categories.forEach((category) => {
      map.set(category.id, category.name);
    });
    return map;
  }, [categories]);
  const filterStatuses = useMemo(() => {
    const merged = categories.flatMap((category) => category.statuses ?? []);
    const unique = new Map<number, GeneralTodoStatus>();
    merged.forEach((status) => {
      unique.set(status.id, status);
    });
    return [...unique.values()].sort((a, b) => a.sortOrder - b.sortOrder);
  }, [categories]);
  const statusFilterValue =
    statusFilter === "all" ? "all" : String(statusFilter);

  const handleKanbanDragEnd = (event: DragEndEvent) => {
    if (!event.over || !event.over.data.current) {
      return;
    }
    const targetStatusId = event.over.data.current.statusId as
      | number
      | undefined;
    if (!targetStatusId) {
      return;
    }
    const todoId = Number(event.active.id);
    const todo = todos.find((item) => item.id === todoId);
    if (!todo) {
      return;
    }
    if (todo.statusId !== targetStatusId) {
      onChangeTodoStatus(todo, targetStatusId);
    }
  };

  const emptyMessage = (() => {
    if (!hasFolders) {
      return "등록된 폴더가 없어 할 일을 표시할 수 없어요.";
    }
    if (selectedFolder) {
      return "선택한 조건에 할 일이 없어요.";
    }
    return "왼쪽에서 폴더를 선택해 주세요.";
  })();

  return (
    <Wrapper>
      <ListHeader>
        <div>
          <CardTitle>할 일 목록</CardTitle>
          <CardSubtitle>
            {selectedFolder
              ? `${selectedFolder.name} · ${todos.length}건`
              : "폴더를 선택해 주세요."}
            {activeCategory ? ` · ${activeCategory.name}` : ""}
          </CardSubtitle>
        </div>

        <HeaderActions>
          {viewMode !== "KANBAN" && (
            <>
              <FilterLabel htmlFor="status-filter">상태</FilterLabel>
              <FilterSelect
                id="status-filter"
                value={statusFilterValue}
                onChange={(event) => {
                  const nextValue = event.target.value;
                  onChangeStatusFilter(
                    nextValue === "all" ? "all" : Number(nextValue)
                  );
                }}
                disabled={filterStatuses.length === 0}
              >
                <option value="all">전체</option>
                {filterStatuses.map((status) => {
                  const categoryName = categoryNameMap.get(status.categoryId);
                  const label =
                    activeCategory && activeCategory.id === status.categoryId
                      ? status.name
                      : categoryName
                      ? `${status.name} · ${categoryName}`
                      : status.name;
                  return (
                    <option key={status.id} value={status.id}>
                      {label}
                    </option>
                  );
                })}
              </FilterSelect>
            </>
          )}
          <Button size="large" onClick={onOpenForm} disabled={isAddDisabled}>
            할 일 추가
          </Button>
        </HeaderActions>
      </ListHeader>

      {viewMode === "KANBAN" ? (
        kanbanStatuses.length === 0 ? (
          <EmptyState>
            이 카테고리에 사용할 상태가 없어요. 카테고리 편집에서 상태를 추가해
            주세요.
          </EmptyState>
        ) : (
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleKanbanDragEnd}
          >
            <KanbanBoard>
              {kanbanStatuses.map((status) => {
                const columnTodos = todosByStatusId.get(status.id) ?? [];
                return (
                  <KanbanColumnDroppable
                    key={status.id}
                    statusId={status.id}
                    title={status.name}
                  >
                    {columnTodos.length === 0 ? (
                      <KanbanColumnEmpty>할 일이 없어요.</KanbanColumnEmpty>
                    ) : (
                      columnTodos.map((todo) => (
                        <DraggableTodoCard
                          key={todo.id}
                          todo={todo}
                          onEdit={onEditTodo}
                          onContextMenu={onTodoContextMenu}
                          activeCategory={activeCategory}
                          columnStatusId={status.id}
                        />
                      ))
                    )}
                  </KanbanColumnDroppable>
                );
              })}
            </KanbanBoard>
          </DndContext>
        )
      ) : todos.length > 0 ? (
        <TodoList>
          {todos.map((todo) => {
            const category = categories.find(
              (item) => item.id === todo.categoryId
            );
            const statusOptions = categoryStatusMap.get(todo.categoryId) ?? [];
            const currentStatusName =
              statusOptions.find((status) => status.id === todo.statusId)
                ?.name ?? todo.statusName;
            const statusSelectId = `todo-status-${todo.id}`;
            const due = todo.dueDate
              ? dayjs(todo.dueDate).format("MM/DD HH:mm")
              : "기한 없음";
            const isOverdue =
              Boolean(todo.dueDate) && dayjs(todo.dueDate).isBefore(dayjs());

            return (
              <TodoItem
                key={todo.id}
                onContextMenu={(event) => onTodoContextMenu(event, todo)}
                onClick={() => onEditTodo(todo)}
              >
                <TodoHeader>
                  <TodoTitle>
                    <strong>{todo.title}</strong>
                  </TodoTitle>
                  <HeaderMeta>
                    <StatusBadge>{currentStatusName}</StatusBadge>
                    <CategoryBadge $color={category?.color}>
                      {category?.name ?? "분류 없음"}
                    </CategoryBadge>
                  </HeaderMeta>
                </TodoHeader>
                {todo.description && (
                  <TodoDescription>{todo.description}</TodoDescription>
                )}

                <TodoFooter>
                  <DueChip $overdue={isOverdue}>{due}</DueChip>
                  <TodoMeta>
                    <StatusControl>
                      <StatusControlLabel htmlFor={statusSelectId}>
                        상태
                      </StatusControlLabel>
                      <StatusSelect
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
                      </StatusSelect>
                    </StatusControl>
                  </TodoMeta>
                </TodoFooter>
              </TodoItem>
            );
          })}
        </TodoList>
      ) : (
        <EmptyState>{emptyMessage}</EmptyState>
      )}
    </Wrapper>
  );
};

export default TodoListPanel;

const Wrapper = styled.section`
  flex: 1;
  display: flex;
  flex-direction: column;
  border: 1px solid ${({ theme }) => theme.app.border};
  border-radius: 16px;
  padding: 24px;
  gap: 16px;
  background: ${({ theme }) => theme.app.bg.white};

  ${({ theme }) => theme.medias.max900} {
    padding: 20px;
  }

  ${({ theme }) => theme.medias.max600} {
    padding: 16px 14px;
    gap: 14px;
  }
`;

const ListHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 16px;

  ${({ theme }) => theme.medias.max600} {
    flex-direction: column;
  }
`;

const HeaderActions = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
  justify-content: flex-end;
`;

const CardTitle = styled.h3`
  font-size: 18px;
  font-weight: 700;
  color: ${({ theme }) => theme.app.text.dark1};
`;

const CardSubtitle = styled.p`
  font-size: 13px;
  color: ${({ theme }) => theme.app.text.light1};
  margin-top: 4px;
`;

const FilterLabel = styled.label`
  font-size: 13px;
  color: ${({ theme }) => theme.app.text.light1};
`;

const FilterSelect = styled.select`
  border: 1px solid ${({ theme }) => theme.app.border};
  border-radius: 8px;
  background: ${({ theme }) => theme.app.bg.white};
  padding: 6px 10px;
  font-size: 13px;
  color: ${({ theme }) => theme.app.text.dark1};
  min-width: 120px;
`;

const TodoList = styled.ul`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const KanbanBoard = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 16px;
`;

const KanbanColumn = styled.div<{ $isOver: boolean }>`
  border: 1px solid
    ${({ theme, $isOver }) =>
      $isOver ? theme.app.text.dark1 : theme.app.border};
  border-radius: 12px;
  background: ${({ theme }) => theme.app.bg.gray1};
  padding: 12px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  min-height: 220px;
  transition:
    border 0.2s ease,
    background 0.2s ease;
`;

const KanbanColumnHeader = styled.h4`
  font-size: 13px;
  font-weight: 700;
  color: ${({ theme }) => theme.app.text.dark1};
  margin: 0;
`;

const KanbanColumnEmpty = styled.p`
  margin: 0;
  padding: 20px 0;
  text-align: center;
  font-size: 12px;
  color: ${({ theme }) => theme.app.text.light2};
`;

const KanbanColumnDroppable = ({
  statusId,
  title,
  children,
}: {
  statusId: number;
  title: string;
  children: React.ReactNode;
}) => {
  const { setNodeRef, isOver } = useDroppable({
    id: `kanban-column-${statusId}`,
    data: { statusId },
  });

  return (
    <KanbanColumn ref={setNodeRef} $isOver={isOver}>
      <KanbanColumnHeader>{title}</KanbanColumnHeader>
      {children}
    </KanbanColumn>
  );
};

const TodoItem = styled.li`
  border: 1px solid ${({ theme }) => theme.app.border};
  border-radius: 12px;
  padding: 14px 16px;
  background: ${({ theme }) => theme.app.bg.white};
  display: flex;
  flex-direction: column;
  gap: 10px;
  transition:
    border 0.2s ease,
    box-shadow 0.2s ease;

  &:hover {
    border-color: ${({ theme }) => theme.app.text.dark1};
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.05);
  }

  ${({ theme }) => theme.medias.max600} {
    padding: 12px 14px;
  }
`;

const TodoHeader = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 10px;
  flex-wrap: wrap;

  ${({ theme }) => theme.medias.max600} {
    flex-direction: column;
    align-items: flex-start;
    gap: 6px;
  }
`;

const TodoTitle = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;

  strong {
    font-size: 15px;
    color: ${({ theme }) => theme.app.text.dark1};
  }
`;

const HeaderMeta = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
  justify-content: flex-end;
`;

const CategoryBadge = styled.span<{ $color?: string | null }>`
  padding: 4px 10px;
  border-radius: 999px;
  font-size: 11px;
  font-weight: 600;
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
`;

const StatusBadge = styled.span`
  padding: 4px 10px;
  border-radius: 999px;
  font-size: 11px;
  font-weight: 600;
  border: 1px solid ${({ theme }) => theme.app.border};
  background: ${({ theme }) => theme.app.bg.white};
  color: ${({ theme }) => theme.app.text.dark1};
`;

const TodoDescription = styled.p`
  font-size: 13px;
  color: ${({ theme }) => theme.app.text.light1};
  line-height: 1.5;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const TodoFooter = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  justify-content: space-between;
  align-items: center;

  ${({ theme }) => theme.medias.max600} {
    flex-direction: column;
    align-items: flex-start;
  }
`;

const DueChip = styled.span<{ $overdue: boolean }>`
  padding: 4px 10px;
  border-radius: 999px;
  font-size: 11px;
  font-weight: 600;
  border: 1px solid
    ${({ theme, $overdue }) =>
      $overdue ? theme.app.palette.red[250] : theme.app.border};
  color: ${({ theme, $overdue }) =>
    $overdue ? theme.app.palette.red[250] : theme.app.text.dark1};
  background: ${({ theme }) => theme.app.bg.white};
`;

const TodoMeta = styled.div`
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  align-items: center;
  font-size: 11px;
  color: ${({ theme }) => theme.app.text.light1};
`;

const StatusControl = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
`;

const StatusControlLabel = styled.label`
  font-size: 11px;
  font-weight: 600;
  color: ${({ theme }) => theme.app.text.light1};
`;

const StatusSelect = styled.select`
  border: 1px solid ${({ theme }) => theme.app.border};
  border-radius: 8px;
  background: ${({ theme }) => theme.app.bg.white};
  padding: 4px 8px;
  font-size: 12px;
  color: ${({ theme }) => theme.app.text.dark1};

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const EmptyState = styled.p`
  padding: 32px 0;
  text-align: center;
  font-size: 14px;
  color: ${({ theme }) => theme.app.text.light1};
`;

const DraggableTodoCard = ({
  todo,
  onEdit,
  onContextMenu,
  activeCategory,
  columnStatusId,
}: {
  todo: GeneralTodoItem;
  onEdit: (todo: GeneralTodoItem) => void;
  onContextMenu: (
    event: React.MouseEvent<HTMLElement>,
    todo: GeneralTodoItem
  ) => void;
  activeCategory: GeneralTodoCategory | null;
  columnStatusId: number;
}) => {
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({
      id: String(todo.id),
      data: { statusId: columnStatusId },
    });

  return (
    <TodoItem
      as="div"
      ref={setNodeRef}
      style={{
        transform: CSS.Translate.toString(transform),
        opacity: isDragging ? 0.6 : 1,
        cursor: "grab",
      }}
      onContextMenu={(event) => {
        event.stopPropagation();
        onContextMenu(event, todo);
      }}
      onClick={() => onEdit(todo)}
      {...listeners}
      {...attributes}
    >
      <TodoHeader>
        <TodoTitle>
          <strong>{todo.title}</strong>
        </TodoTitle>
        <CategoryBadge $color={activeCategory?.color}>
          {activeCategory?.name ?? "분류 없음"}
        </CategoryBadge>
      </TodoHeader>
      {todo.description && (
        <TodoDescription>{todo.description}</TodoDescription>
      )}
      <TodoFooter>
        <DueChip
          $overdue={
            Boolean(todo.dueDate) && dayjs(todo.dueDate).isBefore(dayjs())
          }
        >
          {todo.dueDate
            ? dayjs(todo.dueDate).format("MM/DD HH:mm")
            : "기한 없음"}
        </DueChip>
        <TodoMeta>
          <StatusBadge>{todo.statusName}</StatusBadge>
        </TodoMeta>
      </TodoFooter>
    </TodoItem>
  );
};
