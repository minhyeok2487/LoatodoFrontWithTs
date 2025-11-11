import type { MouseEvent } from "react";
import styled from "styled-components";

import Button from "@components/Button";
import type { FolderWithCategories } from "@core/types/generalTodo";

interface FolderTreeProps {
  folderTree: FolderWithCategories[];
  selectedFolderId: number | null;
  activeCategoryId: number | null;
  onSelectFolder: (folderId: number) => void;
  onSelectCategory: (folderId: number, categoryId: number) => void;
  onClickCreateFolder: () => void;
  onContextMenuFolder: (event: MouseEvent<HTMLButtonElement>, folder: FolderWithCategories) => void;
}

const FolderTree = ({
  folderTree,
  selectedFolderId,
  activeCategoryId,
  onSelectFolder,
  onSelectCategory,
  onClickCreateFolder,
  onContextMenuFolder,
}: FolderTreeProps) => {
  const folderCount = folderTree.length;
  const categoryCount = folderTree.reduce(
    (total, folder) => total + folder.categories.length,
    0
  );

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
        <FolderList>
          {folderTree.map((folder) => (
            <FolderBlock key={folder.id}>
              <FolderButton
                type="button"
                $active={folder.id === selectedFolderId}
                onClick={() => onSelectFolder(folder.id)}
                onContextMenu={(event) => onContextMenuFolder(event, folder)}
              >
                <FolderMeta>
                  <FolderName>{folder.name}</FolderName>
                  <FolderDetail>
                    {folder.categories.length}개의 카테고리
                  </FolderDetail>
                </FolderMeta>
                <FolderOrder>정렬 {folder.sortOrder + 1}</FolderOrder>
              </FolderButton>

              {folder.categories.length > 0 ? (
                <CategoryList>
                  {folder.categories.map((category) => (
                    <CategoryButton
                      key={category.id}
                      type="button"
                      $active={category.id === activeCategoryId}
                      onClick={() => onSelectCategory(folder.id, category.id)}
                    >
                      <CategoryColor $color={category.color} />
                      <CategoryMeta>
                        <strong>{category.name}</strong>
                        <small>
                          보기:{" "}
                          {category.viewMode === "KANBAN" ? "칸반" : "리스트"}
                        </small>
                      </CategoryMeta>
                    </CategoryButton>
                  ))}
                </CategoryList>
              ) : (
                <EmptyState>카테고리가 없어요.</EmptyState>
              )}
            </FolderBlock>
          ))}
        </FolderList>
      ) : (
        <EmptyPlaceholder>
          아직 등록된 폴더가 없어요. 폴더를 생성해 주세요.
        </EmptyPlaceholder>
      )}
    </Wrapper>
  );
};

export default FolderTree;

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

const FolderBlock = styled.div`
  border: 1px solid ${({ theme }) => theme.app.border};
  border-radius: 16px;
  padding: 16px;
  background: ${({ theme }) => theme.app.bg.gray1};

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

const FolderOrder = styled.span`
  font-size: 12px;
  color: ${({ theme }) => theme.app.text.light2};
`;

const CategoryList = styled.div`
  margin-top: 12px;
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const CategoryButton = styled.button<{ $active: boolean }>`
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
