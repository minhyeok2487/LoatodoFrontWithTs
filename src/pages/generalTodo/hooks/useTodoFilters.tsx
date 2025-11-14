import { useCallback, useEffect, useMemo } from "react";
import { useSearchParams } from "react-router-dom";

import type {
  GeneralTodoCategory,
  GeneralTodoFolder,
  GeneralTodoStatus,
  StatusFilter,
} from "@core/types/generalTodo";

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

const useTodoFilters = (
  folders: GeneralTodoFolder[],
  categories: GeneralTodoCategory[],
  statuses: GeneralTodoStatus[]
) => {
  const [searchParams, setSearchParams] = useSearchParams();

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

  const statusFilter = useMemo<StatusFilter>(() => {
    const rawStatus = searchParams.get("status");
    if (!rawStatus) {
      return "all";
    }
    const parsed = Number(rawStatus);
    if (!Number.isFinite(parsed) || !activeCategoryId) {
      return "all";
    }
    const exists = statuses.some(
      (status) =>
        status.id === parsed && status.categoryId === activeCategoryId
    );
    return exists ? parsed : "all";
  }, [searchParams, statuses, activeCategoryId]);

  useEffect(() => {
    if (folders.length === 0) {
      return;
    }

    const rawFolderId = parseNumberParam(searchParams.get("folder"));
    if (!isValidFolderId(folders, rawFolderId)) {
      setSearchParams((prev) => {
        const params = new URLSearchParams(prev);
        const firstFolder = folders[0];

        if (firstFolder) {
          params.set("folder", String(firstFolder.id));
        } else {
          params.delete("folder");
        }
        params.delete("category");
        params.delete("status");

        return params;
      });
    }
  }, [folders, searchParams, setSearchParams]);

  const syncFilters = useCallback(
    (
      folderId: number | null,
      categoryId: number | null,
      status: StatusFilter = statusFilter
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

        if (status === "all" || !categoryId) {
          params.delete("status");
        } else {
          params.set("status", String(status));
        }

        return params;
      });
    },
    [statusFilter, setSearchParams]
  );

  const setStatusFilter = useCallback(
    (next: StatusFilter) => {
      syncFilters(selectedFolderId, activeCategoryId, next);
    },
    [syncFilters, selectedFolderId, activeCategoryId]
  );

  return {
    statusFilter,
    selectedFolderId,
    activeCategoryId,
    syncFilters,
    setStatusFilter,
  };
};

export default useTodoFilters;
