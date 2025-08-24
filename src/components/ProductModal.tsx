import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store';
import { addProduct, updateProduct } from '../store/productSlice';
import { closeAddProductModal, closeEditProductModal } from '../store/uiSlice';
import { ProductFormData, Category } from '../types';

interface ProductModalProps {
  mode: 'add' | 'edit';
}

const ProductModal: React.FC<ProductModalProps> = ({ mode }) => {
  const dispatch = useDispatch();
  const { editingProduct } = useSelector((state: RootState) => state.ui);
  
  const [formData, setFormData] = useState<ProductFormData>({
    name: '',
    category: 'Electronics',
    stockQuantity: 0,
    price: 0,
    description: ''
  });
  
  const [errors, setErrors] = useState<Partial<ProductFormData>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [touched, setTouched] = useState<Partial<Record<keyof ProductFormData, boolean>>>({});

  const categories: Category[] = ['Electronics', 'Apparel', 'Food', 'Books', 'Home & Garden', 'Sports', 'Other'];

  useEffect(() => {
    if (mode === 'edit' && editingProduct) {
      setFormData({
        name: editingProduct.name,
        category: editingProduct.category,
        stockQuantity: editingProduct.stockQuantity,
        price: editingProduct.price,
        description: editingProduct.description || ''
      });
    }
  }, [mode, editingProduct]);

  const validateField = (field: keyof ProductFormData, value: any): string | undefined => {
    switch (field) {
      case 'name':
        if (!value.trim()) return 'Product name is required';
        if (value.trim().length < 2) return 'Product name must be at least 2 characters';
        if (value.trim().length > 100) return 'Product name must be less than 100 characters';
        break;
      case 'stockQuantity':
        if (value < 0) return 'Stock quantity cannot be negative';
        if (value > 999999) return 'Stock quantity is too high';
        break;
      case 'price':
        if (value <= 0) return 'Price must be greater than 0';
        if (value > 999999.99) return 'Price is too high';
        break;
      case 'description':
        if (value && value.length > 500) return 'Description must be less than 500 characters';
        break;
    }
    return undefined;
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<ProductFormData> = {};
    let isValid = true;

    Object.keys(formData).forEach((key) => {
      const field = key as keyof ProductFormData;
      const error = validateField(field, formData[field]);
      if (error) {
        newErrors[field] = error;
        isValid = false;
      }
    });

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      if (mode === 'add') {
        await dispatch(addProduct(formData) as any);
        dispatch(closeAddProductModal());
      } else {
        await dispatch(updateProduct({ id: editingProduct.id, productData: formData }) as any);
        dispatch(closeEditProductModal());
      }
    } catch (error) {
      console.error('Error saving product:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: keyof ProductFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const handleBlur = (field: keyof ProductFormData) => {
    setTouched(prev => ({ ...prev, [field]: true }));
    
    // Validate field on blur
    const error = validateField(field, formData[field]);
    if (error) {
      setErrors(prev => ({ ...prev, [field]: error }));
    }
  };

  const handleClose = () => {
    if (mode === 'add') {
      dispatch(closeAddProductModal());
    } else {
      dispatch(closeEditProductModal());
    }
  };

  const getFieldError = (field: keyof ProductFormData) => {
    return touched[field] && errors[field];
  };

  const getFieldClassName = (field: keyof ProductFormData) => {
    const baseClasses = "w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200";
    const errorClasses = "border-red-300 focus:border-red-500 focus:ring-red-500";
    const normalClasses = "border-gray-300";
    
    return `${baseClasses} ${getFieldError(field) ? errorClasses : normalClasses}`;
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-full max-w-md shadow-lg rounded-md bg-white">
        <div className="mt-3">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-medium text-gray-900">
              {mode === 'add' ? 'Add New Product' : 'Edit Product'}
            </h3>
            <button
              onClick={handleClose}
              className="text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-full p-1 transition-colors duration-200"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Product Name */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                Product Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="name"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                onBlur={() => handleBlur('name')}
                className={getFieldClassName('name')}
                placeholder="Enter product name"
                maxLength={100}
              />
              {getFieldError('name') && (
                <p className="mt-1 text-sm text-red-600">{getFieldError('name')}</p>
              )}
            </div>

            {/* Category */}
            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                Category <span className="text-red-500">*</span>
              </label>
              <select
                id="category"
                value={formData.category}
                onChange={(e) => handleInputChange('category', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
              >
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>

            {/* Stock Quantity */}
            <div>
              <label htmlFor="stockQuantity" className="block text-sm font-medium text-gray-700 mb-2">
                Stock Quantity <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                id="stockQuantity"
                value={formData.stockQuantity}
                onChange={(e) => handleInputChange('stockQuantity', parseInt(e.target.value) || 0)}
                onBlur={() => handleBlur('stockQuantity')}
                className={getFieldClassName('stockQuantity')}
                placeholder="Enter stock quantity"
                min="0"
                max="999999"
              />
              {getFieldError('stockQuantity') && (
                <p className="mt-1 text-sm text-red-600">{getFieldError('stockQuantity')}</p>
              )}
            </div>

            {/* Price */}
            <div>
              <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-2">
                Price <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2 text-gray-500">$</span>
                <input
                  type="number"
                  id="price"
                  value={formData.price}
                  onChange={(e) => handleInputChange('price', parseFloat(e.target.value) || 0)}
                  onBlur={() => handleBlur('price')}
                  className={`${getFieldClassName('price')} pl-8`}
                  placeholder="0.00"
                  min="0.01"
                  max="999999.99"
                  step="0.01"
                />
              </div>
              {getFieldError('price') && (
                <p className="mt-1 text-sm text-red-600">{getFieldError('price')}</p>
              )}
            </div>

            {/* Description */}
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                onBlur={() => handleBlur('description')}
                rows={3}
                className={getFieldClassName('description')}
                placeholder="Enter product description (optional)"
                maxLength={500}
              />
              <div className="flex justify-between items-center mt-1">
                {getFieldError('description') && (
                  <p className="text-sm text-red-600">{getFieldError('description')}</p>
                )}
                <span className="text-xs text-gray-500 ml-auto">
                  {formData.description.length}/500
                </span>
              </div>
            </div>

            {/* Form Actions */}
            <div className="flex items-center justify-end space-x-3 pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={handleClose}
                disabled={isSubmitting}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200 disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
              >
                {isSubmitting ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    {mode === 'add' ? 'Adding...' : 'Updating...'}
                  </div>
                ) : (
                  mode === 'add' ? 'Add Product' : 'Update Product'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProductModal;
