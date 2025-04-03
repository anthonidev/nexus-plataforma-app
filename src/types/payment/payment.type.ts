export interface PaymentListItem {
  id: number;
  amount: number;
  status: "PENDING" | "APPROVED" | "REJECTED";
  createdAt: string;
  reviewedAt?: string;
  relatedEntityType?: string;
  relatedEntityId?: number;

  paymentConfig: {
    id: number;
    name: string;
    code: string;
  };

  reviewer?: {
    id: string;
    email: string;
  };
}

export interface PaymentConfigListItem {
  id: number;
  name: string;
  code: string;
  description?: string;
}

export interface PaginationMeta {
  totalItems: number;
  itemsPerPage: number;
  totalPages: number;
  currentPage: number;
  paymentConfigs: PaymentConfigListItem[];
}

export interface PaymentsListResponse {
  items: PaymentListItem[];
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
