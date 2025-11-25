import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

import type { SimulationDetails } from "../../types/simulation.types";

interface ProductDetailsProps {
  simulation: SimulationDetails;
}

export const ProductDetails = ({ simulation }: ProductDetailsProps) => {
  const { product_details } = simulation;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Product Details</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Basic Information */}
        <div className="space-y-4">
          <h4 className="font-medium">Basic Information</h4>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <span className="text-muted-foreground text-sm font-medium">
                Name
              </span>
              <p className="text-foreground">{product_details.name}</p>
            </div>
            <div>
              <span className="text-muted-foreground text-sm font-medium">
                Price
              </span>
              <p className="text-foreground">
                {product_details.currency} {product_details.price}
              </p>
            </div>
            <div>
              <span className="text-muted-foreground text-sm font-medium">
                Location
              </span>
              <p className="text-foreground">
                {product_details.city}, {product_details.country}
              </p>
            </div>
            <div>
              <span className="text-muted-foreground text-sm font-medium">
                Product Type
              </span>
              <Badge variant="outline">{product_details.product_type}</Badge>
            </div>
          </div>
        </div>

        <Separator />

        {/* Description */}
        <div className="space-y-2">
          <h4 className="font-medium">Description</h4>
          <p className="text-muted-foreground">{product_details.description}</p>
        </div>

        {/* Features */}
        {product_details.features && product_details?.features.length > 0 && (
          <>
            <Separator />
            <div className="space-y-2">
              <h4 className="font-medium">Features</h4>
              <div className="flex flex-wrap gap-2">
                {product_details.features.map((feature, index) => (
                  <Badge key={index} variant="secondary">
                    {feature}
                  </Badge>
                ))}
              </div>
            </div>
          </>
        )}

        {/* Images */}
        {product_details.images && product_details.images.length > 0 && (
          <>
            <Separator />
            <div className="space-y-2">
              <h4 className="font-medium">Images</h4>
              <div className="grid grid-cols-2 gap-2 md:grid-cols-4">
                {product_details.images.map((image, index) => (
                  <div
                    key={index}
                    className="bg-muted aspect-square overflow-hidden rounded-md"
                  >
                    <img
                      src={image}
                      alt={`Product image ${index + 1}`}
                      className="h-full w-full object-cover"
                    />
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {/* Specifications */}
        {product_details.specification &&
          Object.keys(product_details.specification).length > 0 && (
            <>
              <Separator />
              <div className="space-y-2">
                <h4 className="font-medium">Specifications</h4>
                <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
                  {Object.entries(product_details.specification).map(
                    ([key, value]) => (
                      <div key={key} className="flex justify-between">
                        <span className="text-muted-foreground text-sm font-medium capitalize">
                          {key.replace(/([A-Z])/g, " $1").trim()}:
                        </span>
                        <span className="text-foreground text-sm">{value}</span>
                      </div>
                    )
                  )}
                </div>
              </div>
            </>
          )}

        {/* Physical Attributes */}
        {(product_details.color ||
          product_details.size ||
          product_details.weight) && (
          <>
            <Separator />
            <div className="space-y-2">
              <h4 className="font-medium">Physical Attributes</h4>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                {product_details.color && (
                  <div>
                    <span className="text-muted-foreground text-sm font-medium">
                      Color
                    </span>
                    <p className="text-foreground">{product_details.color}</p>
                  </div>
                )}
                {product_details.size && (
                  <div>
                    <span className="text-muted-foreground text-sm font-medium">
                      Size
                    </span>
                    <p className="text-foreground">{product_details.size}</p>
                  </div>
                )}
                {product_details.weight && (
                  <div>
                    <span className="text-muted-foreground text-sm font-medium">
                      Weight/Quantity
                    </span>
                    <p className="text-foreground">{product_details.weight}</p>
                  </div>
                )}
              </div>
            </div>
          </>
        )}

        {/* Variants */}
        {product_details.variants && product_details.variants.length > 0 && (
          <>
            <Separator />
            <div className="space-y-4">
              <h4 className="font-medium">Product Variants</h4>
              <div className="space-y-3">
                {product_details.variants.map((variant, index) => (
                  <div
                    key={variant._id || index}
                    className="space-y-2 rounded-lg border p-4"
                  >
                    <div className="flex items-center justify-between">
                      <h5 className="font-medium">{variant.name}</h5>
                      <Badge variant="outline">{variant.product_type}</Badge>
                    </div>
                    <p className="text-muted-foreground text-sm">
                      {variant.description}
                    </p>
                    <div className="grid grid-cols-2 gap-2 text-sm md:grid-cols-4">
                      <div>
                        <span className="text-muted-foreground font-medium">
                          Price:
                        </span>
                        <span className="ml-1">
                          {variant.currency} {variant.price}
                        </span>
                      </div>
                      {variant.color && (
                        <div>
                          <span className="text-muted-foreground font-medium">
                            Color:
                          </span>
                          <span className="ml-1">{variant.color}</span>
                        </div>
                      )}
                      {variant.size && (
                        <div>
                          <span className="text-muted-foreground font-medium">
                            Size:
                          </span>
                          <span className="ml-1">{variant.size}</span>
                        </div>
                      )}
                      {variant.weight && (
                        <div>
                          <span className="text-muted-foreground font-medium">
                            Weight/Quantity:
                          </span>
                          <span className="ml-1">{variant.weight}</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};
