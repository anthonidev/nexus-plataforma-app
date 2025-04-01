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
