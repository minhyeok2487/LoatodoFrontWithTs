import type { MouseEvent } from "react";
import styled from "styled-components";
import { FiCalendar } from "@react-icons/all-files/fi/FiCalendar";
import { FiCheckCircle } from "@react-icons/all-files/fi/FiCheckCircle";
import { FiCircle } from "@react-icons/all-files/fi/FiCircle";

import { SectionTitle, PlaceholderMessage } from "./styles";
import { hasVisibleContent, normaliseToHtml } from "./editorUtils";
import type { GeneralTodoItem } from "./types";

const formatDueDateLabel = (value: string | null) => {
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

interface Props {
  todos: GeneralTodoItem[];
  selectedTodoId: number | null;
  onSelectTodo: (todoId: number) => void;
  showAllCategories: boolean;
  categoryNameMap: Record<string, string>;
  categoryColorMap: Record<string, string | null>;
  onTodoContextMenu: (
    event: MouseEvent<HTMLButtonElement>,
    todo: GeneralTodoItem
  ) => void;
  onToggleCompletion?: (todoId: number, completed: boolean) => void;
  isReadOnly?: boolean;
  emptyMessage?: string;
}

const GeneralTodoList = ({
  todos,
  selectedTodoId,
  onSelectTodo,
  showAllCategories,
  categoryNameMap,
  categoryColorMap,
  onTodoContextMenu,
  onToggleCompletion,
  isReadOnly = false,
  emptyMessage,
}: Props) => {
  const placeholderMessage = emptyMessage ??
    (showAllCategories
      ? "선택한 리스트에 등록된 할 일이 없습니다."
      : "선택한 카테고리에 등록된 할 일이 없습니다.");

  return (
    <ListContainer>
      <SectionTitle>할 일 목록</SectionTitle>
      {todos.length > 0 ? (
        <List>
          {todos.map((todo) => {
            const categoryLabel = showAllCategories
              ? categoryNameMap[todo.categoryId] ?? "미분류"
              : null;
            const categoryColor = showAllCategories
              ? categoryColorMap[todo.categoryId] ?? null
              : null;
            const formattedDueDate = formatDueDateLabel(todo.dueDate ?? null);
            const shouldRenderDescription = hasVisibleContent(
              todo.description,
            );
            const descriptionMarkup = shouldRenderDescription
              ? normaliseToHtml(todo.description)
              : "";
            const isCompleted = Boolean(todo.completed);

            const handleItemClick = () => {
              if (isReadOnly) {
                return;
              }

              onSelectTodo(todo.id);
            };

            const handleContextMenu = (event: MouseEvent<HTMLButtonElement>) => {
              event.preventDefault();
              if (isReadOnly) {
                return;
              }
              onTodoContextMenu(event, todo);
            };

            const canToggle = !isReadOnly && Boolean(onToggleCompletion);

            return (
              <ListItem
                key={todo.id}
                type="button"
                onClick={handleItemClick}
                onContextMenu={handleContextMenu}
                $isActive={todo.id === selectedTodoId}
                $completed={isCompleted}
                $isReadOnly={isReadOnly}
              >
                <HeaderRow>
                  <TitleWrapper>
                    {canToggle ? (
                      <StatusToggleButton
                        type="button"
                        $active={isCompleted}
                        aria-pressed={isCompleted}
                        onClick={(event) => {
                          event.stopPropagation();
                          onToggleCompletion?.(todo.id, !isCompleted);
                        }}
                      >
                        {isCompleted ? (
                          <FiCheckCircle size={18} />
                        ) : (
                          <FiCircle size={18} />
                        )}
                      </StatusToggleButton>
                    ) : (
                      <ReadOnlyStatus>
                        {isCompleted ? (
                          <FiCheckCircle size={18} />
                        ) : (
                          <FiCircle size={18} />
                        )}
                      </ReadOnlyStatus>
                    )}
                    <Title $completed={isCompleted}>{todo.title}</Title>
                  </TitleWrapper>
                  {categoryLabel && (
                    <CategoryBadge $color={categoryColor}>
                      {categoryLabel}
                      <CategoryColorDot
                        $color={categoryColor}
                        aria-hidden="true"
                      />
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
                {shouldRenderDescription ? (
                  <Description
                    dangerouslySetInnerHTML={{ __html: descriptionMarkup }}
                  />
                ) : null}
              </ListItem>
            );
          })}
        </List>
      ) : (
        <PlaceholderMessage>{placeholderMessage}</PlaceholderMessage>
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

const ListItem = styled.button<{
  $isActive: boolean;
  $completed: boolean;
  $isReadOnly: boolean;
}>`
  padding: 14px 16px;
  border-radius: 16px;
  border: 1px solid
    ${({ theme, $isActive }) =>
      $isActive ? theme.app.palette.smokeBlue[200] : theme.app.border};
  background: ${({ theme, $isActive }) =>
    $isActive ? theme.app.bg.gray1 : theme.app.bg.white};
  color: ${({ theme }) => theme.app.text.main};
  text-align: left;
  cursor: ${({ $isReadOnly }) => ($isReadOnly ? "default" : "pointer")};
  display: flex;
  flex-direction: column;
  gap: 10px;
  box-shadow: ${({ $isActive }) =>
    $isActive
      ? "0 18px 32px rgba(44, 121, 189, 0.14)"
      : "0 12px 20px rgba(15, 23, 42, 0.05)"};
  transition: transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease;

  &:hover {
    transform: ${({ $isReadOnly }) =>
      $isReadOnly ? "none" : "translateY(-2px)"};
    box-shadow: ${({ $isReadOnly }) =>
      $isReadOnly ? "0 12px 20px rgba(15, 23, 42, 0.05)" : "0 20px 34px rgba(44, 121, 189, 0.18)"};
    border-color: ${({ theme, $isReadOnly }) =>
      $isReadOnly ? theme.app.border : theme.app.palette.smokeBlue[200]};
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

const ReadOnlyStatus = styled.span`
  width: 28px;
  height: 28px;
  border-radius: 50%;
  border: 1px solid ${({ theme }) => theme.app.border};
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: ${({ theme }) => theme.app.text.light1};
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

const Description = styled.div`
  display: block;
  font-size: 13px;
  color: ${({ theme }) => theme.app.text.light1};
  line-height: 1.5;
  word-break: break-word;

  p {
    margin: 0 0 6px;
  }

  p:last-child {
    margin-bottom: 0;
  }

  ul,
  ol {
    margin: 6px 0;
    padding-left: 18px;
  }

  code {
    background: ${({ theme }) => theme.app.bg.gray1};
    border-radius: 4px;
    padding: 0 4px;
    font-size: 12px;
    font-family: "Fira Code", "SFMono-Regular", ui-monospace, SFMono-Regular,
      Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
  }

  pre {
    margin: 6px 0;
    padding: 10px;
    background: ${({ theme }) => theme.app.bg.gray1};
    border-radius: 6px;
    overflow-x: auto;
    font-size: 12px;
    font-family: "Fira Code", "SFMono-Regular", ui-monospace, SFMono-Regular,
      Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
  }
`;

const CategoryBadge = styled.span<{ $color: string | null }>`
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

const CategoryColorDot = styled.span<{ $color: string | null }>`
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: ${({ $color, theme }) => $color ?? theme.app.bg.white};
  border: 1px solid
    ${({ $color, theme }) => ($color ? "rgba(0, 0, 0, 0.12)" : theme.app.border)};
  flex-shrink: 0;
`;
