# Inventory Management Dashboard

A modern, responsive React application for managing product inventory with advanced filtering, sorting, and analytics capabilities.

## Features

### Core Functionality
- **Product Management**: Add, edit, and delete products with comprehensive form validation
- **Advanced Filtering**: Filter by category, search terms, and stock availability
- **Sorting & Pagination**: Sort by any field with configurable pagination
- **Multi-selection**: Select multiple products for batch operations
- **Real-time Search**: Debounced search across product names, descriptions, and categories

### Dashboard Analytics
- **Statistics Overview**: Total products, in-stock items, low stock alerts, and out-of-stock items
- **Category Chart**: Interactive bar chart showing product distribution by category
- **Stock Status Indicators**: Visual indicators for stock levels (In Stock, Low Stock, Out of Stock)

### User Experience
- **Responsive Design**: Optimized for desktop, tablet, and mobile devices
- **Modern UI**: Clean, professional interface built with Tailwind CSS
- **Loading States**: Smooth loading indicators and transitions
- **Error Handling**: Comprehensive error handling with user-friendly messages
- **Confirmation Dialogs**: Safe deletion with confirmation prompts

## Technical Stack

- **Frontend**: React 18 with TypeScript
- **State Management**: Redux Toolkit with RTK Query patterns
- **Styling**: Tailwind CSS with custom animations
- **Charts**: Chart.js with react-chartjs-2
- **Build Tool**: Create React App
- **Package Manager**: npm

## Project Structure

```
src/
├── components/          # React components
│   ├── Dashboard.tsx   # Main dashboard layout
│   ├── Header.tsx      # Application header
│   ├── ProductFilters.tsx    # Filter controls
│   ├── ProductTable.tsx      # Product data table
│   ├── ProductModal.tsx      # Add/edit product form
│   ├── ConfirmationDialog.tsx # Delete confirmation
│   └── CategoryChart.tsx     # Category analytics chart
├── store/              # Redux store configuration
│   ├── index.ts        # Store setup
│   ├── productSlice.ts # Product state management
│   └── uiSlice.ts      # UI state management
├── types/              # TypeScript type definitions
│   └── index.ts        # Core type interfaces
├── App.tsx             # Main application component
└── index.tsx           # Application entry point
```

## Getting Started

### Prerequisites
- Node.js 16+ 
- npm 8+

### Installation
1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

### Development
```bash
npm start
```
The application will open at `http://localhost:3000`

### Building for Production
```bash
npm run build
```

### Deployment
```bash
npm run deploy
```
This will build and deploy to GitHub Pages.

## Usage

### Adding Products
1. Click the "Add Product" button in the header
2. Fill out the product form with required information
3. Submit to add the product to inventory

### Managing Products
- **Edit**: Click the "Edit" button on any product row
- **Delete**: Click the "Delete" button and confirm
- **Batch Operations**: Select multiple products and use batch delete

### Filtering & Searching
- **Category Filter**: Select specific product categories
- **Search**: Type to search across product names, descriptions, and categories
- **Stock Filter**: Toggle to show only in-stock products

### Sorting & Pagination
- Click column headers to sort by different fields
- Use pagination controls to navigate through large datasets
- Adjust items per page as needed

## Data Model

### Product Interface
```typescript
interface Product {
  id: string;
  name: string;
  category: Category;
  stockQuantity: number;
  price: number;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}
```

### Categories
- Electronics
- Apparel
- Food
- Books
- Home & Garden
- Sports
- Other

## State Management

The application uses Redux Toolkit for state management with two main slices:

### Product Slice
- Manages product data, filters, pagination, and sorting
- Handles CRUD operations with async thunks
- Implements filtering and sorting logic

### UI Slice
- Manages modal states and confirmation dialogs
- Ensures proper modal lifecycle management
- Prevents multiple modals from being open simultaneously

## Performance Optimizations

- **Memoization**: Uses React.memo and useMemo for expensive calculations
- **Debounced Search**: Prevents excessive API calls during typing
- **Efficient Filtering**: Optimized filter algorithms with early returns
- **Lazy Loading**: Components load only when needed

## Accessibility Features

- **Keyboard Navigation**: Full keyboard support for all interactive elements
- **Screen Reader Support**: Proper ARIA labels and semantic HTML
- **Focus Management**: Clear focus indicators and logical tab order
- **Color Contrast**: WCAG AA compliant color schemes

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Future Enhancements

- **Data Persistence**: Backend API integration
- **User Authentication**: Role-based access control
- **Advanced Analytics**: Sales trends and forecasting
- **Export Functionality**: CSV/PDF export capabilities
- **Real-time Updates**: WebSocket integration for live data
- **Mobile App**: React Native companion application
