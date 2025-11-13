import { useCallback, useEffect, useMemo } from "react";
import { useSearchParams } from "react-router-dom";

import type {
  CompletionFilter,
  GeneralTodoCategory,
  GeneralTodoFolder,
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

const parseCompletionFilter = (value: string | null): CompletionFilter => {
  if (value === "completed" || value === "incomplete") {
    return value;
  }
  return "all";
};

const useTodoFilters = (
  folders: GeneralTodoFolder[],
  categories: GeneralTodoCategory[]
) => {
  const [searchParams, setSearchParams] = useSearchParams();

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
        params.set("status", completionFilter ?? "all");

        return params;
      });
    }
  }, [folders, completionFilter, searchParams, setSearchParams]);

  const syncFilters = useCallback(
    (
      folderId: number | null,
      categoryId: number | null,
      completion: CompletionFilter = completionFilter
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

        params.set("status", completion ?? "all");

        return params;
      });
    },
    [completionFilter, setSearchParams]
  );

  const setCompletionFilter = useCallback(
    (next: CompletionFilter) => {
      syncFilters(selectedFolderId, activeCategoryId, next);
    },
    [syncFilters, selectedFolderId, activeCategoryId]
  );

  return {
    completionFilter,
    selectedFolderId,
    activeCategoryId,
    syncFilters,
    setCompletionFilter,
  };
};

export default useTodoFilters;
