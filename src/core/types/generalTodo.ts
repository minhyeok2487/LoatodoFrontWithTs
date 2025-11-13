export type ViewMode = "LIST" | "KANBAN";
export type CompletionFilter = "all" | "completed" | "incomplete";

export interface GeneralTodoFolder {
  id: number;
  name: string;
  username: string;
  sortOrder: number;
}

export interface GeneralTodoCategory {
  id: number;
  name: string;
  color: string | null;
  folderId: number;
  username: string;
  sortOrder: number;
  viewMode: ViewMode;
}

export interface GeneralTodoItem {
  id: number;
  title: string;
  description: string | null;
  folderId: number;
  categoryId: number;
  username: string;
  dueDate: string | null;
  completed: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface GeneralTodoOverviewResponse {
  folders: GeneralTodoFolder[];
  categories: GeneralTodoCategory[];
  todos: GeneralTodoItem[];
}

export interface FolderWithCategories extends GeneralTodoFolder {
  categories: GeneralTodoCategory[];
}

export interface DraftTodo {
  title: string;
  description: string;
  dueDate: string;
  categoryId: number | null;
}

export interface CreateGeneralTodoFolderRequest {
  name: string;
  sortOrder?: number;
}

export interface UpdateGeneralTodoFolderRequest {
  name: string;
}

export interface CreateGeneralTodoCategoryRequest {
  name: string;
  color?: string | null;
  viewMode?: ViewMode;
  sortOrder?: number;
}

export interface UpdateGeneralTodoCategoryRequest {
  name?: string;
  color?: string | null;
  viewMode?: ViewMode;
}

export interface CreateGeneralTodoItemRequest {
  folderId: number;
  categoryId: number;
  title: string;
  description?: string | null;
  dueDate?: string | null;
}

export interface UpdateGeneralTodoItemRequest {
  title?: string;
  description?: string | null;
  dueDate?: string | null;
  categoryId?: number;
}
