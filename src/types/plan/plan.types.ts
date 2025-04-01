export interface MembershipPlanResponse {
  plans: MembershipPlan[];
  userMembership: {
    hasMembership: boolean;
    status?: "PENDING" | "ACTIVE" | "EXPIRED" | "INACTIVE";
    plan?: {
      id: number;
      name: string;
      price: string;
    };
    nextReconsumptionDate?: string;
    endDate?: string;
    message?: string;
  };
}

export interface MembershipPlan {
  id: number;
  name: string;
  price: string;
  checkAmount: string;
  binaryPoints: number;
  commissionPercentage: string;
  directCommissionAmount: string;
  products: string[];
  benefits: string[];
  isActive: boolean;
  displayOrder: number;
  createdAt: string;
  updatedAt: string;
  upgradeCost?: number;
  isUpgrade?: boolean;
}

export interface PaymentDetail {
  bankName?: string;
  transactionReference: string;
  transactionDate: string;
  amount: number;
  fileIndex: number;
}

export interface MembershipSubscriptionData {
  planId: number;
  totalAmount: number;
  notes?: string;
  payments: PaymentDetail[];
}
