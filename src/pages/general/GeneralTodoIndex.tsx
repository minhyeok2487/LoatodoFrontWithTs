import { arrayMove } from "@dnd-kit/sortable";
import { useCallback, useEffect, useMemo, useState } from "react";
import type { FormEvent, MouseEvent } from "react";
import { useSearchParams } from "react-router-dom";
import styled from "styled-components";
import { FiX } from "@react-icons/all-files/fi/FiX";

import { LOCAL_STORAGE_KEYS } from "@core/constants";
import useModalState from "@core/hooks/useModalState";
import Modal from "@components/Modal";
import WideDefaultLayout from "@layouts/WideDefaultLayout";

import GeneralTodoDetail from "./components/GeneralTodoDetail";
import GeneralTodoKanban from "./components/GeneralTodoKanban";
import GeneralTodoList from "./components/GeneralTodoList";
import GeneralTodoSidebar from "./components/GeneralTodoSidebar";
import MarkdownEditor from "./components/MarkdownEditor";
import type {
  GeneralTodoState,
  GeneralTodoItem,
  GeneralTodoFolder,
} from "./components/types";

const CATEGORY_COLOR_PRESETS = [
  "#EF4444",
  "#F97316",
  "#FACC15",
  "#22C55E",
  "#0EA5E9",
  "#6366F1",
  "#EC4899",
] as const;

const CATEGORY_DEFAULT_CUSTOM_COLOR = "#6366F1";

const CATEGORY_COLOR_PATTERN = /^#[0-9A-Fa-f]{6}$/;

type CategoryViewMode = "list" | "kanban";

const CATEGORY_VIEW_STORAGE_KEY = "generalTodoCategoryView";

const normaliseCategoryColor = (
  value: string | null | undefined
): string | null => {
  if (!value) {
    return null;
  }

  const trimmed = value.trim();

  if (!CATEGORY_COLOR_PATTERN.test(trimmed)) {
    return null;
  }

  return trimmed.toUpperCase();
};

const loadCategoryViewPreferences = (): Record<string, CategoryViewMode> => {
  if (typeof window === "undefined") {
    return {};
  }

  const raw = window.localStorage.getItem(CATEGORY_VIEW_STORAGE_KEY);

  if (!raw) {
    return {};
  }

  try {
    const parsed = JSON.parse(raw) as Record<string, unknown>;
    if (!parsed || typeof parsed !== "object") {
      return {};
    }

    const entries = Object.entries(parsed).filter(
      (entry): entry is [string, CategoryViewMode] =>
        typeof entry[0] === "string" &&
        (entry[1] === "list" || entry[1] === "kanban")
    );

    return entries.reduce<Record<string, CategoryViewMode>>(
      (acc, [categoryId, mode]) => {
        acc[categoryId] = mode;
        return acc;
      },
      {}
    );
  } catch (error) {
    console.error("Failed to parse category view preferences:", error);
    return {};
  }
};

const DEFAULT_STATE: GeneralTodoState = {
  folders: [
    {
      id: "personal",
      name: "개인",
      categories: [
        { id: "personal-daily", name: "일상", color: CATEGORY_COLOR_PRESETS[0] },
        { id: "personal-health", name: "건강", color: CATEGORY_COLOR_PRESETS[1] },
        { id: "personal-hobby", name: "취미", color: CATEGORY_COLOR_PRESETS[2] },
      ],
    },
    {
      id: "work",
      name: "업무",
      categories: [
        { id: "work-ideas", name: "아이디어", color: CATEGORY_COLOR_PRESETS[3] },
        { id: "work-progress", name: "진행 중", color: CATEGORY_COLOR_PRESETS[4] },
        { id: "work-pending", name: "대기", color: CATEGORY_COLOR_PRESETS[5] },
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
  initialColor?: string | null;
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

const combineDateAndTime = (date: string, time: string) => {
  if (!date) {
    return "";
  }

  if (!time) {
    return date;
  }

  return `${date}T${time}`;
};

const splitDateAndTime = (value: string | null | undefined) => {
  if (!value) {
    return { date: "", time: "" };
  }

  const [datePart, timePart] = value.split("T");

  if (!timePart) {
    return { date: datePart, time: "" };
  }

  const normalizedTime = timePart.slice(0, 5);

  return {
    date: datePart,
    time: normalizedTime,
  };
};

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

const cloneState = (state: GeneralTodoState): GeneralTodoState => ({
  folders: state.folders.map((folder) => ({
    id: folder.id,
    name: folder.name,
    categories: folder.categories.map((category) => ({
      id: category.id,
      name: category.name,
      color: normaliseCategoryColor(category.color ?? null),
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
              typeof category.name === "string" &&
              (typeof category.color === "string" ||
                category.color === undefined ||
                category.color === null)
          )
      )
      .map((folder) => ({
        id: folder.id,
        name: folder.name,
        categories: folder.categories.map((category) => ({
          id: category.id,
          name: category.name,
          color: normaliseCategoryColor(
            (category as { color?: string | null }).color ?? null
          ),
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
  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedFolderId, setSelectedFolderId] = useState<string | null>(() => {
    const folderParam = searchParams.get("folder");
    return folderParam ?? null;
  });
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(
    () => {
      const categoryParam = searchParams.get("category");
      return categoryParam ?? null;
    }
  );
  const [selectedTodoId, setSelectedTodoId] = useState<number | null>(() => {
    const todoParam = searchParams.get("todo");

    if (!todoParam) {
      return null;
    }

    const parsed = Number(todoParam);

    return Number.isNaN(parsed) ? null : parsed;
  });
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
  const [categoryViewMap, setCategoryViewMap] = useState<
    Record<string, CategoryViewMode>
  >(() => loadCategoryViewPreferences());
  const [categoryColorInput, setCategoryColorInput] = useState<string | null>(null);
  const [categoryCustomColor, setCategoryCustomColor] =
    useState<string>(CATEGORY_DEFAULT_CUSTOM_COLOR);
  const [todoFormModal, setTodoFormModal] = useModalState<boolean>();
  const [todoFormError, setTodoFormError] = useState<string | null>(null);
  const [todoModalCategoryId, setTodoModalCategoryId] = useState<string | null>(
    null
  );
  const [todoModalDueDate, setTodoModalDueDate] = useState<string>("");
  const [todoModalDueTime, setTodoModalDueTime] = useState<string>("");
  const [todoModalDescription, setTodoModalDescription] = useState<string>("");
  const [detailTitle, setDetailTitle] = useState<string>("");
  const [detailDescription, setDetailDescription] = useState<string>("");
  const [detailDueDate, setDetailDueDate] = useState<string>("");
  const [detailDueTime, setDetailDueTime] = useState<string>("");
  const [detailCompleted, setDetailCompleted] = useState<boolean>(false);
  const [detailDirty, setDetailDirty] = useState<boolean>(false);
  const [detailError, setDetailError] = useState<string | null>(null);
  const [showCompleted, setShowCompleted] = useState<boolean>(false);
  const [viewMode, setViewMode] = useState<"active" | "completed" | "trash">(
    () => {
      const viewParam = searchParams.get("view");

      return viewParam === "completed" || viewParam === "trash"
        ? viewParam
        : "active";
    }
  );
  const [trashTodos, setTrashTodos] = useState<GeneralTodoItem[]>([]);
  const [detailPanelOpen, setDetailPanelOpen] = useState<boolean>(false);

  const addTodosToTrash = useCallback((items: GeneralTodoItem[]) => {
    if (items.length === 0) {
      return;
    }

    setTrashTodos((prev) => {
      const existingIds = new Set(prev.map((todo) => todo.id));
      const merged = [...prev];

      items.forEach((item) => {
        if (!existingIds.has(item.id)) {
          merged.push(item);
        }
      });

      return merged;
    });
  }, []);

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
    if (typeof window === "undefined") {
      return;
    }

    window.localStorage.setItem(
      CATEGORY_VIEW_STORAGE_KEY,
      JSON.stringify(categoryViewMap)
    );
  }, [categoryViewMap]);

  useEffect(() => {
    const validCategoryIds = new Set<string>();

    generalState.folders.forEach((folder) => {
      folder.categories.forEach((category) => {
        validCategoryIds.add(category.id);
      });
    });

    setCategoryViewMap((prev) => {
      const entries = Object.entries(prev).filter(([categoryId]) =>
        validCategoryIds.has(categoryId)
      );

      if (entries.length === Object.keys(prev).length) {
        return prev;
      }

      return entries.reduce<Record<string, CategoryViewMode>>(
        (acc, [categoryId, mode]) => {
          acc[categoryId] = mode;
          return acc;
        },
        {}
      );
    });
  }, [generalState.folders]);

  useEffect(() => {
    if (searchParams.has("folder")) {
      const folderParam = searchParams.get("folder");

      if (folderParam !== null) {
        setSelectedFolderId((prev) =>
          prev === folderParam ? prev : folderParam
        );
      }
    }

    if (searchParams.has("category")) {
      const categoryParam = searchParams.get("category");

      if (categoryParam !== null) {
        setSelectedCategoryId((prev) =>
          prev === categoryParam ? prev : categoryParam
        );
      }
    }

    if (searchParams.has("todo")) {
      const todoParam = searchParams.get("todo");

      if (todoParam !== null) {
        const rawTodoNumber = Number(todoParam);
        const parsedTodo = Number.isNaN(rawTodoNumber)
          ? null
          : rawTodoNumber;

        setSelectedTodoId((prev) =>
          prev === parsedTodo ? prev : parsedTodo
        );
      }
    }

    if (searchParams.has("view")) {
      const viewParam = searchParams.get("view");
      const normalizedView =
        viewParam === "completed" || viewParam === "trash"
          ? viewParam
          : "active";

      setViewMode((prev) =>
        prev === normalizedView ? prev : normalizedView
      );
    }
  }, [searchParams]);

  useEffect(() => {
    const next = new URLSearchParams(searchParams);
    let changed = false;

    const syncParam = (key: string, value: string | null) => {
      if (value) {
        if (next.get(key) !== value) {
          next.set(key, value);
          changed = true;
        }
      } else if (next.has(key)) {
        next.delete(key);
        changed = true;
      }
    };

    syncParam("folder", selectedFolderId);
    syncParam("category", selectedCategoryId);
    syncParam("todo", selectedTodoId !== null ? String(selectedTodoId) : null);

    const viewParamValue =
      viewMode === "completed" || viewMode === "trash" ? viewMode : null;
    syncParam("view", viewParamValue);

    const nextString = next.toString();
    const currentString = searchParams.toString();

    if (nextString !== currentString) {
      setSearchParams(next, { replace: true });
    }
  }, [
    selectedFolderId,
    selectedCategoryId,
    selectedTodoId,
    viewMode,
    searchParams,
    setSearchParams,
  ]);

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
      setCategoryColorInput(null);
      setCategoryCustomColor(CATEGORY_DEFAULT_CUSTOM_COLOR);
      return;
    }

    setCategoryNameInput(categoryFormModal.initialName ?? "");
    setCategoryFormError(null);
    const initialColor = normaliseCategoryColor(
      categoryFormModal.initialColor ?? null
    );
    setCategoryColorInput(initialColor);
    setCategoryCustomColor(
      initialColor ?? CATEGORY_DEFAULT_CUSTOM_COLOR
    );
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

  const activeTodosForSelection = useMemo(() => {
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
    if (!selectedFolderId) {
      return generalState.todos.filter((todo) => todo.completed);
    }

    return generalState.todos.filter(
      (todo) =>
        todo.folderId === selectedFolderId &&
        todo.completed &&
        (!selectedCategoryId || todo.categoryId === selectedCategoryId)
    );
  }, [generalState.todos, selectedFolderId, selectedCategoryId]);

  const trashTodosForSelection = useMemo(() => {
    if (viewMode !== "trash") {
      return trashTodos;
    }

    if (!selectedFolderId) {
      return trashTodos;
    }

    return trashTodos.filter((todo) => {
      if (todo.folderId !== selectedFolderId) {
        return false;
      }

      if (!selectedCategoryId) {
        return true;
      }

      return todo.categoryId === selectedCategoryId;
    });
  }, [trashTodos, viewMode, selectedFolderId, selectedCategoryId]);

  const todosForDisplay = useMemo(() => {
    if (viewMode === "completed") {
      return completedTodosForSelection;
    }

    if (viewMode === "trash") {
      return trashTodosForSelection;
    }

    return activeTodosForSelection;
  }, [
    viewMode,
    activeTodosForSelection,
    completedTodosForSelection,
    trashTodosForSelection,
  ]);

  const selectedTodo = useMemo(() => {
    if (selectedTodoId === null || viewMode === "trash") {
      return null;
    }

    return (
      generalState.todos.find((todo) => todo.id === selectedTodoId) ?? null
    );
  }, [generalState.todos, selectedTodoId, viewMode]);

  const resetDetailState = useCallback(() => {
    setDetailTitle("");
    setDetailDescription("");
    setDetailDueDate("");
    setDetailDueTime("");
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
    const { date, time } = splitDateAndTime(selectedTodo.dueDate ?? "");
    setDetailDueDate(date);
    setDetailDueTime(time);
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

  const categoryColorMap = useMemo(() => {
    const map: Record<string, string | null> = {};

    generalState.folders.forEach((folder) => {
      folder.categories.forEach((category) => {
        map[category.id] = normaliseCategoryColor(category.color ?? null);
      });
    });

    return map;
  }, [generalState.folders]);

  const currentCategoryView: CategoryViewMode =
    selectedCategoryId && viewMode === "active"
      ? categoryViewMap[selectedCategoryId] ?? "list"
      : "list";

  const isKanbanView =
    viewMode === "active" &&
    Boolean(selectedCategoryId) &&
    currentCategoryView === "kanban";

  useEffect(() => {
    if (selectedTodoId === null) {
      setDetailPanelOpen(false);
    }
  }, [selectedTodoId]);

  useEffect(() => {
    if (viewMode !== "active") {
      setDetailPanelOpen(false);
    }
  }, [viewMode]);

  useEffect(() => {
    if (!selectedCategoryId && viewMode === "active") {
      setDetailPanelOpen(false);
    }
  }, [selectedCategoryId, viewMode]);

  useEffect(() => {
    if (!selectedTodo) {
      setDetailPanelOpen(false);
    }
  }, [selectedTodo]);

  useEffect(() => {
    if (viewMode !== "active" && showCompleted) {
      setShowCompleted(false);
    }
  }, [showCompleted, viewMode]);

  useEffect(() => {
    if (!todoFormModal) {
      setTodoModalCategoryId(null);
      setTodoFormError(null);
      setTodoModalDueDate("");
      setTodoModalDueTime("");
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
    setTodoModalDueTime("");
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

    const dueDateValue = combineDateAndTime(todoModalDueDate, todoModalDueTime);

    const newTodo: GeneralTodoItem = {
      id: Date.now(),
      title: trimmedTitle,
      description: todoModalDescription,
      folderId: selectedFolderId,
      categoryId: todoModalCategoryId,
      dueDate: dueDateValue || null,
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
    setTodoModalDueTime("");
    setTodoModalDescription("");
    setTodoFormModal(undefined);
    setSelectedTodoId(newTodo.id);
    setDetailPanelOpen(true);
  };

  const handleSelectFolder = (folderId: string) => {
    if (viewMode !== "active") {
      setViewMode("active");
    }
    setSelectedFolderId(folderId);
    setSelectedCategoryId(null);
    setSelectedTodoId(null);
    setDetailPanelOpen(false);
  };

  const handleSelectCategory = (categoryId: string) => {
    if (viewMode !== "active") {
      setViewMode("active");
    }
    setSelectedCategoryId(categoryId);
    setSelectedTodoId(null);
    setDetailPanelOpen(false);
  };

  const handleSelectTodo = (todoId: number) => {
    setSelectedTodoId(todoId);
    setDetailPanelOpen(true);
  };

  const handleCategoryViewToggle = (mode: CategoryViewMode) => {
    if (!selectedCategoryId) {
      return;
    }

    setCategoryViewMap((prev) => {
      const current = prev[selectedCategoryId];

      if (
        (mode === "list" && !current) ||
        current === mode
      ) {
        return prev;
      }

      const next = { ...prev };

      if (mode === "list") {
        delete next[selectedCategoryId];
      } else {
        next[selectedCategoryId] = mode;
      }

      return next;
    });

    if (mode === "kanban") {
      setSelectedTodoId(null);
      setDetailPanelOpen(false);
    }
  };

  const handleCloseDetailPanel = () => {
    setDetailPanelOpen(false);
    setSelectedTodoId(null);
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
      initialColor: null,
    });
  };

  const handleChangeViewMode = useCallback(
    (mode: "completed" | "trash") => {
      const nextMode = viewMode === mode ? "active" : mode;

      setViewMode(nextMode);

      if (nextMode === "trash") {
        setSelectedCategoryId(null);
        setSelectedTodoId(null);
      } else if (nextMode === "completed") {
        setSelectedTodoId(null);
      } else if (!selectedFolderId && generalState.folders.length > 0) {
        setSelectedFolderId(generalState.folders[0].id);
      }
    },
    [generalState.folders, selectedFolderId, viewMode]
  );

  const handleReorderFolders = useCallback(
    (oldIndex: number, newIndex: number) => {
      setGeneralState((prev) => {
        if (
          oldIndex === newIndex ||
          oldIndex < 0 ||
          newIndex < 0 ||
          oldIndex >= prev.folders.length ||
          newIndex >= prev.folders.length
        ) {
          return prev;
        }

        return {
          ...prev,
          folders: arrayMove(prev.folders, oldIndex, newIndex),
        };
      });
    },
    []
  );

  const handleReorderCategories = useCallback(
    (folderId: string, oldIndex: number, newIndex: number) => {
      setGeneralState((prev) => {
        const folderIndex = prev.folders.findIndex(
          (folder) => folder.id === folderId
        );

        if (folderIndex === -1) {
          return prev;
        }

        const { categories } = prev.folders[folderIndex];

        if (
          oldIndex === newIndex ||
          oldIndex < 0 ||
          newIndex < 0 ||
          oldIndex >= categories.length ||
          newIndex >= categories.length
        ) {
          return prev;
        }

        const nextFolders = [...prev.folders];
        nextFolders[folderIndex] = {
          ...nextFolders[folderIndex],
          categories: arrayMove(categories, oldIndex, newIndex),
        };

        return {
          ...prev,
          folders: nextFolders,
        };
      });
    },
    []
  );

  const handleOpenTodoForm = () => {
    if (viewMode !== "active") {
      return;
    }

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
    setTodoModalDueTime("");
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
    if (!value) {
      setDetailDueTime("");
    }
    setDetailDirty(true);
  };

  const handleDetailDueTimeChange = (value: string) => {
    setDetailDueTime(value);
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

    const dueDateValue = combineDateAndTime(detailDueDate, detailDueTime);

    setGeneralState((prev) => ({
      ...prev,
      todos: prev.todos.map((todo) =>
        todo.id === selectedTodoId
          ? {
              ...todo,
              title: trimmedTitle,
              description: detailDescription,
              dueDate: dueDateValue || null,
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
        initialColor: targetCategory.color ?? null,
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
    const normalisedColor = normaliseCategoryColor(categoryColorInput ?? null);

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
            categories: [
              ...folder.categories,
              { id: newCategoryId, name: trimmed, color: normalisedColor },
            ],
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
                ? { ...category, name: trimmed, color: normalisedColor }
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
      const removedTodos = generalState.todos.filter(
        (todo) => todo.folderId === deleteConfirmModal.folderId
      );
      addTodosToTrash(removedTodos);

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
      const removedTodos = generalState.todos.filter(
        (todo) =>
          todo.folderId === deleteConfirmModal.folderId &&
          todo.categoryId === deleteConfirmModal.categoryId
      );
      addTodosToTrash(removedTodos);

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
      const removedTodo = generalState.todos.find(
        (todo) => todo.id === deleteConfirmModal.todoId
      );

      if (removedTodo) {
        addTodosToTrash([removedTodo]);
      }

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
  const isAddDisabled = viewMode !== "active" || !canAddTodo;
  const showAllCategories = useMemo(() => {
    if (viewMode === "trash") {
      return true;
    }

    return Boolean(selectedFolderId && !selectedCategoryId);
  }, [selectedCategoryId, selectedFolderId, viewMode]);

  const summaryStats = useMemo(() => {
    const today = new Date();
    const startOfToday = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate()
    );

    return generalState.todos.reduce(
      (acc, todo) => {
        acc.total += 1;

        if (todo.completed) {
          acc.completed += 1;
        } else {
          acc.pending += 1;

          if (todo.dueDate) {
            const dueDate = new Date(todo.dueDate);

            if (!Number.isNaN(dueDate.getTime()) && dueDate < startOfToday) {
              acc.overdue += 1;
            }
          }
        }

        return acc;
      },
      {
        total: 0,
        pending: 0,
        completed: 0,
        overdue: 0,
      }
    );
  }, [generalState.todos]);

  const {
    total: totalTodoCount,
    pending: pendingTodoCount,
    completed: completedTodoCount,
    overdue: overdueTodoCount,
  } = summaryStats;

  const activeCategoryName = selectedCategoryId
    ? categoryNameMap[selectedCategoryId] ?? null
    : null;

  let listTitle = "할 일을 선택해주세요";
  let listSubtitle = "좌측 폴더에서 보고 싶은 목록을 선택하세요.";

  if (viewMode === "active") {
    listTitle =
      activeCategoryName ?? activeFolder?.name ?? "할 일을 선택해주세요";
    listSubtitle = activeFolder
      ? [
          activeCategoryName
            ? `${activeFolder.name} · ${activeCategoryName}`
            : `${activeFolder.name} 전체`,
          `진행 중 ${activeTodosForSelection.length}개`,
          `완료 ${completedTodosForSelection.length}개`,
        ]
          .filter(Boolean)
          .join(" · ")
      : "좌측 폴더에서 보고 싶은 목록을 선택하세요.";
  } else if (viewMode === "completed") {
    listTitle = "완료된 할 일";
    const folderLabel = activeFolder?.name ?? "모든 폴더";
    const categoryLabel = activeCategoryName ? ` · ${activeCategoryName}` : "";
    listSubtitle = `${folderLabel}${categoryLabel} · 총 ${completedTodosForSelection.length}개`;
  } else if (viewMode === "trash") {
    listTitle = "휴지통";
    listSubtitle = trashTodosForSelection.length
      ? `삭제된 항목 ${trashTodosForSelection.length}개가 보관되어 있습니다.`
      : "삭제한 할 일이 여기에 모입니다.";
  }

  const canToggleCategoryView =
    viewMode === "active" && Boolean(selectedCategoryId);

  const summaryTitle = "전체 할 일 현황";
  const summarySubtitle = activeFolder
    ? `${listTitle} 기준으로 할 일을 정리하고 있어요.`
    : "폴더와 카테고리를 선택해 할 일을 정리해보세요.";

  const isDetailVisible = detailPanelOpen && selectedTodo !== null;

  return (
    <WideDefaultLayout
      pageTitle="일반 할 일"
      description="폴더와 카테고리로 정리하는 개인용 투두"
    >
      <SummaryBanner>
        <SummaryTexts>
          <SummaryTitle>{summaryTitle}</SummaryTitle>
          <SummarySubtitle>{summarySubtitle}</SummarySubtitle>
        </SummaryTexts>
        <SummaryStats>
          <SummaryStat>
            <SummaryStatLabel>전체</SummaryStatLabel>
            <SummaryStatValue>{totalTodoCount}</SummaryStatValue>
          </SummaryStat>
          <SummaryStat>
            <SummaryStatLabel>진행 중</SummaryStatLabel>
            <SummaryStatValue>{pendingTodoCount}</SummaryStatValue>
          </SummaryStat>
          <SummaryStat>
            <SummaryStatLabel>완료</SummaryStatLabel>
            <SummaryStatValue $accent="positive">
              {completedTodoCount}
            </SummaryStatValue>
          </SummaryStat>
          <SummaryStat>
            <SummaryStatLabel>마감 지난</SummaryStatLabel>
            <SummaryStatValue $accent="danger">
              {overdueTodoCount}
            </SummaryStatValue>
          </SummaryStat>
        </SummaryStats>
      </SummaryBanner>

      <Container>
        <SidebarColumn>
          <GeneralTodoSidebar
            folders={generalState.folders}
            selectedFolderId={selectedFolderId}
            selectedCategoryId={selectedCategoryId}
            viewMode={viewMode}
            onSelectFolder={handleSelectFolder}
            onSelectCategory={handleSelectCategory}
            onAddFolder={handleAddFolder}
            onFolderContextMenu={handleFolderContextMenu}
            onCategoryContextMenu={handleCategoryContextMenu}
            onReorderFolders={handleReorderFolders}
            onReorderCategories={handleReorderCategories}
            onSelectView={handleChangeViewMode}
          />
        </SidebarColumn>

        <TodoColumn>
          <ListHeader>
            <HeaderTexts>
              <HeaderTitle>{listTitle}</HeaderTitle>
              <HeaderSubtitle>{listSubtitle}</HeaderSubtitle>
            </HeaderTexts>
            <HeaderActions>
              {canToggleCategoryView ? (
                <ViewToggleGroup role="group" aria-label="카테고리 보기 전환">
                  <ViewToggleButton
                    type="button"
                    onClick={() => handleCategoryViewToggle("list")}
                    $active={currentCategoryView === "list"}
                  >
                    리스트
                  </ViewToggleButton>
                  <ViewToggleButton
                    type="button"
                    onClick={() => handleCategoryViewToggle("kanban")}
                    $active={currentCategoryView === "kanban"}
                  >
                    칸반
                  </ViewToggleButton>
                </ViewToggleGroup>
              ) : null}
              <AddTodoButton
                type="button"
                disabled={isAddDisabled}
                onClick={handleOpenTodoForm}
              >
                + 새 할 일
              </AddTodoButton>
            </HeaderActions>
          </ListHeader>
          {isKanbanView ? (
            <GeneralTodoKanban
              todos={todosForDisplay}
              onOpenDetail={handleSelectTodo}
              onTodoContextMenu={handleTodoContextMenu}
              onToggleCompletion={handleToggleTodoCompletion}
            />
          ) : (
            <GeneralTodoList
              todos={todosForDisplay}
              selectedTodoId={selectedTodoId}
              onSelectTodo={handleSelectTodo}
              showAllCategories={showAllCategories}
              categoryNameMap={categoryNameMap}
              categoryColorMap={categoryColorMap}
              onTodoContextMenu={handleTodoContextMenu}
              onToggleCompletion={
                viewMode === "trash" ? undefined : handleToggleTodoCompletion
              }
              isReadOnly={viewMode === "trash"}
              emptyMessage={
                viewMode === "completed"
                  ? "선택한 조건에 완료된 할 일이 없습니다."
                  : viewMode === "trash"
                  ? "휴지통이 비어 있습니다."
                  : undefined
              }
            />
          )}

          {viewMode === "active" &&
            !isKanbanView &&
            completedTodosForSelection.length > 0 && (
            <CollapsedCompleted>
              <CollapsedHeaderButton
                type="button"
                onClick={() => setShowCompleted((prev) => !prev)}
              >
                <span>완료 {completedTodosForSelection.length}개</span>
                <ToggleArrow>{showCompleted ? "▲" : "▼"}</ToggleArrow>
              </CollapsedHeaderButton>

              <CompletedCollapse $open={showCompleted}>
                <CompletedCollapseInner $open={showCompleted}>
                  <CollapsedList>
                    {completedTodosForSelection.map((todo) => {
                      const formattedDueDate = formatDueDateLabel(
                        todo.dueDate ?? null
                      );

                      return (
                        <CollapsedItem
                          key={todo.id}
                          type="button"
                          onClick={() => {
                            setSelectedTodoId(todo.id);
                          }}
                        >
                          <span>{todo.title}</span>
                          {formattedDueDate ? <small>{formattedDueDate}</small> : null}
                        </CollapsedItem>
                      );
                    })}
                  </CollapsedList>
                </CompletedCollapseInner>
              </CompletedCollapse>
            </CollapsedCompleted>
          )}
        </TodoColumn>

      </Container>
      <DetailDrawerScrim
        type="button"
        aria-label="상세 패널 닫기"
        $open={isDetailVisible}
        onClick={handleCloseDetailPanel}
      />
      <DetailDrawer $open={isDetailVisible} aria-hidden={!isDetailVisible}>
        <DetailDrawerInner>
          <DetailDrawerHeader>
            <DetailDrawerTitle>할 일 상세</DetailDrawerTitle>
            <CloseDrawerButton
              type="button"
              aria-label="상세 패널 닫기"
              onClick={handleCloseDetailPanel}
            >
              <FiX size={20} />
            </CloseDrawerButton>
          </DetailDrawerHeader>
          <DetailDrawerContent>
            {isDetailVisible && selectedTodo ? (
              <GeneralTodoDetail
                todo={selectedTodo}
                folders={generalState.folders}
                editTitle={detailTitle}
                editDescription={detailDescription}
                editDueDate={detailDueDate}
                editDueTime={detailDueTime}
                editCompleted={detailCompleted}
                onTitleChange={handleDetailTitleChange}
                onDescriptionChange={handleDetailDescriptionChange}
                onDueDateChange={handleDetailDueDateChange}
                onDueTimeChange={handleDetailDueTimeChange}
                onCompletedChange={handleDetailCompletedChange}
                onSave={handleDetailSave}
                isDirty={detailDirty}
                error={detailError}
                showSectionTitle={false}
              />
            ) : null}
          </DetailDrawerContent>
        </DetailDrawerInner>
      </DetailDrawer>

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
            setTodoModalDueDate("");
            setTodoModalDueTime("");
            setTodoModalDescription("");
            setTodoModalCategoryId(null);
          }}
          buttons={[
            {
              label: "취소",
              onClick: () => {
                setTodoFormModal(undefined);
                setTodoFormError(null);
                setTodoTitle("");
                setTodoModalDueDate("");
                setTodoModalDueTime("");
                setTodoModalDescription("");
                setTodoModalCategoryId(null);
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
                  onChange={(event) => {
                    const { value: nextValue } = event.target;
                    setTodoModalDueDate(nextValue);
                    if (!nextValue) {
                      setTodoModalDueTime("");
                    }
                  }}
                />
                {todoModalDueDate && (
                  <>
                    <ModalSubLabel htmlFor="general-todo-due-time">
                      마감 시간 (선택)
                    </ModalSubLabel>
                    <ModalInput
                      id="general-todo-due-time"
                      type="time"
                      value={todoModalDueTime}
                      onChange={(event) => setTodoModalDueTime(event.target.value)}
                    />
                  </>
                )}
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
            <ModalEditorContainer id="general-todo-description">
              <MarkdownEditor
                value={todoModalDescription}
                onChange={(markdown) => setTodoModalDescription(markdown)}
                height="240px"
                placeholder="추가로 기록해 둘 메모를 Markdown으로 작성해보세요"
              />
            </ModalEditorContainer>
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
            <ModalLabel as="p">카테고리 색상</ModalLabel>
            <ColorOptionGrid>
              <ColorChoice>
                <ColorSwatchButton
                  type="button"
                  aria-label="색상 없음"
                  onClick={() => setCategoryColorInput(null)}
                  $color={null}
                  $selected={!categoryColorInput}
                  $isNone
                />
                <ChoiceLabel>없음</ChoiceLabel>
              </ColorChoice>
              {CATEGORY_COLOR_PRESETS.map((color, index) => (
                <ColorChoice key={color}>
                  <ColorSwatchButton
                    type="button"
                    aria-label={`색상 ${index + 1}`}
                    onClick={() => setCategoryColorInput(color)}
                    $color={color}
                    $selected={categoryColorInput === color}
                  />
                </ColorChoice>
              ))}
              <ColorChoice>
                <ColorSwatchButton
                  type="button"
                  aria-label="사용자 지정 색상"
                  onClick={() => setCategoryColorInput(categoryCustomColor)}
                  $color={categoryCustomColor}
                  $selected={
                    !!categoryColorInput &&
                    categoryColorInput === categoryCustomColor
                  }
                />
                <ChoiceLabel>사용자 지정</ChoiceLabel>
              </ColorChoice>
            </ColorOptionGrid>
            <CustomColorRow>
              <CustomColorText>직접 선택</CustomColorText>
              <CustomColorInput
                id="general-category-color"
                type="color"
                aria-label="사용자 지정 색상 선택"
                value={categoryCustomColor}
                onChange={(event) => {
                  const next =
                    normaliseCategoryColor(event.target.value) ??
                    CATEGORY_DEFAULT_CUSTOM_COLOR;
                  setCategoryCustomColor(next);
                  setCategoryColorInput(next);
                }}
              />
            </CustomColorRow>
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

const SummaryBanner = styled.section`
  width: 100%;
  margin-bottom: 24px;
  padding: 28px 32px;
  border-radius: 20px;
  background: linear-gradient(
    135deg,
    ${({ theme }) => theme.app.palette.smokeBlue[500]},
    ${({ theme }) => theme.app.palette.lightBlue[450]}
  );
  color: #ffffff;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 32px;
  box-shadow: 0 28px 48px rgba(44, 121, 189, 0.25);

  ${({ theme }) => theme.medias.max1100} {
    flex-direction: column;
    align-items: flex-start;
    gap: 20px;
    padding: 24px 24px;
  }
`;

const SummaryTexts = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

const SummaryTitle = styled.h2`
  font-size: 22px;
  font-weight: 700;
  letter-spacing: -0.01em;
`;

const SummarySubtitle = styled.p`
  font-size: 14px;
  color: rgba(255, 255, 255, 0.88);
  letter-spacing: -0.01em;

  ${({ theme }) => theme.medias.max1100} {
    font-size: 13px;
  }
`;

const SummaryStats = styled.div`
  display: flex;
  align-items: stretch;
  justify-content: flex-end;
  gap: 16px;
  flex-wrap: wrap;

  ${({ theme }) => theme.medias.max1100} {
    justify-content: flex-start;
  }
`;

const SummaryStat = styled.div`
  min-width: 124px;
  padding: 14px 18px;
  border-radius: 14px;
  background: rgba(255, 255, 255, 0.16);
  border: 1px solid rgba(255, 255, 255, 0.24);
  display: flex;
  flex-direction: column;
  gap: 6px;
  backdrop-filter: blur(8px);
`;

const SummaryStatLabel = styled.span`
  font-size: 12px;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.78);
  letter-spacing: 0.04em;
  text-transform: uppercase;
`;

const SummaryStatValue = styled.span<{ $accent?: "danger" | "positive" }>`
  font-size: 24px;
  font-weight: 700;
  line-height: 1.1;
  color: ${({ theme, $accent }) => {
    if ($accent === "danger") {
      return theme.app.palette.red[0];
    }
    if ($accent === "positive") {
      return theme.app.palette.green[50];
    }
    return "#ffffff";
  }};
`;

const Container = styled.div`
  width: 100%;
  min-height: 70vh;
  display: grid;
  grid-template-columns: minmax(240px, 280px) minmax(0, 1fr);
  gap: 24px;
  align-items: stretch;

  ${({ theme }) => theme.medias.max1520} {
    grid-template-columns: minmax(220px, 260px) minmax(0, 1fr);
  }

  ${({ theme }) => theme.medias.max1100} {
    grid-template-columns: 1fr;
    gap: 20px;
  }
`;

const ColumnBase = styled.div`
  background: ${({ theme }) => theme.app.bg.white};
  border: 1px solid ${({ theme }) => theme.app.border};
  border-radius: 18px;
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 20px;
  box-shadow: 0 20px 40px rgba(17, 24, 39, 0.08);
  transition: box-shadow 0.3s ease;

  ${({ theme }) => theme.medias.max1100} {
    padding: 20px;
  }

  ${({ theme }) => theme.medias.max700} {
    padding: 16px;
  }
`;

const SidebarColumn = styled(ColumnBase)`
  gap: 24px;
`;

const TodoColumn = styled(ColumnBase)`
  gap: 20px;
`;

const HeaderTexts = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  flex: 1;
`;

const ListHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 18px 20px;
  border-radius: 14px;
  background: ${({ theme }) => theme.app.bg.gray1};
  border: 1px solid ${({ theme }) => theme.app.border};
  flex-wrap: wrap;

  ${({ theme }) => theme.medias.max700} {
    flex-direction: column;
    align-items: flex-start;
  }
`;

const HeaderActions = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
`;

const HeaderTitle = styled.h3`
  font-size: 18px;
  font-weight: 700;
  color: ${({ theme }) => theme.app.text.dark1};
  letter-spacing: -0.01em;
`;

const HeaderSubtitle = styled.p`
  font-size: 13px;
  color: ${({ theme }) => theme.app.text.light1};
  letter-spacing: -0.01em;
`;

const DetailDrawerScrim = styled.button<{ $open: boolean }>`
  position: fixed;
  inset: 0;
  background: rgba(15, 23, 42, 0.45);
  opacity: ${({ $open }) => ($open ? 1 : 0)};
  pointer-events: ${({ $open }) => ($open ? "auto" : "none")};
  border: none;
  padding: 0;
  margin: 0;
  transition: opacity 0.25s ease;
  z-index: 3000;
`;

const DetailDrawer = styled.aside<{ $open: boolean }>`
  position: fixed;
  top: 0;
  right: 0;
  height: 100vh;
  width: min(520px, 92vw);
  transform: translateX(${({ $open }) => ($open ? "0" : "100%")});
  transition: transform 0.28s cubic-bezier(0.33, 1, 0.68, 1);
  z-index: 3010;
  pointer-events: ${({ $open }) => ($open ? "auto" : "none")};
  display: flex;
`;

const DetailDrawerInner = styled.div`
  flex: 1;
  height: 100%;
  background: ${({ theme }) => theme.app.bg.white};
  border-left: 1px solid ${({ theme }) => theme.app.border};
  box-shadow: -24px 0 48px rgba(15, 23, 42, 0.18);
  display: flex;
  flex-direction: column;
`;

const DetailDrawerHeader = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 22px 24px 14px;
  border-bottom: 1px solid ${({ theme }) => theme.app.border};
`;

const DetailDrawerTitle = styled.h3`
  margin: 0;
  font-size: 18px;
  font-weight: 700;
  color: ${({ theme }) => theme.app.text.dark1};
`;

const CloseDrawerButton = styled.button`
  border: none;
  background: ${({ theme }) => theme.app.bg.gray1};
  color: ${({ theme }) => theme.app.text.light1};
  border-radius: 50%;
  width: 32px;
  height: 32px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background 0.2s ease, color 0.2s ease, transform 0.2s ease;

  &:hover {
    background: ${({ theme }) => theme.app.palette.smokeBlue[500]};
    color: #ffffff;
    transform: translateY(-1px);
  }
`;

const DetailDrawerContent = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 20px 24px;
  background: ${({ theme }) => theme.app.bg.gray1};

  ${({ theme }) => theme.medias.max600} {
    padding: 16px 18px 24px;
  }
`;

const ViewToggleGroup = styled.div`
  display: inline-flex;
  align-items: center;
  border-radius: 999px;
  border: 1px solid ${({ theme }) => theme.app.border};
  background: ${({ theme }) => theme.app.bg.white};
  padding: 2px;
`;

const ViewToggleButton = styled.button<{ $active: boolean }>`
  min-width: 72px;
  padding: 6px 12px;
  border-radius: 999px;
  border: none;
  font-size: 12px;
  font-weight: 600;
  background: ${({ theme, $active }) =>
    $active ? theme.app.palette.smokeBlue[500] : "transparent"};
  color: ${({ theme, $active }) =>
    $active ? "#ffffff" : theme.app.text.light1};
  cursor: pointer;
  transition: background 0.2s ease, color 0.2s ease, transform 0.2s ease;

  &:hover {
    transform: translateY(-1px);
    color: ${({ theme, $active }) =>
      $active ? "#ffffff" : theme.app.text.main};
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.app.palette.smokeBlue[500]};
    outline-offset: 2px;
  }
`;

const CollapsedCompleted = styled.div`
  padding: 14px 16px;
  border-radius: 12px;
  border: 1px dashed ${({ theme }) => theme.app.border};
  background: ${({ theme }) => theme.app.bg.gray1};
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const CollapsedHeaderButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding: 2px 0;
  border: none;
  background: transparent;
  font-size: 13px;
  font-weight: 600;
  color: ${({ theme }) => theme.app.text.light1};
  cursor: pointer;
  transition: color 0.2s ease;

  &:hover {
    color: ${({ theme }) => theme.app.text.main};
  }
`;

const ToggleArrow = styled.span`
  font-size: 12px;
`;

const CompletedCollapse = styled.div<{ $open: boolean }>`
  display: grid;
  grid-template-rows: ${({ $open }) => ($open ? "1fr" : "0fr")};
  transition: grid-template-rows 0.32s cubic-bezier(0.4, 0, 0.2, 1);
`;

const CompletedCollapseInner = styled.div<{ $open: boolean }>`
  overflow: hidden;
  opacity: ${({ $open }) => ($open ? 1 : 0)};
  transform: translateY(${({ $open }) => ($open ? "0" : "-6px")});
  transition: opacity 0.24s ease, transform 0.24s ease, padding-top 0.24s ease;
  padding-top: ${({ $open }) => ($open ? "10px" : "0")};
  pointer-events: ${({ $open }) => ($open ? "auto" : "none")};
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
  padding: 10px 14px;
  border-radius: 10px;
  border: 1px solid ${({ theme }) => theme.app.border};
  background: ${({ theme }) => theme.app.bg.white};
  color: ${({ theme }) => theme.app.text.main};
  font-size: 13px;
  cursor: pointer;
  transition: background 0.2s ease, box-shadow 0.2s ease, transform 0.2s ease;

  &:hover {
    background: ${({ theme }) => theme.app.bg.gray1};
    transform: translateY(-1px);
    box-shadow: 0 10px 18px rgba(15, 23, 42, 0.08);
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
  padding: 10px 18px;
  border-radius: 999px;
  border: none;
  background: linear-gradient(
    135deg,
    ${({ theme }) => theme.app.palette.smokeBlue[500]},
    ${({ theme }) => theme.app.palette.lightBlue[450]}
  );
  color: #ffffff;
  font-size: 15px;
  font-weight: 700;
  cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  min-width: 140px;
  box-shadow: 0 10px 24px rgba(44, 121, 189, 0.26);

  &:hover:not(:disabled) {
    transform: translateY(-1px);
    box-shadow: 0 14px 28px rgba(44, 121, 189, 0.28);
  }

  &:disabled {
    background: ${({ theme }) => theme.app.bg.gray2};
    color: ${({ theme }) => theme.app.text.light2};
    cursor: not-allowed;
    box-shadow: none;
    transform: none;
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

const ModalSubLabel = styled.label`
  font-size: 12px;
  font-weight: 500;
  color: ${({ theme }) => theme.app.text.light1};
`;

const ModalInput = styled.input`
  width: 100%;
  padding: 10px 12px;
  border-radius: 6px;
  border: 1px solid ${({ theme }) => theme.app.border};
  background: ${({ theme }) => theme.app.bg.white};
  color: ${({ theme }) => theme.app.text.main};
`;

const ColorOptionGrid = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin: 12px 0 4px;
`;

const ColorChoice = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  font-size: 11px;
  color: ${({ theme }) => theme.app.text.light1};
`;

const ColorSwatchButton = styled.button<{
  $color: string | null;
  $selected: boolean;
  $isNone?: boolean;
}>`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  border: ${({ theme, $selected, $color, $isNone }) =>
    $selected
      ? `2px solid ${theme.app.palette.smokeBlue[500]}`
      : $color && !$isNone
      ? "2px solid transparent"
      : `1px solid ${theme.app.border}`};
  background: ${({ theme, $color, $isNone }) =>
    !$color || $isNone ? theme.app.bg.white : $color};
  display: inline-flex;
  align-items: center;
  justify-content: center;
  position: relative;
  padding: 0;
  cursor: pointer;
  transition: transform 0.15s ease, box-shadow 0.15s ease, border-color 0.15s ease;
  box-shadow: ${({ $selected }) =>
    $selected ? "0 0 0 3px rgba(44, 121, 189, 0.18)" : "none"};

  &:hover {
    transform: translateY(-1px);
  }

  &::after {
    content: "";
    display: ${({ $isNone }) => ($isNone ? "block" : "none")};
    width: 14px;
    height: 2px;
    background: ${({ theme }) => theme.app.border};
    transform: rotate(45deg);
  }
`;

const ChoiceLabel = styled.span`
  color: inherit;
`;

const CustomColorRow = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 4px;
`;

const CustomColorText = styled.span`
  font-size: 12px;
  color: ${({ theme }) => theme.app.text.light1};
`;

const CustomColorInput = styled.input`
  width: 44px;
  height: 28px;
  border: 1px solid ${({ theme }) => theme.app.border};
  border-radius: 6px;
  background: ${({ theme }) => theme.app.bg.white};
  padding: 0;
  cursor: pointer;
`;

const CategorySelect = styled.select`
  width: 100%;
  padding: 10px 12px;
  border-radius: 6px;
  border: 1px solid ${({ theme }) => theme.app.border};
  background: ${({ theme }) => theme.app.bg.white};
  color: ${({ theme }) => theme.app.text.main};
`;

const ModalEditorContainer = styled.div`
  .tiptap-editor-root {
    border: 1px solid ${({ theme }) => theme.app.border};
    border-radius: 8px;
    background: ${({ theme }) => theme.app.bg.white};
  }
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
