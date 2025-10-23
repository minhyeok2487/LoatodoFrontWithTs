import { useMemo, useState } from "react";
import type { FormEvent } from "react";
import styled from "styled-components";

import WideDefaultLayout from "@layouts/WideDefaultLayout";

import GeneralTodoDetail from "./components/general/GeneralTodoDetail";
import GeneralTodoForm from "./components/general/GeneralTodoForm";
import GeneralTodoList from "./components/general/GeneralTodoList";
import GeneralTodoSidebar from "./components/general/GeneralTodoSidebar";
import type {
  GeneralTodoFolder,
  GeneralTodoItem,
} from "./components/general/types";

const folders: GeneralTodoFolder[] = [
  {
    id: "personal",
    name: "개인",
    categories: ["일상", "건강", "취미"],
  },
  {
    id: "work",
    name: "업무",
    categories: ["아이디어", "진행 중", "대기"],
  },
];

const initialTodos: GeneralTodoItem[] = [
  {
    id: 1,
    title: "체력 단련",
    description: "저녁 식사 후 30분 스트레칭과 가벼운 러닝",
    folderId: "personal",
    category: "건강",
  },
  {
    id: 2,
    title: "사이드 프로젝트 아이디어 정리",
    description: "개인 프로젝트 기능 목록을 정리하고 우선순위 결정",
    folderId: "work",
    category: "아이디어",
  },
  {
    id: 3,
    title: "사진 편집",
    description: "지난 여행 사진 중 SNS에 올릴 만한 사진 후보 선정",
    folderId: "personal",
    category: "취미",
  },
];

const GeneralTodoIndex = () => {
  const [selectedFolderId, setSelectedFolderId] = useState(folders[0].id);
  const [selectedCategory, setSelectedCategory] = useState(
    folders[0].categories[0]
  );
  const [todos, setTodos] = useState<GeneralTodoItem[]>(initialTodos);
  const [selectedTodoId, setSelectedTodoId] = useState<number | null>(null);
  const [todoTitle, setTodoTitle] = useState("");
  const [todoDescription, setTodoDescription] = useState("");

  const categoriesForFolder = useMemo(() => {
    return (
      folders.find((folder) => folder.id === selectedFolderId)?.categories ?? []
    );
  }, [selectedFolderId]);

  const todosForSelection = useMemo(() => {
    return todos.filter(
      (todo) =>
        todo.folderId === selectedFolderId &&
        todo.category === selectedCategory
    );
  }, [todos, selectedFolderId, selectedCategory]);

  const selectedTodo = useMemo(() => {
    return selectedTodoId
      ? todos.find((todo) => todo.id === selectedTodoId) ?? null
      : null;
  }, [selectedTodoId, todos]);

  const handleAddTodo = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const trimmedTitle = todoTitle.trim();
    const trimmedDescription = todoDescription.trim();

    if (!trimmedTitle) {
      return;
    }

    const newTodo: GeneralTodoItem = {
      id: Date.now(),
      title: trimmedTitle,
      description:
        trimmedDescription || "할 일의 세부 내용을 메모로 작성해보세요.",
      folderId: selectedFolderId,
      category: selectedCategory,
    };

    setTodos((prev) => [...prev, newTodo]);
    setTodoTitle("");
    setTodoDescription("");
    setSelectedTodoId(newTodo.id);
  };

  const handleSelectFolder = (folderId: string) => {
    setSelectedFolderId(folderId);

    const nextCategories =
      folders.find((folder) => folder.id === folderId)?.categories ?? [];
    setSelectedCategory(nextCategories[0] ?? "");
    setSelectedTodoId(null);
  };

  const handleSelectCategory = (category: string) => {
    setSelectedCategory(category);
    setSelectedTodoId(null);
  };

  return (
    <WideDefaultLayout pageTitle="일반 할 일" description="폴더와 카테고리로 정리하는 개인용 투두">
      <Container>
        <SidebarColumn>
          <GeneralTodoSidebar
            folders={folders}
            selectedFolderId={selectedFolderId}
            categories={categoriesForFolder}
            selectedCategory={selectedCategory}
            onSelectFolder={handleSelectFolder}
            onSelectCategory={handleSelectCategory}
          />
        </SidebarColumn>

        <TodoColumn>
          <GeneralTodoForm
            title={todoTitle}
            description={todoDescription}
            onTitleChange={setTodoTitle}
            onDescriptionChange={setTodoDescription}
            onSubmit={handleAddTodo}
          />
          <GeneralTodoList
            todos={todosForSelection}
            selectedTodoId={selectedTodoId}
            onSelectTodo={(todoId) => setSelectedTodoId(todoId)}
          />
        </TodoColumn>

        <DetailColumn>
          <GeneralTodoDetail todo={selectedTodo} folders={folders} />
        </DetailColumn>
      </Container>
    </WideDefaultLayout>
  );
};

export default GeneralTodoIndex;

const Container = styled.div`
  width: 100%;
  min-height: 70vh;
  display: grid;
  grid-template-columns: 20% 40% 40%;
  gap: 16px;

  ${({ theme }) => theme.medias.max1100} {
    grid-template-columns: 1fr;
  }
`;

const ColumnBase = styled.div`
  background: ${({ theme }) => theme.app.bg.white};
  border: 1px solid ${({ theme }) => theme.app.border};
  border-radius: 8px;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const SidebarColumn = styled(ColumnBase)`
  gap: 20px;
`;

const TodoColumn = styled(ColumnBase)`
  gap: 16px;
`;

const DetailColumn = styled(ColumnBase)`
  gap: 16px;
`;
