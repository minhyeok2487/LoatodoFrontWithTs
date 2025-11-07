import { arrayMove } from "@dnd-kit/sortable";
import { FiX } from "@react-icons/all-files/fi/FiX";
import { useCallback, useEffect, useMemo, useState } from "react";
import type { FormEvent, MouseEvent } from "react";
import { useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
import styled from "styled-components";

import WideDefaultLayout from "@layouts/WideDefaultLayout";

import {
  createGeneralTodoCategory,
  createGeneralTodoFolder,
  createGeneralTodoItem,
  deleteGeneralTodoCategory,
  deleteGeneralTodoFolder,
  deleteGeneralTodoItem,
  getGeneralTodoOverview,
  reorderGeneralTodoCategories,
  reorderGeneralTodoFolders,
  createGeneralTodoStatus,
  updateGeneralTodoStatus,
  deleteGeneralTodoStatus,
  reorderGeneralTodoStatuses,
  updateGeneralTodoCategory,
  updateGeneralTodoFolder,
  updateGeneralTodoItem,
} from "@core/apis/generalTodo.api";
import useModalState from "@core/hooks/useModalState";
import type {
  GeneralTodoCategoryResponse,
  GeneralTodoFolderResponse,
  GeneralTodoItemResponse,
  GeneralTodoOverviewResponse,
  GeneralTodoStatusResponse,
  GeneralTodoCategoryViewMode as ApiCategoryViewMode,
  UpdateGeneralTodoItemRequest,
} from "@core/types/generalTodo";

import Modal from "@components/Modal";

import GeneralTodoDetail from "./components/GeneralTodoDetail";
import GeneralTodoKanban from "./components/GeneralTodoKanban";
import GeneralTodoList from "./components/GeneralTodoList";
import GeneralTodoSidebar from "./components/GeneralTodoSidebar";
import MarkdownEditor from "./components/MarkdownEditor";
import GeneralTodoStatusManager from "./components/GeneralTodoStatusManager";
import type {
  GeneralTodoCategory,
  GeneralTodoFolder,
  GeneralTodoItem,
  GeneralTodoState,
  GeneralTodoStatus,
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

const toUiViewMode = (mode?: ApiCategoryViewMode | null): CategoryViewMode =>
  mode === "KANBAN" ? "kanban" : "list";

const toApiViewMode = (mode?: CategoryViewMode | null): ApiCategoryViewMode =>
  mode === "kanban" ? "KANBAN" : "LIST";

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

const mapStatusResponse = (
  status: GeneralTodoStatusResponse
): GeneralTodoStatus => ({
  id: String(status.id),
  categoryId: String(status.categoryId),
  name: status.name,
  sortOrder: status.sortOrder,
  isDone: status.type === "DONE",
  isVirtual: false,
});

const mapCategoryResponse = (
  category: GeneralTodoCategoryResponse,
  statuses: GeneralTodoStatusResponse[]
): GeneralTodoCategory => {
  const relatedStatuses = statuses
    .filter((status) => status.categoryId === category.id)
    .sort((a, b) => a.sortOrder - b.sortOrder)
    .map(mapStatusResponse);

  return {
    id: String(category.id),
    name: category.name,
    color: normaliseCategoryColor(category.color),
    viewMode: toUiViewMode(category.viewMode),
    sortOrder: category.sortOrder,
    statuses: relatedStatuses,
  };
};

const mapFolderResponse = (
  folder: GeneralTodoFolderResponse,
  categories: GeneralTodoCategoryResponse[],
  statuses: GeneralTodoStatusResponse[]
): GeneralTodoFolder => {
  const relatedCategories = categories
    .filter((category) => category.folderId === folder.id)
    .sort((a, b) => a.sortOrder - b.sortOrder)
    .map((category) => mapCategoryResponse(category, statuses));

  return {
    id: String(folder.id),
    name: folder.name,
    sortOrder: folder.sortOrder,
    categories: relatedCategories,
  };
};

const mapItemResponse = (item: GeneralTodoItemResponse): GeneralTodoItem => ({
  id: item.id,
  title: item.title,
  description: typeof item.description === "string" ? item.description : "",
  folderId: String(item.folderId),
  categoryId: String(item.categoryId),
  dueDate: item.dueDate ?? null,
  completed: Boolean(item.completed),
  statusId: item.statusId !== null ? String(item.statusId) : null,
  createdAt: item.createdAt,
  updatedAt: item.updatedAt,
});

const buildStateFromOverview = (
  overview: GeneralTodoOverviewResponse
): GeneralTodoState => {
  const folders = overview.folders
    .slice()
    .sort((a, b) => a.sortOrder - b.sortOrder)
    .map((folder) =>
      mapFolderResponse(folder, overview.categories, overview.statuses)
    );

  const todos = overview.todos.map(mapItemResponse);
  const statuses = overview.statuses
    .slice()
    .sort((a, b) => a.sortOrder - b.sortOrder)
    .map(mapStatusResponse);

  return {
    folders,
    todos,
    statuses,
  };
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
  initialViewMode?: CategoryViewMode;
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

type StatusManagerModalPayload = {
  categoryId: string;
};

const DEFAULT_PROGRESS_STATUS_NAME = "진행 중";
const DEFAULT_DONE_STATUS_NAME = "완료";
const DONE_STATUS_ID_PREFIX = "__done:";
const getDoneStatusIdForCategory = (categoryId: string) =>
  `${DONE_STATUS_ID_PREFIX}${categoryId}`;

const combineDateAndTime = (date: string, time: string) => {
  if (!date) {
    return "";
  }

  if (!time) {
    return `${date}T00:00`;
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
  const timeValue = normalizedTime === "00:00" ? "" : normalizedTime;

  return {
    date: datePart,
    time: timeValue,
  };
};

const formatDueDateLabel = (value: string | null) => {
  if (!value) {
    return null;
  }

  const [datePart, timePartRaw = ""] = value.split("T");
  const normalizedTime = timePartRaw.slice(0, 5);
  const hasTime = normalizedTime.length > 0 && normalizedTime !== "00:00";
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

const GeneralTodoIndex = (): JSX.Element => {
  const [generalState, setGeneralState] = useState<GeneralTodoState>({
    folders: [],
    todos: [],
    statuses: [],
  });
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [searchParams, setSearchParams] = useSearchParams();

  const initialFolderId = searchParams.get("folder");
  const initialCategoryId = searchParams.get("category");
  const initialTodoParam = searchParams.get("todo");
  const initialTodoId = initialTodoParam
    ? Number.isNaN(Number(initialTodoParam))
      ? null
      : Number(initialTodoParam)
    : null;

  const [selectedFolderId, setSelectedFolderId] = useState<string | null>(
    initialFolderId ?? null
  );
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(
    initialCategoryId ?? null
  );
  const [selectedTodoId, setSelectedTodoId] = useState<number | null>(
    initialTodoId
  );
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
  const [categoryFormError, setCategoryFormError] = useState<string | null>(
    null
  );
  const [categoryColorInput, setCategoryColorInput] = useState<string | null>(
    null
  );
  const [categoryCustomColor, setCategoryCustomColor] = useState<string>(
    CATEGORY_DEFAULT_CUSTOM_COLOR
  );
  const [categoryViewModeInput, setCategoryViewModeInput] =
    useState<CategoryViewMode>("list");
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
  const [detailStatusId, setDetailStatusId] = useState<string | null>(null);
  const [detailCompleted, setDetailCompleted] = useState<boolean>(false);
  const [detailDirty, setDetailDirty] = useState<boolean>(false);
  const [detailError, setDetailError] = useState<string | null>(null);
  const [statusManagerModal, setStatusManagerModal] =
    useModalState<StatusManagerModalPayload>();
  const [statusManagerLoading, setStatusManagerLoading] =
    useState<boolean>(false);
  const [statusManagerError, setStatusManagerError] = useState<string | null>(
    null
  );
  const [showCompleted, setShowCompleted] = useState<boolean>(false);
  const [viewMode, setViewMode] = useState<
    "active" | "all" | "completed" | "trash"
  >(
    () => {
      const viewParam = searchParams.get("view");

      return viewParam === "completed" || viewParam === "trash" || viewParam === "all"
        ? (viewParam as "completed" | "trash" | "all")
        : "active";
    }
  );
  const [trashTodos, setTrashTodos] = useState<GeneralTodoItem[]>([]);
  const [detailPanelOpen, setDetailPanelOpen] = useState<boolean>(false);
  const isInitialLoading =
    isLoading &&
    generalState.folders.length === 0 &&
    generalState.todos.length === 0;

  const fetchGeneralTodos = useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await getGeneralTodoOverview();
      setGeneralState(buildStateFromOverview(data));
    } catch (error) {
      toast.error("일반 할 일 데이터를 불러오지 못했습니다.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchGeneralTodos();
  }, [fetchGeneralTodos]);

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
        const parsedTodo = Number.isNaN(rawTodoNumber) ? null : rawTodoNumber;

        setSelectedTodoId((prev) => (prev === parsedTodo ? prev : parsedTodo));
      }
    }

    if (searchParams.has("view")) {
      const viewParam = searchParams.get("view");
      const normalizedView =
        viewParam === "completed" ||
        viewParam === "trash" ||
        viewParam === "all"
          ? (viewParam as "completed" | "trash" | "all")
          : "active";

      setViewMode((prev) => (prev === normalizedView ? prev : normalizedView));
    }
  }, [searchParams]);

  useEffect(() => {
    const next = new URLSearchParams(searchParams);

    const syncParam = (key: string, value: string | null) => {
      if (value) {
        if (next.get(key) !== value) {
          next.set(key, value);
        }
      } else if (next.has(key)) {
        next.delete(key);
      }
    };

    syncParam("folder", selectedFolderId);
    syncParam("category", selectedCategoryId);
    syncParam("todo", selectedTodoId !== null ? String(selectedTodoId) : null);

    const viewParamValue = viewMode !== "active" ? viewMode : null;
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
      setCategoryViewModeInput("list");
      return;
    }

    setCategoryNameInput(categoryFormModal.initialName ?? "");
    setCategoryFormError(null);
    const initialColor = normaliseCategoryColor(
      categoryFormModal.initialColor ?? null
    );
    setCategoryColorInput(initialColor);
    setCategoryCustomColor(initialColor ?? CATEGORY_DEFAULT_CUSTOM_COLOR);
    setCategoryViewModeInput(
      categoryFormModal.initialViewMode ?? "list"
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
    if (isLoading) {
      return;
    }

    if (viewMode === "all") {
      if (selectedFolderId !== null) {
        setSelectedFolderId(null);
      }
      if (selectedCategoryId !== null) {
        setSelectedCategoryId(null);
      }
      return;
    }

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
      !generalState.folders.some((folder) => folder.id === selectedFolderId)
    ) {
      setSelectedFolderId(generalState.folders[0].id);
    }
  }, [
    generalState.folders,
    selectedFolderId,
    selectedCategoryId,
    isLoading,
    viewMode,
  ]);

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
    if (isLoading) {
      return;
    }

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
  }, [activeFolder, selectedCategoryId, isLoading]);

  useEffect(() => {
    if (isLoading) {
      return;
    }

    setSelectedTodoId((prev) => {
      if (prev === null) {
        return null;
      }

      const todoExists = generalState.todos.some((todo) => {
        if (todo.id !== prev) {
          return false;
        }

        if (viewMode === "all") {
          return true;
        }

        if (todo.folderId !== selectedFolderId) {
          return false;
        }

        if (!selectedCategoryId) {
          return true;
        }

        return todo.categoryId === selectedCategoryId;
      });

      return todoExists ? prev : null;
    });
  }, [
    generalState.todos,
    selectedFolderId,
    selectedCategoryId,
    viewMode,
    isLoading,
  ]);

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

  const completedTodosGlobal = useMemo(
    () => generalState.todos.filter((todo) => todo.completed),
    [generalState.todos]
  );

  const allTodosForSelection = useMemo(
    () => generalState.todos.filter((todo) => !todo.completed),
    [generalState.todos]
  );

  const trashTodosForSelection = useMemo(() => trashTodos, [trashTodos]);

  const todosForDisplay = useMemo(() => {
    if (viewMode === "completed") {
      return completedTodosGlobal;
    }

    if (viewMode === "trash") {
      return trashTodosForSelection;
    }

    if (viewMode === "all") {
      return allTodosForSelection;
    }

    return activeTodosForSelection;
  }, [
    viewMode,
    activeTodosForSelection,
    completedTodosGlobal,
    allTodosForSelection,
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
    setDetailStatusId(null);
    setDetailCompleted(false);
    setDetailDirty(false);
    setDetailError(null);
  }, []);

  const categoryViewMap = useMemo(() => {
    const map: Record<string, CategoryViewMode> = {};

    generalState.folders.forEach((folder) => {
      folder.categories.forEach((category) => {
        map[category.id] = category.viewMode === "kanban" ? "kanban" : "list";
      });
    });

    return map;
  }, [generalState.folders]);

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

  const categoryStatusMap = useMemo(() => {
    const map: Record<string, GeneralTodoStatus[]> = {};

    generalState.statuses.forEach((status) => {
      const list = map[status.categoryId] ?? [];
      list.push(status);
      map[status.categoryId] = list;
    });

    Object.keys(map).forEach((categoryId) => {
      map[categoryId] = map[categoryId].slice().sort((a, b) => a.sortOrder - b.sortOrder);
    });

    return map;
  }, [generalState.statuses]);

  const statusById = useMemo(() => {
    const map: Record<string, GeneralTodoStatus> = {};

    generalState.statuses.forEach((status) => {
      map[status.id] = status;
    });

    generalState.folders.forEach((folder) => {
      folder.categories.forEach((category) => {
        const doneId = getDoneStatusIdForCategory(category.id);
        if (!map[doneId]) {
          map[doneId] = {
            id: doneId,
            categoryId: category.id,
            name: DEFAULT_DONE_STATUS_NAME,
            sortOrder: Number.MAX_SAFE_INTEGER,
            isDone: true,
            isVirtual: true,
          };
        }
      });
    });

    return map;
  }, [generalState.statuses, generalState.folders]);

  const doneStatusIdByCategory = useMemo(() => {
    const map: Record<string, string> = {};

    generalState.folders.forEach((folder) => {
      folder.categories.forEach((category) => {
        const statuses = categoryStatusMap[category.id] ?? [];
        const doneStatus = statuses.find((status) => status.isDone);
        map[category.id] = doneStatus?.id ?? getDoneStatusIdForCategory(category.id);
      });
    });

    return map;
  }, [generalState.folders, categoryStatusMap]);

  const defaultStatusIdByCategory = useMemo(() => {
    const map: Record<string, string | null> = {};

    generalState.folders.forEach((folder) => {
      folder.categories.forEach((category) => {
        const statuses = categoryStatusMap[category.id] ?? [];
        const firstActive = statuses.find((status) => !status.isDone);
        map[category.id] = firstActive ? firstActive.id : null;
      });
    });

    return map;
  }, [generalState.folders, categoryStatusMap]);

  const getFallbackStatusId = useCallback(
    (categoryId: string, completed: boolean) => {
      if (completed) {
        return doneStatusIdByCategory[categoryId] ?? getDoneStatusIdForCategory(categoryId);
      }

      return defaultStatusIdByCategory[categoryId] ?? null;
    },
    [doneStatusIdByCategory, defaultStatusIdByCategory]
  );

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
    const fallbackStatusId = getFallbackStatusId(
      selectedTodo.categoryId,
      Boolean(selectedTodo.completed)
    );
    const statusIdForDetail = selectedTodo.statusId
      ?? (!selectedTodo.completed ? fallbackStatusId : null);
    setDetailStatusId(statusIdForDetail);
    setDetailCompleted(Boolean(selectedTodo.completed));
    setDetailDirty(false);
    setDetailError(null);
  }, [
    selectedTodo,
    resetDetailState,
    getFallbackStatusId,
  ]);


  const currentCategoryView: CategoryViewMode =
    selectedCategoryId && viewMode === "active"
      ? categoryViewMap[selectedCategoryId] ?? "list"
      : "list";

  const isKanbanView =
    viewMode === "active" &&
    Boolean(selectedCategoryId) &&
    currentCategoryView === "kanban";

  const kanbanTodos = useMemo(() => {
    if (!isKanbanView || !selectedFolderId || !selectedCategoryId) {
      return [] as GeneralTodoItem[];
    }

    return generalState.todos.filter(
      (todo) =>
        todo.folderId === selectedFolderId &&
        todo.categoryId === selectedCategoryId
    );
  }, [generalState.todos, isKanbanView, selectedFolderId, selectedCategoryId]);

  const kanbanStatuses = useMemo(() => {
    if (!isKanbanView || !selectedCategoryId) {
      return [] as GeneralTodoStatus[];
    }

    return categoryStatusMap[selectedCategoryId] ?? [];
  }, [isKanbanView, selectedCategoryId, categoryStatusMap]);

  const kanbanDoneStatusId = useMemo(() => {
    if (!isKanbanView || !selectedCategoryId) {
      return null;
    }

    return (
      doneStatusIdByCategory[selectedCategoryId] ??
      getDoneStatusIdForCategory(selectedCategoryId)
    );
  }, [isKanbanView, selectedCategoryId, doneStatusIdByCategory]);

  useEffect(() => {
    if (selectedTodoId === null) {
      setDetailPanelOpen(false);
    }
  }, [selectedTodoId]);

  useEffect(() => {
    if (viewMode !== "active" && viewMode !== "all") {
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

  const handleAddTodo = async (event?: FormEvent<HTMLFormElement>) => {
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

    const folderNumericId = Number(selectedFolderId);
    const categoryNumericId = Number(todoModalCategoryId);

    if (Number.isNaN(folderNumericId) || Number.isNaN(categoryNumericId)) {
      toast.error("할 일 정보를 확인할 수 없습니다.");
      return;
    }

    const dueDateValue = combineDateAndTime(todoModalDueDate, todoModalDueTime);
    const defaultStatusId = getFallbackStatusId(todoModalCategoryId, false);
    const statusNumericId =
      defaultStatusId !== null ? Number(defaultStatusId) : undefined;

    if (
      defaultStatusId !== null &&
      (statusNumericId === undefined || Number.isNaN(statusNumericId))
    ) {
      toast.error("상태 정보를 확인할 수 없습니다.");
      return;
    }

    try {
      const created = await createGeneralTodoItem({
        title: trimmedTitle,
        description: todoModalDescription,
        folderId: folderNumericId,
        categoryId: categoryNumericId,
        dueDate: dueDateValue || null,
        statusId: statusNumericId ?? null,
        completed: false,
      });

      const newTodo = mapItemResponse(created);

      setGeneralState((prev) => ({
        ...prev,
        todos: [...prev.todos, newTodo],
      }));
      setTodoTitle("");
      setTodoFormError(null);
      setSelectedCategoryId(newTodo.categoryId);
      setTodoModalCategoryId(null);
      setTodoModalDueDate("");
      setTodoModalDueTime("");
      setTodoModalDescription("");
      setTodoFormModal(undefined);
    } catch (error) {
      toast.error("할 일 추가에 실패했습니다.");
    }
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

  const handleCategoryViewToggle = useCallback(
    async (mode: CategoryViewMode, targetCategoryId?: string) => {
      const categoryId = targetCategoryId ?? selectedCategoryId;

      if (!categoryId) {
        return;
      }

      const numericCategoryId = Number(categoryId);

      if (Number.isNaN(numericCategoryId)) {
        toast.error("카테고리 정보를 확인할 수 없습니다.");
        return;
      }

      try {
        const updatedCategory = await updateGeneralTodoCategory(
          numericCategoryId,
          { viewMode: toApiViewMode(mode) }
        );

        setGeneralState((prev) => ({
          ...prev,
          folders: prev.folders.map((folder) => {
            if (folder.id !== String(updatedCategory.folderId)) {
              return folder;
            }

            return {
              ...folder,
              categories: folder.categories.map((category) =>
                category.id === String(updatedCategory.id)
                  ? {
                      ...category,
                      name: updatedCategory.name,
                      color: normaliseCategoryColor(updatedCategory.color),
                      viewMode: toUiViewMode(updatedCategory.viewMode),
                    }
                  : category
              ),
            };
          }),
        }));

        if (targetCategoryId && selectedCategoryId !== targetCategoryId) {
          setSelectedCategoryId(targetCategoryId);
        }

        if (mode === "kanban") {
          setSelectedTodoId(null);
          setDetailPanelOpen(false);
        }
      } catch (error) {
        toast.error("카테고리 보기 모드 변경에 실패했습니다.");
      }
    },
    [generalState.folders, selectedCategoryId]
  );

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
      initialViewMode: "list",
    });
  };

  const handleChangeViewMode = useCallback(
    (mode: "all" | "completed" | "trash") => {
      const nextMode = viewMode === mode ? "active" : mode;

      setViewMode(nextMode);

      if (nextMode === "trash") {
        setSelectedCategoryId(null);
        setSelectedTodoId(null);
      } else if (nextMode === "completed") {
        setSelectedTodoId(null);
      } else if (nextMode === "all") {
        setSelectedFolderId(null);
        setSelectedCategoryId(null);
        setSelectedTodoId(null);
      } else if (!selectedFolderId && generalState.folders.length > 0) {
        setSelectedFolderId(generalState.folders[0].id);
      }
    },
    [generalState.folders, selectedFolderId, viewMode]
  );

  const handleReorderFolders = useCallback(
    async (oldIndex: number, newIndex: number) => {
      if (
        oldIndex === newIndex ||
        oldIndex < 0 ||
        newIndex < 0 ||
        oldIndex >= generalState.folders.length ||
        newIndex >= generalState.folders.length
      ) {
        return;
      }

      const nextFolders = arrayMove(generalState.folders, oldIndex, newIndex);

      setGeneralState((prev) => ({
        ...prev,
        folders: nextFolders,
      }));

      const folderIds = nextFolders.map((folder) => Number(folder.id));

      if (folderIds.some((id) => Number.isNaN(id))) {
        toast.error("폴더 정보를 확인할 수 없습니다.");
        await fetchGeneralTodos();
        return;
      }

      try {
        await reorderGeneralTodoFolders({ folderIds });
      } catch (error) {
        toast.error("폴더 순서 변경에 실패했습니다.");
        await fetchGeneralTodos();
      }
    },
    [generalState.folders, fetchGeneralTodos]
  );

  const handleReorderCategories = useCallback(
    async (folderId: string, oldIndex: number, newIndex: number) => {
      const targetFolder = generalState.folders.find(
        (folder) => folder.id === folderId
      );

      if (!targetFolder) {
        return;
      }

      const { categories } = targetFolder;

      if (
        oldIndex === newIndex ||
        oldIndex < 0 ||
        newIndex < 0 ||
        oldIndex >= categories.length ||
        newIndex >= categories.length
      ) {
        return;
      }

      const nextCategories = arrayMove(categories, oldIndex, newIndex);

      setGeneralState((prev) => ({
        ...prev,
        folders: prev.folders.map((folder) =>
          folder.id === folderId
            ? {
                ...folder,
                categories: nextCategories,
              }
            : folder
        ),
      }));

      const folderNumericId = Number(folderId);

      if (Number.isNaN(folderNumericId)) {
        toast.error("카테고리 정보를 확인할 수 없습니다.");
        await fetchGeneralTodos();
        return;
      }

      const categoryIds = nextCategories.map((category) => Number(category.id));

      if (categoryIds.some((id) => Number.isNaN(id))) {
        toast.error("카테고리 정보를 확인할 수 없습니다.");
        await fetchGeneralTodos();
        return;
      }

      try {
        await reorderGeneralTodoCategories(folderNumericId, { categoryIds });
      } catch (error) {
        toast.error("카테고리 순서 변경에 실패했습니다.");
        await fetchGeneralTodos();
      }
    },
    [generalState.folders, fetchGeneralTodos]
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

  const handleDetailStatusChange = (statusId: string) => {
    setDetailStatusId(statusId);
    const status = statusById[statusId];
    if (status) {
      setDetailCompleted(status.isDone);
    }
    setDetailDirty(true);
    setDetailError(null);
    if (selectedTodoId !== null) {
      handleChangeTodoStatus(selectedTodoId, statusId);
    }
  };

  const handleDetailCompletedChange = (value: boolean) => {
    setDetailCompleted(value);
    setDetailDirty(true);
    setDetailError(null);

    if (!selectedTodo) {
      return;
    }

    const nextStatusId = getFallbackStatusId(selectedTodo.categoryId, value);

    if (nextStatusId) {
      setDetailStatusId(value ? null : nextStatusId);
      if (selectedTodoId !== null) {
        handleChangeTodoStatus(selectedTodoId, nextStatusId);
      }
      return;
    }

    if (selectedTodoId !== null) {
      handleToggleTodoCompletion(selectedTodoId, value);
    }
  };

  const handleDetailSave = async () => {
    if (!selectedTodoId) {
      return;
    }

    const trimmedTitle = detailTitle.trim();

    if (!trimmedTitle) {
      setDetailError("제목을 입력해주세요.");
      return;
    }

    const dueDateValue = combineDateAndTime(detailDueDate, detailDueTime);
    const statusNumericId =
      detailStatusId !== null ? Number(detailStatusId) : undefined;

    if (
      detailStatusId !== null &&
      (statusNumericId === undefined || Number.isNaN(statusNumericId))
    ) {
      setDetailError("상태 정보를 확인할 수 없습니다.");
      return;
    }

    const statusForSave =
      detailStatusId !== null ? statusById[detailStatusId] ?? null : null;
    const completedForSave =
      statusForSave?.isDone ?? Boolean(detailCompleted);

    try {
      const updated = await updateGeneralTodoItem(selectedTodoId, {
        title: trimmedTitle,
        description: detailDescription,
        dueDate: dueDateValue || null,
        completed: completedForSave,
        statusId: statusNumericId ?? null,
      });

      const nextTodo = mapItemResponse(updated);

      setGeneralState((prev) => ({
        ...prev,
        todos: prev.todos.map((todo) =>
          todo.id === nextTodo.id ? nextTodo : todo
        ),
      }));

      setDetailTitle(nextTodo.title);
      setDetailDescription(nextTodo.description ?? "");
      const { date, time } = splitDateAndTime(nextTodo.dueDate ?? "");
      setDetailDueDate(date);
      setDetailDueTime(time);
      const resolvedStatusId =
        nextTodo.statusId ??
        (!nextTodo.completed
          ? getFallbackStatusId(nextTodo.categoryId, false)
          : null);
      setDetailStatusId(resolvedStatusId);
      setDetailCompleted(Boolean(nextTodo.completed));
      setDetailDirty(false);
      setDetailError(null);
      toast.success("할 일 정보가 저장되었습니다.");
    } catch (error) {
      toast.error("할 일 저장에 실패했습니다.");
      setDetailError("저장에 실패했습니다. 다시 시도해주세요.");
    }
  };

  const handleChangeTodoStatus = async (
    todoId: number,
    nextStatusId: string | null
  ) => {
    const currentTodo =
      generalState.todos.find((todo) => todo.id === todoId) ?? null;

    if (!currentTodo) {
      toast.error("할 일 정보를 찾을 수 없습니다.");
      return;
    }

    const nextStatus = nextStatusId ? statusById[nextStatusId] ?? null : null;
    const isVirtualDoneStatus = Boolean(nextStatus?.isDone && nextStatus?.isVirtual);
    const statusNumericId =
      nextStatusId !== null && !isVirtualDoneStatus
        ? Number(nextStatusId)
        : undefined;

    if (
      nextStatusId !== null &&
      !isVirtualDoneStatus &&
      (Number.isNaN(statusNumericId) || statusNumericId === undefined)
    ) {
      toast.error("상태 정보를 확인할 수 없습니다.");
      return;
    }

    const nextCompleted =
      nextStatus?.isDone ?? (isVirtualDoneStatus ? true : Boolean(currentTodo.completed));

    setGeneralState((prev) => ({
      ...prev,
      todos: prev.todos.map((todo) =>
        todo.id === todoId
          ? {
              ...todo,
              statusId: isVirtualDoneStatus ? null : nextStatusId,
              completed: nextCompleted,
            }
          : todo
      ),
    }));

    if (selectedTodoId === todoId) {
      setDetailStatusId(isVirtualDoneStatus ? null : nextStatusId);
      setDetailCompleted(nextCompleted);
    }

    try {
      const payload: UpdateGeneralTodoItemRequest = {
        statusId: statusNumericId ?? null,
        completed: nextCompleted,
      };

      const updated = await updateGeneralTodoItem(todoId, payload);
      const nextTodo = mapItemResponse(updated);

      setGeneralState((prev) => ({
        ...prev,
        todos: prev.todos.map((todo) =>
          todo.id === nextTodo.id ? nextTodo : todo
        ),
      }));

      if (selectedTodoId === todoId) {
        const resolvedStatusId = nextTodo.statusId
          ?? (!nextTodo.completed
            ? getFallbackStatusId(nextTodo.categoryId, false)
            : null);
        setDetailStatusId(resolvedStatusId);
        setDetailCompleted(Boolean(nextTodo.completed));
      }
    } catch (error) {
      toast.error("상태를 변경하지 못했습니다.");
      await fetchGeneralTodos();
    }
  };

  const handleToggleTodoCompletion = async (
    todoId: number,
    completed: boolean
  ) => {
    const targetTodo =
      generalState.todos.find((todo) => todo.id === todoId) ?? null;

    if (!targetTodo) {
      toast.error("할 일 정보를 찾을 수 없습니다.");
      return;
    }

    const statuses = categoryStatusMap[targetTodo.categoryId] ?? [];

    if (statuses.length > 0) {
      const targetStatusId = getFallbackStatusId(
        targetTodo.categoryId,
        completed
      );

      if (!targetStatusId) {
        toast.error("완료 상태를 변경할 수 없습니다.");
        return;
      }

      await handleChangeTodoStatus(todoId, targetStatusId);
      return;
    }

    try {
      const updated = await updateGeneralTodoItem(todoId, { completed });
      const nextTodo = mapItemResponse(updated);

      setGeneralState((prev) => ({
        ...prev,
        todos: prev.todos.map((todo) =>
          todo.id === nextTodo.id ? nextTodo : todo
        ),
      }));

      if (selectedTodoId === todoId) {
        setDetailCompleted(Boolean(nextTodo.completed));
      }
    } catch (error) {
      toast.error("완료 상태를 변경하지 못했습니다.");
    }
  };

  const applyStatusUpdate = (
    categoryId: string,
    nextCategoryStatuses: GeneralTodoStatus[],
    options?: { deletedStatusId?: string }
  ) => {
    const sortedStatuses = nextCategoryStatuses
      .slice()
      .sort((a, b) => a.sortOrder - b.sortOrder);

    const doneStatus =
      sortedStatuses.find((status) => status.isDone) ?? null;
    const defaultStatus =
      sortedStatuses.find((status) => !status.isDone) ?? null;

    setGeneralState((prev) => {
      const updatedTodos =
        options?.deletedStatusId !== undefined
          ? prev.todos.map((todo) => {
              if (
                todo.categoryId !== categoryId ||
                todo.statusId !== options.deletedStatusId
              ) {
                return todo;
              }

              const fallbackStatusId = todo.completed
                ? doneStatus?.id ?? defaultStatus?.id ?? null
                : defaultStatus?.id ?? doneStatus?.id ?? null;
              const fallbackStatus = fallbackStatusId
                ? sortedStatuses.find(
                    (status) => status.id === fallbackStatusId
                  ) ?? null
                : null;

              return {
                ...todo,
                statusId: fallbackStatusId,
                completed: fallbackStatus
                  ? fallbackStatus.isDone
                  : Boolean(todo.completed && fallbackStatusId !== null),
              };
            })
          : prev.todos;

      const mergedStatuses = [
        ...prev.statuses.filter(
          (status) => status.categoryId !== categoryId
        ),
        ...sortedStatuses,
      ];

      return {
        ...prev,
        statuses: mergedStatuses,
        folders: prev.folders.map((folder) => ({
          ...folder,
          categories: folder.categories.map((category) =>
            category.id === categoryId
              ? {
                  ...category,
                  statuses: sortedStatuses,
                }
              : category
          ),
        })),
        todos: updatedTodos,
      };
    });
  };

  const handleOpenStatusManager = () => {
    if (!selectedCategoryId) {
      toast.error("상태를 관리할 카테고리를 먼저 선택해주세요.");
      return;
    }

    setStatusManagerModal({ categoryId: selectedCategoryId });
    setStatusManagerError(null);
  };

  const handleCloseStatusManager = () => {
    setStatusManagerModal(undefined);
    setStatusManagerError(null);
  };

  const handleCreateStatus = async (categoryId: string, name: string) => {
    const trimmed = name.trim();

    if (!trimmed) {
      setStatusManagerError("상태 이름을 입력해주세요.");
      return;
    }

    const numericCategoryId = Number(categoryId);

    if (Number.isNaN(numericCategoryId)) {
      toast.error("카테고리 정보를 확인할 수 없습니다.");
      return;
    }

    try {
      setStatusManagerLoading(true);
      const created = await createGeneralTodoStatus(numericCategoryId, {
        name: trimmed,
      });
      const mapped = mapStatusResponse(created);
      const current = categoryStatusMap[categoryId] ?? [];
      applyStatusUpdate(categoryId, [...current, mapped]);
      setStatusManagerError(null);
      toast.success("상태가 추가되었습니다.");
    } catch (error) {
      toast.error("상태를 추가하지 못했습니다.");
      setStatusManagerError("상태를 추가하지 못했습니다. 다시 시도해주세요.");
    } finally {
      setStatusManagerLoading(false);
    }
  };

  const handleRenameStatus = async (statusId: string, name: string) => {
    const trimmed = name.trim();

    if (!trimmed) {
      setStatusManagerError("상태 이름을 입력해주세요.");
      return;
    }

    const target = generalState.statuses.find((status) => status.id === statusId);

    if (!target) {
      toast.error("상태 정보를 찾을 수 없습니다.");
      return;
    }

    if (target.isDone) {
      toast.error("완료 상태는 변경할 수 없습니다.");
      return;
    }

    const numericStatusId = Number(statusId);

    if (Number.isNaN(numericStatusId)) {
      toast.error("상태 정보를 확인할 수 없습니다.");
      return;
    }

    try {
      setStatusManagerLoading(true);
      const updated = await updateGeneralTodoStatus(numericStatusId, {
        name: trimmed,
      });
      const mapped = mapStatusResponse(updated);
      const nextStatuses = (categoryStatusMap[mapped.categoryId] ?? []).map(
        (status) => (status.id === mapped.id ? mapped : status)
      );
      applyStatusUpdate(mapped.categoryId, nextStatuses);
      setStatusManagerError(null);
      toast.success("상태 이름을 변경했습니다.");
    } catch (error) {
      toast.error("상태 이름을 변경하지 못했습니다.");
      setStatusManagerError("상태 이름을 변경하지 못했습니다. 다시 시도해주세요.");
      await fetchGeneralTodos();
    } finally {
      setStatusManagerLoading(false);
    }
  };

  const handleDeleteStatus = async (statusId: string) => {
    const target = generalState.statuses.find((status) => status.id === statusId);

    if (!target) {
      toast.error("상태 정보를 찾을 수 없습니다.");
      return;
    }

    if (target.isDone) {
      toast.error("완료 상태는 삭제할 수 없습니다.");
      return;
    }

    const categoryStatuses =
      categoryStatusMap[target.categoryId] ?? [];
    const progressStatuses = categoryStatuses.filter((status) => !status.isDone);

    if (progressStatuses.length <= 1) {
      toast.error("진행 상태는 최소 1개 이상 유지되어야 합니다.");
      return;
    }

    const numericStatusId = Number(statusId);

    if (Number.isNaN(numericStatusId)) {
      toast.error("상태 정보를 확인할 수 없습니다.");
      return;
    }

    try {
      setStatusManagerLoading(true);
      await deleteGeneralTodoStatus(numericStatusId);
      const remaining =
        categoryStatusMap[target.categoryId]?.filter(
          (status) => status.id !== statusId
        ) ?? [];
      applyStatusUpdate(target.categoryId, remaining, {
        deletedStatusId: statusId,
      });
      setStatusManagerError(null);
      toast.success("상태를 삭제했습니다.");
    } catch (error) {
      toast.error("상태를 삭제하지 못했습니다.");
      setStatusManagerError("상태를 삭제하지 못했습니다. 다시 시도해주세요.");
      await fetchGeneralTodos();
    } finally {
      setStatusManagerLoading(false);
    }
  };

  const handleReorderStatuses = async (
    categoryId: string,
    orderedStatusIds: string[]
  ) => {
    const current = categoryStatusMap[categoryId] ?? [];

    if (orderedStatusIds.length !== current.length) {
      return;
    }

    const reordered = orderedStatusIds
      .map((id, index) => {
        const status = current.find((item) => item.id === id);
        if (!status) {
          return null;
        }
        return {
          ...status,
          sortOrder: index,
        };
      })
      .filter((status): status is GeneralTodoStatus => status !== null);

    const statusIdsNumeric = orderedStatusIds.map((id) => Number(id));

    if (statusIdsNumeric.some((value) => Number.isNaN(value))) {
      toast.error("상태 정보를 확인할 수 없습니다.");
      return;
    }

    try {
      setStatusManagerLoading(true);
      applyStatusUpdate(categoryId, reordered);
      await reorderGeneralTodoStatuses(Number(categoryId), {
        statusIds: statusIdsNumeric,
      });
      setStatusManagerError(null);
      toast.success("상태 순서를 변경했습니다.");
    } catch (error) {
      toast.error("상태 순서를 변경하지 못했습니다.");
      setStatusManagerError("상태 순서를 변경하지 못했습니다. 다시 시도해주세요.");
      await fetchGeneralTodos();
    } finally {
      setStatusManagerLoading(false);
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
        initialViewMode: targetCategory.viewMode ?? "list",
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

  const handleSubmitFolderForm = async () => {
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
      try {
        const created = await createGeneralTodoFolder({ name: trimmed });
        const newFolder: GeneralTodoFolder = {
          id: String(created.id),
          name: created.name,
          sortOrder: created.sortOrder,
          categories: [],
        };

        setGeneralState((prev) => {
          const nextFolders = [...prev.folders, newFolder].sort((a, b) => {
            const aOrder = a.sortOrder ?? Number.MAX_SAFE_INTEGER;
            const bOrder = b.sortOrder ?? Number.MAX_SAFE_INTEGER;
            return aOrder - bOrder;
          });

          return {
            ...prev,
            folders: nextFolders,
          };
        });
        setSelectedFolderId(newFolder.id);
        setSelectedCategoryId(null);
      } catch (error) {
        toast.error("폴더 추가에 실패했습니다.");
        return;
      }
    } else if (folderFormModal.folderId) {
      const numericFolderId = Number(folderFormModal.folderId);

      if (Number.isNaN(numericFolderId)) {
        toast.error("폴더 정보를 확인할 수 없습니다.");
        return;
      }

      try {
        const updated = await updateGeneralTodoFolder(numericFolderId, {
          name: trimmed,
        });

        setGeneralState((prev) => {
          const nextFolders = prev.folders
            .map((folder) =>
              folder.id === String(updated.id)
                ? {
                    ...folder,
                    name: updated.name,
                    sortOrder: updated.sortOrder,
                  }
                : folder
            )
            .sort((a, b) => {
              const aOrder = a.sortOrder ?? Number.MAX_SAFE_INTEGER;
              const bOrder = b.sortOrder ?? Number.MAX_SAFE_INTEGER;
              return aOrder - bOrder;
            });

          return {
            ...prev,
            folders: nextFolders,
          };
        });
      } catch (error) {
        toast.error("폴더 이름 변경에 실패했습니다.");
        return;
      }
    }

    setFolderFormModal(undefined);
  };

  const handleSubmitCategoryForm = async () => {
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
      const folderNumericId = Number(categoryFormModal.folderId);

      if (Number.isNaN(folderNumericId)) {
        toast.error("카테고리 정보를 확인할 수 없습니다.");
        return;
      }

      try {
        const created = await createGeneralTodoCategory(folderNumericId, {
          name: trimmed,
          color: normalisedColor,
          viewMode: toApiViewMode(categoryViewModeInput),
        });

        const newCategory: GeneralTodoCategory = {
          id: String(created.id),
          name: created.name,
          color: normaliseCategoryColor(created.color),
          viewMode: toUiViewMode(created.viewMode),
          sortOrder: created.sortOrder,
          statuses: [],
        };

        setGeneralState((prev) => ({
          ...prev,
          folders: prev.folders.map((folder) =>
            folder.id === String(created.folderId)
              ? {
                  ...folder,
                  categories: [...folder.categories, newCategory].sort(
                    (a, b) => {
                      const aOrder = a.sortOrder ?? Number.MAX_SAFE_INTEGER;
                      const bOrder = b.sortOrder ?? Number.MAX_SAFE_INTEGER;
                      return aOrder - bOrder;
                    }
                  ),
                }
              : folder
          ),
        }));

        setSelectedFolderId(String(created.folderId));
        setSelectedCategoryId(newCategory.id);

        if (newCategory.viewMode === "kanban") {
          try {
            const defaultStatus = await createGeneralTodoStatus(created.id, {
              name: DEFAULT_PROGRESS_STATUS_NAME,
            });
            const mappedStatus = mapStatusResponse(defaultStatus);
            applyStatusUpdate(String(created.id), [mappedStatus]);
          } catch (error) {
            toast.error("기본 상태를 생성하지 못했습니다.");
          }
        }
      } catch (error) {
        toast.error("카테고리 추가에 실패했습니다.");
        return;
      }
    } else if (categoryFormModal.categoryId) {
      const numericCategoryId = Number(categoryFormModal.categoryId);

      if (Number.isNaN(numericCategoryId)) {
        toast.error("카테고리 정보를 확인할 수 없습니다.");
        return;
      }

      try {
        const updated = await updateGeneralTodoCategory(numericCategoryId, {
          name: trimmed,
          color: normalisedColor,
        });

        setGeneralState((prev) => ({
          ...prev,
          folders: prev.folders.map((folder) => {
            if (folder.id !== String(updated.folderId)) {
              return folder;
            }

            const nextCategories = folder.categories
              .map((category) =>
                category.id === String(updated.id)
                  ? {
                      ...category,
                      name: updated.name,
                      color: normaliseCategoryColor(updated.color),
                      viewMode: toUiViewMode(updated.viewMode),
                      sortOrder: updated.sortOrder,
                    }
                  : category
              )
              .sort((a, b) => {
                const aOrder = a.sortOrder ?? Number.MAX_SAFE_INTEGER;
                const bOrder = b.sortOrder ?? Number.MAX_SAFE_INTEGER;
                return aOrder - bOrder;
              });

            return {
              ...folder,
              categories: nextCategories,
            };
          }),
        }));

        setSelectedFolderId(String(updated.folderId));
      } catch (error) {
        toast.error("카테고리 수정에 실패했습니다.");
        return;
      }
    }

    setCategoryFormModal(undefined);
  };

  const handleConfirmDelete = async () => {
    if (!deleteConfirmModal) {
      return;
    }

    if (deleteConfirmModal.type === "folder") {
      const folderNumericId = Number(deleteConfirmModal.folderId);

      if (Number.isNaN(folderNumericId)) {
        toast.error("폴더 정보를 확인할 수 없습니다.");
        setDeleteConfirmModal(undefined);
        return;
      }

      try {
        await deleteGeneralTodoFolder(folderNumericId);

        const removedTodos = generalState.todos.filter(
          (todo) => todo.folderId === deleteConfirmModal.folderId
        );
        addTodosToTrash(removedTodos);

        setGeneralState((prev) => ({
          ...prev,
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
      } catch (error) {
        toast.error("폴더 삭제에 실패했습니다.");
        return;
      }
    } else if (deleteConfirmModal.type === "category") {
      const categoryNumericId = Number(deleteConfirmModal.categoryId);

      if (Number.isNaN(categoryNumericId)) {
        toast.error("카테고리 정보를 확인할 수 없습니다.");
        setDeleteConfirmModal(undefined);
        return;
      }

      try {
        await deleteGeneralTodoCategory(categoryNumericId);

        const removedTodos = generalState.todos.filter(
          (todo) =>
            todo.folderId === deleteConfirmModal.folderId &&
            todo.categoryId === deleteConfirmModal.categoryId
        );
        addTodosToTrash(removedTodos);

        setGeneralState((prev) => ({
          ...prev,
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
      } catch (error) {
        toast.error("카테고리 삭제에 실패했습니다.");
        return;
      }
    } else if (deleteConfirmModal.type === "todo") {
      const removedTodo = generalState.todos.find(
        (todo) => todo.id === deleteConfirmModal.todoId
      );

      try {
        await deleteGeneralTodoItem(deleteConfirmModal.todoId);

        if (removedTodo) {
          addTodosToTrash([removedTodo]);
        }

        setGeneralState((prev) => ({
          ...prev,
          todos: prev.todos.filter(
            (todo) => todo.id !== deleteConfirmModal.todoId
          ),
        }));

        if (selectedTodoId === deleteConfirmModal.todoId) {
          setSelectedTodoId(null);
          resetDetailState();
        }
      } catch (error) {
        toast.error("할 일 삭제에 실패했습니다.");
        return;
      }
    }

    setDeleteConfirmModal(undefined);
  };

  const canAddTodo = Boolean(
    selectedFolderId && activeFolderCategories.length > 0
  );
  const isAddDisabled = viewMode !== "active" || !canAddTodo;
  const showAllCategories = useMemo(() => {
    if (viewMode === "trash" || viewMode === "completed" || viewMode === "all") {
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
        } else if (todo.dueDate) {
          const dueDate = new Date(todo.dueDate);

          if (!Number.isNaN(dueDate.getTime()) && dueDate < startOfToday) {
            acc.overdue += 1;
          }
        }

        return acc;
      },
      {
        total: 0,
        completed: 0,
        overdue: 0,
      }
    );
  }, [generalState.todos]);

  const {
    total: totalTodoCount,
    completed: completedTodoCount,
    overdue: overdueTodoCount,
  } = summaryStats;

  const activeCategoryName = selectedCategoryId
    ? categoryNameMap[selectedCategoryId] ?? null
    : null;

  const statusManagerCategoryId = statusManagerModal?.categoryId ?? null;
  const statusManagerCategoryStatuses = statusManagerCategoryId
    ? categoryStatusMap[statusManagerCategoryId] ?? []
    : [];
  const statusManagerCategoryName = statusManagerCategoryId
    ? categoryNameMap[statusManagerCategoryId] ?? ""
    : "";

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
  } else if (viewMode === "all") {
    listTitle = "전체 할 일";
    listSubtitle = allTodosForSelection.length
      ? `모든 폴더에서 진행 중인 할 일 ${allTodosForSelection.length}개`
      : "모든 폴더의 진행 중인 할 일이 여기에 표시됩니다.";
  } else if (viewMode === "completed") {
    listTitle = "완료된 할 일";
    listSubtitle = completedTodosGlobal.length
      ? `완료된 할 일 ${completedTodosGlobal.length}개가 정리되어 있습니다.`
      : "완료된 할 일이 없습니다.";
  } else if (viewMode === "trash") {
    listTitle = "휴지통";
    listSubtitle = trashTodosForSelection.length
      ? `삭제된 항목 ${trashTodosForSelection.length}개가 보관되어 있습니다.`
      : "삭제한 할 일이 여기에 모입니다.";
  }

  const summaryTitle = "전체 할 일 현황";
  const summarySubtitle =
    viewMode === "active"
      ? activeFolder
        ? `${listTitle} 기준으로 할 일을 정리하고 있어요.`
        : "폴더와 카테고리를 선택해 할 일을 정리해보세요."
      : `${listTitle} 기준으로 할 일을 정리하고 있어요.`;

  const isDetailVisible = detailPanelOpen && selectedTodo !== null;

  const currentCategoryViewForModal: CategoryViewMode =
    categoryFormModal?.mode === "rename" && categoryFormModal.categoryId
      ? categoryViewMap[categoryFormModal.categoryId] ?? "list"
      : "list";

  if (isInitialLoading) {
    return (
      <WideDefaultLayout
        pageTitle="일반 할 일"
        description="폴더와 카테고리로 정리하는 개인용 투두"
      >
        <Container>
          <LoadingPlaceholder />
        </Container>
      </WideDefaultLayout>
    );
  }

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
            <AddTodoButton
              type="button"
              disabled={isAddDisabled}
              onClick={handleOpenTodoForm}
            >
              + 새 할 일
            </AddTodoButton>
          </ListHeader>
          {isKanbanView ? (
            <GeneralTodoKanban
              todos={kanbanTodos}
              statuses={kanbanStatuses}
              doneStatusId={kanbanDoneStatusId}
              onOpenDetail={handleSelectTodo}
              onTodoContextMenu={handleTodoContextMenu}
              onToggleCompletion={handleToggleTodoCompletion}
              onStatusChange={handleChangeTodoStatus}
              onManageStatuses={handleOpenStatusManager}
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
                  ? "완료된 할 일이 없습니다."
                  : viewMode === "trash"
                    ? "휴지통이 비어 있습니다."
                    : viewMode === "all"
                      ? "진행 중인 할 일이 없습니다."
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
                            {formattedDueDate ? (
                              <small>{formattedDueDate}</small>
                            ) : null}
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
                editStatusId={detailStatusId}
                onTitleChange={handleDetailTitleChange}
                onDescriptionChange={handleDetailDescriptionChange}
                onDueDateChange={handleDetailDueDateChange}
                onDueTimeChange={handleDetailDueTimeChange}
                onCompletedChange={handleDetailCompletedChange}
                onStatusChange={handleDetailStatusChange}
                onSave={handleDetailSave}
                isDirty={detailDirty}
                error={detailError}
                showSectionTitle={false}
              />
            ) : null}
          </DetailDrawerContent>
      </DetailDrawerInner>
    </DetailDrawer>

      {statusManagerModal && (
        <Modal
          title="상태 관리"
          isOpen
          onClose={handleCloseStatusManager}
        >
          <GeneralTodoStatusManager
            categoryName={statusManagerCategoryName}
            statuses={statusManagerCategoryStatuses}
            error={statusManagerError}
            isBusy={statusManagerLoading}
            onAddStatus={(name) =>
              handleCreateStatus(statusManagerModal.categoryId, name)
            }
            onRenameStatus={handleRenameStatus}
            onDeleteStatus={handleDeleteStatus}
            onReorderStatuses={(orderedIds) =>
              handleReorderStatuses(statusManagerModal.categoryId, orderedIds)
            }
          />
        </Modal>
      )}

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
              onClick: () => {
                handleSubmitFolderForm().catch(() => undefined);
              },
            },
          ]}
        >
          <ModalForm
            onSubmit={(event) => {
              event.preventDefault();
              handleSubmitFolderForm().catch(() => undefined);
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
                handleAddTodo().catch(() => undefined);
              },
            },
          ]}
        >
          <ModalForm
            onSubmit={(event) => {
              handleAddTodo(event).catch(() => undefined);
            }}
          >
            {activeFolderCategories.length > 0 ? (
              <>
                <ModalLabel htmlFor="general-todo-category">
                  카테고리
                </ModalLabel>
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
                <ModalLabel htmlFor="general-todo-due-date">
                  마감일 (선택)
                </ModalLabel>
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
                      onChange={(event) =>
                        setTodoModalDueTime(event.target.value)
                      }
                    />
                  </>
                )}
              </>
            ) : (
              <ModalHelper>카테고리를 먼저 추가해주세요.</ModalHelper>
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
            <ModalLabel htmlFor="general-todo-description">
              메모 (선택)
            </ModalLabel>
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
              onClick: () => {
                handleSubmitCategoryForm().catch(() => undefined);
              },
            },
          ]}
        >
          <ModalForm
            onSubmit={(event) => {
              event.preventDefault();
              handleSubmitCategoryForm().catch(() => undefined);
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
            {categoryFormModal.mode === "create" && (
              <>
                <ModalLabel as="p" style={{ marginTop: 12 }}>
                  기본 보기 설정
                </ModalLabel>
                <ContextMenuOptionGroup>
                  <ContextMenuOptionButton
                    type="button"
                    onClick={() => setCategoryViewModeInput("list")}
                    $active={categoryViewModeInput === "list"}
                  >
                    리스트
                  </ContextMenuOptionButton>
                  <ContextMenuOptionButton
                    type="button"
                    onClick={() => setCategoryViewModeInput("kanban")}
                    $active={categoryViewModeInput === "kanban"}
                  >
                    칸반
                  </ContextMenuOptionButton>
                </ContextMenuOptionGroup>
              </>
            )}
            {categoryFormModal.mode === "rename" &&
              categoryFormModal.categoryId && (
                <>
                  <ModalLabel as="p" style={{ marginTop: 12 }}>
                    기본 보기 설정
                  </ModalLabel>
                  <ContextMenuOptionGroup>
                    <ContextMenuOptionButton
                      type="button"
                      onClick={() => {
                        handleCategoryViewToggle(
                          "list",
                          categoryFormModal.categoryId
                        ).catch(() => undefined);
                      }}
                      $active={currentCategoryViewForModal === "list"}
                    >
                      리스트
                    </ContextMenuOptionButton>
                    <ContextMenuOptionButton
                      type="button"
                      onClick={() => {
                        handleCategoryViewToggle(
                          "kanban",
                          categoryFormModal.categoryId
                        ).catch(() => undefined);
                      }}
                      $active={currentCategoryViewForModal === "kanban"}
                    >
                      칸반
                    </ContextMenuOptionButton>
                  </ContextMenuOptionGroup>
                </>
              )}
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
              onClick: () => {
                handleConfirmDelete().catch(() => undefined);
              },
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
                편집
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
                편집
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

const LoadingPlaceholder = () => (
  <LoadingPlaceholderContainer>
    일반 할 일을 불러오는 중입니다...
  </LoadingPlaceholderContainer>
);

const LoadingPlaceholderContainer = styled.div`
  width: 100%;
  min-height: 320px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 18px;
  border: 1px dashed ${({ theme }) => theme.app.border};
  background: ${({ theme }) => theme.app.bg.gray1};
  color: ${({ theme }) => theme.app.text.light1};
  font-size: 15px;
`;

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
  transition:
    background 0.2s ease,
    color 0.2s ease,
    transform 0.2s ease;

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
  transition:
    opacity 0.24s ease,
    transform 0.24s ease,
    padding-top 0.24s ease;
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
  transition:
    background 0.2s ease,
    box-shadow 0.2s ease,
    transform 0.2s ease;

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

const ContextMenuOptionGroup = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 6px;
`;

const ContextMenuOptionButton = styled.button<{ $active: boolean }>`
  padding: 6px 12px;
  border-radius: 999px;
  border: 1px solid
    ${({ theme, $active }) =>
      $active ? theme.app.palette.smokeBlue[500] : theme.app.border};
  background: ${({ theme, $active }) =>
    $active ? theme.app.palette.smokeBlue[500] : theme.app.bg.white};
  color: ${({ theme, $active }) =>
    $active ? "#ffffff" : theme.app.text.light1};
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  transition:
    background 0.2s ease,
    color 0.2s ease,
    border-color 0.2s ease,
    transform 0.2s ease;

  &:hover {
    transform: translateY(-1px);
    color: ${({ theme, $active }) =>
      $active ? "#ffffff" : theme.app.text.main};
    border-color: ${({ theme }) => theme.app.palette.smokeBlue[500]};
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
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease;
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
  transition:
    transform 0.15s ease,
    box-shadow 0.15s ease,
    border-color 0.15s ease;
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
