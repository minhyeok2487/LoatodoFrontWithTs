import { useCallback, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
import styled from "styled-components";

import WideDefaultLayout from "@layouts/WideDefaultLayout";

import {
  useDeleteGeneralTodoFolder,
  useReorderGeneralTodoCategories,
  useReorderGeneralTodoFolders,
} from "@core/hooks/mutations/generalTodo";
import { useGeneralTodoOverview } from "@core/hooks/queries/generalTodo";
import type {
  CompletionFilter,
  DraftTodo,
  FolderWithCategories,
  GeneralTodoCategory,
  GeneralTodoFolder,
} from "@core/types/generalTodo";

import Button from "@components/Button";

import FolderFormModal from "./components/FolderFormModal";
import FolderTree from "./components/FolderTree";
import FolderRenameModal from "./components/FolderRenameModal";
import TodoDrawer from "./components/TodoDrawer";
import TodoListPanel from "./components/TodoListPanel";

const parseNumberParam = (value: string | null): number | null => {
  if (!value) {
    return null;
  }
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
};

const isValidFolderId = (
  folders: GeneralTodoFolder[],
  folderId: number | null
): folderId is number => {
  if (typeof folderId !== "number") {
    return false;
  }

  return folders.some((folder) => folder.id === folderId);
};

const isValidCategoryId = (
  categories: GeneralTodoCategory[],
  folderId: number | null,
  categoryId: number | null
): categoryId is number => {
  if (typeof folderId !== "number" || typeof categoryId !== "number") {
    return false;
  }

  return categories.some(
    (category) => category.folderId === folderId && category.id === categoryId
  );
};

const parseCompletionFilter = (value: string | null): CompletionFilter => {
  if (value === "completed" || value === "incomplete") {
    return value;
  }
  return "all";
};

const GeneralTodoIndex = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [isMobileLayout, setIsMobileLayout] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isFolderFormOpen, setIsFolderFormOpen] = useState(false);
  const [folderContextMenu, setFolderContextMenu] = useState<{
    folder: FolderWithCategories;
    x: number;
    y: number;
  } | null>(null);
  const [renameTarget, setRenameTarget] =
    useState<FolderWithCategories | null>(null);
  const [draft, setDraft] = useState<DraftTodo>({
    title: "",
    description: "",
    dueDate: "",
    categoryId: null,
  });

  const generalTodoOverview = useGeneralTodoOverview();
  const deleteFolder = useDeleteGeneralTodoFolder();
  const reorderFolders = useReorderGeneralTodoFolders();
  const reorderCategories = useReorderGeneralTodoCategories();
  const overview = generalTodoOverview.data;
  const folders = overview?.folders ?? [];
  const categories = overview?.categories ?? [];
  const todosSource = overview?.todos ?? [];

  const completionFilter = useMemo<CompletionFilter>(() => {
    return parseCompletionFilter(searchParams.get("status"));
  }, [searchParams]);

  const selectedFolderId = useMemo(() => {
    const rawFolderId = parseNumberParam(searchParams.get("folder"));
    if (isValidFolderId(folders, rawFolderId)) {
      return rawFolderId;
    }
    return folders[0]?.id ?? null;
  }, [folders, searchParams]);

  const activeCategoryId = useMemo(() => {
    const rawCategoryId = parseNumberParam(searchParams.get("category"));
    if (isValidCategoryId(categories, selectedFolderId, rawCategoryId)) {
      return rawCategoryId;
    }

    return null;
  }, [categories, searchParams, selectedFolderId]);

  const computedFolderTree = useMemo<FolderWithCategories[]>(() => {
    return [...folders]
      .sort((a, b) => a.sortOrder - b.sortOrder)
      .map((folder) => ({
        ...folder,
        categories: categories
          .filter((category) => category.folderId === folder.id)
          .sort((a, b) => a.sortOrder - b.sortOrder),
      }));
  }, [folders, categories]);

  const [orderedFolderTree, setOrderedFolderTree] =
    useState<FolderWithCategories[]>(computedFolderTree);

  useEffect(() => {
    setOrderedFolderTree(computedFolderTree);
  }, [computedFolderTree]);

  const folderCategories = useMemo(() => {
    if (!selectedFolderId) {
      return [];
    }

    return (
      orderedFolderTree.find((folder) => folder.id === selectedFolderId)
        ?.categories ?? []
    );
  }, [orderedFolderTree, selectedFolderId]);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 900px)");

    const handleChange = (matches: boolean) => {
      setIsMobileLayout(matches);
      setMobileSidebarOpen(!matches);
    };

    handleChange(mediaQuery.matches);

    const listener = (event: MediaQueryListEvent) =>
      handleChange(event.matches);
    mediaQuery.addEventListener("change", listener);

    return () => {
      mediaQuery.removeEventListener("change", listener);
    };
  }, []);

  const todos = useMemo(() => {
    if (!selectedFolderId) {
      return [];
    }

    return todosSource
      .filter((todo) => todo.folderId === selectedFolderId)
      .filter((todo) =>
        activeCategoryId ? todo.categoryId === activeCategoryId : true
      )
      .filter((todo) => {
        if (completionFilter === "completed") {
          return todo.completed;
        }
        if (completionFilter === "incomplete") {
          return !todo.completed;
        }
        return true;
      })
      .sort((a, b) => Number(a.completed) - Number(b.completed));
  }, [todosSource, selectedFolderId, activeCategoryId, completionFilter]);

  const selectedFolder = useMemo(() => {
    return (
      orderedFolderTree.find((folder) => folder.id === selectedFolderId) ?? null
    );
  }, [orderedFolderTree, selectedFolderId]);

  const activeCategory = useMemo<GeneralTodoCategory | null>(() => {
    if (!activeCategoryId) {
      return null;
    }

    return (
      folderCategories.find((category) => category.id === activeCategoryId) ??
      null
    );
  }, [activeCategoryId, folderCategories]);

  const draftCategory = useMemo(() => {
    if (!draft.categoryId) {
      return null;
    }

    return (
      folderCategories.find((category) => category.id === draft.categoryId) ??
      null
    );
  }, [draft.categoryId, folderCategories]);

  useEffect(() => {
    if (!selectedFolderId || folderCategories.length === 0) {
      setDraft((prev) => ({ ...prev, categoryId: null }));
      return;
    }

    if (
      draft.categoryId == null ||
      !folderCategories.some((category) => category.id === draft.categoryId)
    ) {
      setDraft((prev) => ({ ...prev, categoryId: folderCategories[0].id }));
    }
  }, [selectedFolderId, folderCategories, draft.categoryId]);

  const syncSearchParams = useCallback(
    (
      folderId: number | null,
      categoryId: number | null,
      completion: CompletionFilter
    ) => {
      setSearchParams((prev) => {
        const params = new URLSearchParams(prev);

        if (folderId) {
          params.set("folder", String(folderId));
        } else {
          params.delete("folder");
        }

        if (categoryId) {
          params.set("category", String(categoryId));
        } else {
          params.delete("category");
        }

        if (completion && completion !== "all") {
          params.set("status", completion);
        } else {
          params.delete("status");
        }

        return params;
      });
    },
    [setSearchParams]
  );

  const handleFolderSelect = (folderId: number) => {
    closeFolderContextMenu();
    syncSearchParams(folderId, null, completionFilter);
    setDraft((prev) => ({ ...prev, categoryId: null }));
    if (isMobileLayout) {
      setMobileSidebarOpen(false);
    }
  };

  const handleCategorySelect = (folderId: number, categoryId: number) => {
    closeFolderContextMenu();
    syncSearchParams(folderId, categoryId, completionFilter);
    setDraft((prev) => ({ ...prev, categoryId }));
    if (isMobileLayout) {
      setMobileSidebarOpen(false);
    }
  };

  const handleCompletionFilterChange = (next: CompletionFilter) => {
    syncSearchParams(selectedFolderId, activeCategoryId, next);
  };

  const handleFolderDelete = (folder: FolderWithCategories) => {
    if (deleteFolder.isPending) {
      return;
    }

    closeFolderContextMenu();
    const hasCategories = folder.categories.length > 0;
    const message = hasCategories
      ? `"${folder.name}" 폴더를 삭제하면 안에 있는 카테고리와 할 일도 함께 삭제돼요. 계속할까요?`
      : `"${folder.name}" 폴더를 삭제할까요?`;

    if (!window.confirm(message)) {
      return;
    }

    deleteFolder.mutate(folder.id, {
      onSuccess: () => {
        toast.success("폴더를 삭제했어요.");
        const remainingFolders = orderedFolderTree.filter(
          (item) => item.id !== folder.id
        );
        const nextFolderId = remainingFolders[0]?.id ?? null;
        syncSearchParams(nextFolderId, null, completionFilter);
        generalTodoOverview.refetch();
      },
      onError: () => {
        toast.error("폴더를 삭제하지 못했어요. 잠시 후 다시 시도해 주세요.");
      },
    });
  };

  useEffect(() => {
    if (folders.length === 0) {
      return;
    }

    const rawFolderId = parseNumberParam(searchParams.get("folder"));
    if (!isValidFolderId(folders, rawFolderId)) {
      syncSearchParams(folders[0].id, null, completionFilter);
    }
  }, [folders, completionFilter, searchParams, syncSearchParams]);

  const handleDraftChange = (next: Partial<DraftTodo>) => {
    setDraft((prev) => ({ ...prev, ...next }));
  };

  const openForm = () => setIsFormOpen(true);
  const closeForm = () => setIsFormOpen(false);
  const openFolderForm = () => setIsFolderFormOpen(true);
  const closeFolderForm = () => setIsFolderFormOpen(false);
  const closeFolderContextMenu = () => setFolderContextMenu(null);
  const closeRenameModal = () => setRenameTarget(null);

  useEffect(() => {
    if (!folderContextMenu) {
      return undefined;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closeFolderContextMenu();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [folderContextMenu]);

  const handleFolderContextMenu = (
    event: React.MouseEvent<HTMLButtonElement>,
    folder: FolderWithCategories
  ) => {
    event.preventDefault();
    const { clientX, clientY } = event;
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    const horizontalPadding = 12;
    const verticalPadding = 12;
    const menuWidth = 180;
    const menuHeight = 48;
    const x = Math.min(
      Math.max(clientX, horizontalPadding),
      viewportWidth - menuWidth - horizontalPadding
    );
    const y = Math.min(
      Math.max(clientY, verticalPadding),
      viewportHeight - menuHeight - verticalPadding
    );
    setFolderContextMenu({
      folder,
      x,
      y,
    });
  };

  const handleFolderRenameClick = (folder: FolderWithCategories) => {
    closeFolderContextMenu();
    setRenameTarget(folder);
  };

  const handleFoldersReordered = (next: FolderWithCategories[]) => {
    if (reorderFolders.isPending) {
      return;
    }

    const previousOrder = orderedFolderTree;
    setOrderedFolderTree(next);

    reorderFolders.mutate(
      next.map((folder) => folder.id),
      {
        onSuccess: () => {
          toast.success("폴더 순서를 변경했어요.");
          generalTodoOverview.refetch();
        },
        onError: () => {
          toast.error(
            "폴더 순서를 변경하지 못했어요. 잠시 후 다시 시도해 주세요."
          );
          setOrderedFolderTree(previousOrder);
        },
      }
    );
  };

  const handleCategoriesReordered = (
    folderId: number,
    nextCategories: GeneralTodoCategory[]
  ) => {
    if (reorderCategories.isPending) {
      return;
    }

    const previousOrder = orderedFolderTree;
    setOrderedFolderTree((current) =>
      current.map((folder) =>
        folder.id === folderId ? { ...folder, categories: nextCategories } : folder
      )
    );

    reorderCategories.mutate(
      { folderId, categoryIds: nextCategories.map((category) => category.id) },
      {
        onSuccess: () => {
          toast.success("카테고리 순서를 변경했어요.");
          generalTodoOverview.refetch();
        },
        onError: () => {
          toast.error(
            "카테고리 순서를 변경하지 못했어요. 잠시 후 다시 시도해 주세요."
          );
          setOrderedFolderTree(previousOrder);
        },
      }
    );
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    toast.info("일반 투두 API와 아직 연결되지 않았어요.");

    setDraft({
      title: "",
      description: "",
      dueDate: "",
      categoryId: folderCategories[0]?.id ?? null,
    });
    closeForm();
  };

  const isSubmitDisabled =
    !draft.title.trim() || !draft.categoryId || !selectedFolderId;

  if (generalTodoOverview.isLoading) {
    return (
      <WideDefaultLayout pageTitle="개인 할 일" description="개발중이에요">
        <StateCard>일반 할 일을 불러오는 중이에요...</StateCard>
      </WideDefaultLayout>
    );
  }

  if (generalTodoOverview.isError) {
    return (
      <WideDefaultLayout pageTitle="개인 할 일" description="개발중이에요">
        <StateCard>
          <p>일반 할 일을 불러오지 못했어요. 잠시 후 다시 시도해 주세요.</p>
          <Button
            variant="outlined"
            size="large"
            onClick={() => generalTodoOverview.refetch()}
          >
            다시 시도
          </Button>
        </StateCard>
      </WideDefaultLayout>
    );
  }

  return (
    <WideDefaultLayout pageTitle="개인 할 일" description="개발중이에요">
      {isMobileLayout && (
        <SidebarToggle
          type="button"
          onClick={() => setMobileSidebarOpen((prev) => !prev)}
        >
          {mobileSidebarOpen ? "폴더 · 카테고리 닫기" : "폴더 · 카테고리 열기"}
        </SidebarToggle>
      )}

      <Board>
        {(!isMobileLayout || mobileSidebarOpen) && (
          <FolderTree
            folderTree={orderedFolderTree}
            selectedFolderId={selectedFolderId}
            activeCategoryId={activeCategoryId}
            onSelectFolder={handleFolderSelect}
            onSelectCategory={handleCategorySelect}
            onClickCreateFolder={openFolderForm}
            onContextMenuFolder={handleFolderContextMenu}
            onReorderFolders={handleFoldersReordered}
            onReorderCategories={handleCategoriesReordered}
            isReorderDisabled={
              deleteFolder.isPending ||
              reorderFolders.isPending ||
              reorderCategories.isPending
            }
          />
        )}

        <TodoListPanel
          selectedFolder={selectedFolder}
          activeCategory={activeCategory}
          todos={todos}
          onOpenForm={openForm}
          isAddDisabled={!selectedFolderId || folderCategories.length === 0}
          categories={folderCategories}
          completionFilter={completionFilter}
          onChangeCompletionFilter={handleCompletionFilterChange}
          hasFolders={folders.length > 0}
        />
      </Board>

      {folders.length > 0 && (
        <TodoDrawer
          open={isFormOpen}
          selectedFolder={selectedFolder}
          draftCategory={draftCategory}
          categories={folderCategories}
          draft={draft}
          onChangeDraft={handleDraftChange}
          onSubmit={handleSubmit}
          onClose={closeForm}
          isSubmitDisabled={isSubmitDisabled}
        />
      )}
      <FolderFormModal
        isOpen={isFolderFormOpen}
        onClose={closeFolderForm}
        nextSortOrder={orderedFolderTree.length}
        onCreated={() => generalTodoOverview.refetch()}
      />
      <FolderRenameModal
        isOpen={Boolean(renameTarget)}
        folder={renameTarget}
        onClose={closeRenameModal}
        onUpdated={() => generalTodoOverview.refetch()}
      />

      {folderContextMenu && (
        <>
          <ContextMenuOverlay
            onClick={closeFolderContextMenu}
            onContextMenu={(event) => {
              event.preventDefault();
              closeFolderContextMenu();
            }}
          />
          <ContextMenu
            role="menu"
            aria-label="폴더 옵션"
            $x={folderContextMenu.x}
            $y={folderContextMenu.y}
          >
            <ContextMenuButton
              type="button"
              role="menuitem"
              onClick={() => handleFolderRenameClick(folderContextMenu.folder)}
            >
              폴더 이름 수정
            </ContextMenuButton>
            <ContextMenuButton
              type="button"
              role="menuitem"
              onClick={() => handleFolderDelete(folderContextMenu.folder)}
              disabled={deleteFolder.isPending}
              $variant="danger"
            >
              폴더 삭제
            </ContextMenuButton>
          </ContextMenu>
        </>
      )}
    </WideDefaultLayout>
  );
};

export default GeneralTodoIndex;

const Board = styled.div`
  border: 1px solid ${({ theme }) => theme.app.border};
  border-radius: 20px;
  padding: 32px;
  display: flex;
  gap: 24px;
  min-height: 70vh;
  background: ${({ theme }) => theme.app.bg.white};
  width: 100%;

  ${({ theme }) => theme.medias.max1280} {
    padding: 24px;
    gap: 20px;
  }

  ${({ theme }) => theme.medias.max900} {
    flex-direction: column;
    padding: 20px 16px;
    gap: 16px;
  }
`;

const SidebarToggle = styled.button`
  display: none;
  margin-bottom: 12px;
  border: 1px solid ${({ theme }) => theme.app.border};
  border-radius: 10px;
  padding: 10px 16px;
  background: ${({ theme }) => theme.app.bg.white};
  color: ${({ theme }) => theme.app.text.dark1};
  font-size: 14px;
  font-weight: 600;
  width: 100%;

  ${({ theme }) => theme.medias.max900} {
    display: block;
  }
`;

const StateCard = styled.div`
  width: 100%;
  padding: 60px 20px;
  border: 1px dashed ${({ theme }) => theme.app.border};
  border-radius: 16px;
  text-align: center;
  background: ${({ theme }) => theme.app.bg.white};
  display: flex;
  flex-direction: column;
  gap: 12px;
  align-items: center;

  & > p {
    font-size: 14px;
    color: ${({ theme }) => theme.app.text.light1};
    line-height: 1.4;
  }
`;

const ContextMenuOverlay = styled.div`
  position: fixed;
  inset: 0;
  z-index: 30;
`;

const ContextMenu = styled.div<{ $x: number; $y: number }>`
  position: fixed;
  top: ${({ $y }) => $y}px;
  left: ${({ $x }) => $x}px;
  background: ${({ theme }) => theme.app.bg.white};
  border: 1px solid ${({ theme }) => theme.app.border};
  border-radius: 10px;
  min-width: 160px;
  z-index: 31;
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.15);
  padding: 4px 0;
`;

const ContextMenuButton = styled.button<{ $variant?: "default" | "danger" }>`
  width: 100%;
  text-align: left;
  border: none;
  background: transparent;
  padding: 10px 16px;
  font-size: 13px;
  font-weight: 600;
  color: ${({ theme, $variant }) =>
    $variant === "danger" ? theme.app.text.red : theme.app.text.dark1};
  cursor: pointer;

  &:hover:not(:disabled),
  &:focus-visible:not(:disabled) {
    background: ${({ theme }) => theme.app.bg.gray1};
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;
