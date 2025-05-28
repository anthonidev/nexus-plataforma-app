export interface ContactInfo {
  phone: string;
}

export interface PersonalInfo {
  firstName: string;
  lastName: string;
  documentNumber: string;
}
export interface ItemPaymentConfig {
  name: string;
}

export interface ReviewedBy {
  id: string;
  email: string;
}

export interface User {
  id: string;
  email: string;
  photo: null;
  personalInfo: PersonalInfo;
  contactInfo: ContactInfo;
}
export interface PaymentListItem {
  id: number;
  amount: number;
  status: "PENDING" | "APPROVED" | "REJECTED";
  createdAt: string;
  codeOperation?: string;
  banckName?: string;
  dateOperation?: string;
  numberTicket?: string;
  reviewedAt: Date | null;
  paymentConfig: ItemPaymentConfig;
  reviewedBy: ReviewedBy | null;
  user: User;
}

export interface PaymentConfigListItem {
  id: number;
  name: string;
  code: string;
  description?: string;
}

export interface PaginationMeta {
  totalItems: number;
  itemsPerPage: number;
  totalPages: number;
  currentPage: number;
  paymentConfigs: PaymentConfigListItem[];
}

export interface PaymentsListResponse {
  items: PaymentListItem[];
  meta: PaginationMeta;
}

export interface PaymentsFilters {
  page?: number;
  limit?: number;
  order?: "ASC" | "DESC";
  paymentConfigId?: number;
  status?: "PENDING" | "APPROVED" | "REJECTED";
  startDate?: string;
  endDate?: string;
}
