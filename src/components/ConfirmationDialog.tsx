import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store';
import { deleteProduct, deleteMultipleProducts } from '../store/productSlice';
import { closeDeleteConfirmation, closeBatchDeleteConfirmation } from '../store/uiSlice';

interface ConfirmationDialogProps {
  mode: 'single' | 'batch';
}

const ConfirmationDialog: React.FC<ConfirmationDialogProps> = ({ mode }) => {
  const dispatch = useDispatch();
  const { deleteProductId } = useSelector((state: RootState) => state.ui);
  const { selectedProducts } = useSelector((state: RootState) => state.products);

  const handleConfirm = async () => {
    try {
      if (mode === 'single' && deleteProductId) {
        await dispatch(deleteProduct(deleteProductId) as any);
        dispatch(closeDeleteConfirmation());
      } else if (mode === 'batch') {
        await dispatch(deleteMultipleProducts(selectedProducts) as any);
        dispatch(closeBatchDeleteConfirmation());
      }
    } catch (error) {
      console.error('Error deleting product(s):', error);
    }
  };

  const handleCancel = () => {
    if (mode === 'single') {
      dispatch(closeDeleteConfirmation());
    } else {
      dispatch(closeBatchDeleteConfirmation());
    }
  };

  const getTitle = () => {
    return mode === 'single' ? 'Delete Product' : 'Delete Selected Products';
  };

  const getMessage = () => {
    if (mode === 'single') {
      return 'Are you sure you want to delete this product? This action cannot be undone.';
    } else {
      return `Are you sure you want to delete ${selectedProducts.length} selected product(s)? This action cannot be undone.`;
    }
  };

  const getIcon = () => {
    if (mode === 'single') {
      return (
        <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
          <svg className="h-6 w-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        </div>
      );
    } else {
      return (
        <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
          <svg className="h-6 w-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </div>
      );
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-full max-w-md shadow-lg rounded-md bg-white">
        <div className="mt-3">
          {/* Icon */}
          {getIcon()}

          {/* Title */}
          <h3 className="text-lg font-medium text-gray-900 text-center mb-2">
            {getTitle()}
          </h3>

          {/* Message */}
          <p className="text-sm text-gray-500 text-center mb-6 leading-relaxed">
            {getMessage()}
          </p>

          {/* Actions */}
          <div className="flex items-center justify-center space-x-3">
            <button
              onClick={handleCancel}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirm}
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors duration-200"
            >
              {mode === 'single' ? 'Delete' : `Delete ${selectedProducts.length} Products`}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationDialog;
