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
    | {
      notificationType: "COMMUNITY";
      data: {
        communityId: number;
      };
    }
    | {
      notificationType: "INSPECTION";
      data: {
        inspectionCharacterId: number;
      };
    }
  );

export interface NotificationLink {
  url: string;
}

export interface NotificationStatus {
  accessToken: string;
  latestCreatedDate: string;
  unreadCount: number;
}
