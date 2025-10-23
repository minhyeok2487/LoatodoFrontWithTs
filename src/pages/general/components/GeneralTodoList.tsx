import type { MouseEvent } from "react";
import styled from "styled-components";

import { SectionTitle, PlaceholderMessage } from "./styles";
import type { GeneralTodoItem } from "./types";

interface Props {
  todos: GeneralTodoItem[];
  selectedTodoId: number | null;
  onSelectTodo: (todoId: number) => void;
  showAllCategories: boolean;
  categoryNameMap: Record<string, string>;
  onTodoContextMenu: (
    event: MouseEvent<HTMLButtonElement>,
    todo: GeneralTodoItem
  ) => void;
  onToggleCompletion: (todoId: number, completed: boolean) => void;
}

const GeneralTodoList = ({
  todos,
  selectedTodoId,
  onSelectTodo,
  showAllCategories,
  categoryNameMap,
  onTodoContextMenu,
  onToggleCompletion,
}: Props) => {
  return (
    <ListContainer>
      <SectionTitle>할 일 목록</SectionTitle>
      {todos.length > 0 ? (
        <List>
          {todos.map((todo) => {
            const categoryLabel = showAllCategories
              ? categoryNameMap[todo.categoryId] ?? "미분류"
              : null;
            let formattedDueDate: string | null = null;

            if (todo.dueDate) {
              const parsed = new Date(todo.dueDate);
              formattedDueDate = Number.isNaN(parsed.getTime())
                ? todo.dueDate
                : parsed.toLocaleDateString();
            }
            const isCompleted = Boolean(todo.completed);

            return (
              <ListItem
                key={todo.id}
                type="button"
                onClick={() => onSelectTodo(todo.id)}
                onContextMenu={(event) => {
                  event.preventDefault();
                  onTodoContextMenu(event, todo);
                }}
                $isActive={todo.id === selectedTodoId}
                $completed={isCompleted}
              >
                <HeaderRow>
                  <TitleWrapper>
                    <Checkbox
                      type="checkbox"
                      checked={isCompleted}
                      onChange={(event) => {
                        event.stopPropagation();
                        onToggleCompletion(todo.id, event.target.checked);
                      }}
                    />
                    <Title $completed={isCompleted}>{todo.title}</Title>
                  </TitleWrapper>
                  {categoryLabel && <CategoryBadge>{categoryLabel}</CategoryBadge>}
                </HeaderRow>
                {formattedDueDate && (
                  <MetaRow>마감일: {formattedDueDate}</MetaRow>
                )}
                {todo.description ? (
                  <Description>{todo.description}</Description>
                ) : null}
              </ListItem>
            );
          })}
        </List>
      ) : (
        <PlaceholderMessage>
          {showAllCategories
            ? "선택한 리스트에 등록된 할 일이 없습니다."
            : "선택한 카테고리에 등록된 할 일이 없습니다."}
        </PlaceholderMessage>
      )}
    </ListContainer>
  );
};

export default GeneralTodoList;

const ListContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const List = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const ListItem = styled.button<{ $isActive: boolean; $completed: boolean }>`
  padding: 12px;
  border-radius: 6px;
  border: 1px solid
    ${({ theme, $isActive }) =>
      $isActive ? theme.app.border : theme.app.bg.gray2};
  background: ${({ theme, $isActive }) =>
    $isActive ? theme.app.bg.gray1 : theme.app.bg.white};
  color: ${({ theme }) => theme.app.text.main};
  text-align: left;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

const HeaderRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
`;

const TitleWrapper = styled.span`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const Title = styled.strong<{ $completed: boolean }>`
  font-size: 15px;
  font-weight: 600;
  color: ${({ theme }) => theme.app.text.main};
  text-decoration: ${({ $completed }) =>
    $completed ? "line-through" : "none"};
  opacity: ${({ $completed }) => ($completed ? 0.6 : 1)};
`;

const Checkbox = styled.input`
  width: 16px;
  height: 16px;
  cursor: pointer;
`;

const MetaRow = styled.span`
  font-size: 12px;
  color: ${({ theme }) => theme.app.text.light1};
`;

const Description = styled.span`
  font-size: 13px;
  color: ${({ theme }) => theme.app.text.light1};
`;

const CategoryBadge = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 2px 8px;
  border-radius: 999px;
  background: ${({ theme }) => theme.app.bg.gray1};
  color: ${({ theme }) => theme.app.text.light1};
  font-size: 12px;
  white-space: nowrap;
`;
