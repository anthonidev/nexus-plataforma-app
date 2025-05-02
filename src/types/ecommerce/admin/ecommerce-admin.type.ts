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

export interface ProductAdmin {
  id: number;
  name: string;
  description: string;
  sku: string;
  memberPrice: number;
  publicPrice: number;
  stock: number;
  status: string;
  isActive: boolean;
  category: {
    id: number;
    name: string;
    code: string;
  };
  mainImage: string;
  imagesCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface ProductsAdminResponse {
  success: boolean;
  items: ProductAdmin[];
  meta: {
    totalItems: number;
    itemsPerPage: number;
    totalPages: number;
    currentPage: number;
  };
}

export interface ProductAdminFilters {
  categoryId?: number;
  name?: string;
  isActive?: boolean;
  page?: number;
  limit?: number;
}

//---------------------------------------------------------------------------
//---------------------------------------------------------------------------

export interface DetailProductAdminResponse {
  success: boolean;
  product: ProductDetailAdmin;
}

export interface ProductDetailAdmin {
  id: number;
  name: string;
  description: string;
  sku: string;
  memberPrice: number;
  publicPrice: number;
  stock: number;
  status: string;
  benefits: string[];
  isActive: boolean;
  category: Category;
  images: ImageProduct[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Category {
  id: number;
  name: string;
  code: string;
}

export interface ImageProduct {
  id: number;
  url: string;
  isMain: boolean;
  order: number;
}

export interface StockProductResponse {
  success: boolean;
  items: Item[];
  meta: Meta;
}

export interface Item {
  id: number;
  actionType: "INCREASE" | "DECREASE" | "UPDATE";
  previousQuantity: number;
  newQuantity: number;
  quantityChanged: number;
  notes: string;
  createdAt: Date;
  updatedBy: UpdatedBy;
}

export interface UpdatedBy {
  id: string;
  email: string;
}

export interface Meta {
  totalItems: number;
  itemsPerPage: number;
  totalPages: number;
  currentPage: number;
}
