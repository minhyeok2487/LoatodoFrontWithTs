import { arrayMove } from "@dnd-kit/sortable";
import { useEffect, useState } from "react";
import styled from "styled-components";

import type { GeneralTodoStatus } from "./types";

type Props = {
  categoryName?: string;
  statuses: GeneralTodoStatus[];
  error?: string | null;
  isBusy?: boolean;
  onAddStatus: (name: string) => void;
  onRenameStatus: (statusId: string, name: string) => void;
  onDeleteStatus: (statusId: string) => void;
  onReorderStatuses: (orderedIds: string[]) => void;
};

const GeneralTodoStatusManager = ({
  categoryName,
  statuses,
  error,
  isBusy = false,
  onAddStatus,
  onRenameStatus,
  onDeleteStatus,
  onReorderStatuses,
}: Props) => {
  const [newStatusName, setNewStatusName] = useState<string>("");
  const [nameDrafts, setNameDrafts] = useState<Record<string, string>>({});
  const [orderedIds, setOrderedIds] = useState<string[]>([]);

  useEffect(() => {
    const initialDrafts: Record<string, string> = {};
    statuses.forEach((status) => {
      initialDrafts[status.id] = status.name;
    });
    setNameDrafts(initialDrafts);
    setOrderedIds(statuses.map((status) => status.id));
  }, [statuses]);

  const handleMove = (statusId: string, direction: "up" | "down") => {
    if (isBusy) {
      return;
    }

    const currentIndex = orderedIds.indexOf(statusId);
    if (currentIndex === -1) {
      return;
    }

    const targetIndex = direction === "up" ? currentIndex - 1 : currentIndex + 1;

    if (targetIndex < 0 || targetIndex >= orderedIds.length) {
      return;
    }

    const movingStatus = statuses.find((status) => status.id === statusId);
    if (!movingStatus || movingStatus.isDone) {
      return;
    }

    const neighborStatus = statuses.find(
      (status) => status.id === orderedIds[targetIndex]
    );

    if (neighborStatus?.isDone && direction === "down") {
      return;
    }

    const nextOrder = arrayMove(orderedIds, currentIndex, targetIndex);
    setOrderedIds(nextOrder);
    onReorderStatuses(nextOrder);
  };

  const handleRename = (statusId: string) => {
    const draft = nameDrafts[statusId] ?? "";
    onRenameStatus(statusId, draft);
  };

  const handleDelete = (statusId: string) => {
    if (isBusy) {
      return;
    }

    const target = statuses.find((status) => status.id === statusId);

    if (!target || target.isDone) {
      return;
    }

    const confirmed = window.confirm(
      `"${target.name}" 상태를 삭제할까요? 해당 상태의 할 일은 기본 상태로 이동합니다.`
    );

    if (!confirmed) {
      return;
    }

    onDeleteStatus(statusId);
  };

  const canAddNew = newStatusName.trim().length > 0 && !isBusy;
  const doneStatusId =
    statuses.find((status) => status.isDone)?.id ?? null;

  return (
    <Container>
      <Header>
        <HeaderTitle>카테고리 상태</HeaderTitle>
        {categoryName ? (
          <HeaderSubtitle>{categoryName}</HeaderSubtitle>
        ) : null}
      </Header>
      <Hint>완료 상태는 이름 변경, 삭제, 재정렬이 불가능합니다.</Hint>
      <StatusList>
        {orderedIds.length === 0 ? (
          <EmptyMessage>등록된 상태가 없습니다. 새 상태를 추가해보세요.</EmptyMessage>
        ) : (
          orderedIds.map((statusId, index) => {
            const status = statuses.find((item) => item.id === statusId);
            if (!status) {
              return null;
            }

            const { id, isDone, name } = status;
            const draftValue = nameDrafts[id] ?? name;
            const trimmedDraft = draftValue.trim();
            const hasChanged = trimmedDraft.length > 0 && trimmedDraft !== name;
            const canMoveUp = index > 0;
            const canMoveDown =
              index < orderedIds.length - 1 &&
              !(orderedIds[index + 1] === doneStatusId && !isDone);

            return (
              <StatusItem key={id}>
                <StatusInfo>
                  <StatusInput
                    value={draftValue}
                    disabled={isDone || isBusy}
                    onChange={(event) => {
                      const { value } = event.target;
                      setNameDrafts((prev) => ({
                        ...prev,
                        [id]: value,
                      }));
                    }}
                    onKeyDown={(event) => {
                      if (
                        event.key === "Enter" &&
                        !isDone &&
                        hasChanged &&
                        !isBusy
                      ) {
                        event.preventDefault();
                        handleRename(id);
                      }
                    }}
                    placeholder="상태 이름"
                  />
                  {isDone ? <StatusBadge>완료</StatusBadge> : null}
                </StatusInfo>
                <StatusActions>
                  {!isDone ? (
                    <>
                      <ActionButton
                        type="button"
                        disabled={!canMoveUp || isBusy}
                        onClick={() => handleMove(id, "up")}
                      >
                        ↑
                      </ActionButton>
                      <ActionButton
                        type="button"
                        disabled={!canMoveDown || isBusy}
                        onClick={() => handleMove(id, "down")}
                      >
                        ↓
                      </ActionButton>
                      <ActionButton
                        type="button"
                        disabled={!hasChanged || isBusy}
                        onClick={() => handleRename(id)}
                      >
                        저장
                      </ActionButton>
                      <DeleteButton
                        type="button"
                        disabled={isBusy}
                        onClick={() => handleDelete(id)}
                      >
                        삭제
                      </DeleteButton>
                    </>
                  ) : (
                    <DisabledHint>고정 상태</DisabledHint>
                  )}
                </StatusActions>
              </StatusItem>
            );
          })
        )}
      </StatusList>
      <AddSection
        onSubmit={(event) => {
          event.preventDefault();
          if (!canAddNew) {
            return;
          }
          onAddStatus(newStatusName);
          setNewStatusName("");
        }}
      >
        <AddInput
          value={newStatusName}
          onChange={(event) => setNewStatusName(event.target.value)}
          placeholder="새 상태 이름"
          disabled={isBusy}
        />
        <AddButton type="submit" disabled={!canAddNew}>
          상태 추가
        </AddButton>
      </AddSection>
      {error ? <ErrorMessage>{error}</ErrorMessage> : null}
    </Container>
  );
};

export default GeneralTodoStatusManager;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  min-width: 360px;
`;

const Header = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const HeaderTitle = styled.h3`
  margin: 0;
  font-size: 18px;
  font-weight: 700;
  color: ${({ theme }) => theme.app.text.dark1};
`;

const HeaderSubtitle = styled.span`
  font-size: 13px;
  color: ${({ theme }) => theme.app.text.light1};
`;

const Hint = styled.p`
  margin: 0;
  font-size: 12px;
  color: ${({ theme }) => theme.app.text.light2};
`;

const StatusList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const EmptyMessage = styled.p`
  margin: 0;
  padding: 12px;
  border-radius: 8px;
  border: 1px dashed ${({ theme }) => theme.app.border};
  text-align: center;
  font-size: 13px;
  color: ${({ theme }) => theme.app.text.light1};
`;

const StatusItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 12px;
  border-radius: 10px;
  border: 1px solid ${({ theme }) => theme.app.bg.gray2};
  background: ${({ theme }) => theme.app.bg.gray1};
`;

const StatusInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  flex: 1;
`;

const StatusInput = styled.input`
  flex: 1;
  min-width: 0;
  padding: 8px 10px;
  border-radius: 6px;
  border: 1px solid ${({ theme }) => theme.app.border};
  background: ${({ theme }) => theme.app.bg.white};
  color: ${({ theme }) => theme.app.text.dark1};
  font-size: 13px;

  &:disabled {
    background: ${({ theme }) => theme.app.bg.gray1};
    color: ${({ theme }) => theme.app.text.light2};
  }
`;

const StatusBadge = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 4px 8px;
  border-radius: 999px;
  background: ${({ theme }) => theme.app.palette.smokeBlue[0]};
  color: ${({ theme }) => theme.app.palette.smokeBlue[500]};
  font-size: 11px;
  font-weight: 600;
`;

const StatusActions = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 6px;
`;

const ActionButton = styled.button`
  border: 1px solid ${({ theme }) => theme.app.border};
  background: ${({ theme }) => theme.app.bg.white};
  color: ${({ theme }) => theme.app.text.dark1};
  padding: 6px 8px;
  border-radius: 6px;
  font-size: 12px;
  cursor: pointer;
  transition:
    background 0.2s ease,
    border 0.2s ease;

  &:disabled {
    cursor: not-allowed;
    opacity: 0.5;
  }

  &:hover:not(:disabled) {
    background: ${({ theme }) => theme.app.bg.gray1};
    border-color: ${({ theme }) => theme.app.palette.smokeBlue[200]};
  }
`;

const DeleteButton = styled(ActionButton)`
  color: ${({ theme }) => theme.app.text.red};
  border-color: rgba(239, 68, 68, 0.4);

  &:hover:not(:disabled) {
    background: rgba(239, 68, 68, 0.08);
    border-color: rgba(239, 68, 68, 0.6);
  }
`;

const DisabledHint = styled.span`
  font-size: 12px;
  color: ${({ theme }) => theme.app.text.light2};
`;

const AddSection = styled.form`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const AddInput = styled.input`
  flex: 1;
  padding: 8px 10px;
  border-radius: 6px;
  border: 1px solid ${({ theme }) => theme.app.border};
  font-size: 13px;
  color: ${({ theme }) => theme.app.text.dark1};
`;

const AddButton = styled.button`
  padding: 8px 14px;
  border-radius: 6px;
  border: none;
  background: ${({ theme }) => theme.app.palette.smokeBlue[500]};
  color: #ffffff;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: opacity 0.2s ease;

  &:disabled {
    cursor: not-allowed;
    opacity: 0.6;
  }

  &:hover:not(:disabled) {
    opacity: 0.9;
  }
`;

const ErrorMessage = styled.p`
  margin: 0;
  font-size: 12px;
  color: ${({ theme }) => theme.app.text.red};
`;
