import React, { useEffect, useMemo, useState } from "react";

import { Check, Package, Search, X } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useProductsList } from "@/features/Product/api/query/use-products-list";
import type { ProductDocument } from "@/features/Product/types";
import { cn } from "@/lib/utils";

interface MediaProductSelectionStepProps {
  selectedProductId: string;
  onProductSelect: (productId: string) => void;
}

export const MediaProductSelectionStep: React.FC<
  MediaProductSelectionStepProps
> = ({ selectedProductId, onProductSelect }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedProductDetails, setSelectedProductDetails] =
    useState<ProductDocument | null>(null);

  const { data: productsData, isLoading } = useProductsList({
    page: 1,
    page_size: 50,
    search: searchTerm || undefined,
  });

  const products = useMemo(
    () => productsData?.items || [],
    [productsData?.items]
  );

  useEffect(() => {
    // Load details for selected product
    if (selectedProductId && products.length > 0) {
      const details = products.find(
        (product) => product._id === selectedProductId
      );
      setSelectedProductDetails(details || null);
    }
  }, [selectedProductId, products]);

  const handleProductSelect = (product: ProductDocument) => {
    onProductSelect(product._id);
  };

  const handleClearSelection = () => {
    onProductSelect("");
  };

  const formatPrice = (price?: number, currency?: string) => {
    if (!price) return "N/A";
    return `${price.toFixed(2)} ${currency || "USD"}`;
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h3 className="text-lg font-semibold">Select Product</h3>
        <p className="text-muted-foreground text-sm">
          Choose the product that will be used for media analysis
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

      {/* Selected Product */}
      {selectedProductId && selectedProductDetails && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              Selected Product
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between rounded-lg border p-3">
              <div className="flex items-center gap-3">
                {selectedProductDetails.images &&
                  selectedProductDetails.images.length > 0 && (
                    <img
                      src={selectedProductDetails.images[0]}
                      alt={selectedProductDetails.name || "Product"}
                      className="h-12 w-12 rounded-md border object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = "none";
                      }}
                    />
                  )}
                <div>
                  <h4 className="font-medium">
                    {selectedProductDetails.name || "Unnamed Product"}
                  </h4>
                  <div className="text-muted-foreground flex items-center gap-2 text-sm">
                    <span>
                      {formatPrice(
                        selectedProductDetails.price,
                        selectedProductDetails.currency
                      )}
                    </span>
                    {selectedProductDetails.color && (
                      <Badge variant="outline" className="text-xs">
                        {selectedProductDetails.color}
                      </Badge>
                    )}
                    {selectedProductDetails.size && (
                      <Badge variant="outline" className="text-xs">
                        {selectedProductDetails.size}
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
              <Button
                size="sm"
                variant="outline"
                onClick={handleClearSelection}
                className="text-destructive hover:text-destructive"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Available Products */}
      <Card>
        <CardHeader>
          <CardTitle>Available Products</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="text-muted-foreground">Loading products...</div>
            </div>
          ) : products.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <Package className="text-muted-foreground mb-4 h-12 w-12" />
              <h3 className="font-medium">No products found</h3>
              <p className="text-muted-foreground text-sm">
                Create some products to run media simulations
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              {products.map((product) => {
                const isSelected = selectedProductId === product._id;
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
    </div>
  );
};
