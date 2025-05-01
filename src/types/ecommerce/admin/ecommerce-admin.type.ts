export interface ResponseCategories {
  success: boolean;
  categories: Category[];
}

export interface Category {
  id: number;
  name: string;
  description: string;
  code: string;
  order: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}
