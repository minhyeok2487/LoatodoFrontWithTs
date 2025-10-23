import { useCallback, useEffect, useMemo, useState } from "react";
import type { FormEvent, MouseEvent } from "react";
import styled from "styled-components";

import { LOCAL_STORAGE_KEYS } from "@core/constants";
import useModalState from "@core/hooks/useModalState";
import Modal from "@components/Modal";
import WideDefaultLayout from "@layouts/WideDefaultLayout";

import GeneralTodoDetail from "./components/GeneralTodoDetail";
import GeneralTodoList from "./components/GeneralTodoList";
import GeneralTodoSidebar from "./components/GeneralTodoSidebar";
import type {
  GeneralTodoState,
  GeneralTodoItem,
  GeneralTodoFolder,
} from "./components/types";

const DEFAULT_STATE: GeneralTodoState = {
  folders: [
    {
      id: "personal",
      name: "개인",
      categories: [
        { id: "personal-daily", name: "일상" },
        { id: "personal-health", name: "건강" },
        { id: "personal-hobby", name: "취미" },
      ],
    },
    {
      id: "work",
      name: "업무",
      categories: [
        { id: "work-ideas", name: "아이디어" },
        { id: "work-progress", name: "진행 중" },
        { id: "work-pending", name: "대기" },
      ],
    },
  ],
  todos: [
    {
      id: 1,
      title: "체력 단련",
      description: "저녁 식사 후 30분 스트레칭과 가벼운 러닝",
      folderId: "personal",
      categoryId: "personal-health",
      dueDate: null,
      completed: false,
    },
    {
      id: 2,
      title: "사이드 프로젝트 아이디어 정리",
      description: "개인 프로젝트 기능 목록을 정리하고 우선순위 결정",
      folderId: "work",
      categoryId: "work-ideas",
      dueDate: null,
      completed: false,
    },
    {
      id: 3,
      title: "사진 편집",
      description: "지난 여행 사진 중 SNS에 올릴 만한 사진 후보 선정",
      folderId: "personal",
      categoryId: "personal-hobby",
      dueDate: null,
      completed: false,
    },
  ],
};

type FolderContextTarget = {
  type: "folder";
  id: string;
};

type CategoryContextTarget = {
  type: "category";
  id: string;
  folderId: string;
};

type TodoContextTarget = {
  type: "todo";
  todoId: number;
  folderId: string;
  categoryId: string;
  name: string;
};

type ContextMenuTarget =
  | FolderContextTarget
  | CategoryContextTarget
  | TodoContextTarget;

type ContextMenuState = ContextMenuTarget & {
  x: number;
  y: number;
};

const MENU_WIDTH = 184;
const MENU_HEIGHT = 96;

type FolderFormModalPayload = {
  mode: "create" | "rename";
  folderId?: string;
  initialName?: string;
};

type CategoryFormModalPayload = {
  mode: "create" | "rename";
  folderId: string;
  categoryId?: string;
  initialName?: string;
};

type DeleteConfirmModalPayload =
  | {
      type: "folder";
      folderId: string;
      name: string;
    }
  | {
      type: "category";
      folderId: string;
      categoryId: string;
      name: string;
    }
  | {
      type: "todo";
      folderId: string;
      categoryId: string;
      todoId: number;
      name: string;
    };

const cloneState = (state: GeneralTodoState): GeneralTodoState => ({
  folders: state.folders.map((folder) => ({
    id: folder.id,
    name: folder.name,
    categories: folder.categories.map((category) => ({
      id: category.id,
      name: category.name,
    })),
  })),
  todos: state.todos.map((todo) => ({
    id: todo.id,
    title: todo.title,
    description: todo.description,
    folderId: todo.folderId,
    categoryId: todo.categoryId,
    dueDate: todo.dueDate ?? null,
    completed: Boolean(todo.completed),
  })),
});

const loadInitialState = (): GeneralTodoState => {
  if (typeof window === "undefined") {
    return cloneState(DEFAULT_STATE);
  }

  const stored = window.localStorage.getItem(
    LOCAL_STORAGE_KEYS.generalTodoState
  );

  if (!stored) {
    return cloneState(DEFAULT_STATE);
  }

  try {
    const parsed = JSON.parse(stored) as GeneralTodoState;
    if (
      !parsed ||
      !Array.isArray(parsed.folders) ||
      parsed.folders.length === 0 ||
      !Array.isArray(parsed.todos)
    ) {
      return cloneState(DEFAULT_STATE);
    }

    const normalisedFolders: GeneralTodoFolder[] = parsed.folders
      .filter(
        (folder): folder is GeneralTodoFolder =>
          !!folder &&
          typeof folder.id === "string" &&
          typeof folder.name === "string" &&
          Array.isArray(folder.categories) &&
          folder.categories.every(
            (category) =>
              !!category &&
              typeof category.id === "string" &&
              typeof category.name === "string"
          )
      )
      .map((folder) => ({
        id: folder.id,
        name: folder.name,
        categories: folder.categories.map((category) => ({
          id: category.id,
          name: category.name,
        })),
      }));

    if (normalisedFolders.length === 0) {
      return cloneState(DEFAULT_STATE);
    }

    const folderMap = new Map<string, GeneralTodoFolder>(
      normalisedFolders.map((folder) => [folder.id, folder])
    );

    const normalisedTodos: GeneralTodoItem[] = parsed.todos
      .filter(
        (todo): todo is GeneralTodoItem =>
          !!todo &&
          typeof todo.id === "number" &&
          typeof todo.title === "string" &&
          typeof todo.folderId === "string" &&
          typeof todo.categoryId === "string"
      )
      .map((todo) => ({
        id: todo.id,
        title: todo.title,
        description:
          typeof todo.description === "string" ? todo.description : "",
        folderId: todo.folderId,
        categoryId: todo.categoryId,
        dueDate:
          typeof (todo as { dueDate?: string | null }).dueDate === "string"
            ? (todo as { dueDate?: string | null }).dueDate
            : null,
        completed: Boolean((todo as { completed?: boolean }).completed),
      }))
      .filter((todo) => {
        const folder = folderMap.get(todo.folderId);
        return (
          !!folder &&
          folder.categories.some(
            (category) => category.id === todo.categoryId
          )
        );
      });

    return {
      folders: normalisedFolders,
      todos: normalisedTodos,
    };
  } catch (error) {
    console.error("Failed to parse general todo state:", error);
    return cloneState(DEFAULT_STATE);
  }
};

const createId = (prefix: string) =>
  `${prefix}-${Math.random().toString(36).slice(2, 10)}`;

const GeneralTodoIndex = () => {
  const [generalState, setGeneralState] = useState<GeneralTodoState>(
    () => loadInitialState()
  );
  const [selectedFolderId, setSelectedFolderId] = useState<string | null>(null);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(
    null
  );
  const [selectedTodoId, setSelectedTodoId] = useState<number | null>(null);
  const [todoTitle, setTodoTitle] = useState("");
  const [contextMenu, setContextMenu] = useState<ContextMenuState | null>(null);
  const [folderFormModal, setFolderFormModal] =
    useModalState<FolderFormModalPayload>();
  const [categoryFormModal, setCategoryFormModal] =
    useModalState<CategoryFormModalPayload>();
  const [deleteConfirmModal, setDeleteConfirmModal] =
    useModalState<DeleteConfirmModalPayload>();
  const [folderNameInput, setFolderNameInput] = useState("");
  const [folderFormError, setFolderFormError] = useState<string | null>(null);
  const [categoryNameInput, setCategoryNameInput] = useState("");
  const [categoryFormError, setCategoryFormError] = useState<string | null>(null);
  const [todoFormModal, setTodoFormModal] = useModalState<boolean>();
  const [todoFormError, setTodoFormError] = useState<string | null>(null);
  const [todoModalCategoryId, setTodoModalCategoryId] = useState<string | null>(
    null
  );
  const [todoModalDueDate, setTodoModalDueDate] = useState<string>("");
  const [todoModalDescription, setTodoModalDescription] = useState<string>("");
  const [detailTitle, setDetailTitle] = useState<string>("");
  const [detailDescription, setDetailDescription] = useState<string>("");
  const [detailDueDate, setDetailDueDate] = useState<string>("");
  const [detailCompleted, setDetailCompleted] = useState<boolean>(false);
  const [detailDirty, setDetailDirty] = useState<boolean>(false);
  const [detailError, setDetailError] = useState<string | null>(null);
  const [showCompleted, setShowCompleted] = useState<boolean>(false);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    window.localStorage.setItem(
      LOCAL_STORAGE_KEYS.generalTodoState,
      JSON.stringify(generalState)
    );
  }, [generalState]);

  useEffect(() => {
    if (!folderFormModal) {
      setFolderNameInput("");
      setFolderFormError(null);
      return;
    }

    setFolderNameInput(folderFormModal.initialName ?? "");
    setFolderFormError(null);
  }, [folderFormModal]);

  useEffect(() => {
    if (!categoryFormModal) {
      setCategoryNameInput("");
      setCategoryFormError(null);
      return;
    }

    setCategoryNameInput(categoryFormModal.initialName ?? "");
    setCategoryFormError(null);
  }, [categoryFormModal]);

  useEffect(() => {
    if (!contextMenu) {
      return undefined;
    }

    const handleGlobalClick = () => setContextMenu(null);
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setContextMenu(null);
      }
    };

    document.addEventListener("click", handleGlobalClick);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("click", handleGlobalClick);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [contextMenu]);

  useEffect(() => {
    if (generalState.folders.length === 0) {
      if (selectedFolderId !== null) {
        setSelectedFolderId(null);
      }
      if (selectedCategoryId !== null) {
        setSelectedCategoryId(null);
      }
      return;
    }

    if (
      !selectedFolderId ||
      !generalState.folders.some(
        (folder) => folder.id === selectedFolderId
      )
    ) {
      setSelectedFolderId(generalState.folders[0].id);
    }
  }, [generalState.folders, selectedFolderId]);

  const activeFolder = useMemo(() => {
    if (!selectedFolderId) {
      return null;
    }

    return (
      generalState.folders.find((folder) => folder.id === selectedFolderId) ??
      null
    );
  }, [generalState.folders, selectedFolderId]);

  const activeFolderCategories = activeFolder?.categories ?? [];

  useEffect(() => {
    if (!activeFolder) {
      if (selectedCategoryId !== null) {
        setSelectedCategoryId(null);
      }
      return;
    }

    if (!selectedCategoryId) {
      return;
    }

    const hasSelectedCategory = activeFolder.categories.some(
      (category) => category.id === selectedCategoryId
    );

    if (!hasSelectedCategory) {
      setSelectedCategoryId(null);
    }
  }, [activeFolder, selectedCategoryId]);

  useEffect(() => {
    setSelectedTodoId((prev) => {
      if (prev === null) {
        return null;
      }

      const todoExists = generalState.todos.some((todo) => {
        if (todo.id !== prev || todo.folderId !== selectedFolderId) {
          return false;
        }

        if (!selectedCategoryId) {
          return true;
        }

        return todo.categoryId === selectedCategoryId;
      });

      return todoExists ? prev : null;
    });
  }, [generalState.todos, selectedFolderId, selectedCategoryId]);

  const todosForSelection = useMemo(() => {
    if (!selectedFolderId) {
      return [];
    }

    return generalState.todos.filter((todo) => {
      if (todo.folderId !== selectedFolderId) {
        return false;
      }

      if (todo.completed) {
        return false;
      }

      if (!selectedCategoryId) {
        return true;
      }

      return todo.categoryId === selectedCategoryId;
    });
  }, [generalState.todos, selectedFolderId, selectedCategoryId]);

  const completedTodosForSelection = useMemo(() => {
    return generalState.todos.filter(
      (todo) =>
        todo.folderId === selectedFolderId &&
        todo.completed &&
        (!selectedCategoryId || todo.categoryId === selectedCategoryId)
    );
  }, [generalState.todos, selectedFolderId, selectedCategoryId]);

  const selectedTodo = useMemo(() => {
    if (selectedTodoId === null) {
      return null;
    }

    return (
      generalState.todos.find((todo) => todo.id === selectedTodoId) ?? null
    );
  }, [generalState.todos, selectedTodoId]);

  const resetDetailState = useCallback(() => {
    setDetailTitle("");
    setDetailDescription("");
    setDetailDueDate("");
    setDetailCompleted(false);
    setDetailDirty(false);
    setDetailError(null);
  }, []);

  useEffect(() => {
    if (!selectedTodo) {
      resetDetailState();
      return;
    }

    setDetailTitle(selectedTodo.title);
    setDetailDescription(selectedTodo.description ?? "");
    setDetailDueDate(selectedTodo.dueDate ?? "");
    setDetailCompleted(Boolean(selectedTodo.completed));
    setDetailDirty(false);
    setDetailError(null);
  }, [selectedTodo, resetDetailState]);

  const categoryNameMap = useMemo(() => {
    const map: Record<string, string> = {};

    generalState.folders.forEach((folder) => {
      folder.categories.forEach((category) => {
        map[category.id] = category.name;
      });
    });

    return map;
  }, [generalState.folders]);

  useEffect(() => {
    if (!todoFormModal) {
      setTodoModalCategoryId(null);
      setTodoFormError(null);
      setTodoModalDueDate("");
      setTodoModalDescription("");
      return;
    }

    if (!activeFolder || activeFolder.categories.length === 0) {
      setTodoModalCategoryId(null);
      return;
    }

    const initialCategory =
      selectedCategoryId &&
      activeFolder.categories.some(
        (category) => category.id === selectedCategoryId
      )
        ? selectedCategoryId
        : activeFolder.categories[0]?.id ?? null;

    setTodoModalCategoryId(initialCategory);
  }, [todoFormModal, activeFolder, selectedCategoryId]);

  const categoryModalFolderName = useMemo(() => {
    if (!categoryFormModal) {
      return "";
    }

    const folder = generalState.folders.find(
      (item) => item.id === categoryFormModal.folderId
    );

    return folder?.name ?? "";
  }, [categoryFormModal, generalState.folders]);

  const deleteModalFolderName = useMemo(() => {
    if (!deleteConfirmModal) {
      return "";
    }

    const folder = generalState.folders.find(
      (item) => item.id === deleteConfirmModal.folderId
    );

    return folder?.name ?? "";
  }, [deleteConfirmModal, generalState.folders]);

  const deleteModalFolderDisplayName = deleteConfirmModal
    ? deleteModalFolderName || deleteConfirmModal.name
    : "";

  const handleAddTodo = (event?: FormEvent<HTMLFormElement>) => {
    event?.preventDefault();

    const trimmedTitle = todoTitle.trim();

    if (!trimmedTitle) {
      setTodoFormError("제목을 입력해주세요.");
      return;
    }

    if (!selectedFolderId) {
      setTodoFormModal(undefined);
      return;
    }

    if (!todoModalCategoryId) {
      setTodoFormError("카테고리를 선택해주세요.");
      return;
    }

    const newTodo: GeneralTodoItem = {
      id: Date.now(),
      title: trimmedTitle,
      description: todoModalDescription,
      folderId: selectedFolderId,
      categoryId: todoModalCategoryId,
      dueDate: todoModalDueDate || null,
      completed: false,
    };

    setGeneralState((prev) => ({
      ...prev,
      todos: [...prev.todos, newTodo],
    }));
    setTodoTitle("");
    setTodoFormError(null);
    setSelectedCategoryId(todoModalCategoryId);
    setTodoModalCategoryId(null);
    setTodoModalDueDate("");
    setTodoModalDescription("");
    setTodoFormModal(undefined);
    setSelectedTodoId(newTodo.id);
  };

  const handleSelectFolder = (folderId: string) => {
    setSelectedFolderId(folderId);
    setSelectedCategoryId(null);
    setSelectedTodoId(null);
  };

  const handleSelectCategory = (categoryId: string) => {
    setSelectedCategoryId(categoryId);
    setSelectedTodoId(null);
  };

  const handleSelectTodo = (todoId: number) => {
    setSelectedTodoId(todoId);
  };

  const handleAddFolder = () => {
    setContextMenu(null);
    setFolderFormModal({ mode: "create" });
  };

  const openContextMenu = (
    event: MouseEvent<HTMLButtonElement>,
    payload: ContextMenuTarget
  ) => {
    event.preventDefault();

    const { clientX, clientY } = event;
    const safeX =
      typeof window !== "undefined"
        ? Math.min(clientX, window.innerWidth - MENU_WIDTH)
        : clientX;
    const safeY =
      typeof window !== "undefined"
        ? Math.min(clientY, window.innerHeight - MENU_HEIGHT)
        : clientY;

    setContextMenu({
      ...payload,
      x: safeX,
      y: safeY,
    });
  };

  const handleFolderContextMenu = (
    event: MouseEvent<HTMLButtonElement>,
    folderId: string
  ) => {
    setSelectedFolderId(folderId);
    openContextMenu(event, { type: "folder", id: folderId });
  };

  const handleCategoryContextMenu = (
    event: MouseEvent<HTMLButtonElement>,
    folderId: string,
    categoryId: string
  ) => {
    setSelectedFolderId(folderId);
    setSelectedCategoryId(categoryId);
    openContextMenu(event, {
      type: "category",
      id: categoryId,
      folderId,
    });
  };

  const handleTodoContextMenu = (
    event: MouseEvent<HTMLButtonElement>,
    todo: GeneralTodoItem
  ) => {
    event.preventDefault();
    setSelectedFolderId(todo.folderId);
    if (selectedCategoryId !== null) {
      setSelectedCategoryId(todo.categoryId);
    }
    setSelectedTodoId(todo.id);
    openContextMenu(event, {
      type: "todo",
      todoId: todo.id,
      folderId: todo.folderId,
      categoryId: todo.categoryId,
      name: todo.title,
    });
  };

  const handleAddCategoryFromContext = () => {
    if (!contextMenu || contextMenu.type !== "folder") {
      return;
    }

    const targetFolderId = contextMenu.id;

    setContextMenu(null);
    setSelectedFolderId(targetFolderId);
    setCategoryFormModal({
      mode: "create",
      folderId: targetFolderId,
    });
  };

  const handleOpenTodoForm = () => {
    if (!selectedFolderId || !activeFolder) {
      return;
    }

    if (activeFolder.categories.length === 0) {
      window.alert("카테고리를 먼저 추가해주세요.");
      return;
    }

    const initialCategory =
      selectedCategoryId &&
      activeFolder.categories.some(
        (category) => category.id === selectedCategoryId
      )
        ? selectedCategoryId
        : activeFolder.categories[0]?.id ?? null;

    setTodoModalCategoryId(initialCategory);
    setTodoFormError(null);
    setTodoTitle("");
    setTodoModalDueDate("");
    setTodoModalDescription("");
    setTodoFormModal(true);
  };

  const handleDetailTitleChange = (value: string) => {
    setDetailTitle(value);
    setDetailDirty(true);
    if (detailError) {
      setDetailError(null);
    }
  };

  const handleDetailDescriptionChange = (value: string) => {
    setDetailDescription(value);
    setDetailDirty(true);
  };

  const handleDetailDueDateChange = (value: string) => {
    setDetailDueDate(value);
    setDetailDirty(true);
  };

  const handleDetailCompletedChange = (value: boolean) => {
    setDetailCompleted(value);
    setDetailDirty(true);
    setDetailError(null);
    if (selectedTodoId !== null) {
      handleToggleTodoCompletion(selectedTodoId, value);
    }
  };

  const handleDetailSave = () => {
    if (!selectedTodoId) {
      return;
    }

    const trimmedTitle = detailTitle.trim();

    if (!trimmedTitle) {
      setDetailError("제목을 입력해주세요.");
      return;
    }

    setGeneralState((prev) => ({
      ...prev,
      todos: prev.todos.map((todo) =>
        todo.id === selectedTodoId
          ? {
              ...todo,
              title: trimmedTitle,
              description: detailDescription,
              dueDate: detailDueDate || null,
              completed: detailCompleted,
            }
          : todo
      ),
    }));

    setDetailTitle(trimmedTitle);
    setDetailDirty(false);
    setDetailError(null);
  };

  const handleToggleTodoCompletion = (
    todoId: number,
    completed: boolean
  ) => {
    setGeneralState((prev) => ({
      ...prev,
      todos: prev.todos.map((todo) =>
        todo.id === todoId
          ? {
              ...todo,
              completed,
            }
          : todo
      ),
    }));

    if (selectedTodoId === todoId) {
      setDetailCompleted(completed);
      setDetailDirty(true);
    }
  };

  const handleRenameTarget = () => {
    if (!contextMenu) {
      return;
    }

    if (contextMenu.type === "todo") {
      setContextMenu(null);
      return;
    }

    if (contextMenu.type === "folder") {
      const targetFolder = generalState.folders.find(
        (folder) => folder.id === contextMenu.id
      );

      if (!targetFolder) {
        setContextMenu(null);
        return;
      }

      setSelectedFolderId(contextMenu.id);
      setFolderFormModal({
        mode: "rename",
        folderId: contextMenu.id,
        initialName: targetFolder.name,
      });
    } else if (contextMenu.type === "category") {
      const targetFolder = generalState.folders.find(
        (folder) => folder.id === contextMenu.folderId
      );

      if (!targetFolder) {
        setContextMenu(null);
        return;
      }

      const targetCategory = targetFolder.categories.find(
        (category) => category.id === contextMenu.id
      );

      if (!targetCategory) {
        setContextMenu(null);
        return;
      }

      setCategoryFormModal({
        mode: "rename",
        folderId: contextMenu.folderId,
        categoryId: contextMenu.id,
        initialName: targetCategory.name,
      });
    }

    setContextMenu(null);
  };

  const handleDeleteTarget = () => {
    if (!contextMenu) {
      return;
    }

    if (contextMenu.type === "folder") {
      const targetFolder = generalState.folders.find(
        (folder) => folder.id === contextMenu.id
      );

      if (!targetFolder) {
        setContextMenu(null);
        return;
      }

      setDeleteConfirmModal({
        type: "folder",
        folderId: contextMenu.id,
        name: targetFolder.name,
      });
    } else if (contextMenu.type === "category") {
      const targetFolder = generalState.folders.find(
        (folder) => folder.id === contextMenu.folderId
      );

      if (!targetFolder) {
        setContextMenu(null);
        return;
      }

      const targetCategory = targetFolder.categories.find(
        (category) => category.id === contextMenu.id
      );

      if (!targetCategory) {
        setContextMenu(null);
        return;
      }

      setDeleteConfirmModal({
        type: "category",
        folderId: contextMenu.folderId,
        categoryId: contextMenu.id,
        name: `${targetCategory.name}`,
      });
    } else if (contextMenu.type === "todo") {
      const targetTodo = generalState.todos.find(
        (todo) => todo.id === contextMenu.todoId
      );

      if (!targetTodo) {
        setContextMenu(null);
        return;
      }

      setDeleteConfirmModal({
        type: "todo",
        folderId: contextMenu.folderId,
        categoryId: contextMenu.categoryId,
        todoId: contextMenu.todoId,
        name: contextMenu.name,
      });
    }

    setContextMenu(null);
  };

  const handleSubmitFolderForm = () => {
    if (!folderFormModal) {
      return;
    }

    const trimmed = folderNameInput.trim();

    if (!trimmed) {
      setFolderFormError("이름을 입력해주세요.");
      return;
    }

    const isDuplicate = generalState.folders.some(
      (folder) =>
        folder.name.toLowerCase() === trimmed.toLowerCase() &&
        (folderFormModal.mode === "create" ||
          folder.id !== folderFormModal.folderId)
    );

    if (isDuplicate) {
      setFolderFormError("같은 이름의 폴더가 이미 존재합니다.");
      return;
    }

    if (folderFormModal.mode === "create") {
      const newFolder: GeneralTodoFolder = {
        id: createId("folder"),
        name: trimmed,
        categories: [],
      };

      setGeneralState((prev) => ({
        folders: [...prev.folders, newFolder],
        todos: prev.todos,
      }));
      setSelectedFolderId(newFolder.id);
      setSelectedCategoryId(null);
    } else if (folderFormModal.folderId) {
      setGeneralState((prev) => ({
        folders: prev.folders.map((folder) =>
          folder.id === folderFormModal.folderId
            ? { ...folder, name: trimmed }
            : folder
        ),
        todos: prev.todos,
      }));
    }

    setFolderFormModal(undefined);
  };

  const handleSubmitCategoryForm = () => {
    if (!categoryFormModal) {
      return;
    }

    const trimmed = categoryNameInput.trim();

    if (!trimmed) {
      setCategoryFormError("이름을 입력해주세요.");
      return;
    }

    const targetFolder = generalState.folders.find(
      (folder) => folder.id === categoryFormModal.folderId
    );

    if (!targetFolder) {
      setCategoryFormModal(undefined);
      return;
    }

    const isDuplicate = targetFolder.categories.some(
      (category) =>
        category.name.toLowerCase() === trimmed.toLowerCase() &&
        (categoryFormModal.mode === "create" ||
          category.id !== categoryFormModal.categoryId)
    );

    if (isDuplicate) {
      setCategoryFormError("같은 이름의 카테고리가 이미 존재합니다.");
      return;
    }

    if (categoryFormModal.mode === "create") {
      const newCategoryId = createId("category");

      setGeneralState((prev) => ({
        folders: prev.folders.map((folder) => {
          if (folder.id !== categoryFormModal.folderId) {
            return folder;
          }

          return {
            ...folder,
            categories: [...folder.categories, { id: newCategoryId, name: trimmed }],
          };
        }),
        todos: prev.todos,
      }));

      setSelectedFolderId(categoryFormModal.folderId);
      setSelectedCategoryId(newCategoryId);
    } else if (categoryFormModal.categoryId) {
      setGeneralState((prev) => ({
        folders: prev.folders.map((folder) => {
          if (folder.id !== categoryFormModal.folderId) {
            return folder;
          }

          return {
            ...folder,
            categories: folder.categories.map((category) =>
              category.id === categoryFormModal.categoryId
                ? { ...category, name: trimmed }
                : category
            ),
          };
        }),
        todos: prev.todos,
      }));

      setSelectedFolderId(categoryFormModal.folderId);
    }

    setCategoryFormModal(undefined);
  };

  const handleConfirmDelete = () => {
    if (!deleteConfirmModal) {
      return;
    }

    if (deleteConfirmModal.type === "folder") {
      setGeneralState((prev) => ({
        folders: prev.folders.filter(
          (folder) => folder.id !== deleteConfirmModal.folderId
        ),
        todos: prev.todos.filter(
          (todo) => todo.folderId !== deleteConfirmModal.folderId
        ),
      }));
      if (selectedFolderId === deleteConfirmModal.folderId) {
        setSelectedFolderId(null);
        setSelectedCategoryId(null);
        setSelectedTodoId(null);
        resetDetailState();
      }
    } else if (deleteConfirmModal.type === "category") {
      setGeneralState((prev) => ({
        folders: prev.folders.map((folder) => {
          if (folder.id !== deleteConfirmModal.folderId) {
            return folder;
          }

          return {
            ...folder,
            categories: folder.categories.filter(
              (category) => category.id !== deleteConfirmModal.categoryId
            ),
          };
        }),
        todos: prev.todos.filter(
          (todo) =>
            !(
              todo.folderId === deleteConfirmModal.folderId &&
              todo.categoryId === deleteConfirmModal.categoryId
            )
        ),
      }));
      if (
        selectedFolderId === deleteConfirmModal.folderId &&
        selectedCategoryId === deleteConfirmModal.categoryId
      ) {
        setSelectedCategoryId(null);
        setSelectedTodoId(null);
        resetDetailState();
      }
    } else if (deleteConfirmModal.type === "todo") {
      setGeneralState((prev) => ({
        folders: prev.folders,
        todos: prev.todos.filter(
          (todo) => todo.id !== deleteConfirmModal.todoId
        ),
      }));

      if (selectedTodoId === deleteConfirmModal.todoId) {
        setSelectedTodoId(null);
        resetDetailState();
      }
    }

    setDeleteConfirmModal(undefined);
  };

  const canAddTodo = Boolean(selectedFolderId && activeFolderCategories.length > 0);
  const showAllCategories = Boolean(selectedFolderId && !selectedCategoryId);

  return (
    <WideDefaultLayout
      pageTitle="일반 할 일"
      description="폴더와 카테고리로 정리하는 개인용 투두"
    >
      <Container>
        <SidebarColumn>
          <GeneralTodoSidebar
            folders={generalState.folders}
            selectedFolderId={selectedFolderId}
            selectedCategoryId={selectedCategoryId}
            onSelectFolder={handleSelectFolder}
            onSelectCategory={handleSelectCategory}
            onAddFolder={handleAddFolder}
            onFolderContextMenu={handleFolderContextMenu}
            onCategoryContextMenu={handleCategoryContextMenu}
          />
        </SidebarColumn>

        <TodoColumn>
          <ListHeader>
            <AddTodoButton
              type="button"
              disabled={!canAddTodo}
              onClick={handleOpenTodoForm}
            >
              새 할 일 추가
            </AddTodoButton>
          </ListHeader>
          <GeneralTodoList
            todos={todosForSelection}
            selectedTodoId={selectedTodoId}
            onSelectTodo={handleSelectTodo}
            showAllCategories={showAllCategories}
            categoryNameMap={categoryNameMap}
            onTodoContextMenu={handleTodoContextMenu}
            onToggleCompletion={handleToggleTodoCompletion}
          />

          {completedTodosForSelection.length > 0 && (
            <CollapsedCompleted>
              <CollapsedHeaderButton
                type="button"
                onClick={() => setShowCompleted((prev) => !prev)}
              >
                <span>완료 {completedTodosForSelection.length}개</span>
                <ToggleArrow>{showCompleted ? "▲" : "▼"}</ToggleArrow>
              </CollapsedHeaderButton>

              {showCompleted && (
                <CollapsedList>
                  {completedTodosForSelection.map((todo) => (
                    <CollapsedItem
                      key={todo.id}
                      type="button"
                      onClick={() => {
                        setSelectedTodoId(todo.id);
                      }}
                    >
                      <span>{todo.title}</span>
                      {todo.dueDate ? (
                        <small>
                          {new Date(todo.dueDate).toLocaleDateString()}
                        </small>
                      ) : null}
                    </CollapsedItem>
                  ))}
                </CollapsedList>
              )}
            </CollapsedCompleted>
          )}
        </TodoColumn>

        <DetailColumn>
          <GeneralTodoDetail
            todo={selectedTodo}
            folders={generalState.folders}
            editTitle={detailTitle}
            editDescription={detailDescription}
            editDueDate={detailDueDate}
            editCompleted={detailCompleted}
            onTitleChange={handleDetailTitleChange}
            onDescriptionChange={handleDetailDescriptionChange}
            onDueDateChange={handleDetailDueDateChange}
            onCompletedChange={handleDetailCompletedChange}
            onSave={handleDetailSave}
            isDirty={detailDirty}
            error={detailError}
          />
        </DetailColumn>
      </Container>

      {folderFormModal && (
        <Modal
          title={
            folderFormModal.mode === "create" ? "폴더 추가" : "폴더 이름 변경"
          }
          isOpen
          onClose={() => setFolderFormModal(undefined)}
          buttons={[
            {
              label: "취소",
              onClick: () => setFolderFormModal(undefined),
            },
            {
              label: folderFormModal.mode === "create" ? "추가" : "변경",
              onClick: handleSubmitFolderForm,
            },
          ]}
        >
          <ModalForm
            onSubmit={(event) => {
              event.preventDefault();
              handleSubmitFolderForm();
            }}
          >
            <ModalLabel htmlFor="general-folder-name">폴더 이름</ModalLabel>
            <ModalInput
              id="general-folder-name"
              autoFocus
              value={folderNameInput}
              onChange={(event) => {
                setFolderNameInput(event.target.value);
                if (folderFormError) {
                  setFolderFormError(null);
                }
              }}
              placeholder="폴더 이름을 입력하세요"
            />
            {folderFormError && <ModalError>{folderFormError}</ModalError>}
            <HiddenSubmit type="submit" />
          </ModalForm>
        </Modal>
      )}

      {todoFormModal && (
        <Modal
          title="새 할 일 추가"
          isOpen
          onClose={() => {
            setTodoFormModal(undefined);
            setTodoFormError(null);
            setTodoTitle("");
          }}
          buttons={[
            {
              label: "취소",
              onClick: () => {
                setTodoFormModal(undefined);
                setTodoFormError(null);
                setTodoTitle("");
              },
            },
            {
              label: "추가",
              onClick: () => {
                handleAddTodo();
              },
            },
          ]}
        >
          <ModalForm
            onSubmit={(event) => {
              handleAddTodo(event);
            }}
          >
            {activeFolderCategories.length > 0 ? (
              <>
                <ModalLabel htmlFor="general-todo-category">카테고리</ModalLabel>
                <CategorySelect
                  id="general-todo-category"
                  value={todoModalCategoryId ?? ""}
                  onChange={(event) =>
                    setTodoModalCategoryId(event.target.value || null)
                  }
                >
                  {activeFolderCategories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </CategorySelect>
                <ModalLabel htmlFor="general-todo-due-date">마감일 (선택)</ModalLabel>
                <ModalInput
                  id="general-todo-due-date"
                  type="date"
                  value={todoModalDueDate}
                  onChange={(event) => setTodoModalDueDate(event.target.value)}
                />
              </>
            ) : (
              <ModalHelper>
                카테고리를 먼저 추가해주세요.
              </ModalHelper>
            )}
            <ModalLabel htmlFor="general-todo-title">제목</ModalLabel>
            <ModalInput
              id="general-todo-title"
              autoFocus
              value={todoTitle}
              onChange={(event) => {
                setTodoTitle(event.target.value);
                if (todoFormError) {
                  setTodoFormError(null);
                }
              }}
              placeholder="할 일 제목을 입력하세요"
            />
            <ModalLabel htmlFor="general-todo-description">메모 (선택)</ModalLabel>
            <ModalTextArea
              id="general-todo-description"
              rows={4}
              value={todoModalDescription}
              onChange={(event) => setTodoModalDescription(event.target.value)}
              placeholder="추가로 기록해 둘 메모가 있다면 입력하세요"
            />
            {todoFormError && <ModalError>{todoFormError}</ModalError>}
            <HiddenSubmit type="submit" />
          </ModalForm>
        </Modal>
      )}

      {categoryFormModal && (
        <Modal
          title={
            categoryFormModal.mode === "create"
              ? "카테고리 추가"
              : "카테고리 이름 변경"
          }
          isOpen
          onClose={() => setCategoryFormModal(undefined)}
          buttons={[
            {
              label: "취소",
              onClick: () => setCategoryFormModal(undefined),
            },
            {
              label: categoryFormModal.mode === "create" ? "추가" : "변경",
              onClick: handleSubmitCategoryForm,
            },
          ]}
        >
          <ModalForm
            onSubmit={(event) => {
              event.preventDefault();
              handleSubmitCategoryForm();
            }}
          >
            {categoryModalFolderName && (
              <ModalHelper>대상 폴더: {categoryModalFolderName}</ModalHelper>
            )}
            <ModalLabel htmlFor="general-category-name">
              카테고리 이름
            </ModalLabel>
            <ModalInput
              id="general-category-name"
              autoFocus
              value={categoryNameInput}
              onChange={(event) => {
                setCategoryNameInput(event.target.value);
                if (categoryFormError) {
                  setCategoryFormError(null);
                }
              }}
              placeholder="카테고리 이름을 입력하세요"
            />
            {categoryFormError && <ModalError>{categoryFormError}</ModalError>}
            <HiddenSubmit type="submit" />
          </ModalForm>
        </Modal>
      )}

      {deleteConfirmModal && (
        <Modal
          title="삭제 확인"
          isOpen
          onClose={() => setDeleteConfirmModal(undefined)}
          buttons={[
            {
              label: "취소",
              onClick: () => setDeleteConfirmModal(undefined),
            },
            {
              label: "삭제",
              onClick: handleConfirmDelete,
            },
          ]}
        >
          <ModalMessage>
            {deleteConfirmModal.type === "folder"
              ? `폴더 "${deleteModalFolderDisplayName}"와 해당 폴더에 포함된 모든 카테고리 및 할 일을 삭제할까요?`
              : deleteConfirmModal.type === "category"
              ? `카테고리 "${deleteConfirmModal.name}" (폴더 "${deleteModalFolderDisplayName}")와 해당 카테고리에 포함된 할 일이 모두 삭제됩니다.`
              : `할 일 "${deleteConfirmModal.name}"을 삭제할까요?`}
          </ModalMessage>
        </Modal>
      )}

      {contextMenu && (
        <ContextMenu
          $left={contextMenu.x}
          $top={contextMenu.y}
          onClick={(event) => event.stopPropagation()}
          onContextMenu={(event) => event.preventDefault()}
        >
          {contextMenu.type === "folder" && (
            <>
              <ContextMenuButton
                type="button"
                onClick={handleAddCategoryFromContext}
              >
                카테고리 추가
              </ContextMenuButton>
              <ContextMenuButton type="button" onClick={handleRenameTarget}>
                이름 변경
              </ContextMenuButton>
              <ContextMenuButton
                type="button"
                $danger
                onClick={handleDeleteTarget}
              >
                삭제
              </ContextMenuButton>
            </>
          )}
          {contextMenu.type === "category" && (
            <>
              <ContextMenuButton type="button" onClick={handleRenameTarget}>
                이름 변경
              </ContextMenuButton>
              <ContextMenuButton
                type="button"
                $danger
                onClick={handleDeleteTarget}
              >
                삭제
              </ContextMenuButton>
            </>
          )}
          {contextMenu.type === "todo" && (
            <ContextMenuButton
              type="button"
              $danger
              onClick={handleDeleteTarget}
            >
              삭제
            </ContextMenuButton>
          )}
        </ContextMenu>
      )}
    </WideDefaultLayout>
  );
};

export default GeneralTodoIndex;

const Container = styled.div`
  width: 100%;
  min-height: 70vh;
  display: grid;
  grid-template-columns: 20% 40% 40%;
  gap: 16px;

  ${({ theme }) => theme.medias.max1100} {
    grid-template-columns: 1fr;
  }
`;

const ColumnBase = styled.div`
  background: ${({ theme }) => theme.app.bg.white};
  border: 1px solid ${({ theme }) => theme.app.border};
  border-radius: 8px;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const SidebarColumn = styled(ColumnBase)`
  gap: 20px;
`;

const TodoColumn = styled(ColumnBase)`
  gap: 16px;
`;

const DetailColumn = styled(ColumnBase)`
  gap: 16px;
`;

const ListHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
`;

const CollapsedCompleted = styled.div`
  padding: 10px 12px;
  border-radius: 6px;
  border: 1px dashed ${({ theme }) => theme.app.bg.gray2};
  background: ${({ theme }) => theme.app.bg.gray1};
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const CollapsedHeaderButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding: 0;
  border: none;
  background: transparent;
  font-size: 13px;
  color: ${({ theme }) => theme.app.text.light1};
  cursor: pointer;

  &:hover {
    text-decoration: underline;
  }
`;

const ToggleArrow = styled.span`
  font-size: 12px;
`;

const CollapsedList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

const CollapsedItem = styled.button`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 10px;
  border-radius: 6px;
  border: 1px solid ${({ theme }) => theme.app.border};
  background: ${({ theme }) => theme.app.bg.white};
  color: ${({ theme }) => theme.app.text.main};
  font-size: 13px;
  cursor: pointer;
  transition: background 0.2s ease;

  &:hover {
    background: ${({ theme }) => theme.app.bg.gray1};
  }

  small {
    color: ${({ theme }) => theme.app.text.light1};
    font-size: 12px;
  }
`;

const ContextMenu = styled.div<{ $top: number; $left: number }>`
  position: fixed;
  top: ${({ $top }) => `${$top}px`};
  left: ${({ $left }) => `${$left}px`};
  display: flex;
  flex-direction: column;
  background: ${({ theme }) => theme.app.bg.white};
  border: 1px solid ${({ theme }) => theme.app.border};
  border-radius: 8px;
  box-shadow: 0 10px 24px rgba(0, 0, 0, 0.12);
  min-width: 160px;
  z-index: 2000;
  overflow: hidden;
`;

const ContextMenuButton = styled.button<{ $danger?: boolean }>`
  padding: 10px 16px;
  background: ${({ theme }) => theme.app.bg.white};
  border: none;
  text-align: left;
  color: ${({ theme, $danger }) =>
    $danger ? theme.app.text.red : theme.app.text.main};
  font-size: 14px;
  cursor: pointer;
  transition: background 0.2s ease;

  &:hover {
    background: ${({ theme }) => theme.app.bg.gray1};
  }
`;

const AddTodoButton = styled.button`
  align-self: flex-start;
  padding: 8px 14px;
  border-radius: 6px;
  border: 1px solid ${({ theme }) => theme.app.border};
  background: ${({ theme }) => theme.app.bg.white};
  color: ${({ theme }) => theme.app.text.main};
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s ease;

  &:hover:not(:disabled) {
    background: ${({ theme }) => theme.app.bg.gray1};
  }

  &:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }
`;

const ModalForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const ModalLabel = styled.label`
  font-size: 14px;
  font-weight: 600;
  color: ${({ theme }) => theme.app.text.main};
`;

const ModalInput = styled.input`
  width: 100%;
  padding: 10px 12px;
  border-radius: 6px;
  border: 1px solid ${({ theme }) => theme.app.border};
  background: ${({ theme }) => theme.app.bg.white};
  color: ${({ theme }) => theme.app.text.main};
`;

const CategorySelect = styled.select`
  width: 100%;
  padding: 10px 12px;
  border-radius: 6px;
  border: 1px solid ${({ theme }) => theme.app.border};
  background: ${({ theme }) => theme.app.bg.white};
  color: ${({ theme }) => theme.app.text.main};
`;

const ModalTextArea = styled.textarea`
  width: 100%;
  padding: 10px 12px;
  border-radius: 6px;
  border: 1px solid ${({ theme }) => theme.app.border};
  background: ${({ theme }) => theme.app.bg.white};
  color: ${({ theme }) => theme.app.text.main};
  resize: vertical;
`;

const ModalError = styled.p`
  margin: 0;
  font-size: 13px;
  color: ${({ theme }) => theme.app.text.red};
`;

const ModalHelper = styled.p`
  margin: 0;
  font-size: 13px;
  color: ${({ theme }) => theme.app.text.light1};
`;

const ModalMessage = styled.p`
  margin: 0;
  line-height: 1.5;
  color: ${({ theme }) => theme.app.text.main};
`;

const HiddenSubmit = styled.button`
  display: none;
`;
