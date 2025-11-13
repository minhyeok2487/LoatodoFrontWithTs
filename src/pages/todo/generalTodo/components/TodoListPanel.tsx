import dayjs from "dayjs";
import styled from "styled-components";

import Button from "@components/Button";

import type {
  CompletionFilter,
  FolderWithCategories,
  GeneralTodoCategory,
  GeneralTodoItem,
} from "@core/types/generalTodo";
import {
  addAlphaToColor,
  adjustColorForTheme,
  getReadableTextColor,
  normalizeColorInput,
} from "@core/utils/color";

interface TodoListPanelProps {
  selectedFolder: FolderWithCategories | null;
  activeCategory: GeneralTodoCategory | null;
  todos: GeneralTodoItem[];
  onOpenForm: () => void;
  isAddDisabled: boolean;
  categories: GeneralTodoCategory[];
  completionFilter: CompletionFilter;
  onChangeCompletionFilter: (next: CompletionFilter) => void;
  hasFolders: boolean;
  onToggleTodo: (todo: GeneralTodoItem) => void;
  onEditTodo: (todo: GeneralTodoItem) => void;
  isTodoActionDisabled: boolean;
  onTodoContextMenu: (
    event: React.MouseEvent<HTMLLIElement>,
    todo: GeneralTodoItem
  ) => void;
}

const TodoListPanel = ({
  selectedFolder,
  activeCategory,
  todos,
  onOpenForm,
  isAddDisabled,
  categories,
  completionFilter,
  onChangeCompletionFilter,
  hasFolders,
  onToggleTodo,
  onEditTodo,
  isTodoActionDisabled,
  onTodoContextMenu,
}: TodoListPanelProps) => {
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
          <FilterLabel htmlFor="completion-filter">완료 상태</FilterLabel>
          <FilterSelect
            id="completion-filter"
            value={completionFilter}
            onChange={(event) =>
              onChangeCompletionFilter(event.target.value as CompletionFilter)
            }
          >
            <option value="all">전체</option>
            <option value="incomplete">진행 중</option>
            <option value="completed">완료</option>
          </FilterSelect>
          <Button size="large" onClick={onOpenForm} disabled={isAddDisabled}>
            할 일 추가
          </Button>
        </HeaderActions>
      </ListHeader>

      {todos.length > 0 ? (
        <TodoList>
          {todos.map((todo) => {
            const category = categories.find(
              (item) => item.id === todo.categoryId
            );
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
                    <StatusCheckbox
                      type="checkbox"
                      checked={todo.completed}
                      disabled={isTodoActionDisabled}
                      onClick={(event) => event.stopPropagation()}
                      onChange={() => onToggleTodo(todo)}
                      aria-label={`${todo.title} 완료 토글`}
                    />
                    <strong>{todo.title}</strong>
                  </TodoTitle>
                  <CategoryBadge $color={category?.color}>
                    {category?.name ?? "분류 없음"}
                  </CategoryBadge>
                </TodoHeader>
                {todo.description && (
                  <TodoDescription>{todo.description}</TodoDescription>
                )}

                <TodoFooter>
                  <DueChip $overdue={isOverdue}>{due}</DueChip>
                  <TodoMeta>
                    <span>
                      상태:{" "}
                      {todo.completed ? "완료됨" : "진행 중"}
                    </span>
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

const TodoItem = styled.li`
  border: 1px solid ${({ theme }) => theme.app.border};
  border-radius: 12px;
  padding: 14px 16px;
  background: ${({ theme }) => theme.app.bg.white};
  display: flex;
  flex-direction: column;
  gap: 10px;
  transition: border 0.2s ease, box-shadow 0.2s ease;

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

const StatusCheckbox = styled.input`
  width: 20px;
  height: 20px;
  border: 2px solid ${({ theme }) => theme.app.border};
  border-radius: 6px;
  appearance: none;
  -webkit-appearance: none;
  background: ${({ theme }) => theme.app.bg.white};
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;

  &:checked {
    background: ${({ theme }) => theme.app.text.dark1};
    border-color: ${({ theme }) => theme.app.text.dark1};
  }

  &:checked::after {
    content: "✓";
    color: ${({ theme }) => theme.app.bg.white};
    font-size: 12px;
    font-weight: 700;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
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
  font-size: 11px;
  color: ${({ theme }) => theme.app.text.light1};
`;

const EmptyState = styled.p`
  padding: 32px 0;
  text-align: center;
  font-size: 14px;
  color: ${({ theme }) => theme.app.text.light1};
`;
