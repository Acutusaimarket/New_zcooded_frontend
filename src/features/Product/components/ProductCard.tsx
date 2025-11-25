import React from "react";

import { Edit, Eye, Package, Plus, Tag, Trash2 } from "lucide-react";
import { Link } from "react-router";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

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
                >
                  <Plus className="mr-1 h-4 w-4" />
                  Create Variant
                </Button>
              )}
              <Button size="sm" variant="outline" asChild>
                <Link to={`/dashboard/product/variants/${product._id}`}>
                  <Eye className="mr-1 h-4 w-4" />
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
    <Card className="h-full">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="min-w-0 flex-1">
            <CardTitle className="truncate text-lg font-semibold">
              {product.name || "Unnamed Product"}
            </CardTitle>
            <div className="mt-1 flex items-center gap-2">
              <Badge
                variant={
                  product.product_type === "product" ? "default" : "secondary"
                }
              >
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
          </div>
          <div className="flex gap-2">
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
      </CardHeader>

      <CardContent className="space-y-3">
        {product.description && (
          <p className="text-muted-foreground line-clamp-2 text-sm">
            {product.description}
          </p>
        )}

        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="flex items-center gap-2">
            <Tag className="text-muted-foreground h-4 w-4" />
            <span className="font-medium">Price:</span>
            <span>{formatPrice(product.price, product.currency)}</span>
          </div>

          {product.weight && (
            <div className="flex items-center gap-2">
              <Package className="text-muted-foreground h-4 w-4" />
              <span className="text-xs font-medium">Weight/Quantity:</span>
              <span>{product.weight}</span>
            </div>
          )}
        </div>

        {/* {(product.country || product.city) && (
          <div className="text-muted-foreground text-sm">
            <span className="font-medium">Location: </span>
            {[product.city, product.country].filter(Boolean).join(", ")}
          </div>
        )} */}

        {product.features && product.features.length > 0 && (
          <div className="space-y-2">
            <span className="text-sm font-medium">Features:</span>
            <div className="flex flex-wrap gap-1">
              {product.features.slice(0, 3).map((feature, index) => (
                <Badge key={index} variant="secondary" className="text-xs">
                  {feature}
                </Badge>
              ))}
              {product.features.length > 3 && (
                <Badge variant="secondary" className="text-xs">
                  +{product.features.length - 3} more
                </Badge>
              )}
            </div>
          </div>
        )}

        {product.images && product.images.length > 0 && (
          <div className="flex gap-2 overflow-x-auto pb-2">
            {product.images.slice(0, 3).map((image, index) => (
              <img
                key={index}
                src={image}
                alt={`Product ${index + 1}`}
                className="h-16 w-16 rounded-md border object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = "none";
                }}
              />
            ))}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-2 pt-2">
          {product.product_type === "product" && (
            <Button
              size="sm"
              variant="outline"
              onClick={() => onCreateVariant(product)}
              className="flex-1"
            >
              <Plus className="mr-1 h-4 w-4" />
              Create Variant
            </Button>
          )}
          <Button size="sm" variant="outline" className="flex-1" asChild>
            <Link to={`/dashboard/product/variants/${product._id}`}>
              <Eye className="mr-1 h-4 w-4" />
              View Variants
            </Link>
          </Button>
        </div>

        <div className="text-muted-foreground border-t pt-2 text-xs">
          Created: {formatDate(product.created_at)}
        </div>
      </CardContent>
    </Card>
  );
};
