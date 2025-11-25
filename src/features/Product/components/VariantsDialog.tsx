import React from "react";

import { Package, Plus, X } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { useProductVariants } from "../api/query/use-product-variants";
import type { ProductDocument } from "../types";

interface VariantsDialogProps {
  product: ProductDocument;
  onClose: () => void;
  onCreateVariant: (product: ProductDocument) => void;
}

export const VariantsDialog: React.FC<VariantsDialogProps> = ({
  product,
  onClose,
  onCreateVariant,
}) => {
  const {
    data: variantsData,
    isLoading,
    error,
  } = useProductVariants(product._id);
  const variants = variantsData?.items || [];

  const formatPrice = (price?: number, currency?: string) => {
    if (!price) return "N/A";
    return `${price.toFixed(2)} ${currency || "USD"}`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <div className="bg-opacity-50 fixed inset-0 z-50 flex items-center justify-center bg-black">
      <div className="bg-background mx-4 max-h-[90vh] w-full max-w-6xl overflow-y-auto rounded-lg p-6">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-semibold">
              Variants of {product.name || "Product"}
            </h2>
            <p className="text-muted-foreground">
              Manage variants for this product
            </p>
          </div>
          <div className="flex gap-2">
            <Button onClick={() => onCreateVariant(product)} size="sm">
              <Plus className="mr-2 h-4 w-4" />
              Create Variant
            </Button>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Product Info */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg">Base Product</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4 text-sm md:grid-cols-4">
              <div>
                <span className="font-medium">Name:</span>
                <p className="text-muted-foreground">{product.name || "N/A"}</p>
              </div>
              <div>
                <span className="font-medium">Type:</span>
                <Badge variant="default" className="ml-2">
                  {product.product_type}
                </Badge>
              </div>
              <div>
                <span className="font-medium">Price:</span>
                <p className="text-muted-foreground">
                  {formatPrice(product.price, product.currency)}
                </p>
              </div>
              <div>
                <span className="font-medium">Created:</span>
                <p className="text-muted-foreground">
                  {formatDate(product.created_at)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Variants List */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Product Variants</h3>
            <Badge variant="secondary">
              {variants.length} variant{variants.length !== 1 ? "s" : ""}
            </Badge>
          </div>

          {isLoading && (
            <div className="py-8 text-center">
              <div className="border-primary mx-auto h-8 w-8 animate-spin rounded-full border-b-2"></div>
              <p className="text-muted-foreground mt-2">Loading variants...</p>
            </div>
          )}

          {error && (
            <div className="py-8 text-center">
              <Package className="text-muted-foreground mx-auto mb-2 h-12 w-12" />
              <p className="text-muted-foreground">Error loading variants</p>
              <p className="text-muted-foreground text-sm">
                {error instanceof Error
                  ? error.message
                  : "Unknown error occurred"}
              </p>
            </div>
          )}

          {!isLoading && !error && variants.length === 0 && (
            <div className="py-8 text-center">
              <Package className="text-muted-foreground mx-auto mb-2 h-12 w-12" />
              <p className="text-muted-foreground">No variants found</p>
              <p className="text-muted-foreground text-sm">
                Create your first variant to get started
              </p>
            </div>
          )}

          {!isLoading && !error && variants.length > 0 && (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              {variants.map((variant) => (
                <Card key={variant._id} className="h-full">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="min-w-0 flex-1">
                        <CardTitle className="truncate text-base font-semibold">
                          {variant.name || "Unnamed Variant"}
                        </CardTitle>
                        <div className="mt-1 flex items-center gap-2">
                          <Badge variant="secondary" className="text-xs">
                            Variant
                          </Badge>
                          {variant.color && (
                            <Badge variant="outline" className="text-xs">
                              {variant.color}
                            </Badge>
                          )}
                          {variant.size && (
                            <Badge variant="outline" className="text-xs">
                              {variant.size}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-3">
                    {variant.description && (
                      <p className="text-muted-foreground line-clamp-2 text-sm">
                        {variant.description}
                      </p>
                    )}

                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">Price:</span>
                        <span>
                          {formatPrice(variant.price, variant.currency)}
                        </span>
                      </div>

                      {variant.weight && (
                        <div className="flex items-center gap-2">
                          <span className="font-medium">Weight/Quantity:</span>
                          <span>{variant.weight}</span>
                        </div>
                      )}
                    </div>

                    {(variant.country || variant.city) && (
                      <div className="text-muted-foreground text-sm">
                        <span className="font-medium">Location: </span>
                        {[variant.city, variant.country]
                          .filter(Boolean)
                          .join(", ")}
                      </div>
                    )}

                    <div className="text-muted-foreground border-t pt-2 text-xs">
                      Created: {formatDate(variant.created_at)}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
