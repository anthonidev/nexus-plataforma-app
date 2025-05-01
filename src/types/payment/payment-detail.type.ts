export interface PaymentImageResponse {
  id: number;
  url: string;
  amount: number;
  bankName?: string;
  transactionReference: string;
  transactionDate: string;
}

export interface PaymentUserResponse {
  email: string;
  personalInfo: {
    firstName: string;
    lastName: string;
    documentNumber: string;
  };
  contactInfo: {
    phone: string;
  };
}

export interface PaymentReviewerResponse {
  email: string;
}

export interface PaymentConfigResponse {
  name: string;
}

export interface PaymentResponse {
  id: number;
  amount: number;
  status: "PENDING" | "APPROVED" | "REJECTED";

  codeOperation: string | null;
  banckName: string | null;
  dateOperation: string | null;
  numberTicket: string | null;

  rejectionReason: string | null;

  createdAt: string;
  updatedAt: string;
  reviewedAt: string | null;
  isArchived: boolean;

  metadata?: Record<string, any>;
  user: PaymentUserResponse;
  paymentConfig: PaymentConfigResponse;

  reviewedBy: PaymentReviewerResponse | null;
  images: PaymentImageResponse[];
}

export interface UserResponse {
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
}

export interface ResponseApprovePayment {
  success: boolean;
  message: string;
  user: UserResponse;
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
