export type GeneralTodoFolder = {
  id: string;
  name: string;
  categories: string[];
};

export type GeneralTodoItem = {
  id: number;
  title: string;
  description: string;
  folderId: string;
  category: string;
};
