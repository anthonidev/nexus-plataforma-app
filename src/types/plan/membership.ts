export interface MembershipDetailResponse {
  membership: {
    id: number;
    status: "PENDING" | "ACTIVE" | "INACTIVE" | "EXPIRED";
    startDate: Date;
    endDate: Date;
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
    nextReconsumptionDate: Date;
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

export interface ReconsumptionsResponse {
  items: {
    id: number;
    amount: number;
    status: "PENDING" | "ACTIVE" | "CANCELLED";
    periodDate: Date;
    paymentReference?: string;
    notes?: string;
    paymentDetails?: Record<string, any>;
    createdAt: Date;
    updatedAt: Date;
  }[];
  meta: {
    totalItems: number;
    itemsPerPage: number;
    totalPages: number;
    currentPage: number;
  };
  canReconsume: boolean;
  autoRenewal: boolean;
}
export interface MembershipHistoryResponse {
  items: {
    id: number;
    action:
      | "CREATED"
      | "RENEWED"
      | "CANCELLED"
      | "UPGRADED"
      | "DOWNGRADED"
      | "REACTIVATED"
      | "EXPIRED "
      | "STATUS_CHANGED"
      | "PAYMENT_RECEIVED";
    changes?: Record<string, any>;
    notes?: string;
    metadata?: Record<string, any>;
    createdAt: Date;
  }[];
  meta: {
    totalItems: number;
    itemsPerPage: number;
    totalPages: number;
    currentPage: number;
  };
}
