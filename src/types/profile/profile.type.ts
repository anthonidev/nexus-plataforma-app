export interface ApiResponse {
  success: boolean;
  message: string;
}

export interface UpdateContactInfoDto {
  phone?: string;
  address?: string;
  postalCode?: string;
  ubigeoId?: number;
}

export interface UpdateBillingInfoDto {
  address: string;
  ubigeoId?: number;
}

export interface UpdateBankInfoDto {
  bankName: string;
  accountNumber: string;
  cci?: string;
}

export interface UpdatePersonalInfoDto {
  documentNumber?: string;
  nickname?: string;
  email?: string;
}

export interface ProfileResponse {
  id: string;
  email: string;
  referralCode: string;
  isActive: boolean;
  nickname?: string;
  photo?: string;
  role: {
    id: number;
    code: string;
    name: string;
  };
  personalInfo: {
    id: number;
    firstName: string;
    lastName: string;
    documentNumber?: string;
    gender?: string;
    birthDate?: Date;
  } | null;
  contactInfo: {
    id: number;
    phone: string;
    address?: string;
    postalCode?: string;
    ubigeo?: {
      id: number;
      name: string;
      code: string;
      parentId?: number;
    } | null;
  } | null;
  billingInfo: {
    id: number;
    address: string;
    ubigeo?: {
      id: number;
      name: string;
      code: string;
      parentId?: number;
    } | null;
  } | null;
  bankInfo: {
    id: number;
    bankName: string;
    accountNumber: string;
    cci?: string;
  } | null;
}
