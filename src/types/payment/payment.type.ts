export interface PaymentConfig {
  id: number;
  code: string;
  name: string;
  description: string;
}

export interface Payment {
  id: number;
  amount: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
  createdAt: string;
  reviewedAt: string | null;
  relatedEntityType: string;
  relatedEntityId: number;
  paymentConfig: {
    id: number;
    code: string;
    name: string;
  };
  reviewedBy: any | null;
}

export interface PaymentsResponse {
  items: Payment[];
  meta: {
    totalItems: number;
    itemsPerPage: number;
    totalPages: number;
    currentPage: number;
    paymentConfigs: PaymentConfig[];
  };
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
