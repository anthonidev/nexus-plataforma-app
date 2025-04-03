export interface PaymentImageResponse {
  id: number;
  url: string;
  cloudinaryPublicId: string;
  amount: number;
  bankName?: string;
  transactionReference: string;
  transactionDate: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface PaymentUserResponse {
  id: string;
  email: string;
  referralCode: string;
  isActive: boolean;
}

export interface PaymentReviewerResponse {
  id: string;
  email: string;
}

export interface PaymentConfigResponse {
  id: number;
  name: string;
  code: string;
  description?: string;
  requiresApproval: boolean;
  isActive: boolean;
  minimumAmount?: number;
  maximumAmount?: number;
}

export interface PaymentResponse {
  id: number;
  amount: number;
  status: "PENDING" | "APPROVED" | "REJECTED";
  rejectionReason?: string;
  createdAt: string;
  updatedAt: string;
  reviewedAt?: string;
  isArchived: boolean;
  relatedEntityType?: string;
  relatedEntityId?: number;
  transactionId?: string;
  paymentMethod?: string;
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
