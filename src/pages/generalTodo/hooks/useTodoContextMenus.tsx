import { useCallback, useEffect, useState } from "react";

import type {
  FolderWithCategories,
  GeneralTodoCategory,
  GeneralTodoItem,
} from "@core/types/generalTodo";

import calculateMenuPosition from "../utils/menuPosition";

const useTodoContextMenus = () => {
  const [folderMenu, setFolderMenu] = useState<{
    folder: FolderWithCategories;
    x: number;
    y: number;
  } | null>(null);

  const [categoryMenu, setCategoryMenu] = useState<{
    folder: FolderWithCategories;
    category: GeneralTodoCategory;
    x: number;
    y: number;
  } | null>(null);

  const [todoMenu, setTodoMenu] = useState<{
    todo: GeneralTodoItem;
    x: number;
    y: number;
  } | null>(null);

  const closeFolderMenu = useCallback(() => setFolderMenu(null), []);
  const closeCategoryMenu = useCallback(() => setCategoryMenu(null), []);
  const closeTodoMenu = useCallback(() => setTodoMenu(null), []);

  const closeAllMenus = useCallback(() => {
    closeFolderMenu();
    closeCategoryMenu();
    closeTodoMenu();
  }, [closeCategoryMenu, closeFolderMenu, closeTodoMenu]);

  useEffect(() => {
    if (!folderMenu && !categoryMenu && !todoMenu) {
      return undefined;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closeAllMenus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [folderMenu, categoryMenu, todoMenu, closeAllMenus]);

  const openFolderMenu = useCallback(
    (
      event: React.MouseEvent<HTMLButtonElement>,
      folder: FolderWithCategories
    ) => {
      event.preventDefault();
      closeCategoryMenu();
      closeTodoMenu();
      setFolderMenu({
        folder,
        ...calculateMenuPosition(event, { width: 180, height: 48 }),
      });
    },
    [closeCategoryMenu, closeTodoMenu]
  );

  const openCategoryMenu = useCallback(
    (
      event: React.MouseEvent<HTMLButtonElement>,
      folder: FolderWithCategories,
      category: GeneralTodoCategory
    ) => {
      event.preventDefault();
      closeFolderMenu();
      closeTodoMenu();
      setCategoryMenu({
        folder,
        category,
        ...calculateMenuPosition(event, { width: 200, height: 72 }),
      });
    },
    [closeFolderMenu, closeTodoMenu]
  );

  const openTodoMenu = useCallback(
    (event: React.MouseEvent<HTMLElement>, todo: GeneralTodoItem) => {
      event.preventDefault();
      event.stopPropagation();
      closeFolderMenu();
      closeCategoryMenu();
      setTodoMenu({
        todo,
        ...calculateMenuPosition(event, { width: 180, height: 72 }),
      });
    },
    [closeCategoryMenu, closeFolderMenu]
  );

  return {
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
  };
};

export default useTodoContextMenus;
