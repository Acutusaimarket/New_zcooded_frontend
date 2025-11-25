import React from "react";

import { ChevronLeft, ChevronRight, Package } from "lucide-react";

import { Button } from "@/components/ui/button";

import type { ProductDocument, ProductFilters } from "../types";
import { ProductCard } from "./ProductCard";

interface ProductListProps {
  products: ProductDocument[];
  pagination: {
    page: number;
    page_size: number;
    total_pages: number;
    has_next: boolean;
    has_previous: boolean;
  };
  total_count: number;
  filters: ProductFilters;
  onFiltersChange: (filters: ProductFilters) => void;
  onEdit: (product: ProductDocument) => void;
  onDelete: (productId: string) => void;
  onCreateVariant: (product: ProductDocument) => void;
  onViewVariants: (product: ProductDocument) => void;
  isLoading?: boolean;
  viewMode?: "grid" | "list";
}

export const ProductList: React.FC<ProductListProps> = ({
  products,
  pagination,
  total_count,
  filters,
  onFiltersChange,
  onEdit,
  onDelete,
  onCreateVariant,
  onViewVariants,
  isLoading = false,
  viewMode = "grid",
}) => {
  const handlePageChange = (page: number) => {
    onFiltersChange({
      ...filters,
      page,
    });
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div
          className={
            viewMode === "grid"
              ? "grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3"
              : "space-y-4"
          }
        >
          {Array.from({ length: 6 }).map((_, index) => (
            <div
              key={index}
              className={`bg-muted animate-pulse rounded-lg ${
                viewMode === "grid" ? "h-64" : "h-32"
              }`}
            />
          ))}
        </div>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="py-12 text-center">
        <Package className="text-muted-foreground mx-auto mb-4 h-16 w-16" />
        <h3 className="text-muted-foreground mb-2 text-lg font-medium">
          No products found
        </h3>
        <p className="text-muted-foreground text-sm">
          Try adjusting your filters or create a new product.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Products Grid/List */}
      <div
        className={
          viewMode === "grid"
            ? "grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3"
            : "space-y-4"
        }
      >
        {products.map((product) => (
          <ProductCard
            key={product._id}
            product={product}
            onEdit={onEdit}
            onDelete={onDelete}
            onCreateVariant={onCreateVariant}
            onViewVariants={onViewVariants}
            viewMode={viewMode}
          />
        ))}
      </div>

      {/* Pagination */}
      {pagination.total_pages > 1 && (
        <div className="flex items-center justify-between">
          <div className="text-muted-foreground text-sm">
            Showing {(pagination.page - 1) * pagination.page_size + 1} to{" "}
            {Math.min(pagination.page * pagination.page_size, total_count)} of{" "}
            {total_count} products
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(pagination.page - 1)}
              disabled={!pagination.has_previous}
            >
              <ChevronLeft className="h-4 w-4" />
              Previous
            </Button>

            <div className="flex items-center gap-1">
              {Array.from(
                { length: Math.min(5, pagination.total_pages) },
                (_, i) => {
                  let pageNum;
                  if (pagination.total_pages <= 5) {
                    pageNum = i + 1;
                  } else if (pagination.page <= 3) {
                    pageNum = i + 1;
                  } else if (pagination.page >= pagination.total_pages - 2) {
                    pageNum = pagination.total_pages - 4 + i;
                  } else {
                    pageNum = pagination.page - 2 + i;
                  }

                  return (
                    <Button
                      key={pageNum}
                      variant={
                        pagination.page === pageNum ? "default" : "outline"
                      }
                      size="sm"
                      onClick={() => handlePageChange(pageNum)}
                      className="h-8 w-8 p-0"
                    >
                      {pageNum}
                    </Button>
                  );
                }
              )}
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(pagination.page + 1)}
              disabled={!pagination.has_next}
            >
              Next
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
