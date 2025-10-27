import type { MouseEvent } from "react";
import styled from "styled-components";
import { FiCalendar } from "@react-icons/all-files/fi/FiCalendar";
import { FiCheckCircle } from "@react-icons/all-files/fi/FiCheckCircle";
import { FiCircle } from "@react-icons/all-files/fi/FiCircle";

import { hasVisibleContent, normaliseToHtml } from "./editorUtils";
import type { GeneralTodoItem } from "./types";

type Props = {
  todos: GeneralTodoItem[];
  onOpenDetail: (todoId: number) => void;
  onTodoContextMenu: (
    event: MouseEvent<HTMLButtonElement>,
    todo: GeneralTodoItem
  ) => void;
  onToggleCompletion?: (todoId: number, completed: boolean) => void;
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

const GeneralTodoKanban = ({
  todos,
  onOpenDetail,
  onTodoContextMenu,
  onToggleCompletion,
}: Props) => {
  const pendingTodos = todos.filter((todo) => !todo.completed);
  const doneTodos = todos.filter((todo) => todo.completed);

  const columns: Array<{
    key: "pending" | "done";
    title: string;
    helper: string;
    items: GeneralTodoItem[];
  }> = [
    {
      key: "pending",
      title: "진행 중",
      helper: "아직 완료하지 않은 할 일",
      items: pendingTodos,
    },
    {
      key: "done",
      title: "완료",
      helper: "완료 처리한 할 일",
      items: doneTodos,
    },
  ];

  return (
    <Board>
      {columns.map(({ key, title, helper, items }) => (
        <Column key={key}>
          <ColumnHeader>
            <ColumnTitle>{title}</ColumnTitle>
            <ColumnMeta>
              <ColumnCount>{items.length}</ColumnCount>
              <ColumnHelper>{helper}</ColumnHelper>
            </ColumnMeta>
          </ColumnHeader>
          <ColumnBody>
            {items.length === 0 ? (
              <ColumnEmpty>아직 표시할 할 일이 없어요.</ColumnEmpty>
            ) : (
              items.map((todo) => {
                const formattedDueDate = formatDueDateLabel(todo.dueDate);
                const shouldRenderDescription = hasVisibleContent(
                  todo.description
                );
                const descriptionMarkup = shouldRenderDescription
                  ? normaliseToHtml(todo.description)
                  : "";
                const isCompleted = Boolean(todo.completed);
                const canToggle = Boolean(onToggleCompletion);

                const handleCardClick = () => {
                  onOpenDetail(todo.id);
                };

                const handleContextMenu = (
                  event: MouseEvent<HTMLButtonElement>
                ) => {
                  event.preventDefault();
                  onTodoContextMenu(event, todo);
                };

                const handleToggle = (
                  event: MouseEvent<HTMLButtonElement>
                ) => {
                  event.preventDefault();
                  event.stopPropagation();
                  onToggleCompletion?.(todo.id, !isCompleted);
                };

                return (
                  <Card
                    key={todo.id}
                    type="button"
                    onClick={handleCardClick}
                    onContextMenu={handleContextMenu}
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
                          {isCompleted ? (
                            <FiCheckCircle size={16} />
                          ) : (
                            <FiCircle size={16} />
                          )}
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
              })
            )}
          </ColumnBody>
        </Column>
      ))}
    </Board>
  );
};

export default GeneralTodoKanban;

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
  transition: transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease;
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
  transition: background 0.2s ease, color 0.2s ease, transform 0.2s ease;

  &:hover {
    transform: translateY(-1px);
    color: ${({ theme }) => "#ffffff"};
    background: ${({ theme }) => theme.app.palette.smokeBlue[500]};
  }
`;
