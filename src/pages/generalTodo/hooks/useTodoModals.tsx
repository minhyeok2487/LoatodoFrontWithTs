import { useCallback, useState } from "react";

import type {
  FolderWithCategories,
  GeneralTodoCategory,
  GeneralTodoItem,
} from "@core/types/generalTodo";

const useTodoModals = () => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isFolderFormOpen, setIsFolderFormOpen] = useState(false);
  const [renameTarget, setRenameTarget] = useState<FolderWithCategories | null>(
    null
  );
  const [categoryFormTarget, setCategoryFormTarget] =
    useState<FolderWithCategories | null>(null);
  const [categoryEditTarget, setCategoryEditTarget] = useState<{
    folder: FolderWithCategories;
    category: GeneralTodoCategory;
  } | null>(null);
  const [editingTodo, setEditingTodo] = useState<GeneralTodoItem | null>(null);

  const openCreateForm = useCallback(() => {
    setEditingTodo(null);
    setIsFormOpen(true);
  }, []);

  const openEditForm = useCallback((todo: GeneralTodoItem) => {
    setEditingTodo(todo);
    setIsFormOpen(true);
  }, []);

  const closeForm = useCallback(() => {
    setEditingTodo(null);
    setIsFormOpen(false);
  }, []);

  const openFolderForm = useCallback(() => setIsFolderFormOpen(true), []);
  const closeFolderForm = useCallback(() => setIsFolderFormOpen(false), []);

  const openRenameModal = useCallback(
    (folder: FolderWithCategories) => setRenameTarget(folder),
    []
  );
  const closeRenameModal = useCallback(() => setRenameTarget(null), []);

  const openCategoryForm = useCallback(
    (folder: FolderWithCategories) => setCategoryFormTarget(folder),
    []
  );
  const closeCategoryForm = useCallback(() => setCategoryFormTarget(null), []);

  const openCategoryEditModal = useCallback(
    (folder: FolderWithCategories, category: GeneralTodoCategory) => {
      setCategoryEditTarget({ folder, category });
    },
    []
  );
  const closeCategoryEditModal = useCallback(
    () => setCategoryEditTarget(null),
    []
  );

  return {
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
  };
};

export default useTodoModals;
