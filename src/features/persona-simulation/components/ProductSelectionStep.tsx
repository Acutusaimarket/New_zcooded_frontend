import React, { useState } from "react";

// import { Label } from "@/components/ui/label";
import { Check, CheckCircle, Package, Search } from "lucide-react";

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
      <div className="flex items-center justify-center py-8">
        <div className="space-y-2 text-center">
          <div className="border-primary mx-auto h-8 w-8 animate-spin rounded-full border-b-2"></div>
          <p className="text-muted-foreground">Loading products...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-8 text-center">
        <p className="text-destructive">
          Failed to load products. Please try again.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Search */}
      <div className="relative max-w-md">
        <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform" />
        <Input
          placeholder="Search products..."
          value={searchTerm}
          onChange={(e) => handleSearch(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Selected Product Info */}
      {selectedProduct && (
        <div className="bg-primary/5 flex items-center space-x-2 rounded-lg border p-3">
          <CheckCircle className="text-primary h-5 w-5" />
          <span className="text-sm font-medium">
            Product selected for simulation
          </span>
        </div>
      )}

      {/* Products List */}
      <div className="space-y-4">
        {productData?.items?.map((product) => (
          <Card
            key={product._id}
            className={`cursor-pointer transition-all hover:shadow-md ${
              selectedProduct === product._id
                ? "ring-primary bg-primary/5 ring-2"
                : "hover:bg-muted/50"
            }`}
            onClick={() => onProductChange(product._id)}
          >
            <CardContent className="p-4">
              <div className="flex items-start space-x-4">
                <div className="mt-1">
                  <div
                    className={`flex h-4 w-4 items-center justify-center rounded-full border-2 ${
                      selectedProduct === product._id
                        ? "border-primary bg-primary"
                        : "border-muted-foreground"
                    }`}
                  >
                    {selectedProduct === product._id && (
                      <Check className="text-primary-foreground h-2.5 w-2.5" />
                    )}
                  </div>
                </div>

                <div className="flex-1 space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="cursor-pointer text-lg font-semibold">
                        {product.name}
                      </div>
                      <p className="text-muted-foreground mt-1 text-sm">
                        {product.description}
                      </p>
                    </div>

                    {product.price && (
                      <Badge variant="secondary" className="ml-2">
                        {product.price} {product.currency || "INR"}
                      </Badge>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-sm md:grid-cols-4">
                    <div>
                      <span className="text-muted-foreground font-medium">
                        Type:
                      </span>
                      <p className="capitalize">
                        {product.product_type || "N/A"}
                      </p>
                    </div>
                    <div>
                      <span className="text-muted-foreground font-medium">
                        Country:
                      </span>
                      <p>{product.country || "N/A"}</p>
                    </div>
                  </div>

                  {product.features && product.features.length > 0 && (
                    <div>
                      <span className="text-muted-foreground text-sm font-medium">
                        Features:
                      </span>
                      <div className="mt-1 flex flex-wrap gap-1">
                        {product.features.slice(0, 5).map((feature, index) => (
                          <Badge
                            key={index}
                            variant="outline"
                            className="text-xs"
                          >
                            {feature}
                          </Badge>
                        ))}
                        {product.features.length > 5 && (
                          <Badge variant="outline" className="text-xs">
                            +{product.features.length - 5} more
                          </Badge>
                        )}
                      </div>
                    </div>
                  )}

                  {product.specification &&
                    Object.keys(product.specification).length > 0 && (
                      <div>
                        <span className="text-muted-foreground text-sm font-medium">
                          Specifications:
                        </span>
                        <div className="mt-1 grid grid-cols-2 gap-2 text-xs">
                          {Object.entries(product.specification)
                            .slice(0, 4)
                            .map(([key, value]) => (
                              <div key={key} className="flex justify-between">
                                <span className="text-muted-foreground">
                                  {key}:
                                </span>
                                <span>{String(value)}</span>
                              </div>
                            ))}
                        </div>
                      </div>
                    )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {productData?.items?.length === 0 && (
        <div className="py-8 text-center">
          <Package className="text-muted-foreground mx-auto mb-4 h-12 w-12" />
          <p className="text-muted-foreground">
            No products found matching your criteria.
          </p>
        </div>
      )}

      {/* Pagination */}
      {productData?.pagination && productData.pagination.total_pages > 1 && (
        <div className="flex justify-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            disabled={!productData.pagination.has_previous}
            onClick={() =>
              setFilters((prev) => ({ ...prev, page: (prev?.page || 1) - 1 }))
            }
          >
            Previous
          </Button>
          <span className="text-muted-foreground flex items-center px-3 text-sm">
            Page {productData.pagination.page} of{" "}
            {productData.pagination.total_pages}
          </span>
          <Button
            variant="outline"
            size="sm"
            disabled={!productData.pagination.has_next}
            onClick={() =>
              setFilters((prev) => ({ ...prev, page: (prev?.page || 1) + 1 }))
            }
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
};
