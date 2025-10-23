import styled from "styled-components";

import { SectionTitle, PlaceholderMessage } from "./styles";
import type { GeneralTodoItem } from "./types";

interface Props {
  todos: GeneralTodoItem[];
  selectedTodoId: number | null;
  onSelectTodo: (todoId: number) => void;
}

const GeneralTodoList = ({
  todos,
  selectedTodoId,
  onSelectTodo,
}: Props) => {
  return (
    <ListContainer>
      <SectionTitle>할 일 목록</SectionTitle>
      {todos.length > 0 ? (
        <List>
          {todos.map((todo) => (
            <ListItem
              key={todo.id}
              type="button"
              onClick={() => onSelectTodo(todo.id)}
              $isActive={todo.id === selectedTodoId}
            >
              <strong>{todo.title}</strong>
              <span>{todo.description}</span>
            </ListItem>
          ))}
        </List>
      ) : (
        <PlaceholderMessage>선택한 카테고리에 등록된 할 일이 없습니다.</PlaceholderMessage>
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

  span {
    font-size: 13px;
    color: ${({ theme }) => theme.app.text.light1};
  }
`;
