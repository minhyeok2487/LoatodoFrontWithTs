import { useCallback, useEffect, useMemo, useState } from "react";
import styled from "styled-components";
import { toast } from "react-toastify";
import { useSearchParams } from "react-router-dom";

import Button from "@components/Button";
import WideDefaultLayout from "@layouts/WideDefaultLayout";
import { useGeneralTodoOverview } from "@core/hooks/queries/generalTodo";
import type {
  CompletionFilter,
  DraftTodo,
  FolderWithCategories,
  GeneralTodoCategory,
  GeneralTodoFolder,
} from "@core/types/generalTodo";

import FolderTree from "./components/FolderTree";
import TodoDrawer from "./components/TodoDrawer";
import TodoListPanel from "./components/TodoListPanel";

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
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [draft, setDraft] = useState<DraftTodo>({
    title: "",
    description: "",
    dueDate: "",
    categoryId: null,
  });

  const generalTodoOverview = useGeneralTodoOverview();
  const overview = generalTodoOverview.data;
  const folders = overview?.folders ?? [];
  const categories = overview?.categories ?? [];
  const todosSource = overview?.todos ?? [];

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

  const folderCategories = useMemo(() => {
    if (!selectedFolderId) {
      return [];
    }

    return categories
      .filter((category) => category.folderId === selectedFolderId)
      .sort((a, b) => a.sortOrder - b.sortOrder);
  }, [categories, selectedFolderId]);

  const activeCategoryId = useMemo(() => {
    const rawCategoryId = parseNumberParam(searchParams.get("category"));
    if (isValidCategoryId(categories, selectedFolderId, rawCategoryId)) {
      return rawCategoryId;
    }

    return null;
  }, [categories, searchParams, selectedFolderId]);

  const folderTree = useMemo<FolderWithCategories[]>(() => {
    return folders.map((folder) => ({
      ...folder,
      categories: categories
        .filter((category) => category.folderId === folder.id)
        .sort((a, b) => a.sortOrder - b.sortOrder),
    }));
  }, [folders, categories]);

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

    return todosSource
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
  }, [todosSource, selectedFolderId, activeCategoryId, completionFilter]);

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

  const syncSearchParams = useCallback(
    (
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
    },
    [setSearchParams]
  );

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

  useEffect(() => {
    if (folders.length === 0) {
      return;
    }

    const rawFolderId = parseNumberParam(searchParams.get("folder"));
    if (!isValidFolderId(folders, rawFolderId)) {
      syncSearchParams(folders[0].id, null, completionFilter);
    }
  }, [folders, completionFilter, searchParams, syncSearchParams]);

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

  if (generalTodoOverview.isLoading) {
    return (
      <WideDefaultLayout
        pageTitle="개인 할 일"
        description="원정대 숙제와 분리된 일반 투두를 한 눈에 정리할 수 있어요."
      >
        <StateCard>일반 할 일을 불러오는 중이에요...</StateCard>
      </WideDefaultLayout>
    );
  }

  if (generalTodoOverview.isError) {
    return (
      <WideDefaultLayout
        pageTitle="개인 할 일"
        description="원정대 숙제와 분리된 일반 투두를 한 눈에 정리할 수 있어요."
      >
        <StateCard>
          <p>일반 할 일을 불러오지 못했어요. 잠시 후 다시 시도해 주세요.</p>
          <Button variant="outlined" size="large" onClick={() => generalTodoOverview.refetch()}>
            다시 시도
          </Button>
        </StateCard>
      </WideDefaultLayout>
    );
  }

  return (
    <WideDefaultLayout
      pageTitle="개인 할 일"
      description="원정대 숙제와 분리된 일반 투두를 한 눈에 정리할 수 있어요."
    >
      {isMobileLayout && folders.length > 0 && (
        <SidebarToggle
          type="button"
          onClick={() => setMobileSidebarOpen((prev) => !prev)}
        >
          {mobileSidebarOpen ? "폴더 · 카테고리 닫기" : "폴더 · 카테고리 열기"}
        </SidebarToggle>
      )}

      <Board>
        {folders.length > 0 ? (
          <>
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
          </>
        ) : (
          <EmptyBoard>
            <p>등록된 폴더가 없어요. 폴더를 생성한 뒤 다시 확인해 주세요.</p>
            <Button variant="outlined" size="large" onClick={() => generalTodoOverview.refetch()}>
              다시 불러오기
            </Button>
          </EmptyBoard>
        )}
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
          onClose={closeForm}
          isSubmitDisabled={isSubmitDisabled}
        />
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

const EmptyBoard = styled.div`
  width: 100%;
  min-height: 200px;
  border: 1px dashed ${({ theme }) => theme.app.border};
  border-radius: 16px;
  padding: 40px 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
  text-align: center;
  background: ${({ theme }) => theme.app.bg.white};

  & > p {
    font-size: 14px;
    color: ${({ theme }) => theme.app.text.light1};
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
