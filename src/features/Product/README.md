# Product Management Feature

This feature provides comprehensive product management functionality for the Zcoded application, integrating with the FastAPI MCP backend.

## Features

- **Product CRUD Operations**: Create, read, update, and delete products
- **Advanced Filtering**: Filter products by various criteria (price, location, type, etc.)
- **Search Functionality**: Search products by name and description
- **Pagination**: Efficient pagination for large product lists
- **Product Types**: Support for both products and variants
- **Rich Product Data**: Support for images, features, specifications, and metadata
- **Responsive Design**: Mobile-friendly interface that matches the current theme

## Components

### Core Components

- **ProductManagementComponent**: Main component that orchestrates the entire feature
- **ProductForm**: Form component for creating and editing products
- **ProductCard**: Card component for displaying individual products
- **ProductList**: List component with pagination
- **ProductFilters**: Advanced filtering and search component
- **CreateEditProductDialog**: Modal dialog for create/edit operations

### API Integration

- **useCreateProduct**: Hook for creating new products
- **useUpdateProduct**: Hook for updating existing products
- **useDeleteProduct**: Hook for deleting products
- **useProductsList**: Hook for fetching all products
- **useMyProducts**: Hook for fetching user's own products
- **useProductById**: Hook for fetching a specific product

## API Endpoints

The feature integrates with the following FastAPI MCP endpoints:

- `POST /api/v1/products/` - Create product
- `GET /api/v1/products/` - Get products list
- `GET /api/v1/products/{product_id}` - Get product by ID
- `GET /api/v1/products/user/me` - Get user's products
- `PUT /api/v1/products/{product_id}` - Update product
- `DELETE /api/v1/products/{product_id}` - Delete product

## Product Schema

Products support the following fields:

- **Basic Info**: Name, description, product type
- **Pricing**: Price, currency
- **Location**: Country, city
- **Physical Attributes**: Color, size, weight
- **Features**: Array of product features
- **Images**: Array of image URLs
- **Specifications**: Key-value pairs for technical specs
- **Metadata**: Additional custom data

## Usage

The Product feature is accessible via the dashboard sidebar at `/dashboard/product`. It provides:

1. **Overview Tab**: View all products with advanced filtering
2. **My Products Tab**: View and manage your own products
3. **Create Product**: Add new products to the system
4. **Edit Products**: Modify existing product information
5. **Delete Products**: Remove products from the system

## Theme Integration

The feature uses the existing UI components and follows the current design system:

- Consistent with existing color scheme and typography
- Responsive grid layouts
- Card-based design patterns
- Consistent button and form styling
- Proper dark/light mode support

## Dependencies

- React Query for API state management
- React Hook Form for form handling
- Zod for schema validation
- Radix UI components for accessible UI elements
- Lucide React for icons
- Tailwind CSS for styling
