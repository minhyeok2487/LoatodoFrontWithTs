import { useMemo, type MouseEvent } from "react";
import styled from "styled-components";
import {
  DndContext,
  type DragEndEvent,
  MouseSensor,
  TouchSensor,
  closestCenter,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { MdDragHandle } from "@react-icons/all-files/md/MdDragHandle";

import Button from "@components/Button";
import type {
  FolderWithCategories,
  GeneralTodoCategory,
} from "@core/types/generalTodo";

interface FolderTreeProps {
  folderTree: FolderWithCategories[];
  selectedFolderId: number | null;
  activeCategoryId: number | null;
  onSelectFolder: (folderId: number) => void;
  onSelectCategory: (folderId: number, categoryId: number) => void;
  onClickCreateFolder: () => void;
  onContextMenuFolder: (
    event: MouseEvent<HTMLButtonElement>,
    folder: FolderWithCategories
  ) => void;
  onContextMenuCategory: (
    event: MouseEvent<HTMLButtonElement>,
    folder: FolderWithCategories,
    category: GeneralTodoCategory
  ) => void;
  onReorderFolders: (next: FolderWithCategories[]) => void;
  onReorderCategories: (
    folderId: number,
    nextCategories: GeneralTodoCategory[]
  ) => void;
  isReorderDisabled?: boolean;
}

const getFolderItemId = (id: number) => `folder-${id}`;
const getCategoryItemId = (id: number) => `category-${id}`;
const isFolderItem = (id: string) => id.startsWith("folder-");
const isCategoryItem = (id: string) => id.startsWith("category-");
const parseEntityId = (id: string) => Number(id.split("-")[1]);

const FolderTree = ({
  folderTree,
  selectedFolderId,
  activeCategoryId,
  onSelectFolder,
  onSelectCategory,
  onClickCreateFolder,
  onContextMenuFolder,
  onContextMenuCategory,
  onReorderFolders,
  onReorderCategories,
  isReorderDisabled = false,
}: FolderTreeProps) => {
  const folderCount = folderTree.length;
  const categoryCount = folderTree.reduce(
    (total, folder) => total + folder.categories.length,
    0
  );
  const sensors = useSensors(
    useSensor(MouseSensor, { activationConstraint: { distance: 8 } }),
    useSensor(TouchSensor, {
      activationConstraint: { delay: 150, tolerance: 8 },
    })
  );
  const categoryFolderMap = useMemo(() => {
    const map = new Map<number, number>();
    folderTree.forEach((folder) => {
      folder.categories.forEach((category) => {
        map.set(category.id, folder.id);
      });
    });
    return map;
  }, [folderTree]);

  const handleDragEnd = (event: DragEndEvent) => {
    if (isReorderDisabled) {
      return;
    }

    const { active, over } = event;

    if (!over || active.id === over.id) {
      return;
    }

    const activeKey = String(active.id);
    const overKey = String(over.id);

    if (isFolderItem(activeKey) && isFolderItem(overKey)) {
      const activeFolderId = parseEntityId(activeKey);
      const overFolderId = parseEntityId(overKey);

      const activeIndex = folderTree.findIndex(
        (folder) => folder.id === activeFolderId
      );
      const overIndex = folderTree.findIndex(
        (folder) => folder.id === overFolderId
      );

      if (activeIndex !== -1 && overIndex !== -1) {
        const nextOrder = arrayMove(folderTree, activeIndex, overIndex);
        onReorderFolders(nextOrder);
      }
    } else if (isCategoryItem(activeKey) && isCategoryItem(overKey)) {
      const activeCategoryId = parseEntityId(activeKey);
      const overCategoryId = parseEntityId(overKey);
      const activeFolderId = categoryFolderMap.get(activeCategoryId);
      const overFolderId = categoryFolderMap.get(overCategoryId);

      if (
        activeFolderId &&
        overFolderId &&
        activeFolderId === overFolderId
      ) {
        const targetFolder = folderTree.find(
          (folder) => folder.id === activeFolderId
        );

        if (targetFolder) {
          const { categories } = targetFolder;
          const activeIndex = categories.findIndex(
            (category) => category.id === activeCategoryId
          );
          const overIndex = categories.findIndex(
            (category) => category.id === overCategoryId
          );

          if (activeIndex !== -1 && overIndex !== -1) {
            const nextCategories = arrayMove(categories, activeIndex, overIndex);
            onReorderCategories(activeFolderId, nextCategories);
          }
        }
      }
    }

  };

  return (
    <Wrapper>
      <TreeHeader>
        <TreeMeta>
          <TreeTitle>폴더 · 카테고리</TreeTitle>
          <TreeHint>
            {folderCount}개 폴더 · {categoryCount}개 카테고리
          </TreeHint>
        </TreeMeta>
        <CreateButton
          variant="outlined"
          size="small"
          onClick={onClickCreateFolder}
        >
          폴더 추가
        </CreateButton>
      </TreeHeader>

      {folderTree.length > 0 ? (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={folderTree.map((folder) => getFolderItemId(folder.id))}
            strategy={verticalListSortingStrategy}
          >
            <FolderList>
              {folderTree.map((folder) => (
                <SortableFolderItem
                  key={folder.id}
                  folder={folder}
                  selectedFolderId={selectedFolderId}
                  activeCategoryId={activeCategoryId}
                  onSelectFolder={onSelectFolder}
                  onSelectCategory={onSelectCategory}
                  onContextMenuFolder={onContextMenuFolder}
                  onContextMenuCategory={onContextMenuCategory}
                  isDragDisabled={isReorderDisabled || folderTree.length <= 1}
                />
              ))}
            </FolderList>
          </SortableContext>
        </DndContext>
      ) : (
        <EmptyPlaceholder>
          아직 등록된 폴더가 없어요. 폴더를 생성해 주세요.
        </EmptyPlaceholder>
      )}
    </Wrapper>
  );
};

export default FolderTree;

interface SortableFolderItemProps {
  folder: FolderWithCategories;
  selectedFolderId: number | null;
  activeCategoryId: number | null;
  onSelectFolder: (folderId: number) => void;
  onSelectCategory: (folderId: number, categoryId: number) => void;
  onContextMenuFolder: (
    event: MouseEvent<HTMLButtonElement>,
    folder: FolderWithCategories
  ) => void;
  onContextMenuCategory: (
    event: MouseEvent<HTMLButtonElement>,
    folder: FolderWithCategories,
    category: GeneralTodoCategory
  ) => void;
  isDragDisabled: boolean;
}

const SortableFolderItem = ({
  folder,
  selectedFolderId,
  activeCategoryId,
  onSelectFolder,
  onSelectCategory,
  onContextMenuFolder,
  onContextMenuCategory,
  isDragDisabled,
}: SortableFolderItemProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortableItem(getFolderItemId(folder.id), isDragDisabled);

  return (
    <FolderBlock
      ref={setNodeRef}
      $isDragging={isDragging}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
      }}
    >
      <FolderButton
        type="button"
        $active={folder.id === selectedFolderId}
        onClick={() => onSelectFolder(folder.id)}
        onContextMenu={(event) => onContextMenuFolder(event, folder)}
      >
        <FolderMeta>
          <FolderName>{folder.name}</FolderName>
          <FolderDetail>{folder.categories.length}개의 카테고리</FolderDetail>
        </FolderMeta>
        <FolderActionArea>
          <FolderOrder />
          <DragHandle
            type="button"
            aria-label={`${folder.name} 순서 변경`}
            {...attributes}
            {...listeners}
            onClick={(event) => {
              event.preventDefault();
              event.stopPropagation();
            }}
            disabled={isDragDisabled}
          >
            <MdDragHandle />
          </DragHandle>
        </FolderActionArea>
      </FolderButton>

      {folder.categories.length > 0 ? (
        <SortableContext
          id={`folder-${folder.id}-categories`}
          items={folder.categories.map((category) =>
            getCategoryItemId(category.id)
          )}
          strategy={verticalListSortingStrategy}
        >
          <CategoryList>
            {folder.categories.map((category) => (
              <SortableCategoryItem
                key={category.id}
                folderId={folder.id}
                category={category}
                activeCategoryId={activeCategoryId}
                onSelectCategory={onSelectCategory}
                onContextMenuCategory={onContextMenuCategory}
                folder={folder}
                isDragDisabled={isDragDisabled || folder.categories.length <= 1}
              />
            ))}
          </CategoryList>
        </SortableContext>
      ) : (
        <EmptyState>카테고리가 없어요.</EmptyState>
      )}
    </FolderBlock>
  );
};

interface SortableCategoryItemProps {
  folderId: number;
  folder: FolderWithCategories;
  category: GeneralTodoCategory;
  activeCategoryId: number | null;
  onSelectCategory: (folderId: number, categoryId: number) => void;
  onContextMenuCategory: (
    event: MouseEvent<HTMLButtonElement>,
    folder: FolderWithCategories,
    category: GeneralTodoCategory
  ) => void;
  isDragDisabled: boolean;
}

const SortableCategoryItem = ({
  folderId,
  folder,
  category,
  activeCategoryId,
  onSelectCategory,
  onContextMenuCategory,
  isDragDisabled,
}: SortableCategoryItemProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortableItem(getCategoryItemId(category.id), isDragDisabled);

  return (
    <CategoryButton
      ref={setNodeRef}
      type="button"
      $active={category.id === activeCategoryId}
      $isDragging={isDragging}
      onClick={() => onSelectCategory(folderId, category.id)}
      onContextMenu={(event) => onContextMenuCategory(event, folder, category)}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
      }}
    >
      <CategoryColor $color={category.color} />
      <CategoryMeta>
        <strong>{category.name}</strong>
        <small>
          보기: {category.viewMode === "KANBAN" ? "칸반" : "리스트"}
        </small>
      </CategoryMeta>
      <CategoryHandle
        type="button"
        aria-label={`${category.name} 순서 변경`}
        {...attributes}
        {...listeners}
        onClick={(event) => {
          event.preventDefault();
          event.stopPropagation();
        }}
        disabled={isDragDisabled}
      >
        <MdDragHandle />
      </CategoryHandle>
    </CategoryButton>
  );
};

const useSortableItem = (id: string, disabled: boolean) => {
  return useSortable({
    id,
    disabled,
  });
};

const Wrapper = styled.section`
  flex: 0 0 24%;
  width: 24%;
  max-width: 420px;
  min-width: 260px;
  display: flex;
  flex-direction: column;
  gap: 16px;

  ${({ theme }) => theme.medias.max1100} {
    flex: 0 0 30%;
    width: 30%;
  }

  ${({ theme }) => theme.medias.max900} {
    max-width: 100%;
    width: 100%;
    min-width: 0;
  }

  ${({ theme }) => theme.medias.max600} {
    gap: 12px;
  }
`;

const TreeHeader = styled.div`
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 8px;
  align-items: flex-start;

  ${({ theme }) => theme.medias.max600} {
    flex-direction: column;
    align-items: stretch;
  }
`;

const TreeMeta = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const TreeTitle = styled.h3`
  font-size: 16px;
  font-weight: 700;
  color: ${({ theme }) => theme.app.text.dark1};
`;

const TreeHint = styled.p`
  font-size: 12px;
  color: ${({ theme }) => theme.app.text.light1};
`;

const CreateButton = styled(Button)`
  && {
    white-space: nowrap;
    ${({ theme }) => theme.medias.max600} {
      width: 100%;
    }
  }
`;

const FolderList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const FolderBlock = styled.div<{ $isDragging: boolean }>`
  border: 1px solid ${({ theme }) => theme.app.border};
  border-radius: 16px;
  padding: 16px;
  background: ${({ theme }) => theme.app.bg.gray1};
  opacity: ${({ $isDragging }) => ($isDragging ? 0.6 : 1)};
  transition: opacity 0.2s ease;

  ${({ theme }) => theme.medias.max600} {
    padding: 14px;
  }
`;

const FolderButton = styled.button<{ $active: boolean }>`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
  border: 1px solid
    ${({ theme, $active }) =>
      $active ? theme.app.text.dark1 : theme.app.border};
  border-radius: 12px;
  padding: 12px;
  background: ${({ theme }) => theme.app.bg.white};
  transition: border 0.2s ease;

  span {
    font-size: 12px;
    color: ${({ theme }) => theme.app.text.light1};
  }
  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.app.text.dark1};
    outline-offset: 2px;
  }
`;

const FolderMeta = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  align-items: flex-start;
`;

const FolderName = styled.strong`
  font-size: 15px;
  color: ${({ theme }) => theme.app.text.dark1};
`;

const FolderDetail = styled.span`
  font-size: 12px;
  color: ${({ theme }) => theme.app.text.light1};
`;

const FolderActionArea = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
`;

const FolderOrder = styled.span`
  font-size: 12px;
  color: ${({ theme }) => theme.app.text.light2};
`;

const DragHandle = styled.button`
  border: none;
  background: transparent;
  color: ${({ theme }) => theme.app.text.light1};
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: grab;
  padding: 4px;

  &:disabled {
    cursor: not-allowed;
    color: ${({ theme }) => theme.app.text.light2};
  }

  svg {
    width: 18px;
    height: 18px;
  }
`;

const CategoryList = styled.div`
  margin-top: 12px;
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const CategoryButton = styled.button<{ $active: boolean; $isDragging: boolean }>`
  width: 100%;
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 12px;
  border-radius: 12px;
  border: 1px solid
    ${({ theme, $active }) =>
      $active ? theme.app.text.dark1 : theme.app.border};
  background: ${({ theme }) => theme.app.bg.white};
  transition: border 0.2s ease;
  text-align: left;
  opacity: ${({ $isDragging }) => ($isDragging ? 0.6 : 1)};

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.app.text.dark1};
    outline-offset: 2px;
  }
`;

const CategoryMeta = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  align-items: flex-start;

  strong {
    font-size: 14px;
    color: ${({ theme }) => theme.app.text.dark1};
  }

  small {
    font-size: 12px;
    color: ${({ theme }) => theme.app.text.light1};
  }
`;

const CategoryColor = styled.span<{ $color: string | null }>`
  width: 6px;
  height: 36px;
  border-radius: 6px;
  background: ${({ $color, theme }) => $color || theme.app.bg.gray2};
`;

const CategoryHandle = styled(DragHandle)`
  margin-left: auto;
`;

const EmptyState = styled.p`
  margin-top: 8px;
  font-size: 12px;
  color: ${({ theme }) => theme.app.text.light1};
`;

const EmptyPlaceholder = styled.div`
  border: 1px dashed ${({ theme }) => theme.app.border};
  border-radius: 16px;
  padding: 32px 20px;
  text-align: center;
  font-size: 13px;
  color: ${({ theme }) => theme.app.text.light1};
  background: ${({ theme }) => theme.app.bg.gray1};
`;
