import styled from "styled-components";

import { SectionTitle, PlaceholderMessage } from "./styles";
import type { GeneralTodoItem } from "./types";

interface Props {
  todos: GeneralTodoItem[];
  selectedTodoId: number | null;
  onSelectTodo: (todoId: number) => void;
  showAllCategories: boolean;
  categoryNameMap: Record<string, string>;
}

const GeneralTodoList = ({
  todos,
  selectedTodoId,
  onSelectTodo,
  showAllCategories,
  categoryNameMap,
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

            return (
              <ListItem
                key={todo.id}
                type="button"
                onClick={() => onSelectTodo(todo.id)}
                $isActive={todo.id === selectedTodoId}
              >
                <HeaderRow>
                  <Title>{todo.title}</Title>
                  {categoryLabel && <CategoryBadge>{categoryLabel}</CategoryBadge>}
                </HeaderRow>
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

const ListItem = styled.button<{ $isActive: boolean }>`
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

const Title = styled.strong`
  font-size: 15px;
  font-weight: 600;
  color: ${({ theme }) => theme.app.text.main};
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
