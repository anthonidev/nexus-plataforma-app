export interface UserPointsResponse {
  availablePoints: number;
  totalEarnedPoints: number;
  totalWithdrawnPoints: number;
  membershipPlan: {
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
  metadata?: Record<string, any>;
  createdAt: Date;
}
