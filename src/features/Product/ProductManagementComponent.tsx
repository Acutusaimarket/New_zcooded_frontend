import React, { useState } from "react";

import { Grid3X3, List, Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import {
  useCreateProduct,
  useDeleteProduct,
  useProductsList,
  useUpdateProduct,
} from "./api";
import { CreateEditProductDialog } from "./components/CreateEditProductDialog";
import { ProductFiltersComponent } from "./components/ProductFilters";
import { ProductList } from "./components/ProductList";
import type {
  CreateProductFormData,
  ProductDocument,
  ProductFilters,
} from "./types";

export const ProductManagementComponent: React.FC = () => {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [editingProduct, setEditingProduct] = useState<ProductDocument | null>(
    null
  );
  const [creatingVariantFor, setCreatingVariantFor] =
    useState<ProductDocument | null>(null);
  const [filters, setFilters] = useState<ProductFilters>({
    page: 1,
    page_size: 10,
    sort_by: "created_at",
    sort_order: "desc",
    product_type: "product", // Default to showing only products, not variants
  });

  // API hooks
  const createProductMutation = useCreateProduct();
  const updateProductMutation = useUpdateProduct();
  const deleteProductMutation = useDeleteProduct();
  const productsListQuery = useProductsList(filters);
  const { data: productsData, isLoading } = productsListQuery;

  const handleCreateProduct = (
    data: CreateProductFormData & {
      specification?: Record<string, string>;
      metadata?: Record<string, string>;
    }
  ) => {
    createProductMutation.mutate(data);
  };

  const handleUpdateProduct = (data: CreateProductFormData) => {
    if (editingProduct) {
      updateProductMutation.mutate({
        productId: editingProduct._id,
        productData: data,
      });
    }
  };

  const handleDeleteProduct = (productId: string) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      deleteProductMutation.mutate(productId);
    }
  };

  const handleEditProduct = (product: ProductDocument) => {
    setEditingProduct(product);
  };

  const handleCloseEditDialog = () => {
    setEditingProduct(null);
  };

  const handleCreateVariant = (product: ProductDocument) => {
    setCreatingVariantFor(product);
  };

  const handleCloseCreateVariantDialog = () => {
    setCreatingVariantFor(null);
  };

  const handleFiltersChange = (newFilters: ProductFilters) => {
    setFilters(newFilters);
  };

  const handleClearFilters = () => {
    setFilters({
      page: 1,
      page_size: 10,
      sort_by: "created_at",
      sort_order: "desc",
      product_type: "product", // Keep the default filter to show only products
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Product Management
          </h1>
          <p className="text-muted-foreground">
            Manage your products and inventory
          </p>
        </div>
        <Button onClick={() => setIsCreateDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Create Product
        </Button>
      </div>

      {/* Main Content */}
      <div className="space-y-4">
        <ProductFiltersComponent
          filters={filters}
          onFiltersChange={handleFiltersChange}
          onClearFilters={handleClearFilters}
        />

        {/* View Tabs */}
        <Tabs
          value={viewMode}
          onValueChange={(value) => setViewMode(value as "grid" | "list")}
        >
          <div className="flex items-center justify-between">
            <TabsList>
              <TabsTrigger value="grid" className="flex items-center gap-2">
                <Grid3X3 className="h-4 w-4" />
                Grid View
              </TabsTrigger>
              <TabsTrigger value="list" className="flex items-center gap-2">
                <List className="h-4 w-4" />
                List View
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="grid" className="space-y-4">
            {productsData && (
              <ProductList
                products={productsData.items}
                pagination={productsData.pagination}
                total_count={productsData.total_count}
                filters={filters}
                onFiltersChange={handleFiltersChange}
                onEdit={handleEditProduct}
                onDelete={handleDeleteProduct}
                onCreateVariant={handleCreateVariant}
                onViewVariants={() => {}} // Not used anymore since we navigate to separate page
                isLoading={isLoading}
                viewMode="grid"
              />
            )}
          </TabsContent>

          <TabsContent value="list" className="space-y-4">
            {productsData && (
              <ProductList
                products={productsData.items}
                pagination={productsData.pagination}
                total_count={productsData.total_count}
                filters={filters}
                onFiltersChange={handleFiltersChange}
                onEdit={handleEditProduct}
                onDelete={handleDeleteProduct}
                onCreateVariant={handleCreateVariant}
                onViewVariants={() => {}} // Not used anymore since we navigate to separate page
                isLoading={isLoading}
                viewMode="list"
              />
            )}
          </TabsContent>
        </Tabs>
      </div>

      {/* Create Product Dialog */}
      <CreateEditProductDialog
        isOpen={isCreateDialogOpen}
        onClose={() => setIsCreateDialogOpen(false)}
        onSubmit={handleCreateProduct}
        isLoading={createProductMutation.isPending}
        mode="create"
      />

      {/* Edit Product Dialog */}
      <CreateEditProductDialog
        isOpen={!!editingProduct}
        onClose={handleCloseEditDialog}
        onSubmit={handleUpdateProduct}
        isLoading={updateProductMutation.isPending}
        product={editingProduct || undefined}
        mode="edit"
      />

      {/* Create Variant Dialog */}
      <CreateEditProductDialog
        isOpen={!!creatingVariantFor}
        onClose={handleCloseCreateVariantDialog}
        onSubmit={(data) => {
          // Create variant with parent_id set to the current product
          const variantData = {
            ...data,
            product_type: "variant" as const,
            parent_id: creatingVariantFor?._id,
          };
          createProductMutation.mutate(variantData);
          handleCloseCreateVariantDialog();
        }}
        isLoading={createProductMutation.isPending}
        mode="create"
        product={creatingVariantFor || undefined}
        isCreatingVariant={true}
      />
    </div>
  );
};
