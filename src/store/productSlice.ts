import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Product, ProductFormData, FilterState, PaginationState, SortState, Category } from '../types';

// Enhanced sample data generation with more realistic product information
const generateSampleProducts = (): Product[] => {
  const categories: Category[] = ['Electronics', 'Apparel', 'Food', 'Books', 'Home & Garden', 'Sports', 'Other'];
  
  const productTemplates = [
    { name: 'MacBook Pro', category: 'Electronics', basePrice: 1299, baseStock: 25 },
    { name: 'iPhone 15', category: 'Electronics', basePrice: 799, baseStock: 50 },
    { name: 'Wireless Headphones', category: 'Electronics', basePrice: 199, baseStock: 75 },
    { name: 'Cotton T-Shirt', category: 'Apparel', basePrice: 25, baseStock: 100 },
    { name: 'Denim Jeans', category: 'Apparel', basePrice: 89, baseStock: 60 },
    { name: 'Running Shoes', category: 'Apparel', basePrice: 120, baseStock: 45 },
    { name: 'Organic Pizza', category: 'Food', basePrice: 18, baseStock: 30 },
    { name: 'Fresh Burger', category: 'Food', basePrice: 12, baseStock: 40 },
    { name: 'Coffee Beans', category: 'Food', basePrice: 15, baseStock: 80 },
    { name: 'Programming Book', category: 'Books', basePrice: 45, baseStock: 35 },
    { name: 'Fiction Novel', category: 'Books', basePrice: 22, baseStock: 55 },
    { name: 'Garden Chair', category: 'Home & Garden', basePrice: 75, baseStock: 20 },
    { name: 'Plant Pot', category: 'Home & Garden', basePrice: 18, baseStock: 90 },
    { name: 'Football', category: 'Sports', basePrice: 35, baseStock: 65 },
    { name: 'Basketball', category: 'Sports', basePrice: 28, baseStock: 70 }
  ];

  return Array.from({ length: 50 }, (_, index) => {
    const template = productTemplates[index % productTemplates.length];
    const variation = Math.floor(Math.random() * 3) + 1;
    
    return {
      id: `product-${index + 1}`,
      name: `${template.name} ${variation > 1 ? `v${variation}` : ''}`,
      category: template.category,
      stockQuantity: Math.max(0, template.baseStock + Math.floor(Math.random() * 40) - 20),
      price: parseFloat((template.basePrice + Math.random() * 50 - 25).toFixed(2)),
      description: `High-quality ${template.name.toLowerCase()} with excellent features and durability.`,
      createdAt: new Date(Date.now() - Math.random() * 10000000000),
      updatedAt: new Date()
    };
  });
};

interface ProductState {
  products: Product[];
  filteredProducts: Product[];
  selectedProducts: string[];
  filters: FilterState;
  pagination: PaginationState;
  sort: SortState;
  loading: boolean;
  error: string | null;
}

const initialState: ProductState = {
  products: generateSampleProducts(),
  filteredProducts: [],
  selectedProducts: [],
  filters: {
    category: 'All',
    inStockOnly: false,
    searchTerm: ''
  },
  pagination: {
    currentPage: 1,
    itemsPerPage: 10,
    totalItems: 0
  },
  sort: {
    field: 'name',
    direction: 'asc'
  },
  loading: false,
  error: null
};

// Async thunks with proper error handling
export const addProduct = createAsyncThunk(
  'products/addProduct',
  async (productData: ProductFormData, { rejectWithValue }) => {
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const newProduct: Product = {
        ...productData,
        id: `product-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      return newProduct;
    } catch (error) {
      return rejectWithValue('Failed to add product');
    }
  }
);

export const updateProduct = createAsyncThunk(
  'products/updateProduct',
  async ({ id, productData }: { id: string; productData: ProductFormData }, { rejectWithValue }) => {
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      return { id, productData };
    } catch (error) {
      return rejectWithValue('Failed to update product');
    }
  }
);

export const deleteProduct = createAsyncThunk(
  'products/deleteProduct',
  async (id: string, { rejectWithValue }) => {
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 300));
      
      return id;
    } catch (error) {
      return rejectWithValue('Failed to delete product');
    }
  }
);

export const deleteMultipleProducts = createAsyncThunk(
  'products/deleteMultipleProducts',
  async (ids: string[], { rejectWithValue }) => {
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      return ids;
    } catch (error) {
      return rejectWithValue('Failed to delete products');
    }
  }
);

const productSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    setFilters: (state, action: PayloadAction<Partial<FilterState>>) => {
      state.filters = { ...state.filters, ...action.payload };
      state.pagination.currentPage = 1; // Reset to first page when filters change
    },
    
    setPagination: (state, action: PayloadAction<Partial<PaginationState>>) => {
      state.pagination = { ...state.pagination, ...action.payload };
    },
    
    setSort: (state, action: PayloadAction<SortState>) => {
      state.sort = action.payload;
    },
    
    setSelectedProducts: (state, action: PayloadAction<string[]>) => {
      state.selectedProducts = action.payload;
    },
    
    toggleProductSelection: (state, action: PayloadAction<string>) => {
      const productId = action.payload;
      if (state.selectedProducts.includes(productId)) {
        state.selectedProducts = state.selectedProducts.filter(id => id !== productId);
      } else {
        state.selectedProducts.push(productId);
      }
    },
    
    selectAllProducts: (state) => {
      if (state.selectedProducts.length === state.filteredProducts.length) {
        state.selectedProducts = [];
      } else {
        state.selectedProducts = state.filteredProducts.map(product => product.id);
      }
    },
    
    clearSelection: (state) => {
      state.selectedProducts = [];
    },
    
    applyFiltersAndSort: (state) => {
      let filtered = [...state.products];

      // Apply category filter
      if (state.filters.category !== 'All') {
        filtered = filtered.filter(product => product.category === state.filters.category);
      }

      // Apply in-stock filter
      if (state.filters.inStockOnly) {
        filtered = filtered.filter(product => product.stockQuantity > 0);
      }

      // Apply search filter with improved matching
      if (state.filters.searchTerm.trim()) {
        const searchTerm = state.filters.searchTerm.toLowerCase().trim();
        filtered = filtered.filter(product =>
          product.name.toLowerCase().includes(searchTerm) ||
          product.description?.toLowerCase().includes(searchTerm) ||
          product.category.toLowerCase().includes(searchTerm)
        );
      }

      // Apply sorting with improved logic
      filtered.sort((a, b) => {
        const aValue = a[state.sort.field];
        const bValue = b[state.sort.field];
        
        if (typeof aValue === 'string' && typeof bValue === 'string') {
          return state.sort.direction === 'asc' 
            ? aValue.localeCompare(bValue)
            : bValue.localeCompare(aValue);
        }
        
        if (typeof aValue === 'number' && typeof bValue === 'number') {
          return state.sort.direction === 'asc' ? aValue - bValue : bValue - aValue;
        }
        
        if (aValue instanceof Date && bValue instanceof Date) {
          return state.sort.direction === 'asc' 
            ? aValue.getTime() - bValue.getTime()
            : bValue.getTime() - aValue.getTime();
        }
        
        return 0;
      });

      state.filteredProducts = filtered;
      state.pagination.totalItems = filtered.length;
      
      // Ensure current page is valid after filtering
      const maxPage = Math.ceil(filtered.length / state.pagination.itemsPerPage);
      state.pagination.currentPage = Math.min(
        Math.max(1, state.pagination.currentPage),
        maxPage || 1
      );
    }
  },
  
  extraReducers: (builder) => {
    builder
      // Add Product
      .addCase(addProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addProduct.fulfilled, (state, action) => {
        state.products.unshift(action.payload);
        state.selectedProducts = [];
        state.loading = false;
        state.error = null;
      })
      .addCase(addProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string || 'Failed to add product';
      })
      
      // Update Product
      .addCase(updateProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateProduct.fulfilled, (state, action) => {
        const { id, productData } = action.payload;
        const index = state.products.findIndex(product => product.id === id);
        if (index !== -1) {
          state.products[index] = {
            ...state.products[index],
            ...productData,
            updatedAt: new Date()
          };
        }
        state.selectedProducts = [];
        state.loading = false;
        state.error = null;
      })
      .addCase(updateProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string || 'Failed to update product';
      })
      
      // Delete Product
      .addCase(deleteProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.products = state.products.filter(product => product.id !== action.payload);
        state.selectedProducts = state.selectedProducts.filter(id => id !== action.payload);
        state.loading = false;
        state.error = null;
      })
      .addCase(deleteProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string || 'Failed to delete product';
      })
      
      // Delete Multiple Products
      .addCase(deleteMultipleProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteMultipleProducts.fulfilled, (state, action) => {
        state.products = state.products.filter(product => !action.payload.includes(product.id));
        state.selectedProducts = [];
        state.loading = false;
        state.error = null;
      })
      .addCase(deleteMultipleProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string || 'Failed to delete products';
      });
  }
});

export const {
  setFilters,
  setPagination,
  setSort,
  setSelectedProducts,
  toggleProductSelection,
  selectAllProducts,
  clearSelection,
  applyFiltersAndSort
} = productSlice.actions;

export default productSlice.reducer;
