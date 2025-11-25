import React, { useEffect, useMemo, useState } from "react";

import { Check, Package, Search, X } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useProductsList } from "@/features/Product/api/query/use-products-list";
import type { ProductDocument } from "@/features/Product/types";
import { cn } from "@/lib/utils";

interface ProductSelectionStepProps {
  selectedProducts: string[];
  onProductsChange: (productIds: string[]) => void;
}

export const ProductSelectionStep: React.FC<ProductSelectionStepProps> = ({
  selectedProducts,
  onProductsChange,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedProductDetails, setSelectedProductDetails] = useState<
    ProductDocument[]
  >([]);

  const { data: productsData, isLoading } = useProductsList({
    page: 1,
    page_size: 50,
    search: searchTerm || undefined,
    // Show both products and variants for A/B testing
  });

  const products = useMemo(
    () => productsData?.items || [],
    [productsData?.items]
  );

  useEffect(() => {
    // Load details for selected products
    if (selectedProducts.length > 0 && products.length > 0) {
      const details = products.filter((product) =>
        selectedProducts.includes(product._id)
      );
      setSelectedProductDetails(details);
    }
  }, [selectedProducts, products]);

  const handleProductSelect = (product: ProductDocument) => {
    if (selectedProducts.includes(product._id)) {
      onProductsChange(selectedProducts.filter((id) => id !== product._id));
    } else {
      onProductsChange([...selectedProducts, product._id]);
    }
  };

  const handleRemoveProduct = (productId: string) => {
    onProductsChange(selectedProducts.filter((id) => id !== productId));
  };

  const formatPrice = (price?: number, currency?: string) => {
    if (!price) return "N/A";
    return `${price.toFixed(2)} ${currency || "USD"}`;
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h3 className="text-lg font-semibold">Select Products & Variants</h3>
        <p className="text-muted-foreground text-sm">
          Choose 2 or more products or variants to compare in your A/B test
        </p>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
        <Input
          placeholder="Search products..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Selected Products */}
      {selectedProducts.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              Selected Products & Variants ({selectedProducts.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {selectedProductDetails.map((product) => (
                <div
                  key={product._id}
                  className="flex items-center justify-between rounded-lg border p-3"
                >
                  <div className="flex items-center gap-3">
                    {product.images && product.images.length > 0 && (
                      <img
                        src={product.images[0]}
                        alt={product.name || "Product"}
                        className="h-12 w-12 rounded-md border object-cover"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.style.display = "none";
                        }}
                      />
                    )}
                    <div>
                      <h4 className="font-medium">
                        {product.name || "Unnamed Product"}
                      </h4>
                      <div className="text-muted-foreground flex items-center gap-2 text-sm">
                        <span>
                          {formatPrice(product.price, product.currency)}
                        </span>
                        {product.color && (
                          <Badge variant="outline" className="text-xs">
                            {product.color}
                          </Badge>
                        )}
                        {product.size && (
                          <Badge variant="outline" className="text-xs">
                            {product.size}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleRemoveProduct(product._id)}
                    className="text-destructive hover:text-destructive"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Available Products */}
      <Card>
        <CardHeader>
          <CardTitle>Available Products & Variants</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="text-muted-foreground">Loading products...</div>
            </div>
          ) : products.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <Package className="text-muted-foreground mb-4 h-12 w-12" />
              <h3 className="font-medium">No products or variants found</h3>
              <p className="text-muted-foreground text-sm">
                Create some products or variants to run A/B tests
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              {products.map((product) => {
                const isSelected = selectedProducts.includes(product._id);
                return (
                  <div
                    key={product._id}
                    className={cn(
                      "cursor-pointer rounded-lg border p-4 transition-all hover:shadow-md",
                      isSelected
                        ? "border-primary bg-primary/5"
                        : "hover:border-primary/50"
                    )}
                    onClick={() => handleProductSelect(product)}
                  >
                    <div className="flex items-start gap-3">
                      {product.images && product.images.length > 0 && (
                        <img
                          src={product.images[0]}
                          alt={product.name || "Product"}
                          className="h-16 w-16 rounded-md border object-cover"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.style.display = "none";
                          }}
                        />
                      )}
                      <div className="min-w-0 flex-1">
                        <div className="mb-2 flex items-center gap-2">
                          <h4 className="truncate font-medium">
                            {product.name || "Unnamed Product"}
                          </h4>
                          {isSelected && (
                            <Check className="text-primary h-4 w-4 flex-shrink-0" />
                          )}
                        </div>
                        {product.description && (
                          <p className="text-muted-foreground mb-2 line-clamp-2 text-sm">
                            {product.description}
                          </p>
                        )}
                        <div className="flex items-center gap-2 text-sm">
                          <span className="font-medium">
                            {formatPrice(product.price, product.currency)}
                          </span>
                          <Badge variant="secondary" className="text-xs">
                            {product.product_type}
                          </Badge>
                          {product.color && (
                            <Badge variant="outline" className="text-xs">
                              {product.color}
                            </Badge>
                          )}
                          {product.size && (
                            <Badge variant="outline" className="text-xs">
                              {product.size}
                            </Badge>
                          )}
                        </div>
                        {product.features && product.features.length > 0 && (
                          <div className="mt-2 flex flex-wrap gap-1">
                            {product.features
                              .slice(0, 2)
                              .map((feature, index) => (
                                <Badge
                                  key={index}
                                  variant="secondary"
                                  className="text-xs"
                                >
                                  {feature}
                                </Badge>
                              ))}
                            {product.features.length > 2 && (
                              <Badge variant="secondary" className="text-xs">
                                +{product.features.length - 2}
                              </Badge>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Minimum requirement notice */}
      {selectedProducts.length > 0 && selectedProducts.length < 2 && (
        <div className="rounded-lg border border-amber-200 bg-amber-50 p-4">
          <div className="flex items-center gap-2 text-amber-800">
            <Package className="h-4 w-4" />
            <span className="text-sm font-medium">
              Select at least 2 products or variants to run an A/B test
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
