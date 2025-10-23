import type { MouseEvent } from "react";
import styled from "styled-components";
import { FiCalendar } from "@react-icons/all-files/fi/FiCalendar";
import { FiCheckCircle } from "@react-icons/all-files/fi/FiCheckCircle";
import { FiCircle } from "@react-icons/all-files/fi/FiCircle";
import { FiTag } from "@react-icons/all-files/fi/FiTag";

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
                    <StatusToggleButton
                      type="button"
                      $active={isCompleted}
                      aria-pressed={isCompleted}
                      onClick={(event) => {
                        event.stopPropagation();
                        onToggleCompletion(todo.id, !isCompleted);
                      }}
                    >
                      {isCompleted ? (
                        <FiCheckCircle size={18} />
                      ) : (
                        <FiCircle size={18} />
                      )}
                    </StatusToggleButton>
                    <Title $completed={isCompleted}>{todo.title}</Title>
                  </TitleWrapper>
                  {categoryLabel && (
                    <CategoryBadge>
                      <CategoryIcon>
                        <FiTag size={12} />
                      </CategoryIcon>
                      {categoryLabel}
                    </CategoryBadge>
                  )}
                </HeaderRow>
                {formattedDueDate && (
                  <MetaRow>
                    <MetaIcon>
                      <FiCalendar size={13} />
                    </MetaIcon>
                    마감일 {formattedDueDate}
                  </MetaRow>
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
  gap: 12px;
`;

const List = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const ListItem = styled.button<{ $isActive: boolean; $completed: boolean }>`
  padding: 14px 16px;
  border-radius: 16px;
  border: 1px solid
    ${({ theme, $isActive }) =>
      $isActive ? theme.app.palette.smokeBlue[200] : theme.app.border};
  background: ${({ theme, $isActive }) =>
    $isActive ? theme.app.bg.gray1 : theme.app.bg.white};
  color: ${({ theme }) => theme.app.text.main};
  text-align: left;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  gap: 10px;
  box-shadow: ${({ $isActive }) =>
    $isActive
      ? "0 18px 32px rgba(44, 121, 189, 0.14)"
      : "0 12px 20px rgba(15, 23, 42, 0.05)"};
  transition: transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 20px 34px rgba(44, 121, 189, 0.18);
    border-color: ${({ theme }) => theme.app.palette.smokeBlue[200]};
  }
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
  gap: 10px;
`;

const Title = styled.strong<{ $completed: boolean }>`
  font-size: 15px;
  font-weight: 600;
  color: ${({ theme }) => theme.app.text.main};
  text-decoration: ${({ $completed }) =>
    $completed ? "line-through" : "none"};
  opacity: ${({ $completed }) => ($completed ? 0.6 : 1)};
`;

const StatusToggleButton = styled.button<{ $active: boolean }>`
  width: 28px;
  height: 28px;
  border-radius: 50%;
  border: none;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: ${({ theme, $active }) =>
    $active ? theme.app.palette.smokeBlue[500] : theme.app.bg.white};
  color: ${({ theme, $active }) =>
    $active ? "#ffffff" : theme.app.text.light1};
  box-shadow: ${({ $active }) =>
    $active ? "0 10px 20px rgba(44, 121, 189, 0.28)" : "none"};
  transition: background 0.2s ease, color 0.2s ease, box-shadow 0.2s ease,
    transform 0.2s ease;

  &:hover {
    transform: translateY(-1px);
    background: ${({ theme, $active }) =>
      $active ? theme.app.palette.smokeBlue[500] : theme.app.bg.gray1};
  }

  svg {
    display: block;
  }
`;

const MetaRow = styled.span`
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

const Description = styled.span`
  display: block;
  font-size: 13px;
  color: ${({ theme }) => theme.app.text.light1};
  line-height: 1.5;
`;

const CategoryBadge = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 4px 10px;
  border-radius: 999px;
  background: ${({ theme }) => theme.app.bg.white};
  border: 1px solid ${({ theme }) => theme.app.border};
  color: ${({ theme }) => theme.app.text.light1};
  font-size: 12px;
  white-space: nowrap;
`;

const CategoryIcon = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: ${({ theme }) => theme.app.palette.smokeBlue[500]};
`;
