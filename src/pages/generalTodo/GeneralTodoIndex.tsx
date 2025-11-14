import dayjs from "dayjs";
import { useCallback, useEffect, useMemo, useState } from "react";
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
  useUpdateGeneralTodoItemStatus,
  useUpdateGeneralTodoItem,
} from "@core/hooks/mutations/generalTodo";
import { useGeneralTodoOverview } from "@core/hooks/queries/generalTodo";
import type {
  DraftTodo,
  FolderWithCategories,
  GeneralTodoCategory,
  GeneralTodoItem,
  GeneralTodoStatus,
  StatusFilter,
} from "@core/types/generalTodo";

import Button from "@components/Button";

import CategoryEditModal from "./components/CategoryEditModal";
import CategoryFormModal from "./components/CategoryFormModal";
import FolderFormModal from "./components/FolderFormModal";
import FolderRenameModal from "./components/FolderRenameModal";
import FolderTree from "./components/FolderTree";
import TodoDrawer from "./components/TodoDrawer";
import TodoListPanel from "./components/TodoListPanel";
import useTodoFilters from "./hooks/useTodoFilters";
import useTodoModals from "./hooks/useTodoModals";
import useTodoContextMenus from "./hooks/useTodoContextMenus";

const formatDateTimeInput = (value: string | null) => {
  return value ? dayjs(value).format("YYYY-MM-DDTHH:mm") : "";
};

const toISOStringFromInput = (value: string) => {
  return value ? dayjs(value).format("YYYY-MM-DDTHH:mm") : null;
};

const GeneralTodoIndex = () => {
  const [isMobileLayout, setIsMobileLayout] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(true);
  const [draft, setDraft] = useState<DraftTodo>({
    title: "",
    description: "",
    dueDate: "",
    categoryId: null,
    statusId: null,
  });
  const {
    isFormOpen,
    isFolderFormOpen,
    renameTarget,
    categoryFormTarget,
    categoryEditTarget,
    editingTodo,
    openCreateForm,
    openEditForm,
    closeForm,
    openFolderForm,
    closeFolderForm,
    openRenameModal,
    closeRenameModal,
    openCategoryForm,
    closeCategoryForm,
    openCategoryEditModal,
    closeCategoryEditModal,
    setEditingTodo,
  } = useTodoModals();
  const {
    folderMenu,
    categoryMenu,
    todoMenu,
    openFolderMenu,
    openCategoryMenu,
    openTodoMenu,
    closeFolderMenu,
    closeCategoryMenu,
    closeTodoMenu,
    closeAllMenus,
  } = useTodoContextMenus();

  const generalTodoOverview = useGeneralTodoOverview();
  const deleteFolder = useDeleteGeneralTodoFolder();
  const deleteCategory = useDeleteGeneralTodoCategory();
  const createTodoItem = useCreateGeneralTodoItem();
  const updateTodoItem = useUpdateGeneralTodoItem();
  const updateTodoStatus = useUpdateGeneralTodoItemStatus();
  const deleteTodoItem = useDeleteGeneralTodoItem();
  const reorderFolders = useReorderGeneralTodoFolders();
  const reorderCategories = useReorderGeneralTodoCategories();
  const overview = generalTodoOverview.data;
  const folders = overview?.folders ?? [];
  const categories = overview?.categories ?? [];
  const todosSource = overview?.todos ?? [];
  const statuses = overview?.statuses ?? [];
  const isTodoMutating =
    createTodoItem.isPending ||
    updateTodoItem.isPending ||
    updateTodoStatus.isPending ||
    deleteTodoItem.isPending;
  const statusOrderMap = useMemo(() => {
    const map = new Map<number, number>();
    statuses.forEach((status) => {
      map.set(status.id, status.sortOrder);
    });
    return map;
  }, [statuses]);
  const categoryStatusesMap = useMemo(() => {
    const map = new Map<number, GeneralTodoStatus[]>();
    const sortedStatuses = [...statuses].sort(
      (a, b) => a.sortOrder - b.sortOrder
    );
    sortedStatuses.forEach((status) => {
      const list = map.get(status.categoryId);
      if (list) {
        list.push(status);
      } else {
        map.set(status.categoryId, [status]);
      }
    });
    return map;
  }, [statuses]);
  const {
    statusFilter,
    selectedFolderId,
    activeCategoryId,
    syncFilters,
    setStatusFilter,
  } = useTodoFilters(folders, categories, statuses);

  const computedFolderTree = useMemo<FolderWithCategories[]>(() => {
    return [...folders]
      .sort((a, b) => a.sortOrder - b.sortOrder)
      .map((folder) => ({
        ...folder,
        categories: categories
          .filter((category) => category.folderId === folder.id)
          .sort((a, b) => a.sortOrder - b.sortOrder)
          .map((category) => ({
            ...category,
            statuses: categoryStatusesMap.get(category.id) ?? [],
          })),
      }));
  }, [folders, categories, categoryStatusesMap]);

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

  const getDefaultStatusId = useCallback(
    (categoryId: number | null) => {
      if (!categoryId) {
        return null;
      }
      const targetCategory =
        folderCategories.find((category) => category.id === categoryId) ?? null;
      return targetCategory?.statuses?.[0]?.id ?? null;
    },
    [folderCategories]
  );

  const resetDraft = useCallback(
    (overrides?: Partial<DraftTodo>) => {
      const fallbackCategoryId = folderCategories[0]?.id ?? null;
      const nextCategoryId = overrides?.categoryId ?? fallbackCategoryId ?? null;
      const nextStatusId =
        overrides?.statusId ?? getDefaultStatusId(nextCategoryId);

      setDraft({
        title: "",
        description: "",
        dueDate: "",
        categoryId: nextCategoryId,
        statusId: nextStatusId ?? null,
        ...overrides,
      });
    },
    [folderCategories, getDefaultStatusId]
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
        if (statusFilter === "all") {
          return true;
        }
        return todo.statusId === statusFilter;
      })
      .sort((a, b) => {
        const orderA = statusOrderMap.get(a.statusId) ?? 0;
        const orderB = statusOrderMap.get(b.statusId) ?? 0;
        if (orderA !== orderB) {
          return orderA - orderB;
        }
        return dayjs(a.createdAt).valueOf() - dayjs(b.createdAt).valueOf();
      });
  }, [
    todosSource,
    selectedFolderId,
    activeCategoryId,
    statusFilter,
    statusOrderMap,
  ]);

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
      statusId: editingTodo.statusId,
    });
  }, [editingTodo]);

  useEffect(() => {
    if (editingTodo) {
      return;
    }

    if (!selectedFolderId || folderCategories.length === 0) {
      setDraft((prev) => ({ ...prev, categoryId: null, statusId: null }));
      return;
    }

    if (
      draft.categoryId == null ||
      !folderCategories.some((category) => category.id === draft.categoryId)
    ) {
      const nextCategoryId = folderCategories[0].id;
      setDraft((prev) => ({
        ...prev,
        categoryId: nextCategoryId,
        statusId: getDefaultStatusId(nextCategoryId),
      }));
      return;
    }

    const currentCategory =
      folderCategories.find((category) => category.id === draft.categoryId) ??
      null;
    const hasStatus =
      currentCategory?.statuses?.some(
        (status) => status.id === draft.statusId
      ) ?? false;
    if (!hasStatus) {
      setDraft((prev) => ({
        ...prev,
        statusId: currentCategory?.statuses?.[0]?.id ?? null,
      }));
    }
  }, [
    selectedFolderId,
    folderCategories,
    draft.categoryId,
    draft.statusId,
    editingTodo,
    getDefaultStatusId,
  ]);

  const handleFolderSelect = (folderId: number) => {
    closeFolderMenu();
    setEditingTodo(null);
    syncFilters(folderId, null, "all");
    setDraft((prev) => ({ ...prev, categoryId: null, statusId: null }));
    if (isMobileLayout) {
      setMobileSidebarOpen(false);
    }
  };

  const handleCategorySelect = (folderId: number, categoryId: number) => {
    closeFolderMenu();
    syncFilters(folderId, categoryId, "all");
    setDraft((prev) => ({ ...prev, categoryId, statusId: null }));
    if (isMobileLayout) {
      setMobileSidebarOpen(false);
    }
  };

  const handleStatusFilterChange = (next: StatusFilter) => {
    setStatusFilter(next);
  };

  const handleFolderDelete = (folder: FolderWithCategories) => {
    if (deleteFolder.isPending) {
      return;
    }

    closeFolderMenu();
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
        if (categoryMenu?.folder.id === folder.id) {
          closeCategoryMenu();
        }
        const remainingFolders = orderedFolderTree.filter(
          (item) => item.id !== folder.id
        );
        const nextFolderId = remainingFolders[0]?.id ?? null;
        syncFilters(nextFolderId, null, "all");
        generalTodoOverview.refetch();
      },
      onError: () => {
        toast.error("폴더를 삭제하지 못했어요. 잠시 후 다시 시도해 주세요.");
      },
    });
  };

  const handleDraftChange = (next: Partial<DraftTodo>) => {
    setDraft((prev) => {
      const updated = { ...prev, ...next };
      if (Object.prototype.hasOwnProperty.call(next, "categoryId")) {
        const category =
          folderCategories.find(
            (item) => item.id === next.categoryId
          ) ?? null;
        const categoryStatuses = category?.statuses ?? [];
        if (
          updated.statusId == null ||
          !categoryStatuses.some((status) => status.id === updated.statusId)
        ) {
          updated.statusId = categoryStatuses[0]?.id ?? null;
        }
      }
      return updated;
    });
  };

  const handleOpenCreateForm = () => {
    const draftCategoryId =
      activeCategoryId &&
      folderCategories.some((category) => category.id === activeCategoryId)
        ? activeCategoryId
        : folderCategories[0]?.id ?? null;

    resetDraft({ categoryId: draftCategoryId });
    openCreateForm();
  };

  const handleCloseForm = () => {
    closeForm();
    resetDraft();
  };

  const handleFolderContextMenu = (
    event: React.MouseEvent<HTMLButtonElement>,
    folder: FolderWithCategories
  ) => {
    openFolderMenu(event, folder);
  };

  const handleCategoryContextMenu = (
    event: React.MouseEvent<HTMLButtonElement>,
    folder: FolderWithCategories,
    category: GeneralTodoCategory
  ) => {
    openCategoryMenu(event, folder, category);
  };

  const handleFolderRenameClick = (folder: FolderWithCategories) => {
    closeFolderMenu();
    openRenameModal(folder);
  };

  const handleCategoryCreateClick = (folder: FolderWithCategories) => {
    closeFolderMenu();
    openCategoryForm(folder);
  };

  const handleCategoryRenameClick = (
    folder: FolderWithCategories,
    category: GeneralTodoCategory
  ) => {
    closeCategoryMenu();
    openCategoryEditModal(folder, category);
  };

  const handleCategoryDelete = (
    folder: FolderWithCategories,
    category: GeneralTodoCategory
  ) => {
    if (deleteCategory.isPending) {
      return;
    }
    closeCategoryMenu();
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
          setDraft((prev) => ({ ...prev, categoryId: null, statusId: null }));
        }
        if (activeCategoryId === category.id) {
          syncFilters(selectedFolderId, null, "all");
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
    event: React.MouseEvent<HTMLElement>,
    todo: GeneralTodoItem
  ) => {
    openTodoMenu(event, todo);
  };

  const handleEditTodo = (todo: GeneralTodoItem) => {
    setDraft({
      title: todo.title,
      description: todo.description ?? "",
      dueDate: formatDateTimeInput(todo.dueDate),
      categoryId: todo.categoryId,
      statusId: todo.statusId,
    });
    openEditForm(todo);
  };

  const handleChangeTodoStatus = (todo: GeneralTodoItem, statusId: number) => {
    if (updateTodoStatus.isPending) {
      return;
    }

    updateTodoStatus.mutate(
      { todoId: todo.id, payload: { statusId } },
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
          handleCloseForm();
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
    if (!draft.statusId) {
      toast.warn("상태를 선택해 주세요.");
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
            statusId: draft.statusId,
          },
        },
        {
          onSuccess: () => {
            toast.success("할 일을 수정했어요.");
            generalTodoOverview.refetch();
            handleCloseForm();
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
        statusId: draft.statusId ?? undefined,
      },
      {
        onSuccess: () => {
          toast.success("할 일을 추가했어요.");
          generalTodoOverview.refetch();
          handleCloseForm();
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
    !draft.statusId ||
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
          onOpenForm={handleOpenCreateForm}
          isAddDisabled={!selectedFolderId || folderCategories.length === 0}
          categories={folderCategories}
          statusFilter={statusFilter}
          onChangeStatusFilter={handleStatusFilterChange}
          hasFolders={folders.length > 0}
          onChangeTodoStatus={handleChangeTodoStatus}
          onEditTodo={handleEditTodo}
          isTodoActionDisabled={isTodoMutating}
          onTodoContextMenu={handleTodoContextMenu}
          viewMode={activeCategory?.viewMode ?? "LIST"}
          statuses={activeCategory?.statuses ?? []}
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
          onClose={handleCloseForm}
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

      {(folderMenu || categoryMenu || todoMenu) && (
        <ContextMenuOverlay
          onClick={() => {
            closeAllMenus();
          }}
          onContextMenu={(event) => {
            event.preventDefault();
            closeAllMenus();
          }}
        />
      )}

      {folderMenu && (
        <ContextMenu
          role="menu"
          aria-label="폴더 옵션"
          $x={folderMenu.x}
          $y={folderMenu.y}
        >
          <ContextMenuButton
            type="button"
            role="menuitem"
            onClick={() => handleCategoryCreateClick(folderMenu.folder)}
          >
            카테고리 추가
          </ContextMenuButton>
          <ContextMenuButton
            type="button"
            role="menuitem"
            onClick={() => handleFolderRenameClick(folderMenu.folder)}
          >
            폴더 이름 수정
          </ContextMenuButton>
          <ContextMenuButton
            type="button"
            role="menuitem"
            onClick={() => handleFolderDelete(folderMenu.folder)}
            disabled={deleteFolder.isPending}
            $variant="danger"
          >
            폴더 삭제
          </ContextMenuButton>
        </ContextMenu>
      )}

      {categoryMenu && (
        <ContextMenu
          role="menu"
          aria-label="카테고리 옵션"
          $x={categoryMenu.x}
          $y={categoryMenu.y}
        >
          <ContextMenuButton
            type="button"
            role="menuitem"
            onClick={() =>
              handleCategoryRenameClick(
                categoryMenu.folder,
                categoryMenu.category
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
                categoryMenu.folder,
                categoryMenu.category
              )
            }
            disabled={deleteCategory.isPending}
            $variant="danger"
          >
            카테고리 삭제
          </ContextMenuButton>
        </ContextMenu>
      )}

      {todoMenu && (
        <ContextMenu
          role="menu"
          aria-label="할 일 옵션"
          $x={todoMenu.x}
          $y={todoMenu.y}
        >
          <ContextMenuButton
            type="button"
            role="menuitem"
            onClick={() => {
              handleEditTodo(todoMenu.todo);
              closeTodoMenu();
            }}
          >
            할 일 수정
          </ContextMenuButton>
          <ContextMenuButton
            type="button"
            role="menuitem"
            onClick={() => {
              handleDeleteTodo(todoMenu.todo);
              closeTodoMenu();
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
