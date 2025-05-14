export interface WithdrawalsResponse {
  items: {
    id: number;
    amount: number;
    status: "PENDING" | "APPROVED" | "REJECTED";
    createdAt: Date;
    reviewedAt?: Date;
    rejectionReason?: string;
    bankName: string;
    accountNumber: string;
    cci?: string;
    metadata?: Record<string, any>;
  }[];
  meta: Meta;
}

export interface Meta {
  totalItems: number;
  itemsPerPage: number;
  totalPages: number;
  currentPage: number;
}
//------------------------------------------------------------------------
export interface WithdrawalsInfo {
  canWithdraw: boolean;
  reason: string;
  backName?: string;
  accountNumber?: string;
  cci?: string;
  config: Config;
  availablePoints: number;
  missingInfo: MissingInfo[];
}

export interface Config {
  minimumAmount: number;
  maximumAmount: null;
  startHour: number;
  endHour: number;
  enabledWeekDays: number[];
}

export interface MissingInfo {
  field: string;
  message: string;
}
