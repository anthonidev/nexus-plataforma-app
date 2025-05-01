export enum NotificationType {
  VOLUME_ADDED = "VOLUME_ADDED",
  COMMISSION_EARNED = "COMMISSION_EARNED",
  RANK_ACHIEVED = "RANK_ACHIEVED",
  REFERRAL_REGISTERED = "REFERRAL_REGISTERED",
  PAYMENT_APPROVED = "PAYMENT_APPROVED",
  PAYMENT_REJECTED = "PAYMENT_REJECTED",
  MEMBERSHIP_EXPIRING = "MEMBERSHIP_EXPIRING",
  POINTS_MOVEMENT = "POINTS_MOVEMENT",
  RECONSUMPTION_REMINDER = "RECONSUMPTION_REMINDER",
  SYSTEM_ANNOUNCEMENT = "SYSTEM_ANNOUNCEMENT",
  DIRECT_BONUS = "DIRECT_BONUS",
  MEMBERSHIP_UPGRADE = "MEMBERSHIP_UPGRADE",
}

export interface Notification {
  id: number;
  type: NotificationType;
  title: string;
  message: string;
  isRead: boolean;
  actionUrl?: string;
  imageUrl?: string;
  metadata?: Record<string, any>;
  readAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface NotificationResponse {
  items: Notification[];
  meta: {
    totalItems: number;
    itemsPerPage: number;
    totalPages: number;
    currentPage: number;
  };
}

export interface UnreadCountResponse {
  count: number;
}

export interface NotificationFilters {
  type?: NotificationType;
  isRead?: boolean;
  limit?: number;
  page?: number;
}

export interface MarkAsReadResponse {
  success: boolean;
  message: string;
}
