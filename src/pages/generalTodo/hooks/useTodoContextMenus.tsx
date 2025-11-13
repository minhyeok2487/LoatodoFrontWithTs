import { useCallback, useEffect, useState } from "react";

import type {
  FolderWithCategories,
  GeneralTodoCategory,
  GeneralTodoItem,
} from "@core/types/generalTodo";

interface MenuPosition {
  x: number;
  y: number;
}

const calculateMenuPosition = (
  event: React.MouseEvent<HTMLElement>,
  menuWidth = 180,
  menuHeight = 72
): MenuPosition => {
  const { clientX, clientY } = event;
  const viewportWidth = window.innerWidth;
  const viewportHeight = window.innerHeight;
  const horizontalPadding = 12;
  const verticalPadding = 12;

  const x = Math.min(
    Math.max(clientX, horizontalPadding),
    viewportWidth - menuWidth - horizontalPadding
  );
  const y = Math.min(
    Math.max(clientY, verticalPadding),
    viewportHeight - menuHeight - verticalPadding
  );

  return { x, y };
};

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
        ...calculateMenuPosition(event, 180, 48),
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
        ...calculateMenuPosition(event, 200, 72),
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
        ...calculateMenuPosition(event, 180, 72),
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
