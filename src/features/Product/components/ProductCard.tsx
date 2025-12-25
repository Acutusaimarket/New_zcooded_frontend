import React from "react";

import { Edit, Eye, Package, Plus, Tag, Trash2 } from "lucide-react";
import { Link } from "react-router";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardTitle } from "@/components/ui/card";

import type { ProductDocument } from "../types";

interface ProductCardProps {
  product: ProductDocument;
  onEdit: (product: ProductDocument) => void;
  onDelete: (productId: string) => void;
  onCreateVariant: (product: ProductDocument) => void;
  onViewVariants: (product: ProductDocument) => void;
  viewMode?: "grid" | "list";
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onEdit,
  onDelete,
  onCreateVariant,
  onViewVariants: _onViewVariants,
  viewMode = "grid",
}) => {
  // const navigate = useNavigate();

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const formatPrice = (price?: number, currency?: string) => {
    if (!price) return "N/A";
    return `${price.toFixed(2)} ${currency || "USD"}`;
  };

  // const handleViewVariants = () => {
  //   navigate(`/dashboard/product/variants/${product._id}`);
  // };

  if (viewMode === "list") {
    return (
      <Card className="h-full">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex min-w-0 flex-1 items-center gap-4">
              {/* Product Image */}
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

              {/* Product Info */}
              <div className="min-w-0 flex-1">
                <div className="mb-1 flex items-center gap-2">
                  <h3 className="truncate font-semibold">
                    {product.name || "Unnamed Product"}
                  </h3>
                  <Badge
                    variant={
                      product.product_type === "product"
                        ? "default"
                        : "secondary"
                    }
                    className="text-xs"
                  >
                    {product.product_type}
                  </Badge>
                </div>

                {product.description && (
                  <p className="text-muted-foreground mb-2 line-clamp-1 text-sm">
                    {product.description}
                  </p>
                )}

                <div className="flex items-center gap-4 text-sm">
                  <span className="font-medium">
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
                  <span className="text-muted-foreground">
                    {formatDate(product.created_at)}
                  </span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2">
              {product.product_type === "product" && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => onCreateVariant(product)}
                  className="h-8 px-3 text-xs"
                >
                  <Plus className="mr-1.5 h-3.5 w-3.5" />
                  Create Variant
                </Button>
              )}
              <Button
                size="sm"
                variant="outline"
                className="h-8 px-3 text-xs"
                asChild
              >
                <Link to={`/dashboard/product/variants/${product._id}`}>
                  <Eye className="mr-1.5 h-3.5 w-3.5" />
                  View Variants
                </Link>
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => onEdit(product)}
                className="h-8 w-8 p-0"
              >
                <Edit className="h-4 w-4" />
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => onDelete(product._id)}
                className="text-destructive hover:text-destructive h-8 w-8 p-0"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="group h-full overflow-hidden border border-gray-200 bg-white shadow-sm transition-all duration-300 hover:border-gray-300 hover:shadow-lg">
      {/* Product Image Section */}
      <div className="relative aspect-square overflow-hidden bg-gray-100">
        {product.images && product.images.length > 0 ? (
          <img
            src={product.images[0]}
            alt={product.name || "Product"}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src =
                "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='400'%3E%3Crect fill='%23f3f4f6' width='400' height='400'/%3E%3Ctext fill='%239ca3af' font-family='sans-serif' font-size='20' dy='10.5' font-weight='bold' x='50%25' y='50%25' text-anchor='middle'%3ENo Image%3C/text%3E%3C/svg%3E";
            }}
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
            <Package className="h-12 w-12 text-gray-400" />
          </div>
        )}

        {/* Action Buttons Overlay */}
        <div className="absolute top-2 right-2 flex gap-1.5 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
          <Button
            size="sm"
            variant="secondary"
            onClick={() => onEdit(product)}
            className="h-8 w-8 rounded-full bg-white/90 p-0 shadow-md backdrop-blur-sm hover:bg-white"
          >
            <Edit className="h-3.5 w-3.5" />
          </Button>
          <Button
            size="sm"
            variant="secondary"
            onClick={() => onDelete(product._id)}
            className="text-destructive hover:text-destructive h-8 w-8 rounded-full bg-white/90 p-0 shadow-md backdrop-blur-sm hover:bg-white"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </Button>
        </div>

        {/* Product Type Badge */}
        <div className="absolute top-2 left-2">
          <Badge
            variant={
              product.product_type === "product" ? "default" : "secondary"
            }
            className="shadow-sm"
          >
            {product.product_type}
          </Badge>
        </div>

        {/* Image Count Indicator */}
        {product.images && product.images.length > 1 && (
          <div className="absolute right-2 bottom-2 rounded-full bg-black/60 px-2 py-1 text-xs font-medium text-white backdrop-blur-sm">
            +{product.images.length - 1}
          </div>
        )}
      </div>

      <CardContent className="p-4">
        {/* Product Title and Attributes */}
        <div className="mb-3">
          <CardTitle className="mb-2 line-clamp-2 text-base font-semibold text-gray-900">
            {product.name || "Unnamed Product"}
          </CardTitle>

          {/* Color and Size Badges */}
          {(product.color || product.size) && (
            <div className="mb-2 flex flex-wrap gap-1.5">
              {product.color && (
                <Badge variant="outline" className="text-xs font-normal">
                  {product.color}
                </Badge>
              )}
              {product.size && (
                <Badge variant="outline" className="text-xs font-normal">
                  {product.size}
                </Badge>
              )}
            </div>
          )}

          {/* Description */}
          {product.description && (
            <p className="text-muted-foreground line-clamp-2 text-xs leading-relaxed">
              {product.description}
            </p>
          )}
        </div>

        {/* Price and Quantity Section */}
        <div className="mb-3 space-y-2 border-t border-gray-100 pt-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <Tag className="text-muted-foreground h-3.5 w-3.5" />
              <span className="text-xs font-medium text-gray-600">Price</span>
            </div>
            <span className="text-base font-semibold text-gray-900">
              {formatPrice(product.price, product.currency)}
            </span>
          </div>

          {product.weight && (
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <Package className="text-muted-foreground h-3.5 w-3.5" />
                <span className="text-xs font-medium text-gray-600">
                  Quantity
                </span>
              </div>
              <span className="text-sm font-medium text-gray-700">
                {product.weight}
              </span>
            </div>
          )}
        </div>

        {/* Features */}
        {product.features && product.features.length > 0 && (
          <div className="mb-3">
            <div className="mb-1.5 flex flex-wrap gap-1">
              {product.features.slice(0, 3).map((feature, index) => (
                <Badge
                  key={index}
                  variant="secondary"
                  className="text-xs font-normal"
                >
                  {feature}
                </Badge>
              ))}
              {product.features.length > 3 && (
                <Badge variant="secondary" className="text-xs font-normal">
                  +{product.features.length - 3}
                </Badge>
              )}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex items-center gap-2 border-t border-gray-100 pt-3">
          {product.product_type === "product" && (
            <Button
              size="sm"
              variant="outline"
              onClick={() => onCreateVariant(product)}
              className="h-8 flex-1 text-xs font-medium"
            >
              <Plus className="mr-1.5 h-3.5 w-3.5" />
              Create Variant
            </Button>
          )}
          <Button
            size="sm"
            variant="outline"
            className="h-8 flex-1 text-xs font-medium"
            asChild
          >
            <Link to={`/dashboard/product/variants/${product._id}`}>
              <Eye className="mr-1.5 h-3.5 w-3.5" />
              View Variants
            </Link>
          </Button>
        </div>

        {/* Footer */}
        <div className="mt-3 text-center">
          <p className="text-muted-foreground text-xs">
            Created {formatDate(product.created_at)}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
