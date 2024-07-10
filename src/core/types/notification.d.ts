export type Notification = {
  id: number;
  content: string;
  createdDate: string;
  read: boolean;
} & (
  | {
      notificationType: "FRIEND";
      data: {
        friendId: number;
        friendCharacterName: string;
        friendUsername: string;
      };
    }
  | {
      notificationType: "BOARD";
      data: {
        boardId: number;
      };
    }
  | {
      notificationType: "COMMENT";
      data: {
        commentId: number;
        page: number;
      };
    }
);

export interface NotificationLink {
  url: string;
}

export interface NotificationStatus {
  latestCreatedDate: string;
  unreadCount: number;
}
