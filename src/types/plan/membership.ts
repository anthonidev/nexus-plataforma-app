export interface MembershipDetailResponse {
  membership: {
    id: number;
    status: "PENDING" | "ACTIVE" | "INACTIVE" | "EXPIRED";
    startDate: string;
    endDate: string;
    autoRenewal: boolean;
    paidAmount: number;
    plan: {
      id: number;
      name: string;
      price: number;
      binaryPoints: number;
      checkAmount: number;
      commissionPercentage: number;
    };
    nextReconsumptionDate: string;
  };
  lastReconsumption: {
    id: number;
    amount: number;
    status: "PENDING" | "ACTIVE" | "CANCELLED";
    periodDate: Date;
    createdAt: Date;
  } | null;
  pendingReconsumption: {
    id: number;
    amount: number;
    status: "PENDING" | "ACTIVE" | "CANCELLED";
    periodDate: Date;
    createdAt: Date;
  } | null;
  canReconsume: boolean;
}

export interface MembershipHistoryItem {
  id: number;
  action:
    | "CREATED"
    | "RENEWED"
    | "CANCELLED"
    | "UPGRADED"
    | "DOWNGRADED"
    | "REACTIVATED"
    | "EXPIRED"
    | "STATUS_CHANGED"
    | "PAYMENT_RECEIVED";
  changes?: Record<string, any>;
  notes?: string;
  metadata?: Record<string, any>;
  createdAt: Date;
  amount: number;
  status: "PENDING" | "ACTIVE" | "CANCELLED";
  methodPayment?: "VOUCHER" | "POINTS";
  periodDate: Date;
  paymentReference?: string;
  updatedAt: Date;
}

export interface ReconsumptionsResponse {
  items: MembershipHistoryItem[];
  meta: {
    totalItems: number;
    itemsPerPage: number;
    totalPages: number;
    currentPage: number;
  };
  canReconsume: boolean;
  autoRenewal: boolean;
  reconsumptionAmount: number;
}
export interface MembershipHistoryResponse {
  items: MembershipHistoryItem[];
  meta: {
    totalItems: number;
    itemsPerPage: number;
    totalPages: number;
    currentPage: number;
  };
}
