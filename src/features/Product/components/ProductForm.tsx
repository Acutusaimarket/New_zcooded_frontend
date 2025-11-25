import React, { useRef, useState } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { Upload, X } from "lucide-react";
import { useForm } from "react-hook-form";

import ArrayInputForm from "@/components/shared/array-form-input";
import ArrayObjectInput from "@/components/shared/array-object-input";
import FromInput from "@/components/shared/form-input";
import FormTextArea from "@/components/shared/form-text-area";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
// import Image from "next/image";
import countryCode from "@/constants/countries.json";

import { useOCRExtract } from "../api/mutation/use-ocr-extract";
import { type CreateProductFormData, createProductSchema } from "../schema";
import type { CreateProductFormData as CreateProductFormDataType } from "../types";

interface ProductFormProps {
  onSubmit: (data: CreateProductFormDataType) => void;
  isLoading?: boolean;
  initialData?: Partial<CreateProductFormDataType>;
  mode?: "create" | "edit";
}

export const ProductForm: React.FC<ProductFormProps> = ({
  onSubmit,
  isLoading = false,
  initialData,
  mode = "create",
}) => {
  // Determine if this is for creating a variant
  const isCreatingVariant =
    initialData?.parent_id && initialData?.product_type === "variant";

  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const ocrMutation = useOCRExtract();

  const form = useForm<CreateProductFormData>({
    resolver: zodResolver(createProductSchema),
    defaultValues: {
      product_type: isCreatingVariant
        ? "variant"
        : initialData?.product_type || "product",
      ...initialData,
      images: initialData?.images || [],
      specification: initialData?.specification
        ? Object.entries(initialData.specification).map(([key, value]) => ({
            key,
            value: String(value),
          }))
        : [],
      metadata: initialData?.metadata
        ? Object.entries(initialData.metadata).map(([key, value]) => ({
            key,
            value: String(value),
          }))
        : [],
      currency: initialData?.currency || "INR",
    },
    mode: "onChange",
  });

  const { control, handleSubmit, setValue } = form;

  // Handle image selection (multiple images)
  const handleImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      const newFiles = Array.from(files);
      setSelectedImages((prev) => [...prev, ...newFiles]);

      // Generate previews for new files
      newFiles.forEach((file) => {
        const reader = new FileReader();
        reader.onload = (e) => {
          setImagePreviews((prev) => [...prev, e.target?.result as string]);
        };
        reader.readAsDataURL(file);
      });
    }
  };

  // Handle OCR extraction
  const handleOCRExtract = async () => {
    if (selectedImages.length === 0) return;

    try {
      const result = await ocrMutation.mutateAsync({ images: selectedImages });

      if (result.success) {
        // Helper function to check if value is meaningful (not "Not specified" or empty)
        const isMeaningfulValue = (value: string | number): boolean => {
          if (typeof value === "string") {
            return (
              value.trim() !== "" && value.toLowerCase() !== "not specified"
            );
          }
          return value > 0;
        };

        // Fill form with OCR data only if meaningful
        if (isMeaningfulValue(result.data.product_name)) {
          setValue("name", result.data.product_name);
        }

        if (isMeaningfulValue(result.data.description)) {
          setValue("description", result.data.description);
        }

        if (isMeaningfulValue(result.data.price)) {
          setValue("price", result.data.price);
        }

        if (isMeaningfulValue(result.data.currency)) {
          setValue("currency", result.data.currency);
        }

        if (isMeaningfulValue(result.data.weight)) {
          setValue("weight", String(result.data.weight));
        }

        if (isMeaningfulValue(result.data.color)) {
          setValue("color", result.data.color);
        }

        if (isMeaningfulValue(result.data.size)) {
          setValue("size", result.data.size);
        }

        // Handle features (convert string to array)
        if (isMeaningfulValue(result.data.features)) {
          const featuresArray = result.data.features
            .split(",")
            .map((f) => f.trim())
            .filter((f) => f && f.toLowerCase() !== "not specified");
          if (featuresArray.length > 0) {
            setValue("features", featuresArray);
          }
        }

        // Handle image URLs from OCR response
        if (result.data.images && result.data.images.length > 0) {
          const imageUrls = result.data.images.map((img) => img.url);
          setValue("images", imageUrls);
          setValue(
            "s3_key",
            result.data.images.map((img) => img.key)
          );
        }

        // Handle specifications
        if (
          result.data.specifications &&
          result.data.specifications.length > 0
        ) {
          const meaningfulSpecs = result.data.specifications.filter(
            (spec) =>
              spec.key &&
              spec.value &&
              spec.key.toLowerCase() !== "not specified" &&
              spec.value.toLowerCase() !== "not specified"
          );
          if (meaningfulSpecs.length > 0) {
            setValue("specification", meaningfulSpecs);
          }
        }

        // Handle metadata
        if (result.data.metadata && result.data.metadata.length > 0) {
          const meaningfulMetadata = result.data.metadata.filter(
            (meta) =>
              meta.key &&
              meta.value &&
              meta.key.toLowerCase() !== "not specified" &&
              meta.value.toLowerCase() !== "not specified"
          );
          if (meaningfulMetadata.length > 0) {
            setValue("metadata", meaningfulMetadata);
          }
        }
      }
    } catch (error) {
      console.error("OCR extraction failed:", error);
    }
  };

  // Remove selected image by index
  const removeSelectedImage = (index: number) => {
    setSelectedImages((prev) => prev.filter((_, i) => i !== index));
    setImagePreviews((prev) => prev.filter((_, i) => i !== index));
  };

  // Clear all images
  const clearAllImages = () => {
    setSelectedImages([]);
    setImagePreviews([]);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleFormSubmit = (data: CreateProductFormData) => {
    // convert specification from array of object to object
    const specificationObject: Record<string, string> = data?.specification
      ? data.specification.reduce(
          (acc, { key, value }) => ({ ...acc, [key]: value }),
          {}
        )
      : {};

    // convert metadata from array of object to object
    const metadataObject: Record<string, string> = data?.metadata
      ? data.metadata.reduce(
          (acc, { key, value }) => ({ ...acc, [key]: value }),
          {}
        )
      : {};

    onSubmit({
      ...data,
      specification: specificationObject,
      metadata: metadataObject,
      product_type: isCreatingVariant ? "variant" : "product",
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
        <div>
          <div className="space-y-4">
            {/* Upload Product Images for OCR - Moved to top */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium">Upload Product Images</h3>
                <p className="text-muted-foreground text-sm">
                  Upload multiple images to automatically extract product
                  information
                </p>
              </div>

              <Card className="border-2 border-dashed">
                <CardContent className="p-6">
                  {imagePreviews.length === 0 ? (
                    <div className="flex flex-col items-center justify-center space-y-4">
                      <Upload className="text-muted-foreground h-12 w-12" />
                      <div className="text-center">
                        <p className="text-sm font-medium">
                          Upload Product Images
                        </p>
                        <p className="text-muted-foreground text-xs">
                          Click to select images or drag and drop (multiple
                          files supported)
                        </p>
                      </div>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={handleImageSelect}
                        className="hidden"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={ocrMutation.isPending}
                      >
                        Select Images
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {/* Image Grid */}
                      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                        {imagePreviews.map((preview, index) => (
                          <div key={index} className="relative">
                            <img
                              src={preview}
                              alt={`Product preview ${index + 1}`}
                              className="h-24 w-full rounded-lg object-cover"
                            />
                            <Button
                              type="button"
                              variant="destructive"
                              size="sm"
                              className="absolute top-1 right-1 h-6 w-6 p-0"
                              onClick={() => removeSelectedImage(index)}
                            >
                              <X className="h-3 w-3" />
                            </Button>
                          </div>
                        ))}
                      </div>

                      {/* Action Buttons */}
                      <div className="flex gap-2">
                        <Button
                          type="button"
                          onClick={handleOCRExtract}
                          disabled={ocrMutation.isPending}
                          className="flex-1"
                        >
                          {ocrMutation.isPending ? (
                            <>
                              <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                              Extracting...
                            </>
                          ) : (
                            "Extract Product Information"
                          )}
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => fileInputRef.current?.click()}
                          disabled={ocrMutation.isPending}
                        >
                          Add More
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          onClick={clearAllImages}
                          disabled={ocrMutation.isPending}
                        >
                          Clear All
                        </Button>
                      </div>

                      {/* Progress Indicator */}
                      {ocrMutation.isPending && (
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>
                              Processing {selectedImages.length} image(s)...
                            </span>
                            <span>Please wait</span>
                          </div>
                          <Progress value={66} className="h-2" />
                        </div>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Basic Information */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <FromInput
                control={control}
                name="name"
                label="Product Name"
                placeholder={
                  isCreatingVariant
                    ? "Enter variant name"
                    : "Enter product name"
                }
                required
              />

              <FormField
                control={control}
                name="product_type"
                disabled
                render={({ field }) => (
                  <FormItem>
                    <FormLabel required>Product Type</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select product type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="product">Product</SelectItem>
                        <SelectItem value="variant">Variant</SelectItem>
                      </SelectContent>
                    </Select>
                    {isCreatingVariant && (
                      <p className="text-muted-foreground text-xs">
                        This will be created as a variant of the parent product
                      </p>
                    )}
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Parent ID for variants */}
            {form.watch("product_type") === "variant" && !isCreatingVariant && (
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <FromInput
                  control={control}
                  name="parent_id"
                  label="Parent Product ID"
                  placeholder="Enter parent product ID"
                  description="ID of the parent product this variant belongs to"
                />
              </div>
            )}

            <FormTextArea
              control={control}
              name="description"
              label="Description"
              placeholder={
                isCreatingVariant
                  ? "Enter variant description"
                  : "Enter product description"
              }
              rows={3}
              className="min-h-[100px]"
            />

            {/* Pricing */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <FromInput
                control={control}
                name="price"
                label="Price"
                type="number"
                step="0.01"
                placeholder="0.00"
              />

              <FormField
                control={control}
                name="currency"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Currency</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value || "INR"}
                    >
                      <FormControl>
                        <SelectTrigger className="w-full ps-2 [&>span]:flex [&>span]:items-center [&>span]:gap-0.5 [&>span_img]:shrink-0">
                          <SelectValue placeholder="Select currency" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="[&_*[role=option]]:ps-2 [&_*[role=option]]:pe-8 [&_*[role=option]>span]:start-auto [&_*[role=option]>span]:end-2 [&_*[role=option]>span]:flex [&_*[role=option]>span]:items-center [&_*[role=option]>span]:gap-1">
                        {countryCode.map((country) => (
                          <SelectItem key={country.code} value={country.code}>
                            <img
                              src={country.flag}
                              alt={country.name}
                              width={20}
                              height={15}
                              className="mr-2 inline-block"
                            />
                            <span className="truncate">{country.name}</span>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FromInput
                control={control}
                name="weight"
                label="Quantity"
                type="text"
                placeholder="Enter quantity"
              />
            </div>

            {/* Physical Attributes */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <FromInput
                control={control}
                name="color"
                label="Color"
                placeholder="Enter color"
              />

              <FromInput
                control={control}
                name="size"
                label="Size"
                placeholder="Enter size"
              />
            </div>

            {/* Array inputs for features and images */}
            <ArrayInputForm
              control={control}
              name="features"
              label="Features"
              placeholder="Add a feature"
              maxItems={10}
              minItems={0}
            />
            <ArrayInputForm
              control={control}
              name="images"
              label="Images"
              placeholder="Add an image"
              maxItems={10}
              minItems={0}
            />

            {/* Specifications */}
            <ArrayObjectInput
              control={control}
              name="specification"
              label="Specifications"
              keyLabel="Key"
              valueLabel="Value"
              keyPlaceholder="Specification key"
              valuePlaceholder="Specification value"
              minItems={0}
              maxItems={20}
            />

            {/* Metadata */}
            <ArrayObjectInput
              control={control}
              name="metadata"
              label="Metadata"
              keyLabel="Key"
              valueLabel="Value"
              keyPlaceholder="Metadata key"
              valuePlaceholder="Metadata value"
              minItems={0}
              maxItems={20}
            />
          </div>
        </div>

        <div className="flex justify-end gap-4">
          <Button type="submit" disabled={isLoading}>
            {isLoading
              ? "Saving..."
              : isCreatingVariant
                ? "Create Variant"
                : mode === "create"
                  ? "Create Product"
                  : "Update Product"}
          </Button>
        </div>
      </form>
    </Form>
  );
};
