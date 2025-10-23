import type { MouseEvent } from "react";
import { useMemo } from "react";
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
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { MdAdd } from "@react-icons/all-files/md/MdAdd";
import { FiFolder } from "@react-icons/all-files/fi/FiFolder";
import { FiMenu } from "@react-icons/all-files/fi/FiMenu";
import styled, { keyframes } from "styled-components";

import { PlaceholderMessage, SectionTitle, SelectionButton } from "./styles";
import type { GeneralTodoCategory, GeneralTodoFolder } from "./types";

const SidebarContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  flex: 1;
`;

const SectionHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
`;

const List = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  flex: 1;
`;

const FolderItem = styled.div<{ $isDragging?: boolean }>`
  display: flex;
  flex-direction: column;
  gap: 6px;
  opacity: ${({ $isDragging }) => ($isDragging ? 0.6 : 1)};
`;

const FolderRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const CategoryList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding-left: 16px;
`;

const CategoryRow = styled.div<{ $isDragging?: boolean }>`
  display: flex;
  align-items: center;
  gap: 8px;
  opacity: ${({ $isDragging }) => ($isDragging ? 0.6 : 1)};
`;

const CategoryButton = styled(SelectionButton)`
  font-size: 13px;
  padding: 8px 12px;
  gap: 8px;
  font-weight: 500;
  border-radius: 8px;
`;

const CategoryCollapse = styled.div<{ $open: boolean }>`
  display: grid;
  grid-template-rows: ${({ $open }) => ($open ? "1fr" : "0fr")};
  transition: grid-template-rows 0.32s cubic-bezier(0.4, 0, 0.2, 1);
`;

const CategoryCollapseInner = styled.div<{ $open: boolean }>`
  overflow: hidden;
  opacity: ${({ $open }) => ($open ? 1 : 0)};
  transform: translateY(${({ $open }) => ($open ? "0" : "-8px")});
  transition: opacity 0.28s ease, transform 0.28s ease, padding-top 0.28s ease;
  padding-top: ${({ $open }) => ($open ? "8px" : "0")};
  pointer-events: ${({ $open }) => ($open ? "auto" : "none")};
`;

const FolderIcon = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: ${({ theme }) => theme.app.palette.smokeBlue[500]};
`;

const SelectionLabel = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  flex: 1;
  min-width: 0;
`;

const DragHandleBase = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  border: 1px solid ${({ theme }) => theme.app.border};
  background: ${({ theme }) => theme.app.bg.white};
  color: ${({ theme }) => theme.app.text.light1};
  cursor: grab;
  transition: background 0.2s ease, color 0.2s ease, transform 0.2s ease;

  &:hover {
    background: ${({ theme }) => theme.app.bg.gray1};
    color: ${({ theme }) => theme.app.text.main};
    transform: translateY(-1px);
  }

  &:active {
    cursor: grabbing;
  }
`;

const DragHandle = styled(DragHandleBase)`
  width: 32px;
  height: 32px;
`;

const SmallDragHandle = styled(DragHandleBase)`
  width: 28px;
  height: 28px;
`;

const linePulse = keyframes`
  0%,
  100% {
    transform: scaleX(1);
    opacity: 0.7;
  }
  50% {
    transform: scaleX(0.85);
    opacity: 1;
  }
`;

const ListIcon = styled.span`
  display: inline-flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  gap: 3px;
  width: 18px;
  height: 16px;
`;

const Line = styled.span`
  display: block;
  width: 100%;
  height: 2px;
  border-radius: 999px;
  background: ${({ theme }) => theme.app.palette.smokeBlue[500]};
  opacity: 0.85;
  transform-origin: left;
  animation: ${linePulse} 2.4s ease-in-out infinite;

  &:nth-child(2) {
    animation-delay: 0.2s;
  }

  &:nth-child(3) {
    animation-delay: 0.4s;
  }
`;

const EmptyCategories = styled.div`
  padding: 8px 10px 8px 18px;
  margin-left: 4px;
  border-radius: 6px;
  background: ${({ theme }) => theme.app.bg.gray1};
  color: ${({ theme }) => theme.app.text.light1};
  font-size: 12px;
`;

const AddButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border-radius: 6px;
  border: 1px solid ${({ theme }) => theme.app.border};
  background: ${({ theme }) => theme.app.bg.white};
  color: ${({ theme }) => theme.app.text.main};
  cursor: pointer;
  transition: background 0.2s ease;

  &:hover {
    background: ${({ theme }) => theme.app.bg.gray1};
  }
`;

const FooterSection = styled.div`
  margin-top: auto;
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const FooterTitle = styled.p`
  font-size: 11px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: ${({ theme }) => theme.app.text.light2};
`;

const FooterButtons = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

const FooterButton = styled.button<{ $active?: boolean }>`
  width: 100%;
  padding: 10px 12px;
  border-radius: 10px;
  border: 1px solid
    ${({ theme, $active }) =>
      $active ? theme.app.palette.smokeBlue[200] : theme.app.border};
  background: ${({ theme, $active }) =>
    $active ? theme.app.bg.gray1 : theme.app.bg.white};
  color: ${({ theme, $active }) =>
    $active ? theme.app.palette.smokeBlue[500] : theme.app.text.light1};
  font-size: 13px;
  font-weight: 600;
  text-align: left;
  cursor: pointer;
  transition: background 0.2s ease, border 0.2s ease, color 0.2s ease,
    transform 0.2s ease;

  &:hover {
    background: ${({ theme }) => theme.app.bg.gray1};
    color: ${({ theme }) => theme.app.text.main};
    transform: translateY(-1px);
  }
`;

type DragMetadata =
  | {
      type: "folder";
      folderId: string;
    }
  | {
      type: "category";
      folderId: string;
      categoryId: string;
    };

const getCategoryKey = (folderId: string, categoryId: string) =>
  `category-${folderId}-${categoryId}`;

type FolderSortableItemProps = {
  folder: GeneralTodoFolder;
  isExpanded: boolean;
  selectedCategoryId: string | null;
  onSelectFolder: (folderId: string) => void;
  onSelectCategory: (categoryId: string) => void;
  onFolderContextMenu: (
    event: MouseEvent<HTMLButtonElement>,
    folderId: string
  ) => void;
  onCategoryContextMenu: (
    event: MouseEvent<HTMLButtonElement>,
    folderId: string,
    categoryId: string
  ) => void;
};

type CategorySortableItemProps = {
  folderId: string;
  category: GeneralTodoCategory;
  isActive: boolean;
  onSelectCategory: (categoryId: string) => void;
  onCategoryContextMenu: (
    event: MouseEvent<HTMLButtonElement>,
    folderId: string,
    categoryId: string
  ) => void;
};

const CategorySortableItem = ({
  folderId,
  category,
  isActive,
  onSelectCategory,
  onCategoryContextMenu,
}: CategorySortableItemProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    setActivatorNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: getCategoryKey(folderId, category.id),
    data: {
      type: "category",
      folderId,
      categoryId: category.id,
    } satisfies DragMetadata,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <CategoryRow ref={setNodeRef} style={style} $isDragging={isDragging}>
      <CategoryButton
        type="button"
        onClick={() => onSelectCategory(category.id)}
        onContextMenu={(event) =>
          onCategoryContextMenu(event, folderId, category.id)
        }
        $isActive={isActive}
      >
        <SelectionLabel>
          <ListIcon aria-hidden="true">
            <Line />
            <Line />
            <Line />
          </ListIcon>
          {category.name}
        </SelectionLabel>
      </CategoryButton>
      <SmallDragHandle
        type="button"
        aria-label={`${category.name} 카테고리 순서 변경`}
        ref={setActivatorNodeRef}
        {...attributes}
        {...listeners}
      >
        <FiMenu size={14} />
      </SmallDragHandle>
    </CategoryRow>
  );
};

const FolderSortableItem = ({
  folder,
  isExpanded,
  selectedCategoryId,
  onSelectFolder,
  onSelectCategory,
  onFolderContextMenu,
  onCategoryContextMenu,
}: FolderSortableItemProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    setActivatorNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: folder.id,
    data: {
      type: "folder",
      folderId: folder.id,
    } satisfies DragMetadata,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <FolderItem ref={setNodeRef} style={style} $isDragging={isDragging}>
      <FolderRow>
        <SelectionButton
          type="button"
          onClick={() => onSelectFolder(folder.id)}
          onContextMenu={(event) => onFolderContextMenu(event, folder.id)}
          $isActive={isExpanded}
        >
          <SelectionLabel>
            <FolderIcon>
              <FiFolder size={16} />
            </FolderIcon>
            {folder.name}
          </SelectionLabel>
        </SelectionButton>
        <DragHandle
          type="button"
          aria-label={`${folder.name} 폴더 순서 변경`}
          ref={setActivatorNodeRef}
          {...attributes}
          {...listeners}
        >
          <FiMenu size={16} />
        </DragHandle>
      </FolderRow>

      <CategoryCollapse $open={isExpanded}>
        <CategoryCollapseInner $open={isExpanded}>
          {folder.categories.length > 0 ? (
            <SortableContext
              items={folder.categories.map((category) =>
                getCategoryKey(folder.id, category.id)
              )}
              strategy={verticalListSortingStrategy}
            >
              <CategoryList>
                {folder.categories.map((category) => (
                  <CategorySortableItem
                    key={category.id}
                    folderId={folder.id}
                    category={category}
                    isActive={category.id === selectedCategoryId}
                    onSelectCategory={onSelectCategory}
                    onCategoryContextMenu={onCategoryContextMenu}
                  />
                ))}
              </CategoryList>
            </SortableContext>
          ) : (
            <EmptyCategories>
              우클릭 후 카테고리를 추가해보세요.
            </EmptyCategories>
          )}
        </CategoryCollapseInner>
      </CategoryCollapse>
    </FolderItem>
  );
};

interface Props {
  folders: GeneralTodoFolder[];
  selectedFolderId: string | null;
  selectedCategoryId: string | null;
  viewMode: "active" | "completed" | "trash";
  onSelectFolder: (folderId: string) => void;
  onSelectCategory: (categoryId: string) => void;
  onAddFolder: () => void;
  onFolderContextMenu: (
    event: MouseEvent<HTMLButtonElement>,
    folderId: string
  ) => void;
  onCategoryContextMenu: (
    event: MouseEvent<HTMLButtonElement>,
    folderId: string,
    categoryId: string
  ) => void;
  onReorderFolders: (oldIndex: number, newIndex: number) => void;
  onReorderCategories: (
    folderId: string,
    oldIndex: number,
    newIndex: number
  ) => void;
  onSelectView: (view: "completed" | "trash") => void;
}

const GeneralTodoSidebar = ({
  folders,
  selectedFolderId,
  selectedCategoryId,
  viewMode,
  onSelectFolder,
  onSelectCategory,
  onAddFolder,
  onFolderContextMenu,
  onCategoryContextMenu,
  onReorderFolders,
  onReorderCategories,
  onSelectView,
}: Props) => {
  const sensors = useSensors(
    useSensor(MouseSensor, {
      activationConstraint: {
        distance: 6,
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 150,
        tolerance: 8,
      },
    })
  );

  const folderItems = useMemo(
    () => folders.map((folder) => folder.id),
    [folders]
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over) {
      return;
    }

    const activeMeta = active.data.current as DragMetadata | undefined;
    const overMeta = over.data.current as DragMetadata | undefined;

    if (!activeMeta || !overMeta) {
      return;
    }

    if (activeMeta.type === "folder" && overMeta.type === "folder") {
      const oldIndex = folders.findIndex(
        (folder) => folder.id === activeMeta.folderId
      );
      const newIndex = folders.findIndex(
        (folder) => folder.id === overMeta.folderId
      );

      if (oldIndex !== -1 && newIndex !== -1 && oldIndex !== newIndex) {
        onReorderFolders(oldIndex, newIndex);
      }

      return;
    }

    if (
      activeMeta.type === "category" &&
      overMeta.type === "category" &&
      activeMeta.folderId === overMeta.folderId
    ) {
      const folder = folders.find((item) => item.id === activeMeta.folderId);

      if (!folder) {
        return;
      }

      const oldIndex = folder.categories.findIndex(
        (category) => category.id === activeMeta.categoryId
      );
      const newIndex = folder.categories.findIndex(
        (category) => category.id === overMeta.categoryId
      );

      if (oldIndex !== -1 && newIndex !== -1 && oldIndex !== newIndex) {
        onReorderCategories(activeMeta.folderId, oldIndex, newIndex);
      }
    }
  };

  const hasFolders = folders.length > 0;

  return (
    <SidebarContainer>
      <SectionHeader>
        <SectionTitle>리스트</SectionTitle>
        <AddButton type="button" onClick={onAddFolder} aria-label="폴더 추가">
          <MdAdd size={16} />
        </AddButton>
      </SectionHeader>

      {hasFolders ? (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={folderItems}
            strategy={verticalListSortingStrategy}
          >
            <List>
              {folders.map((folder) => (
                <FolderSortableItem
                  key={folder.id}
                  folder={folder}
                  isExpanded={folder.id === selectedFolderId}
                  selectedCategoryId={selectedCategoryId}
                  onSelectFolder={onSelectFolder}
                  onSelectCategory={onSelectCategory}
                  onFolderContextMenu={onFolderContextMenu}
                  onCategoryContextMenu={onCategoryContextMenu}
                />
              ))}
            </List>
          </SortableContext>
        </DndContext>
      ) : (
        <PlaceholderMessage>
          등록된 리스트가 없습니다. 오른쪽 + 버튼으로 새 폴더를 추가해보세요.
        </PlaceholderMessage>
      )}

      <FooterSection>
        <FooterTitle>기타</FooterTitle>
        <FooterButtons>
          <FooterButton
            type="button"
            $active={viewMode === "completed"}
            onClick={() => onSelectView("completed")}
          >
            완료
          </FooterButton>
          <FooterButton
            type="button"
            $active={viewMode === "trash"}
            onClick={() => onSelectView("trash")}
          >
            휴지통
          </FooterButton>
        </FooterButtons>
      </FooterSection>
    </SidebarContainer>
  );
};

export default GeneralTodoSidebar;
