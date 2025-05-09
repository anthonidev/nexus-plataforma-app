export interface PaymentImageResponse {
  id: number;
  url: string;
  amount: number;
  bankName: string;
  transactionDate: Date;
  transactionReference: string;
  pointsTransaction?: {
    id: number;
    amount: number;
  };
}

export interface PaymentUserResponse {
  id: string;
  email: string;
  personalInfo: {
    firstName: string;
    lastName: string;
    documentNumber: string;
  };
}

export interface PaymentReviewerResponse {
  id: string;
  email: string;
}

export interface PaymentConfigResponse {
  id: number;
  name: string;
}

export interface PaymentDetailUserResponse {
  id: number;
  amount: number;
  status: "PENDING" | "APPROVED" | "REJECTED";
  methodPayment: "VOUCHER" | "POINTS" | "PAYMENT_GATEWAY";
  rejectionReason?: string;
  createdAt: string;
  updatedAt: string;
  reviewedAt?: string;
  isArchived: boolean;

  metadata?: Record<string, any>;
  user: PaymentUserResponse;
  paymentConfig: PaymentConfigResponse;
  reviewedBy?: PaymentReviewerResponse;
  images: PaymentImageResponse[];
}

export interface ResponseApprovePayment {
  success: boolean;
  message: string;
  paymentId: number;
  reviewedBy: {
    id: string;
    email: string;
  };
  timestamp: Date;
}

export interface ResponseRejectPayment extends ResponseApprovePayment {
  rejectionReason: string;
}
