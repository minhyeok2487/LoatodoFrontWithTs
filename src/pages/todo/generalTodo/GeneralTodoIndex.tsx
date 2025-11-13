import dayjs from "dayjs";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
import styled from "styled-components";

import WideDefaultLayout from "@layouts/WideDefaultLayout";

import {
  useCreateGeneralTodoItem,
  useDeleteGeneralTodoCategory,
  useDeleteGeneralTodoFolder,
  useDeleteGeneralTodoItem,
  useReorderGeneralTodoCategories,
  useReorderGeneralTodoFolders,
  useToggleGeneralTodoItem,
  useUpdateGeneralTodoItem,
} from "@core/hooks/mutations/generalTodo";
import { useGeneralTodoOverview } from "@core/hooks/queries/generalTodo";
import type {
  CompletionFilter,
  DraftTodo,
  FolderWithCategories,
  GeneralTodoCategory,
  GeneralTodoFolder,
  GeneralTodoItem,
} from "@core/types/generalTodo";

import Button from "@components/Button";

import CategoryEditModal from "./components/CategoryEditModal";
import CategoryFormModal from "./components/CategoryFormModal";
import FolderFormModal from "./components/FolderFormModal";
import FolderRenameModal from "./components/FolderRenameModal";
import FolderTree from "./components/FolderTree";
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

const formatDateTimeInput = (value: string | null) => {
  return value ? dayjs(value).format("YYYY-MM-DDTHH:mm") : "";
};

const toISOStringFromInput = (value: string) => {
  return value ? dayjs(value).format("YYYY-MM-DDTHH:mm") : null;
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
  const [renameTarget, setRenameTarget] = useState<FolderWithCategories | null>(
    null
  );
  const [categoryFormTarget, setCategoryFormTarget] =
    useState<FolderWithCategories | null>(null);
  const [editingTodo, setEditingTodo] = useState<GeneralTodoItem | null>(null);
  const [categoryEditTarget, setCategoryEditTarget] = useState<{
    folder: FolderWithCategories;
    category: GeneralTodoCategory;
  } | null>(null);
  const [categoryContextMenu, setCategoryContextMenu] = useState<{
    folder: FolderWithCategories;
    category: GeneralTodoCategory;
    x: number;
    y: number;
  } | null>(null);
  const [todoContextMenu, setTodoContextMenu] = useState<{
    todo: GeneralTodoItem;
    x: number;
    y: number;
  } | null>(null);
  const [draft, setDraft] = useState<DraftTodo>({
    title: "",
    description: "",
    dueDate: "",
    categoryId: null,
  });

  const generalTodoOverview = useGeneralTodoOverview();
  const deleteFolder = useDeleteGeneralTodoFolder();
  const deleteCategory = useDeleteGeneralTodoCategory();
  const createTodoItem = useCreateGeneralTodoItem();
  const updateTodoItem = useUpdateGeneralTodoItem();
  const toggleTodoItem = useToggleGeneralTodoItem();
  const deleteTodoItem = useDeleteGeneralTodoItem();
  const reorderFolders = useReorderGeneralTodoFolders();
  const reorderCategories = useReorderGeneralTodoCategories();
  const overview = generalTodoOverview.data;
  const folders = overview?.folders ?? [];
  const categories = overview?.categories ?? [];
  const todosSource = overview?.todos ?? [];
  const isTodoMutating =
    createTodoItem.isPending ||
    updateTodoItem.isPending ||
    toggleTodoItem.isPending ||
    deleteTodoItem.isPending;

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

  const resetDraft = useCallback(
    (overrides?: Partial<DraftTodo>) => {
      setDraft((prev) => ({
        title: "",
        description: "",
        dueDate: "",
        categoryId: folderCategories[0]?.id ?? null,
        ...overrides,
      }));
    },
    [folderCategories]
  );

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
    if (!editingTodo) {
      return;
    }

    setDraft({
      title: editingTodo.title,
      description: editingTodo.description ?? "",
      dueDate: formatDateTimeInput(editingTodo.dueDate),
      categoryId: editingTodo.categoryId,
    });
  }, [editingTodo]);

  useEffect(() => {
    if (editingTodo) {
      return;
    }

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
  }, [selectedFolderId, folderCategories, draft.categoryId, editingTodo]);

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
    setEditingTodo(null);
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
        if (categoryFormTarget?.id === folder.id) {
          closeCategoryForm();
        }
        if (categoryEditTarget?.folder.id === folder.id) {
          closeCategoryEditModal();
        }
        if (categoryContextMenu?.folder.id === folder.id) {
          closeCategoryContextMenu();
        }
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

  const openForm = () => {
    setEditingTodo(null);
    const draftCategoryId = (() => {
      if (activeCategoryId && folderCategories.some((c) => c.id === activeCategoryId)) {
        return activeCategoryId;
      }
      return folderCategories[0]?.id ?? null;
    })();
    resetDraft({ categoryId: draftCategoryId });
    setIsFormOpen(true);
  };
  const closeForm = () => {
    setIsFormOpen(false);
    setEditingTodo(null);
    resetDraft();
  };
  const openFolderForm = () => setIsFolderFormOpen(true);
  const closeFolderForm = () => setIsFolderFormOpen(false);
  const closeFolderContextMenu = () => setFolderContextMenu(null);
  const closeRenameModal = () => setRenameTarget(null);
  const closeCategoryForm = () => setCategoryFormTarget(null);
  const closeCategoryContextMenu = () => setCategoryContextMenu(null);
  const closeCategoryEditModal = () => setCategoryEditTarget(null);
  const closeTodoContextMenu = () => setTodoContextMenu(null);

  useEffect(() => {
    if (!folderContextMenu && !categoryContextMenu && !todoContextMenu) {
      return undefined;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closeFolderContextMenu();
        closeCategoryContextMenu();
        closeTodoContextMenu();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [folderContextMenu, categoryContextMenu, todoContextMenu]);

  const handleFolderContextMenu = (
    event: React.MouseEvent<HTMLButtonElement>,
    folder: FolderWithCategories
  ) => {
    event.preventDefault();
    closeCategoryContextMenu();
    closeTodoContextMenu();
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

  const handleCategoryContextMenu = (
    event: React.MouseEvent<HTMLButtonElement>,
    folder: FolderWithCategories,
    category: GeneralTodoCategory
  ) => {
    event.preventDefault();
    closeFolderContextMenu();
    closeTodoContextMenu();
    const { clientX, clientY } = event;
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    const horizontalPadding = 12;
    const verticalPadding = 12;
    const menuWidth = 200;
    const menuHeight = 72;
    const x = Math.min(
      Math.max(clientX, horizontalPadding),
      viewportWidth - menuWidth - horizontalPadding
    );
    const y = Math.min(
      Math.max(clientY, verticalPadding),
      viewportHeight - menuHeight - verticalPadding
    );
    setCategoryContextMenu({
      folder,
      category,
      x,
      y,
    });
  };

  const handleFolderRenameClick = (folder: FolderWithCategories) => {
    closeFolderContextMenu();
    setRenameTarget(folder);
  };

  const handleCategoryCreateClick = (folder: FolderWithCategories) => {
    closeFolderContextMenu();
    setCategoryFormTarget(folder);
  };

  const handleCategoryRenameClick = (
    folder: FolderWithCategories,
    category: GeneralTodoCategory
  ) => {
    closeCategoryContextMenu();
    setCategoryEditTarget({ folder, category });
  };

  const handleCategoryDelete = (
    folder: FolderWithCategories,
    category: GeneralTodoCategory
  ) => {
    if (deleteCategory.isPending) {
      return;
    }
    closeCategoryContextMenu();
    const message = `"${category.name}" 카테고리를 삭제할까요? 포함된 할 일도 함께 삭제돼요.`;
    if (!window.confirm(message)) {
      return;
    }

    deleteCategory.mutate(category.id, {
      onSuccess: () => {
        toast.success("카테고리를 삭제했어요.");
        if (categoryEditTarget?.category.id === category.id) {
          closeCategoryEditModal();
        }
        if (draft.categoryId === category.id) {
          setDraft((prev) => ({ ...prev, categoryId: null }));
        }
        if (activeCategoryId === category.id) {
          syncSearchParams(selectedFolderId, null, completionFilter);
        }
        generalTodoOverview.refetch();
      },
      onError: () => {
        toast.error(
          "카테고리를 삭제하지 못했어요. 잠시 후 다시 시도해 주세요."
        );
      },
    });
  };

  const handleTodoContextMenu = (
    event: React.MouseEvent<HTMLLIElement>,
    todo: GeneralTodoItem
  ) => {
    event.preventDefault();
    event.stopPropagation();
    closeFolderContextMenu();
    closeCategoryContextMenu();
    const { clientX, clientY } = event;
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    const horizontalPadding = 12;
    const verticalPadding = 12;
    const menuWidth = 180;
    const menuHeight = 72;
    const x = Math.min(
      Math.max(clientX, horizontalPadding),
      viewportWidth - menuWidth - horizontalPadding
    );
    const y = Math.min(
      Math.max(clientY, verticalPadding),
      viewportHeight - menuHeight - verticalPadding
    );
    setTodoContextMenu({ todo, x, y });
  };

  const handleEditTodo = (todo: GeneralTodoItem) => {
    setEditingTodo(todo);
    setDraft({
      title: todo.title,
      description: todo.description ?? "",
      dueDate: formatDateTimeInput(todo.dueDate),
      categoryId: todo.categoryId,
    });
    setIsFormOpen(true);
  };

  const handleToggleTodo = (todo: GeneralTodoItem) => {
    if (toggleTodoItem.isPending) {
      return;
    }

    toggleTodoItem.mutate(
      { todoId: todo.id, completed: !todo.completed },
      {
        onSuccess: () => {
          generalTodoOverview.refetch();
        },
        onError: () => {
          toast.error(
            "할 일 상태를 변경하지 못했어요. 잠시 후 다시 시도해 주세요."
          );
        },
      }
    );
  };

  const handleDeleteTodo = (todo: GeneralTodoItem) => {
    if (deleteTodoItem.isPending) {
      return;
    }

    if (!window.confirm(`"${todo.title}" 할 일을 삭제할까요?`)) {
      return;
    }

    deleteTodoItem.mutate(todo.id, {
      onSuccess: () => {
        toast.success("할 일을 삭제했어요.");
        if (editingTodo?.id === todo.id) {
          closeForm();
        }
        generalTodoOverview.refetch();
      },
      onError: () => {
        toast.error("할 일을 삭제하지 못했어요. 잠시 후 다시 시도해 주세요.");
      },
    });
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
        folder.id === folderId
          ? { ...folder, categories: nextCategories }
          : folder
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

    if (!selectedFolderId) {
      toast.warn("폴더를 선택해 주세요.");
      return;
    }
    if (!draft.categoryId) {
      toast.warn("카테고리를 선택해 주세요.");
      return;
    }
    const trimmedTitle = draft.title.trim();
    if (!trimmedTitle) {
      toast.warn("할 일 제목을 입력해 주세요.");
      return;
    }

    const normalizedDescription = draft.description.trim()
      ? draft.description.trim()
      : null;
    const dueDateValue = draft.dueDate
      ? toISOStringFromInput(draft.dueDate)
      : null;

    if (editingTodo) {
      updateTodoItem.mutate(
        {
          todoId: editingTodo.id,
          payload: {
            title: trimmedTitle,
            description: normalizedDescription,
            dueDate: dueDateValue,
            categoryId: draft.categoryId,
          },
        },
        {
          onSuccess: () => {
            toast.success("할 일을 수정했어요.");
            generalTodoOverview.refetch();
            closeForm();
          },
          onError: () => {
            toast.error(
              "할 일을 수정하지 못했어요. 잠시 후 다시 시도해 주세요."
            );
          },
        }
      );
      return;
    }

    createTodoItem.mutate(
      {
        folderId: selectedFolderId,
        categoryId: draft.categoryId,
        title: trimmedTitle,
        description: normalizedDescription,
        dueDate: dueDateValue,
      },
      {
        onSuccess: () => {
          toast.success("할 일을 추가했어요.");
          generalTodoOverview.refetch();
          closeForm();
        },
        onError: () => {
          toast.error("할 일을 추가하지 못했어요. 잠시 후 다시 시도해 주세요.");
        },
      }
    );
  };

  const isSubmitDisabled =
    isTodoMutating ||
    !draft.title.trim() ||
    !draft.categoryId ||
    !selectedFolderId;

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
            onContextMenuCategory={handleCategoryContextMenu}
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
          onToggleTodo={handleToggleTodo}
          onEditTodo={handleEditTodo}
          isTodoActionDisabled={isTodoMutating}
          onTodoContextMenu={handleTodoContextMenu}
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
          mode={editingTodo ? "edit" : "create"}
          isSubmitting={isTodoMutating}
          onDelete={
            editingTodo
              ? () => handleDeleteTodo(editingTodo)
              : undefined
          }
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
      <CategoryFormModal
        isOpen={Boolean(categoryFormTarget)}
        folder={categoryFormTarget}
        onClose={closeCategoryForm}
        onCreated={() => generalTodoOverview.refetch()}
      />
      <CategoryEditModal
        isOpen={Boolean(categoryEditTarget)}
        folder={categoryEditTarget?.folder ?? null}
        category={categoryEditTarget?.category ?? null}
        onClose={closeCategoryEditModal}
        onUpdated={() => generalTodoOverview.refetch()}
      />

      {(folderContextMenu || categoryContextMenu || todoContextMenu) && (
        <ContextMenuOverlay
          onClick={() => {
            closeFolderContextMenu();
            closeCategoryContextMenu();
            closeTodoContextMenu();
          }}
          onContextMenu={(event) => {
            event.preventDefault();
            closeFolderContextMenu();
            closeCategoryContextMenu();
            closeTodoContextMenu();
          }}
        />
      )}

      {folderContextMenu && (
        <ContextMenu
          role="menu"
          aria-label="폴더 옵션"
          $x={folderContextMenu.x}
          $y={folderContextMenu.y}
        >
          <ContextMenuButton
            type="button"
            role="menuitem"
            onClick={() => handleCategoryCreateClick(folderContextMenu.folder)}
          >
            카테고리 추가
          </ContextMenuButton>
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
      )}

      {categoryContextMenu && (
        <ContextMenu
          role="menu"
          aria-label="카테고리 옵션"
          $x={categoryContextMenu.x}
          $y={categoryContextMenu.y}
        >
          <ContextMenuButton
            type="button"
            role="menuitem"
            onClick={() =>
              handleCategoryRenameClick(
                categoryContextMenu.folder,
                categoryContextMenu.category
              )
            }
          >
            카테고리 수정
          </ContextMenuButton>
          <ContextMenuButton
            type="button"
            role="menuitem"
            onClick={() =>
              handleCategoryDelete(
                categoryContextMenu.folder,
                categoryContextMenu.category
              )
            }
            disabled={deleteCategory.isPending}
            $variant="danger"
          >
            카테고리 삭제
          </ContextMenuButton>
        </ContextMenu>
      )}

      {todoContextMenu && (
        <ContextMenu
          role="menu"
          aria-label="할 일 옵션"
          $x={todoContextMenu.x}
          $y={todoContextMenu.y}
        >
          <ContextMenuButton
            type="button"
            role="menuitem"
            onClick={() => {
              handleEditTodo(todoContextMenu.todo);
              closeTodoContextMenu();
            }}
          >
            할 일 수정
          </ContextMenuButton>
          <ContextMenuButton
            type="button"
            role="menuitem"
            onClick={() => {
              handleDeleteTodo(todoContextMenu.todo);
              closeTodoContextMenu();
            }}
            disabled={isTodoMutating}
            $variant="danger"
          >
            할 일 삭제
          </ContextMenuButton>
        </ContextMenu>
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
