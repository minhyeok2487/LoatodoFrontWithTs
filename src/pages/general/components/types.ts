export type GeneralTodoCategory = {
  id: string;
  name: string;
  color?: string | null;
  viewMode?: "list" | "kanban";
  sortOrder?: number;
  statuses?: GeneralTodoStatus[];
};

export type GeneralTodoFolder = {
  id: string;
  name: string;
  categories: GeneralTodoCategory[];
  sortOrder?: number;
};

export type GeneralTodoStatus = {
  id: string;
  categoryId: string;
  name: string;
  sortOrder: number;
  isDone: boolean;
};

export type GeneralTodoItem = {
  id: number;
  title: string;
  description: string;
  folderId: string;
  categoryId: string;
  dueDate?: string | null;
  completed: boolean;
  statusId: string | null;
  createdAt?: string;
  updatedAt?: string;
};

export type GeneralTodoState = {
  folders: GeneralTodoFolder[];
  todos: GeneralTodoItem[];
  statuses: GeneralTodoStatus[];
};
