export interface UserPointsResponse {
  id: number;
  availablePoints: number;
  totalEarnedPoints: number;
  totalWithdrawnPoints: number;
  membershipPlan: {
    id: number;
    name: string;
  } | null;
}

export interface PointsTransactionsResponse {
  items: PointTransactionItem[];
  meta: {
    totalItems: number;
    itemsPerPage: number;
    totalPages: number;
    currentPage: number;
  };
}

export interface PointTransactionItem {
  id: number;
  type: "WITHDRAWAL" | "BINARY_COMMISSION" | "DIRECT_BONUS";
  amount: number;
  status: "PENDING" | "COMPLETED" | "CANCELLED" | "FAILED";
  membershipPlan?: {
    id: number;
    name: string;
  };
  metadata?: Record<string, any>;
  createdAt: Date;
}
