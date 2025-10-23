import styled from "styled-components";

import { SectionTitle, PlaceholderMessage, SelectionButton } from "./styles";
import type { GeneralTodoFolder } from "./types";

interface Props {
  folders: GeneralTodoFolder[];
  selectedFolderId: string;
  categories: string[];
  selectedCategory: string;
  onSelectFolder: (folderId: string) => void;
  onSelectCategory: (category: string) => void;
}

const GeneralTodoSidebar = ({
  folders,
  selectedFolderId,
  categories,
  selectedCategory,
  onSelectFolder,
  onSelectCategory,
}: Props) => {
  return (
    <SidebarContainer>
      <SectionTitle>폴더</SectionTitle>
      <List>
        {folders.map((folder) => (
          <SelectionButton
            key={folder.id}
            type="button"
            onClick={() => onSelectFolder(folder.id)}
            $isActive={folder.id === selectedFolderId}
          >
            {folder.name}
          </SelectionButton>
        ))}
      </List>

      <SectionTitle>카테고리</SectionTitle>
      <List>
        {categories.length > 0 ? (
          categories.map((category) => (
            <SelectionButton
              key={category}
              type="button"
              onClick={() => onSelectCategory(category)}
              $isActive={category === selectedCategory}
            >
              {category}
            </SelectionButton>
          ))
        ) : (
          <PlaceholderMessage>선택된 폴더에 카테고리가 없습니다.</PlaceholderMessage>
        )}
      </List>
    </SidebarContainer>
  );
};

export default GeneralTodoSidebar;

const SidebarContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const List = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;
