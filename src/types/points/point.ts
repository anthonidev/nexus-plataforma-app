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

//----------------------------
export interface DetailTransactionResponse {
  id: number;
  type: "WITHDRAWAL" | "BINARY_COMMISSION" | "DIRECT_BONUS";
  amount: number;
  pendingAmount: number;
  withdrawnAmount: number;
  status: "PENDING" | "COMPLETED" | "CANCELLED" | "FAILED";
  metadata?: Record<string, any>;
  createdAt: Date;
  listPayments: ListPayments;
}

export interface ListPayments {
  items: Item[];
  meta: Meta;
}

export interface Item {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  payment: Payment;
}

export interface Payment {
  id: number;
  amount: number;
  methodPayment: "VOUCHER" | "POINTS" | "PAYMENT_GATEWAY";
  codeOperation: string;
  banckName: string;
  dateOperation: Date;
  numberTicket: string;
  status: "PENDING" | "APPROVED" | "REJECTED" | "COMPLETED";
}

export interface Meta {
  totalItems: number;
  itemsPerPage: number;
  totalPages: number;
  currentPage: number;
}
