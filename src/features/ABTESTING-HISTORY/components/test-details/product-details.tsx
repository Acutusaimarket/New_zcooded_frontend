import React from "react";

import { Package, Users } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import type { ABTestHistoryItem } from "../../types";

interface ProductDetailsProps {
  test: ABTestHistoryItem;
}

export const ProductDetails: React.FC<ProductDetailsProps> = ({ test }) => {
  return (
    <div className="space-y-6">
      {/* Products Information */}
      {test.products && test.products.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              Product Variants ({test.products.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
              {test.products.map((product) => (
                <div
                  key={product._id}
                  className="space-y-3 rounded-lg border p-4"
                >
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <h4 className="font-medium">{product.name}</h4>
                      <p className="text-muted-foreground text-sm">
                        {product.description}
                      </p>
                    </div>
                    <Badge variant="outline" className="ml-2">
                      {product.price} {product.currency}
                    </Badge>
                  </div>

                  {product.images && product.images.length > 0 && (
                    <div className="flex gap-2">
                      {product.images.slice(0, 3).map((image, i) => (
                        <img
                          key={i}
                          src={image}
                          alt={`${product.name} image ${i + 1}`}
                          className="h-20 w-20 rounded-md object-cover"
                          onError={(e) => {
                            e.currentTarget.style.display = "none";
                          }}
                        />
                      ))}
                      {product.images.length > 3 && (
                        <div className="flex h-20 w-20 items-center justify-center rounded-md bg-gray-100 text-xs text-gray-600">
                          +{product.images.length - 3}
                        </div>
                      )}
                    </div>
                  )}

                  <div className="grid gap-3 text-sm">
                    <div className="grid gap-2 md:grid-cols-2">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Brand:</span>
                        <span className="font-medium">
                          {product.metadata.brand}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Model:</span>
                        <span className="font-medium">
                          {product.metadata.model}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Color:</span>
                        <span className="font-medium">{product.color}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Size:</span>
                        <span className="font-medium">{product.size}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">
                          Weight/Quantity:
                        </span>
                        <span className="font-medium">{product.weight}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Warranty:</span>
                        <span className="font-medium">
                          {product.metadata.warranty}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Specifications */}
                  {/* <div>
                    <div className="mb-2 text-sm font-medium">
                      Specifications:
                    </div>
                    <div className="grid gap-1 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Storage:</span>
                        <span className="font-medium">
                          {product.specification.storage}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">RAM:</span>
                        <span className="font-medium">
                          {product.specification.ram}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Battery:</span>
                        <span className="font-medium">
                          {product.specification.battery}
                        </span>
                      </div>
                    </div>
                  </div> */}

                  {/* Features */}
                  {product.features && product.features.length > 0 && (
                    <div>
                      <div className="mb-2 text-sm font-medium">
                        Key Features:
                      </div>
                      <ul className="text-muted-foreground space-y-1 text-xs">
                        {product.features.map((feature, i) => (
                          <li key={i}>• {feature}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Location Info */}
                  <div className="border-t pt-2">
                    <div className="text-muted-foreground flex justify-between text-xs">
                      <span>
                        {product.city}, {product.country}
                      </span>
                      <span>Product Type: {product.product_type}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Persona Details */}
      {test.persona && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Persona Details
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {/* Persona Basic Information */}
              <div className="rounded-lg border p-4">
                <div className="mb-4 flex items-start justify-between">
                  <div className="space-y-2">
                    <h4 className="text-xl font-semibold">
                      {test.persona.name}
                    </h4>
                    <p className="text-muted-foreground">
                      {test.persona.description}
                    </p>
                  </div>
                  <Badge variant="outline" className="ml-2">
                    {"General"}
                  </Badge>
                </div>

                {/* Persona Demographics */}
                {/* <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-3">
                    <h5 className="font-medium text-gray-800">Demographics</h5>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Age Range:</span>
                        <span className="font-medium">
                          {test.persona.age_range || "Not specified"}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Gender:</span>
                        <span className="font-medium">
                          {test.persona.gender || "Not specified"}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Income Level:</span>
                        <span className="font-medium">
                          {test.persona.income_level || "Not specified"}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Education:</span>
                        <span className="font-medium">
                          {test.persona.education_level || "Not specified"}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <h5 className="font-medium text-gray-800">Behavioral Traits</h5>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Tech Savviness:</span>
                        <span className="font-medium">
                          {test.persona.tech_savviness || "Not specified"}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Shopping Behavior:</span>
                        <span className="font-medium">
                          {test.persona.shopping_behavior || "Not specified"}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Brand Loyalty:</span>
                        <span className="font-medium">
                          {test.persona.brand_loyalty || "Not specified"}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Price Sensitivity:</span>
                        <span className="font-medium">
                          {test.persona.price_sensitivity || "Not specified"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div> */}

                {/* Persona Goals and Pain Points */}
                <div className="mt-6 grid gap-4 md:grid-cols-2">
                  {test.persona.goals && test.persona.goals.length > 0 && (
                    <div>
                      <h5 className="mb-2 font-medium text-green-800">
                        Goals & Motivations
                      </h5>
                      <ul className="space-y-1 text-sm text-green-700">
                        {test.persona.goals?.map((goal: string, i: number) => (
                          <li key={i} className="flex items-start gap-2">
                            <span className="mt-1 text-green-500">✓</span>
                            {goal}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {test.persona.challenges &&
                    test.persona.challenges.length > 0 && (
                      <div>
                        <h5 className="mb-2 font-medium text-red-800">
                          Pain Points & Challenges
                        </h5>
                        <ul className="space-y-1 text-sm text-red-700">
                          {test.persona.challenges.map(
                            (challenge: string, i: number) => (
                              <li key={i} className="flex items-start gap-2">
                                <span className="mt-1 text-red-500">⚠</span>
                                {challenge}
                              </li>
                            )
                          )}
                        </ul>
                      </div>
                    )}
                </div>

                {/* Persona Preferences */}
                {test.persona.preferences &&
                  test.persona.preferences.length > 0 && (
                    <div className="mt-6">
                      <h5 className="mb-2 font-medium text-blue-800">
                        Preferences & Interests
                      </h5>
                      <div className="flex flex-wrap gap-2">
                        {test.persona.preferences.map(
                          (preference: string, i: number) => (
                            <Badge
                              key={i}
                              variant="secondary"
                              className="text-xs"
                            >
                              {preference}
                            </Badge>
                          )
                        )}
                      </div>
                    </div>
                  )}

                {/* Persona Communication Style */}
                {test.persona.communication_style && (
                  <div className="mt-6 rounded-lg bg-gray-50 p-4">
                    <h5 className="mb-2 font-medium text-gray-800">
                      Communication Style
                    </h5>
                    <p className="text-sm text-gray-700">
                      {test.persona.communication_style}
                    </p>
                  </div>
                )}

                {/* Persona ID */}
                {/* <div className="mt-4 pt-4 border-t">
                  <div className="text-muted-foreground text-xs">
                    Persona ID: {test.persona._id}
                  </div>
                </div> */}
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
