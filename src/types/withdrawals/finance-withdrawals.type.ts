export interface FinanceWithdrawals {
  items: Item[];
  meta: Meta;
}

export interface Item {
  id: number;
  amount: number;
  status: string;
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
  referralCode: string;
  personalInfo: PersonalInfo;
}

export interface PersonalInfo {
  firstName: string;
  lastName: string;
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
