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

//-------------------------------------------------------------------------------------------
export interface OrdersClientResponse {
  success: boolean;
  items: ItemOrder[];
  meta: Meta;
}

export interface ItemOrder {
  id: number;
  totalItems: number;
  totalAmount: number;
  status: "PENDIENTE" | "APROBADO" | "ENVIADO" | "ENTREGADO" | "RECHAZADO";
  methodPayment: "VOUCHER" | "POINTS";
  metadata: Metadata;
  createdAt: Date;
  updatedAt: Date;
}

export interface Metadata {
  Productos?: Producto[];
}

export interface Producto {
  SKU: string;
  Nombre: string;
  Cantidad: number;
  Precio: number;
}

export interface Meta {
  totalItems: number;
  itemsPerPage: number;
  totalPages: number;
  currentPage: number;
}
//-------------------------------------------------------------------------------------------
export interface OrderDetailClientResponse {
  id: number;
  userId: string;
  status: "PENDIENTE" | "APROBADO" | "ENVIADO" | "ENTREGADO" | "RECHAZADO";
  methodPayment: "VOUCHER" | "POINTS";
  totalAmount: number;
  totalItems: number;
  createdAt: Date;
  updatedAt: Date;
  orderDetails: OrderDetail[];
  orderHistory: OrderHistory[];
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
    | "APROBADO"
    | "ENVIADO"
    | "ENTREGADO"
    | "CANCELADO"
    | "RECHAZADO";
  changes: null;
  notes: string;
  metadata: null;
  createdAt: Date;
}
