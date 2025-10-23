export type GeneralTodoCategory = {
  id: string;
  name: string;
};

export type GeneralTodoFolder = {
  id: string;
  name: string;
  categories: GeneralTodoCategory[];
};

export type GeneralTodoItem = {
  id: number;
  title: string;
  description: string;
  folderId: string;
  categoryId: string;
};

export type GeneralTodoState = {
  folders: GeneralTodoFolder[];
  todos: GeneralTodoItem[];
};
