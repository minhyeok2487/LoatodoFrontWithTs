import type {
  PageResponse,
  AdminMember,
  AdminMemberDetail,
  AdminMemberUpdateRequest,
  AdminMemberListParams,
  AdminCharacter,
  AdminCharacterDetail,
  AdminCharacterUpdateRequest,
  AdminCharacterListParams,
  AdminContent,
  AdminContentCreateRequest,
  ContentCategory,
  DailyStats,
  DashboardSummary,
  RecentActivity,
  AdminComment,
  AdminCommentListParams,
  AdminFriend,
  AdminFriendListParams,
  AdminNotification,
  AdminNotificationListParams,
  AdminBroadcastRequest,
  AdminBroadcastResponse,
} from "@core/types/admin";

import mainAxios from "./mainAxios";

const ADMIN_BASE = "/admin/api/v1";

// ==================== Dashboard ====================
export const getDailyMembers = (limit = 14): Promise<DailyStats[]> => {
  return mainAxios
    .get(`${ADMIN_BASE}/dashboard/daily-members`, { params: { limit } })
    .then((res) => res.data);
};

export const getDailyCharacters = (limit = 14): Promise<DailyStats[]> => {
  return mainAxios
    .get(`${ADMIN_BASE}/dashboard/daily-characters`, { params: { limit } })
    .then((res) => res.data);
};

export const getDashboardSummary = (): Promise<DashboardSummary> => {
  return mainAxios
    .get(`${ADMIN_BASE}/dashboard/summary`)
    .then((res) => res.data);
};

export const getRecentActivities = (limit = 10): Promise<RecentActivity[]> => {
  return mainAxios
    .get(`${ADMIN_BASE}/dashboard/recent-activities`, { params: { limit } })
    .then((res) => res.data);
};

// ==================== Members ====================
export const getMembers = (
  params: AdminMemberListParams = {}
): Promise<PageResponse<AdminMember>> => {
  return mainAxios
    .get(`${ADMIN_BASE}/members`, { params })
    .then((res) => res.data);
};

export const getMember = (memberId: number): Promise<AdminMemberDetail> => {
  return mainAxios
    .get(`${ADMIN_BASE}/members/${memberId}`)
    .then((res) => res.data);
};

export const updateMember = (
  memberId: number,
  data: AdminMemberUpdateRequest
): Promise<AdminMemberDetail> => {
  return mainAxios
    .put(`${ADMIN_BASE}/members/${memberId}`, data)
    .then((res) => res.data);
};

export const deleteMember = (memberId: number): Promise<void> => {
  return mainAxios.delete(`${ADMIN_BASE}/members/${memberId}`);
};

// ==================== Characters ====================
export const getCharacters = (
  params: AdminCharacterListParams = {}
): Promise<PageResponse<AdminCharacter>> => {
  return mainAxios
    .get(`${ADMIN_BASE}/characters`, { params })
    .then((res) => res.data);
};

export const getCharacter = (
  characterId: number
): Promise<AdminCharacterDetail> => {
  return mainAxios
    .get(`${ADMIN_BASE}/characters/${characterId}`)
    .then((res) => res.data);
};

export const updateCharacter = (
  characterId: number,
  data: AdminCharacterUpdateRequest
): Promise<AdminCharacterDetail> => {
  return mainAxios
    .put(`${ADMIN_BASE}/characters/${characterId}`, data)
    .then((res) => res.data);
};

export const deleteCharacter = (
  characterId: number,
  hardDelete = false
): Promise<void> => {
  return mainAxios.delete(`${ADMIN_BASE}/characters/${characterId}`, {
    params: { hardDelete },
  });
};

// ==================== Contents ====================
export const getContents = (category?: ContentCategory): Promise<AdminContent[]> => {
  return mainAxios
    .get(`${ADMIN_BASE}/contents`, { params: category ? { category } : undefined })
    .then((res) => res.data);
};

export const getContent = (contentId: number): Promise<AdminContent> => {
  return mainAxios
    .get(`${ADMIN_BASE}/contents/${contentId}`)
    .then((res) => res.data);
};

export const createContent = (
  data: AdminContentCreateRequest
): Promise<AdminContent> => {
  return mainAxios
    .post(`${ADMIN_BASE}/contents`, data)
    .then((res) => res.data);
};

export const updateContent = (
  contentId: number,
  data: Partial<AdminContentCreateRequest>
): Promise<AdminContent> => {
  return mainAxios
    .put(`${ADMIN_BASE}/contents/${contentId}`, data)
    .then((res) => res.data);
};

export const deleteContent = (contentId: number): Promise<void> => {
  return mainAxios.delete(`${ADMIN_BASE}/contents/${contentId}`);
};

// ==================== Comments ====================
export const getComments = (
  params: AdminCommentListParams = {}
): Promise<PageResponse<AdminComment>> => {
  return mainAxios
    .get(`${ADMIN_BASE}/comments`, { params })
    .then((res) => res.data);
};

export const deleteComment = (commentId: number): Promise<void> => {
  return mainAxios.delete(`${ADMIN_BASE}/comments/${commentId}`);
};

// ==================== Friends ====================
export const getFriends = (
  params: AdminFriendListParams = {}
): Promise<PageResponse<AdminFriend>> => {
  return mainAxios
    .get(`${ADMIN_BASE}/friends`, { params })
    .then((res) => res.data);
};

export const deleteFriend = (friendId: number): Promise<void> => {
  return mainAxios.delete(`${ADMIN_BASE}/friends/${friendId}`);
};

// ==================== Notifications ====================
export const getNotifications = (
  params: AdminNotificationListParams = {}
): Promise<PageResponse<AdminNotification>> => {
  return mainAxios
    .get(`${ADMIN_BASE}/notifications`, { params })
    .then((res) => res.data);
};

export const sendBroadcast = (
  data: AdminBroadcastRequest
): Promise<AdminBroadcastResponse> => {
  return mainAxios
    .post(`${ADMIN_BASE}/notifications/broadcast`, data)
    .then((res) => res.data);
};

export const deleteNotification = (notificationId: number): Promise<void> => {
  return mainAxios.delete(`${ADMIN_BASE}/notifications/${notificationId}`);
};
