import React, { useState } from "react";

import { Check, CheckCircle, Package, Search, Sparkles } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

import { useProductsList } from "../../Product/api/query/use-products-list";
import type { ProductFilters } from "../../Product/types";

interface ProductSelectionStepProps {
  selectedProduct: string;
  onProductChange: (productId: string) => void;
}

export const ProductSelectionStep: React.FC<ProductSelectionStepProps> = ({
  selectedProduct,
  onProductChange,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState<ProductFilters>({
    search: "",
    page: 1,
    page_size: 20,
    product_type: "product",
  });

  const { data: productData, isLoading, error } = useProductsList(filters);

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    setFilters((prev) => ({ ...prev, search: value, page: 1 }));
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="space-y-3 text-center">
          <div className="border-primary mx-auto h-10 w-10 animate-spin rounded-full border-2 border-t-transparent"></div>
          <p className="text-muted-foreground text-sm font-medium">
            Loading products...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-12 text-center">
        <p className="text-destructive text-sm font-medium">
          Failed to load products. Please try again.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Search Section */}
      <div className="relative max-w-lg">
        <Search className="text-muted-foreground absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2" />
        <Input
          placeholder="Search products by name, type, or description..."
          value={searchTerm}
          onChange={(e) => handleSearch(e.target.value)}
          className="h-11 pr-4 pl-11 text-sm shadow-sm transition-all focus:shadow-md"
        />
      </div>

      {/* Selected Product Info */}
      {selectedProduct && (
        <div className="bg-primary/10 border-primary/20 flex items-center gap-3 rounded-lg border px-4 py-3 shadow-sm">
          <div className="bg-primary/10 flex h-8 w-8 items-center justify-center rounded-full">
            <CheckCircle className="text-primary h-4 w-4" />
          </div>
          <div className="flex-1">
            <p className="text-primary text-sm font-semibold">
              Product Selected
            </p>
            <p className="text-muted-foreground text-xs">
              Ready to proceed with simulation
            </p>
          </div>
        </div>
      )}

      {/* Products List */}
      <div className="space-y-3">
        {productData?.items?.map((product) => {
          const isSelected = selectedProduct === product._id;
          return (
            <Card
              key={product._id}
              className={`group relative cursor-pointer overflow-hidden border transition-all duration-200 ${
                isSelected
                  ? "border-primary bg-primary/5 ring-primary/20 shadow-lg ring-2"
                  : "border-border bg-card hover:border-primary/30 hover:shadow-md"
              }`}
              onClick={() => onProductChange(product._id)}
            >
              <CardContent className="p-5">
                <div className="flex items-start gap-4">
                  {/* Product Image or Icon */}
                  <div className="relative flex-shrink-0">
                    {product.images && product.images.length > 0 ? (
                      <div className="border-border bg-muted relative h-20 w-20 overflow-hidden rounded-lg border-2">
                        <img
                          src={product.images[0]}
                          alt={product.name || "Product"}
                          className="h-full w-full object-cover transition-transform duration-200 group-hover:scale-105"
                        />
                      </div>
                    ) : (
                      <div className="bg-muted border-border flex h-20 w-20 items-center justify-center rounded-lg border-2">
                        <Package className="text-muted-foreground h-8 w-8" />
                      </div>
                    )}
                    {/* Selection Indicator Overlay */}
                    {isSelected && (
                      <div className="bg-primary border-background absolute -top-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full border-2 shadow-md">
                        <Check className="text-primary-foreground h-3.5 w-3.5" />
                      </div>
                    )}
                  </div>

                  {/* Product Details */}
                  <div className="flex flex-1 flex-col gap-3">
                    {/* Header Section */}
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 space-y-1">
                        <div className="flex items-center gap-2">
                          <h3
                            className={`text-base leading-tight font-semibold ${
                              isSelected ? "text-primary" : "text-foreground"
                            }`}
                          >
                            {product.name || "Unnamed Product"}
                          </h3>
                          {isSelected && (
                            <Sparkles className="text-primary h-4 w-4" />
                          )}
                        </div>
                        {product.description && (
                          <p className="text-muted-foreground line-clamp-2 text-sm leading-relaxed">
                            {product.description}
                          </p>
                        )}
                      </div>
                      {product.price && (
                        <div className="flex-shrink-0 text-right">
                          <Badge
                            variant={isSelected ? "default" : "secondary"}
                            className="text-xs font-semibold"
                          >
                            {product.price} {product.currency || "INR"}
                          </Badge>
                        </div>
                      )}
                    </div>

                    {/* Metadata Grid */}
                    <div className="grid grid-cols-2 gap-x-6 gap-y-2 text-sm md:grid-cols-4">
                      {product.product_type && (
                        <div className="space-y-0.5">
                          <span className="text-muted-foreground text-xs font-medium tracking-wide uppercase">
                            Type
                          </span>
                          <p className="text-foreground font-medium capitalize">
                            {product.product_type}
                          </p>
                        </div>
                      )}
                      {product.country && (
                        <div className="space-y-0.5">
                          <span className="text-muted-foreground text-xs font-medium tracking-wide uppercase">
                            Country
                          </span>
                          <p className="text-foreground font-medium">
                            {product.country}
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Features */}
                    {product.features && product.features.length > 0 && (
                      <div className="space-y-2">
                        <span className="text-muted-foreground text-xs font-semibold tracking-wide uppercase">
                          Key Features
                        </span>
                        <div className="flex flex-wrap gap-1.5">
                          {product.features
                            .slice(0, 4)
                            .map((feature, index) => (
                              <Badge
                                key={index}
                                variant="outline"
                                className="text-xs font-normal"
                              >
                                {feature}
                              </Badge>
                            ))}
                          {product.features.length > 4 && (
                            <Badge
                              variant="outline"
                              className="text-xs font-normal"
                            >
                              +{product.features.length - 4} more
                            </Badge>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Specifications */}
                    {product.specification &&
                      Object.keys(product.specification).length > 0 && (
                        <div className="space-y-2">
                          <span className="text-muted-foreground text-xs font-semibold tracking-wide uppercase">
                            Specifications
                          </span>
                          <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 text-xs">
                            {Object.entries(product.specification)
                              .slice(0, 4)
                              .map(([key, value]) => (
                                <div
                                  key={key}
                                  className="border-border/50 flex items-center justify-between border-b pb-1"
                                >
                                  <span className="text-muted-foreground capitalize">
                                    {key}:
                                  </span>
                                  <span className="text-foreground font-medium">
                                    {String(value)}
                                  </span>
                                </div>
                              ))}
                          </div>
                        </div>
                      )}
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Empty State */}
      {productData?.items?.length === 0 && (
        <div className="py-16 text-center">
          <div className="bg-muted mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full">
            <Package className="text-muted-foreground h-8 w-8" />
          </div>
          <h3 className="text-foreground mb-2 text-base font-semibold">
            No products found
          </h3>
          <p className="text-muted-foreground text-sm">
            {searchTerm
              ? "Try adjusting your search criteria"
              : "No products available at the moment"}
          </p>
        </div>
      )}

      {/* Pagination */}
      {productData?.pagination && productData.pagination.total_pages > 1 && (
        <div className="flex items-center justify-center gap-3 border-t pt-6">
          <Button
            variant="outline"
            size="sm"
            disabled={!productData.pagination.has_previous}
            onClick={() =>
              setFilters((prev) => ({ ...prev, page: (prev?.page || 1) - 1 }))
            }
            className="min-w-[100px]"
          >
            Previous
          </Button>
          <div className="text-muted-foreground flex items-center gap-2 px-4 text-sm">
            <span className="font-medium">
              Page {productData.pagination.page}
            </span>
            <span>of</span>
            <span className="font-medium">
              {productData.pagination.total_pages}
            </span>
          </div>
          <Button
            variant="outline"
            size="sm"
            disabled={!productData.pagination.has_next}
            onClick={() =>
              setFilters((prev) => ({ ...prev, page: (prev?.page || 1) + 1 }))
            }
            className="min-w-[100px]"
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
};
