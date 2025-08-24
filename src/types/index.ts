export interface Product {
  id: string;
  name: string;
  category: Category;
  stockQuantity: number;
  price: number;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}

export type Category = 'Electronics' | 'Apparel' | 'Food' | 'Books' | 'Home & Garden' | 'Sports' | 'Other';
export type CategoryFilter = Category | 'All';

export interface ProductFormData {
  name: string;
  category: Category;
  stockQuantity: number;
  price: number;
  description?: string;
}

export interface FilterState {
  category: CategoryFilter;
  inStockOnly: boolean;
  searchTerm: string;
}

export interface PaginationState {
  currentPage: number;
  itemsPerPage: number;
  totalItems: number;
}

export interface SortState {
  field: keyof Product;
  direction: 'asc' | 'desc';
}
