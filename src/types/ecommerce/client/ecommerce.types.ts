export interface ProductsClientResponse {
  success: boolean;
  items: Item[];
  meta: Meta;
}

export interface Item {
  id: number;
  name: string;
  description: string;
  sku: string;
  memberPrice: number;
  publicPrice: number;
  stock: number;
  status: string;
  isActive: boolean;
  category: Category;
  imagesCount: number;
  createdAt: Date;
  updatedAt: Date;
  mainImage: string;
}

export interface Category {
  id: number;
  name: string;
  code: string;
}

export interface Meta {
  totalItems: number;
  itemsPerPage: number;
  totalPages: number;
  currentPage: number;
}

export interface ProductDetailClientResponse {
  success: boolean;
  product: Product;
}

export interface Product {
  id: number;
  name: string;
  description: string;
  sku: string;
  memberPrice: number;
  publicPrice: number;
  stock: number;
  status: string;
  isActive: boolean;
  category: Category;
  imagesCount: number;
  createdAt: Date;
  updatedAt: Date;
  images: Image[];
}

export interface Image {
  id: number;
  url: string;
  isMain: boolean;
  order: number;
}

export interface ProductClientFilters {
  categoryId?: number;
  name?: string;
  page?: number;
  limit?: number;
  isActive?: boolean;
}
