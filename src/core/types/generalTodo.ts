export type GeneralTodoCategoryViewMode = "LIST" | "KANBAN";

export interface GeneralTodoFolderResponse {
  id: number;
  name: string;
  username: string;
  sortOrder: number;
}

export interface GeneralTodoCategoryResponse {
  id: number;
  name: string;
  color: string | null;
  folderId: number;
  username: string;
  sortOrder: number;
  viewMode: GeneralTodoCategoryViewMode;
}

export interface GeneralTodoItemResponse {
  id: number;
  title: string;
  description: string;
  folderId: number;
  categoryId: number;
  username: string;
  dueDate: string | null;
  completed: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface GeneralTodoOverviewResponse {
  folders: GeneralTodoFolderResponse[];
  categories: GeneralTodoCategoryResponse[];
  todos: GeneralTodoItemResponse[];
}

export interface CreateGeneralTodoFolderRequest {
  name: string;
  sortOrder?: number;
}

export interface UpdateGeneralTodoFolderRequest {
  name: string;
}

export interface ReorderGeneralTodoFoldersRequest {
  folderIds: number[];
}

export interface CreateGeneralTodoCategoryRequest {
  name: string;
  color?: string | null;
  sortOrder?: number;
  viewMode?: GeneralTodoCategoryViewMode;
}

export interface UpdateGeneralTodoCategoryRequest {
  name?: string;
  color?: string | null;
  viewMode?: GeneralTodoCategoryViewMode;
}

export interface ReorderGeneralTodoCategoriesRequest {
  categoryIds: number[];
}

export interface CreateGeneralTodoItemRequest {
  title: string;
  description?: string;
  folderId: number;
  categoryId: number;
  dueDate?: string | null;
  completed?: boolean;
}

export interface UpdateGeneralTodoItemRequest {
  title?: string;
  description?: string;
  folderId?: number;
  categoryId?: number;
  dueDate?: string | null;
  completed?: boolean;
}
