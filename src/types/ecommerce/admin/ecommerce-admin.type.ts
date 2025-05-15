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
  composition?: string;
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

//--------------------------------------------------------------------------
export interface ListOrdersAdminResponse {
  success: boolean;
  items: ItemOrder[];
  meta: Meta;
}

export interface ItemOrder {
  id: number;
  totalItems: number;
  totalAmount: number;
  status: "PENDIENTE" | "APROBADO" | "ENVIADO" | "ENTREGADO" | "RECHAZADO";
  metadata: Metadata;
  createdAt: Date;
  updatedAt: Date;
  user: User;
}

export interface Metadata {
  Productos?: {
    SKU: string;
    Nombre: string;
    Cantidad: number;
    Precio: number;
  }[];
  "Número de productos"?: number;
  "Total de productos"?: number;
}

export interface User {
  id: string;
  email: string;
  personalInfo: {
    firstName: string;
    lastName: string;
  };
}

//--------------------------------------------------------------------------
export interface DetailOrderAdminResponse {
  id: number;
  userId: string;
  status: "PENDIENTE" | "APROBADO" | "ENVIADO" | "ENTREGADO" | "RECHAZADO";
  totalAmount: number;
  totalItems: number;
  createdAt: Date;
  updatedAt: Date;
  orderDetails: OrderDetail[];
  orderHistory: OrderHistory[];
  payment: PaymentOrder;
  user: {
    email: string;
    firstName: string;
    lastName: string;
    documentNumber?: string;
  };
}

export interface OrderDetail {
  id: string;
  productId: number;
  productName: string;
  productImage: string;
  quantity: number;
  price: number;
}

export interface OrderHistory {
  id: string;
  action:
    | "CREADO"
    | "PENDIENTE"
    | "APROBADO"
    | "ENVIADO"
    | "ENTREGADO"
    | "RECHAZADO"
    | "CANCELADO";
  changes: null;
  notes: string;
  metadata: null;
  createdAt: Date;
}

export interface PaymentOrder {
  id: number;
  amount: number;
  status: "PENDING" | "APPROVED" | "REJECTED" | "COMPLETED";
  methodPayment: "VOUCHER" | "POINTS" | "PAYMENT_GATEWAY";
}

export interface OrderAdminFilters {
  startDate?: string;
  endDate?: string;
  search?: string;
  page?: number;
  limit?: number;
  status?:
    | "PENDIENTE"
    | "APROBADO"
    | "ENVIADO"
    | "ENTREGADO"
    | "RECHAZADO"
    | "all"
    | undefined;
}
