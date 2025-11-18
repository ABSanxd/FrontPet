import { NotificationChannel } from "./enums/notification-channel.enum";
import { NotificationType } from "./enums/notification-type.enum";
import { Status } from "./enums/status.enum";

export interface NotificationResponse {
  id: string;
  title: string;
  message: string;
  type: NotificationType;
  channel: NotificationChannel;
  status: Status
  createdAt: string;
  actionUrl?: string;
}

export interface NotificationPage {
  content: NotificationResponse[];
  totalPages: number;
  totalElements: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
}
