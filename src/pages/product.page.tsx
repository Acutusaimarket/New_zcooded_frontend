import React from "react";

import { ProductManagementComponent } from "@/features/Product/ProductManagementComponent";

export const ProductPage: React.FC = () => {
  return (
    <div className="container mx-auto p-6">
      <ProductManagementComponent />
    </div>
  );
};
