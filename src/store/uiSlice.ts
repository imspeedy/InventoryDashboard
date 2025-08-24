import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Product } from '../types';

interface UIState {
  isAddProductModalOpen: boolean;
  isEditProductModalOpen: boolean;
  isDeleteConfirmationOpen: boolean;
  isBatchDeleteConfirmationOpen: boolean;
  editingProduct: Product | null;
  deleteProductId: string | null;
}

const initialState: UIState = {
  isAddProductModalOpen: false,
  isEditProductModalOpen: false,
  isDeleteConfirmationOpen: false,
  isBatchDeleteConfirmationOpen: false,
  editingProduct: null,
  deleteProductId: null
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    openAddProductModal: (state) => {
      state.isAddProductModalOpen = true;
      // Ensure other modals are closed
      state.isEditProductModalOpen = false;
      state.isDeleteConfirmationOpen = false;
      state.isBatchDeleteConfirmationOpen = false;
      state.editingProduct = null;
      state.deleteProductId = null;
    },
    
    closeAddProductModal: (state) => {
      state.isAddProductModalOpen = false;
    },
    
    openEditProductModal: (state, action: PayloadAction<Product>) => {
      state.isEditProductModalOpen = true;
      state.editingProduct = action.payload;
      // Ensure other modals are closed
      state.isAddProductModalOpen = false;
      state.isDeleteConfirmationOpen = false;
      state.isBatchDeleteConfirmationOpen = false;
      state.deleteProductId = null;
    },
    
    closeEditProductModal: (state) => {
      state.isEditProductModalOpen = false;
      state.editingProduct = null;
    },
    
    openDeleteConfirmation: (state, action: PayloadAction<string>) => {
      state.isDeleteConfirmationOpen = true;
      state.deleteProductId = action.payload;
      // Ensure other modals are closed
      state.isAddProductModalOpen = false;
      state.isEditProductModalOpen = false;
      state.isBatchDeleteConfirmationOpen = false;
      state.editingProduct = null;
    },
    
    closeDeleteConfirmation: (state) => {
      state.isDeleteConfirmationOpen = false;
      state.deleteProductId = null;
    },
    
    openBatchDeleteConfirmation: (state) => {
      state.isBatchDeleteConfirmationOpen = true;
      // Ensure other modals are closed
      state.isAddProductModalOpen = false;
      state.isEditProductModalOpen = false;
      state.isDeleteConfirmationOpen = false;
      state.editingProduct = null;
      state.deleteProductId = null;
    },
    
    closeBatchDeleteConfirmation: (state) => {
      state.isBatchDeleteConfirmationOpen = false;
    },
    
    // Utility function to close all modals
    closeAllModals: (state) => {
      state.isAddProductModalOpen = false;
      state.isEditProductModalOpen = false;
      state.isDeleteConfirmationOpen = false;
      state.isBatchDeleteConfirmationOpen = false;
      state.editingProduct = null;
      state.deleteProductId = null;
    }
  }
});

export const {
  openAddProductModal,
  closeAddProductModal,
  openEditProductModal,
  closeEditProductModal,
  openDeleteConfirmation,
  closeDeleteConfirmation,
  openBatchDeleteConfirmation,
  closeBatchDeleteConfirmation,
  closeAllModals
} = uiSlice.actions;

export default uiSlice.reducer;
