import React from "react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import type { CreateProductFormData, ProductDocument } from "../types";
import { ProductForm } from "./ProductForm";

interface CreateEditProductDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateProductFormData) => void;
  isLoading?: boolean;
  product?: ProductDocument;
  mode?: "create" | "edit";
  isCreatingVariant?: boolean;
}

export const CreateEditProductDialog: React.FC<
  CreateEditProductDialogProps
> = ({
  isOpen,
  onClose,
  onSubmit,
  isLoading = false,
  product,
  mode = "create",
  isCreatingVariant = false,
}) => {
  const handleSubmit = (data: CreateProductFormData) => {
    onSubmit(data);
    onClose();
  };

  const getInitialData = (): Partial<CreateProductFormData> => {
    if (!product) return {};

    if (isCreatingVariant) {
      return {
        product_type: "variant",
        parent_id: product._id,
        currency: product.currency || "INR",
        country: product.country || "",
        city: product.city || "",
        features: product.features || [],
        specification: product.specification || {},
        metadata: product.metadata || {},
      };
    }

    return {
      name: product.name || "",
      description: product.description || "",
      price: product.price,
      currency: product.currency || "INR",
      country: product.country || "",
      city: product.city || "",
      images: product.images || [],
      features: product.features || [],
      specification: product.specification || {},
      color: product.color,
      size: product.size || "",
      weight: product.weight || "",
      metadata: product.metadata || {},
      product_type: product.product_type,
    };
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-h-[90vh] overflow-y-auto md:max-w-4xl">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle>
              {isCreatingVariant
                ? "Create New Variant"
                : mode === "create"
                  ? "Create New Product"
                  : "Edit Product"}
            </DialogTitle>
          </div>
        </DialogHeader>

        <ProductForm
          onSubmit={handleSubmit}
          isLoading={isLoading}
          initialData={getInitialData()}
          mode={mode}
        />
      </DialogContent>
    </Dialog>
  );
};
