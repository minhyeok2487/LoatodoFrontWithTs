export type GeneralTodoCategory = {
  id: string;
  name: string;
  color?: string | null;
  viewMode?: "list" | "kanban";
  sortOrder?: number;
};

export type GeneralTodoFolder = {
  id: string;
  name: string;
  categories: GeneralTodoCategory[];
  sortOrder?: number;
};

export type GeneralTodoItem = {
  id: number;
  title: string;
  description: string;
  folderId: string;
  categoryId: string;
  dueDate?: string | null;
  completed: boolean;
  createdAt?: string;
  updatedAt?: string;
};

export type GeneralTodoState = {
  folders: GeneralTodoFolder[];
  todos: GeneralTodoItem[];
};
