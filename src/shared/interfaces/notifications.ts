export interface INotification {
  type: string;
  message: string;
  userId: any;
  createdAt: Date;
  read: boolean;
}

export interface INotificationResponse {
  id: string;
  type: string;
  message: string;
  userId: any;
  createdAt: Date;
  read: boolean;
}
