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
