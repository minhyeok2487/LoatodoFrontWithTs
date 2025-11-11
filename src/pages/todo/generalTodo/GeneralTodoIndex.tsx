import { useEffect, useMemo, useState } from "react";
import styled from "styled-components";
import { toast } from "react-toastify";
import { useSearchParams } from "react-router-dom";

import WideDefaultLayout from "@layouts/WideDefaultLayout";

import FolderTree from "./components/FolderTree";
import TodoDrawer from "./components/TodoDrawer";
import TodoListPanel from "./components/TodoListPanel";
import { mockOverview } from "./mockData";
import type {
  CompletionFilter,
  DraftTodo,
  FolderWithCategories,
  GeneralTodoCategory,
} from "./types";

const DEFAULT_FOLDER_ID = mockOverview.folders[0]?.id ?? null;

const parseNumberParam = (value: string | null): number | null => {
  if (!value) {
    return null;
  }
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
};

const isValidFolderId = (folderId: number | null): folderId is number => {
  if (typeof folderId !== "number") {
    return false;
  }

  return mockOverview.folders.some((folder) => folder.id === folderId);
};

const isValidCategoryId = (
  folderId: number | null,
  categoryId: number | null
): categoryId is number => {
  if (typeof folderId !== "number" || typeof categoryId !== "number") {
    return false;
  }

  return mockOverview.categories.some(
    (category) => category.folderId === folderId && category.id === categoryId
  );
};

const parseCompletionFilter = (
  value: string | null
): CompletionFilter => {
  if (value === "completed" || value === "incomplete") {
    return value;
  }
  return "all";
};

const GeneralTodoIndex = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [isMobileLayout, setIsMobileLayout] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(true);

  const selectedFolderId = useMemo(() => {
    const rawFolderId = parseNumberParam(searchParams.get("folder"));
    if (isValidFolderId(rawFolderId)) {
      return rawFolderId;
    }
    return DEFAULT_FOLDER_ID;
  }, [searchParams]);

  const folderCategories = useMemo(() => {
    if (!selectedFolderId) {
      return [];
    }

    return mockOverview.categories
      .filter((category) => category.folderId === selectedFolderId)
      .sort((a, b) => a.sortOrder - b.sortOrder);
  }, [selectedFolderId]);

  const activeCategoryId = useMemo(() => {
    const rawCategoryId = parseNumberParam(searchParams.get("category"));
    if (isValidCategoryId(selectedFolderId, rawCategoryId)) {
      return rawCategoryId;
    }

    return null;
  }, [searchParams, selectedFolderId]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [draft, setDraft] = useState<DraftTodo>({
    title: "",
    description: "",
    dueDate: "",
    categoryId: mockOverview.categories[0]?.id ?? null,
  });

  const folderTree = useMemo<FolderWithCategories[]>(() => {
    return mockOverview.folders.map((folder) => ({
      ...folder,
      categories: mockOverview.categories
        .filter((category) => category.folderId === folder.id)
        .sort((a, b) => a.sortOrder - b.sortOrder),
    }));
  }, []);

  const completionFilter = useMemo<CompletionFilter>(() => {
    return parseCompletionFilter(searchParams.get("status"));
  }, [searchParams]);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 900px)");

    const handleChange = (matches: boolean) => {
      setIsMobileLayout(matches);
      setMobileSidebarOpen(!matches);
    };

    handleChange(mediaQuery.matches);

    const listener = (event: MediaQueryListEvent) => handleChange(event.matches);
    mediaQuery.addEventListener("change", listener);

    return () => {
      mediaQuery.removeEventListener("change", listener);
    };
  }, []);

  const todos = useMemo(() => {
    if (!selectedFolderId) {
      return [];
    }

    return mockOverview.todos
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
  }, [selectedFolderId, activeCategoryId, completionFilter]);

  const selectedFolder = useMemo(() => {
    return folderTree.find((folder) => folder.id === selectedFolderId) ?? null;
  }, [folderTree, selectedFolderId]);

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
  }, [selectedFolderId, folderCategories, draft.categoryId]);

  const syncSearchParams = (
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
  };

  const handleFolderSelect = (folderId: number) => {
    syncSearchParams(folderId, null, completionFilter);
    setDraft((prev) => ({ ...prev, categoryId: null }));
    if (isMobileLayout) {
      setMobileSidebarOpen(false);
    }
  };

  const handleCategorySelect = (folderId: number, categoryId: number) => {
    syncSearchParams(folderId, categoryId, completionFilter);
    setDraft((prev) => ({ ...prev, categoryId }));
    if (isMobileLayout) {
      setMobileSidebarOpen(false);
    }
  };

  const handleCompletionFilterChange = (next: CompletionFilter) => {
    syncSearchParams(selectedFolderId, activeCategoryId, next);
  };

  const handleDraftChange = (next: Partial<DraftTodo>) => {
    setDraft((prev) => ({ ...prev, ...next }));
  };

  const openForm = () => setIsFormOpen(true);
  const closeForm = () => setIsFormOpen(false);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    toast.info("일반 투두 API와 아직 연결되지 않았어요.");

    setDraft({
      title: "",
      description: "",
      dueDate: "",
      categoryId: folderCategories[0]?.id ?? null,
    });
    closeForm();
  };

  const isSubmitDisabled =
    !draft.title.trim() || !draft.categoryId || !selectedFolderId;

  return (
    <WideDefaultLayout
      pageTitle="개인 할 일"
      description="원정대 숙제와 분리된 일반 투두를 한 눈에 정리할 수 있어요."
    >
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
            folderTree={folderTree}
            selectedFolderId={selectedFolderId}
            activeCategoryId={activeCategoryId}
            onSelectFolder={handleFolderSelect}
            onSelectCategory={handleCategorySelect}
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
        />
      </Board>

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
      />
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
