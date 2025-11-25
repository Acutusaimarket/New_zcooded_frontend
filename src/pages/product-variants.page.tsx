import React from "react";

import { ArrowLeft, Package, Plus } from "lucide-react";
import { useNavigate, useParams } from "react-router";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useCreateProduct, useProductById } from "@/features/Product/api";
import { useProductVariantById } from "@/features/Product/api/query/use-product-varient-by-id";
import { CreateEditProductDialog } from "@/features/Product/components/CreateEditProductDialog";
import type { CreateProductFormData } from "@/features/Product/types";

export const ProductVariantsPage: React.FC = () => {
  const { productId } = useParams<{ productId: string }>();
  const navigate = useNavigate();
  const [isCreateVariantOpen, setIsCreateVariantOpen] = React.useState(false);

  const { data: productData, isLoading: productLoading } = useProductById(
    productId || ""
  );
  // const {
  //   data: variantsData,
  //   isLoading: variantsLoading,
  //   error,
  // } = useProductVariants(productId || "");
  const {
    data: variantsData,
    isLoading: variantsLoading,
    error,
  } = useProductVariantById(productId || "");
  const createProductMutation = useCreateProduct();

  const product = productData?.data;
  const variants = variantsData || [];

  const handleCreateVariant = (data: CreateProductFormData) => {
    if (productId) {
      const variantData = {
        ...data,
        product_type: "variant" as const,
        parent_id: productId,
      };
      createProductMutation.mutate(variantData);
      setIsCreateVariantOpen(false);
    }
  };

  const formatPrice = (price?: number, currency?: string) => {
    if (!price) return "N/A";
    return `${price.toFixed(2)} ${currency || "USD"}`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  if (productLoading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex h-64 items-center justify-center">
          <div className="border-primary h-8 w-8 animate-spin rounded-full border-b-2"></div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container mx-auto p-6">
        <div className="py-12 text-center">
          <Package className="text-muted-foreground mx-auto mb-4 h-16 w-16" />
          <h2 className="mb-2 text-2xl font-semibold">Product Not Found</h2>
          <p className="text-muted-foreground mb-4">
            The product you're looking for doesn't exist.
          </p>
          <Button onClick={() => navigate("/dashboard/product")}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Products
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex flex-col items-start gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/dashboard/product")}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Products
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Variants of {product.name || "Product"}
            </h1>
            <p className="text-muted-foreground">
              Manage variants for this product
            </p>
          </div>
        </div>
        <Button onClick={() => setIsCreateVariantOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Create Variant
        </Button>
      </div>

      {/* Product Info */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Base Product Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
            <div>
              <span className="text-muted-foreground text-sm font-medium">
                Name
              </span>
              <p className="text-lg font-semibold">{product.name || "N/A"}</p>
            </div>
            <div>
              <span className="text-muted-foreground text-sm font-medium">
                Type
              </span>
              <div className="mt-1">
                <Badge variant="default">{product.product_type}</Badge>
              </div>
            </div>
            <div>
              <span className="text-muted-foreground text-sm font-medium">
                Price
              </span>
              <p className="text-lg font-semibold">
                {formatPrice(product.price, product.currency)}
              </p>
            </div>
            <div>
              <span className="text-muted-foreground text-sm font-medium">
                Created
              </span>
              <p className="text-lg font-semibold">
                {formatDate(product.created_at)}
              </p>
            </div>
          </div>

          {product.description && (
            <div className="mt-6">
              <span className="text-muted-foreground text-sm font-medium">
                Description
              </span>
              <p className="mt-1 text-sm">{product.description}</p>
            </div>
          )}

          {(product.country || product.city) && (
            <div className="mt-4">
              <span className="text-muted-foreground text-sm font-medium">
                Location
              </span>
              <p className="mt-1 text-sm">
                {[product.city, product.country].filter(Boolean).join(", ")}
              </p>
            </div>
          )}

          {product.features && product.features.length > 0 && (
            <div className="mt-4">
              <span className="text-muted-foreground text-sm font-medium">
                Features
              </span>
              <div className="mt-2 flex flex-wrap gap-2">
                {product.features.map((feature, index) => (
                  <Badge key={index} variant="secondary" className="text-xs">
                    {feature}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Variants Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold">Product Variants</h2>
          <Badge variant="secondary" className="text-sm">
            {variants.length} variant{variants.length !== 1 ? "s" : ""}
          </Badge>
        </div>

        {variantsLoading && (
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

        {!variantsLoading && !error && variants.length === 0 && (
          <div className="py-12 text-center">
            <Package className="text-muted-foreground mx-auto mb-4 h-16 w-16" />
            <h3 className="text-muted-foreground mb-2 text-lg font-medium">
              No variants found
            </h3>
            <p className="text-muted-foreground mb-4 text-sm">
              Create your first variant to get started
            </p>
            <Button onClick={() => setIsCreateVariantOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Create First Variant
            </Button>
          </div>
        )}

        {!variantsLoading && !error && variants.length > 0 && (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {variants.map((variant) => (
              <Card key={variant._id} className="h-full">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="min-w-0 flex-1">
                      <CardTitle className="truncate text-lg font-semibold">
                        {variant.name || "Unnamed Variant"}
                      </CardTitle>
                      <div className="mt-2 flex items-center gap-2">
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

                <CardContent className="space-y-4">
                  {variant.description && (
                    <p className="text-muted-foreground line-clamp-3 text-sm">
                      {variant.description}
                    </p>
                  )}

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground font-medium">
                        Price
                      </span>
                      <p className="font-semibold">
                        {formatPrice(variant.price, variant.currency)}
                      </p>
                    </div>

                    {variant.weight && (
                      <div>
                        <span className="text-muted-foreground font-medium">
                          Weight/Quantity
                        </span>
                        <p className="font-semibold">{variant.weight}</p>
                      </div>
                    )}
                  </div>

                  {(variant.country || variant.city) && (
                    <div className="text-sm">
                      <span className="text-muted-foreground font-medium">
                        Location
                      </span>
                      <p className="mt-1">
                        {[variant.city, variant.country]
                          .filter(Boolean)
                          .join(", ")}
                      </p>
                    </div>
                  )}

                  {variant.features && variant.features.length > 0 && (
                    <div className="text-sm">
                      <span className="text-muted-foreground font-medium">
                        Features
                      </span>
                      <div className="mt-2 flex flex-wrap gap-1">
                        {variant.features.slice(0, 3).map((feature, index) => (
                          <Badge
                            key={index}
                            variant="secondary"
                            className="text-xs"
                          >
                            {feature}
                          </Badge>
                        ))}
                        {variant.features.length > 3 && (
                          <Badge variant="secondary" className="text-xs">
                            +{variant.features.length - 3} more
                          </Badge>
                        )}
                      </div>
                    </div>
                  )}

                  {variant.images && variant.images.length > 0 && (
                    <div className="flex gap-2 overflow-x-auto pb-2">
                      {variant.images.slice(0, 3).map((image, index) => (
                        <img
                          key={index}
                          src={image}
                          alt={`Variant ${index + 1}`}
                          className="h-16 w-16 rounded-md border object-cover"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.style.display = "none";
                          }}
                        />
                      ))}
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

      {/* Create Variant Dialog */}
      <CreateEditProductDialog
        isOpen={isCreateVariantOpen}
        onClose={() => setIsCreateVariantOpen(false)}
        onSubmit={handleCreateVariant}
        isLoading={createProductMutation.isPending}
        mode="create"
        product={product}
        isCreatingVariant={true}
      />
    </div>
  );
};
