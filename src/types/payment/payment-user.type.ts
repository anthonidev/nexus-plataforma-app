export interface PaymentListUserItem {
  id: number;
  amount: number;
  status: "PENDING" | "APPROVED" | "REJECTED";
  createdAt: string;
  reviewedAt?: string;
  relatedEntityType?: string;
  relatedEntityId?: number;
  paymentConfig: {
    name: string;
  };
}

export interface PaymentConfigListUserItem {
  id: number;
  name: string;
}

export interface PaginationMeta {
  totalItems: number;
  itemsPerPage: number;
  totalPages: number;
  currentPage: number;
  paymentConfigs: PaymentConfigListUserItem[];
}

export interface PaymentsListUserResponse {
  items: PaymentListUserItem[];
  meta: PaginationMeta;
}

export interface PaymentsFilters {
  page?: number;
  limit?: number;
  order?: "ASC" | "DESC";
  paymentConfigId?: number;
  status?: "PENDING" | "APPROVED" | "REJECTED";
  startDate?: string;
  endDate?: string;
}
