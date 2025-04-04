export interface PaymentDetail {
  bankName?: string;
  transactionReference: string;
  transactionDate: string;
  amount: number;
  fileIndex: number;
}

export interface CreateReconsumptionData {
  totalAmount: number;
  paymentReference?: string;
  notes?: string;
  payments: PaymentDetail[];
}

export interface ReconsumptionResponse {
  success: boolean;
  message: string;
  reconsumptionId?: number;
}

export interface UpdateAutoRenewalResponse {
  success: boolean;
  message: string;
}
