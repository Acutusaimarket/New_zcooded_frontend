import React, { useMemo, useState } from "react";

import { Check, Package, Search } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useProductsList } from "@/features/Product/api/query/use-products-list";
import { cn } from "@/lib/utils";

interface ProductSelectorProps {
  selectedProductId: string;
  onProductSelect: (productId: string) => void;
  title?: string;
  description?: string;
}

export const ProductSelector: React.FC<ProductSelectorProps> = ({
  selectedProductId,
  onProductSelect,
  title = "Select Product",
  description = "Choose the product context for analyzing media interactions",
}) => {
  const [productSearchTerm, setProductSearchTerm] = useState("");

  // Fetch products
  const productFilters = useMemo(
    () => ({
      page: 1,
      page_size: 50,
      search: productSearchTerm || undefined,
    }),
    [productSearchTerm]
  );

  const { data: productsData, isLoading: isLoadingProducts } =
    useProductsList(productFilters);

  const products = useMemo(() => productsData?.items || [], [productsData]);

  const selectedProduct = useMemo(
    () => products.find((p) => p._id === selectedProductId),
    [products, selectedProductId]
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Package className="h-5 w-5" />
          {title}
        </CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="relative">
          <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
          <Input
            placeholder="Search products..."
            value={productSearchTerm}
            onChange={(e) => setProductSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        {selectedProduct && (
          <div className="bg-muted/50 rounded-lg border p-3">
            <div className="flex items-center gap-3">
              {selectedProduct.images && selectedProduct.images.length > 0 && (
                <img
                  src={selectedProduct.images[0]}
                  alt={selectedProduct.name || "Product"}
                  className="h-12 w-12 rounded-md border object-cover"
                />
              )}
              <div>
                <h4 className="font-medium">
                  {selectedProduct.name || "Unnamed Product"}
                </h4>
                <div className="text-muted-foreground flex items-center gap-2 text-sm">
                  <Badge variant="secondary">
                    {selectedProduct.product_type}
                  </Badge>
                  {selectedProduct.price && (
                    <span>${selectedProduct.price.toFixed(2)}</span>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {isLoadingProducts ? (
          <div className="flex items-center justify-center py-8">
            <div className="space-y-2 text-center">
              <div className="border-primary mx-auto h-8 w-8 animate-spin rounded-full border-b-2"></div>
              <p className="text-muted-foreground">Loading products...</p>
            </div>
          </div>
        ) : products.length === 0 ? (
          <div className="py-8 text-center">
            <Package className="text-muted-foreground mx-auto mb-4 h-12 w-12" />
            <p className="text-muted-foreground">
              No products found matching your criteria.
            </p>
          </div>
        ) : (
          <div className="grid max-h-60 grid-cols-1 gap-4 overflow-y-auto md:grid-cols-2">
            {products.map((product) => {
              const isSelected = selectedProductId === product._id;
              return (
                <div
                  key={product._id}
                  className={cn(
                    "flex cursor-pointer items-center space-x-3 rounded-lg border p-3 transition-all hover:shadow-sm",
                    isSelected
                      ? "border-primary bg-primary/5"
                      : "hover:border-primary/50"
                  )}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    onProductSelect(product._id);
                  }}
                >
                  {product.images && product.images.length > 0 && (
                    <img
                      src={product.images[0]}
                      alt={product.name || "Product"}
                      className="h-10 w-10 flex-shrink-0 rounded-md border object-cover"
                    />
                  )}
                  <div className="min-w-0 flex-1">
                    <h4 className="truncate font-medium">
                      {product.name || "Unnamed Product"}
                    </h4>
                    <div className="text-muted-foreground flex items-center gap-2 text-sm">
                      <Badge variant="outline" className="text-xs">
                        {product.product_type}
                      </Badge>
                      {product.price && (
                        <span className="text-xs">
                          ${product.price.toFixed(2)}
                        </span>
                      )}
                    </div>
                  </div>
                  {isSelected && (
                    <Check className="text-primary h-4 w-4 flex-shrink-0" />
                  )}
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
