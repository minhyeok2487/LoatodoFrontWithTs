export type ViewMode = "LIST" | "KANBAN" | "TIMELINE";
export type StatusFilter = "all" | number;

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
  statuses?: GeneralTodoStatus[];
}

export interface GeneralTodoStatus {
  id: number;
  categoryId: number;
  name: string;
  sortOrder: number;
  username: string;
}

export interface GeneralTodoItem {
  id: number;
  title: string;
  description: string | null;
  folderId: number;
  categoryId: number;
  username: string;
  startDate: string | null;
  dueDate: string | null;
  isAllDay: boolean;
  statusId: number;
  statusName: string;
  createdAt: string;
  updatedAt: string;
}

export interface GeneralTodoOverviewResponse {
  folders: GeneralTodoFolder[];
  categories: GeneralTodoCategory[];
  todos: GeneralTodoItem[];
  statuses: GeneralTodoStatus[];
}

export interface FolderWithCategories extends GeneralTodoFolder {
  categories: GeneralTodoCategory[];
}

export interface DraftTodo {
  title: string;
  description: string;
  startDate: string;
  dueDate: string;
  isAllDay: boolean;
  categoryId: number | null;
  statusId: number | null;
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
  startDate?: string | null;
  dueDate?: string | null;
  isAllDay?: boolean;
  statusId?: number;
}

export interface UpdateGeneralTodoItemRequest {
  title?: string;
  description?: string | null;
  startDate?: string | null;
  dueDate?: string | null;
  isAllDay?: boolean;
  categoryId?: number;
  statusId?: number;
}

export interface CreateGeneralTodoStatusRequest {
  name: string;
  sortOrder?: number;
}

export interface UpdateGeneralTodoStatusRequest {
  name?: string;
}

export interface ReorderGeneralTodoStatusesRequest {
  statusIds: number[];
}

export interface UpdateGeneralTodoItemStatusRequest {
  statusId: number;
}
