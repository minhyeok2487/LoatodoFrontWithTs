import type { MouseEvent } from "react";
import { MdAdd } from "@react-icons/all-files/md/MdAdd";
import { FiFolder } from "@react-icons/all-files/fi/FiFolder";
import styled, { keyframes } from "styled-components";

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
                  <FolderIcon>
                    <FiFolder size={16} />
                  </FolderIcon>
                  {name}
                </SelectionButton>
                <CategoryCollapse $open={isActive}>
                  <CategoryCollapseInner $open={isActive}>
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
                            <ListIcon aria-hidden="true">
                              <Line />
                              <Line />
                              <Line />
                            </ListIcon>
                            {categoryName}
                          </CategoryButton>
                        ))}
                      </CategoryList>
                    ) : (
                      <EmptyCategories>
                        우클릭 후 카테고리를 추가해보세요.
                      </EmptyCategories>
                    )}
                  </CategoryCollapseInner>
                </CategoryCollapse>
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
