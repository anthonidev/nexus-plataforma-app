export interface FinanceWithdrawals {
  items: Item[];
  meta: Meta;
}

export interface Item {
  id: number;
  amount: number;
  status: "PENDING" | "APPROVED" | "REJECTED";
  createdAt: Date;
  reviewedAt?: Date;
  bankName: string;
  accountNumber: string;
  reviewedBy?: {
    id: string;
    email: string;
  };
  user: User;
}

export interface User {
  id: string;
  email: string;
  personalInfo: PersonalInfo;
}

export interface PersonalInfo {
  firstName: string;
  lastName: string;
  documentNumber: string;
}

export interface Meta {
  totalItems: number;
  itemsPerPage: number;
  totalPages: number;
  currentPage: number;
  withdrawalConfigs: WithdrawalConfig[];
}

export interface WithdrawalConfig {
  id: number;
  code: string;
  name: string;
  description: string;
  minimumAmount: number;
  maximumAmount: null;
}

//----------------------detalle de un retiro----------------------
export interface FinanceWithdrawalDetailResponse {
  id: number;
  amount: number;
  status: "PENDING" | "APPROVED" | "REJECTED";
  rejectionReason?: string;
  createdAt: Date;
  updatedAt: Date;
  reviewedAt: Date;
  isArchived: boolean;
  bankName: string;
  accountNumber: string;
  cci: string;
  metadata?: Record<string, any>;
  user: UserDetail;
  reviewedBy: ReviewedBy;
  withdrawalPoints: WithdrawalPoint[];
  meta: {
    totalItems: number;
    itemsPerPage: number;
    totalPages: number;
    currentPage: number;
  };
}

export interface UserDetail {
  id: string;
  email: string;
  createdAt: Date;
  updatedAt: Date;
  personalInfo?: PersonalInfo;
  contactInfo?: ContactInfo;
  bankInfo?: BankInfo;
}
export interface ReviewedBy {
  id: string;
  email: string;
}

export interface BankInfo {
  bankName: string;
  accountNumber: string;
  cci: string;
}

export interface ContactInfo {
  phone: string;
  address: null;
  postalCode: null;
}

export interface PersonalInfo {
  firstName: string;
  lastName: string;
  documentNumber: string;
}

export interface WithdrawalPoint {
  id: number;
  amountUsed: number;
  createdAt: Date;
  updatedAt: Date;
  points: Points;
}

export interface Points {
  id: number;
  type: "BINARY_COMMISSION" | "DIRECT_BONUS" | "WITHDRAWAL";
  amount: number;
  pendingAmount: number;
  withdrawnAmount: number;
  isArchived: boolean;
  status: "PENDING" | "APPROVED" | "REJECTED" | "COMPLETED";
  metadata?: Record<string, any>;
  createdAt: Date;
}
