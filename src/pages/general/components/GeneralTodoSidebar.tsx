import type { MouseEvent } from "react";
import { MdAdd } from "@react-icons/all-files/md/MdAdd";
import styled from "styled-components";

import { PlaceholderMessage, SectionTitle, SelectionButton } from "./styles";
import type { GeneralTodoFolder } from "./types";

interface Props {
  folders: GeneralTodoFolder[];
  selectedFolderId: string | null;
  selectedCategoryId: string | null;
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
}

const GeneralTodoSidebar = ({
  folders,
  selectedFolderId,
  selectedCategoryId,
  onSelectFolder,
  onSelectCategory,
  onAddFolder,
  onFolderContextMenu,
  onCategoryContextMenu,
}: Props) => {
  return (
    <SidebarContainer>
      <SectionHeader>
        <SectionTitle>리스트</SectionTitle>
        <AddButton type="button" onClick={onAddFolder} aria-label="폴더 추가">
          <MdAdd size={16} />
        </AddButton>
      </SectionHeader>

      {folders.length > 0 ? (
        <List>
          {folders.map(({ id, name, categories }) => {
            const isActive = id === selectedFolderId;

            return (
              <FolderItem key={id}>
                <SelectionButton
                  type="button"
                  onClick={() => onSelectFolder(id)}
                  onContextMenu={(event) => onFolderContextMenu(event, id)}
                  $isActive={isActive}
                >
                  {name}
                </SelectionButton>

                {isActive && (
                  <>
                    {categories.length > 0 ? (
                      <CategoryList>
                        {categories.map(({ id: categoryId, name: categoryName }) => (
                          <CategoryButton
                            key={categoryId}
                            type="button"
                            onClick={() => onSelectCategory(categoryId)}
                            onContextMenu={(event) =>
                              onCategoryContextMenu(event, id, categoryId)
                            }
                            $isActive={categoryId === selectedCategoryId}
                          >
                            {categoryName}
                          </CategoryButton>
                        ))}
                      </CategoryList>
                    ) : (
                      <EmptyCategories>
                        우클릭 후 카테고리를 추가해보세요.
                      </EmptyCategories>
                    )}
                  </>
                )}
              </FolderItem>
            );
          })}
        </List>
      ) : (
        <PlaceholderMessage>
          등록된 리스트가 없습니다. 오른쪽 + 버튼으로 새 폴더를 추가해보세요.
        </PlaceholderMessage>
      )}
    </SidebarContainer>
  );
};

export default GeneralTodoSidebar;

const SidebarContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
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
`;

const FolderItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

const CategoryList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding-left: 12px;
`;

const CategoryButton = styled(SelectionButton)`
  font-size: 13px;
  padding: 8px 10px 8px 20px;
  justify-content: flex-start;
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
