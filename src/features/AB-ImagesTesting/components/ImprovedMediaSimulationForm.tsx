import React, { useCallback, useState } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  AlertCircle,
  Camera,
  FileImage,
  FileVideo,
  Play,
  Plus,
  Upload,
  X,
  Zap,
} from "lucide-react";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { PersonaSelector } from "@/components/shared/persona-selector";
import { ProductSelector } from "@/components/shared/product-selector";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Form, FormDescription, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import type {
  MediaFile,
  MediaSimulationFormData,
} from "@/types/media-simulation.type";

const formSchema = z.object({
  persona_ids: z.array(z.string()).min(1, "At least one persona is required"),
  product_id: z.string().min(1, "Product is required"),
  questions: z.array(z.string()).optional(),
  simulation_type: z.enum(["overview", "detailed"]),
  model: z.string().min(1, "Model is required"),
});

type FormData = z.infer<typeof formSchema>;

interface MediaSimulationFormProps {
  onSubmit: (data: MediaSimulationFormData) => void;
  isLoading?: boolean;
}

// MediaFileUpload Component
interface MediaFileUploadProps {
  mediaFiles: MediaFile[];
  onFilesChange: (files: MediaFile[]) => void;
  title?: string;
  description?: string;
}

const MediaFileUpload: React.FC<MediaFileUploadProps> = ({
  mediaFiles,
  onFilesChange,
  title = "Media Files Upload",
  description = "Upload images or videos to analyze. Supported formats: JPG, PNG, GIF, MP4, MOV, AVI (Max: 30MB per file)",
}) => {
  const formatFileSize = useCallback((bytes: number): string => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  }, []);

  const handleFileUpload = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const files = Array.from(event.target.files || []);
      const newMediaFiles: MediaFile[] = [];

      files.forEach((file) => {
        const isImage = file.type.startsWith("image/");
        const isVideo = file.type.startsWith("video/");

        if (!isImage && !isVideo) {
          alert("Please upload only image or video files");
          return;
        }

        // Check file size (limit to 10MB)
        if (file.size > 30 * 1024 * 1024) {
          alert(`File ${file.name} is too large. Maximum size is 30MB.`);
          return;
        }

        // Additional validation for image files
        if (isImage) {
          const validImageTypes = ["image/jpeg", "image/jpg", "image/png"];
          if (!validImageTypes.includes(file.type)) {
            alert(
              `Unsupported image format: ${file.type}. Please use JPEG, PNG, GIF, or WebP.`
            );
            return;
          }
        }

        // Additional validation for video files
        if (isVideo) {
          const validVideoTypes = ["video/mp4"];
          if (!validVideoTypes.includes(file.type)) {
            alert(`Unsupported video format: ${file.type}. Please use MP4`);
            return;
          }
        }

        // Validate file extension matches MIME type
        const fileExtension = file.name.split(".").pop()?.toLowerCase();
        if (
          isImage &&
          fileExtension &&
          !["jpg", "jpeg", "png"].includes(fileExtension)
        ) {
          alert(
            `File extension .${fileExtension} doesn't match image type ${file.type}`
          );
          return;
        }

        if (isVideo && fileExtension && !["mp4"].includes(fileExtension)) {
          alert(
            `File extension .${fileExtension} doesn't match video type ${file.type}`
          );
          return;
        }

        const mediaFile: MediaFile = {
          id: Math.random().toString(36).substr(2, 9),
          file,
          preview: URL.createObjectURL(file),
          type: isImage ? "image" : "video",
          size: file.size,
          name: file.name,
        };

        newMediaFiles.push(mediaFile);
      });

      if (newMediaFiles.length > 0) {
        onFilesChange([...mediaFiles, ...newMediaFiles]);
      }

      // Clear the input
      event.target.value = "";
    },
    [mediaFiles, onFilesChange]
  );

  const removeMediaFile = useCallback(
    (id: string) => {
      const newFiles = mediaFiles.filter((f) => {
        if (f.id === id) {
          URL.revokeObjectURL(f.preview);
          return false;
        }
        return true;
      });
      onFilesChange(newFiles);
    },
    [mediaFiles, onFilesChange]
  );

  const clearAllFiles = useCallback(() => {
    mediaFiles.forEach((file) => URL.revokeObjectURL(file.preview));
    onFilesChange([]);
  }, [mediaFiles, onFilesChange]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Upload className="h-5 w-5" />
          {title}
        </CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="border-muted-foreground/25 hover:border-primary/50 rounded-lg border-2 border-dashed p-8 transition-colors">
          <div className="flex flex-col items-center justify-center space-y-4">
            <div className="bg-primary/10 rounded-full p-4">
              <Upload className="text-primary h-8 w-8" />
            </div>
            <div className="space-y-2 text-center">
              <p className="text-lg font-medium">Upload media files</p>
              <p className="text-muted-foreground text-sm">
                Drag and drop files here, or click to browse
              </p>
            </div>
            <Input
              type="file"
              multiple
              accept="image/*,video/*"
              onChange={handleFileUpload}
              className="max-w-xs cursor-pointer"
            />
          </div>
        </div>

        {mediaFiles.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-medium">
                Uploaded Files ({mediaFiles.length})
              </h4>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={clearAllFiles}
              >
                Clear All
              </Button>
            </div>
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
              {mediaFiles.map((file) => (
                <div key={file.id} className="group relative">
                  <div className="bg-muted aspect-square overflow-hidden rounded-lg border">
                    {file.type === "image" ? (
                      <img
                        src={file.preview}
                        alt={file.name}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="relative h-full w-full">
                        <video
                          src={file.preview}
                          className="h-full w-full object-cover"
                          muted
                        />
                        <div className="absolute inset-0 flex items-center justify-center">
                          <Play className="h-8 w-8 text-white drop-shadow-lg" />
                        </div>
                      </div>
                    )}
                  </div>
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0 opacity-0 transition-opacity group-hover:opacity-100"
                    onClick={() => removeMediaFile(file.id)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                  <div className="absolute right-0 bottom-0 left-0 rounded-b-lg bg-black/70 p-2 text-white">
                    <p className="truncate text-xs font-medium">{file.name}</p>
                    <div className="flex items-center justify-between text-xs">
                      <span className="flex items-center gap-1">
                        {file.type === "image" ? (
                          <FileImage className="h-3 w-3" />
                        ) : (
                          <FileVideo className="h-3 w-3" />
                        )}
                        {file.type.toUpperCase()}
                      </span>
                      <span>{formatFileSize(file.size)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {mediaFiles.length === 0 && (
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Please upload one media file to proceed with the
              simulation.
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
};

export const ImprovedMediaSimulationForm: React.FC<
  MediaSimulationFormProps
> = ({ onSubmit, isLoading = false }) => {
  const [mediaFiles, setMediaFiles] = useState<MediaFile[]>([]);
  const [newQuestion, setNewQuestion] = useState("");
  const [questions, setQuestions] = useState<string[]>([]);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      persona_ids: [],
      product_id: "",
      questions: [],
      simulation_type: "overview",
      model: "gemini-2.0-flash",
    },
  });

  // Handle media files change from MediaFileUpload component
  const handleMediaFilesChange = useCallback((files: MediaFile[]) => {
    setMediaFiles(files);
  }, []);

  const addQuestion = () => {
    if (newQuestion.trim() && !questions.includes(newQuestion.trim())) {
      setQuestions((prev) => [...prev, newQuestion.trim()]);
      setNewQuestion("");
    }
  };

  const removeQuestion = (index: number) => {
    setQuestions((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = (data: FormData) => {
    if (mediaFiles.length === 0) {
      alert("Please upload one media file");
      return;
    }

    onSubmit({
      ...data,
      questions,
      environment_names: [],
      media_files: mediaFiles.map((f) => f.file),
    });
  };

  // Handle persona selection
  const handlePersonaToggle = useCallback(
    (personaId: string) => {
      const currentIds = form.getValues("persona_ids") || [];
      const newIds = currentIds.includes(personaId)
        ? currentIds.filter((id) => id !== personaId)
        : [...currentIds, personaId];

      form.setValue("persona_ids", newIds, {
        shouldValidate: true,
        shouldDirty: true,
        shouldTouch: true,
      });
    },
    [form]
  );

  // Handle product selection
  const handleProductSelect = useCallback(
    (productId: string) => {
      form.setValue("product_id", productId, {
        shouldValidate: true,
        shouldDirty: true,
        shouldTouch: true,
      });
    },
    [form]
  );

  // Watch form values for validation display
  const watchedPersonaIds = form.watch("persona_ids") || [];
  const watchedProductId = form.watch("product_id") || "";

  return (
    <div className="mx-auto w-full max-w-6xl space-y-6">
      {/* Header */}
      <div>
        <div className="py-3">
          <CardTitle className="flex items-center justify-start gap-2 text-2xl">
            <Camera className="h-6 w-6" />
            Media Simulation Analysis
          </CardTitle>
          <CardDescription className="text-base">
            Upload media files and analyze how different personas interact with
            your product using AI-powered insights
          </CardDescription>
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
          {/* Media Files Upload */}
          <MediaFileUpload
            mediaFiles={mediaFiles}
            onFilesChange={handleMediaFilesChange}
          />

          {/* Persona Selection */}
          <PersonaSelector
            selectedPersonaIds={watchedPersonaIds}
            onPersonaToggle={handlePersonaToggle}
          />

          {/* Product Selection */}
          <ProductSelector
            selectedProductId={watchedProductId}
            onProductSelect={handleProductSelect}
          />

          {/* Configuration */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5" />
                Simulation Configuration
              </CardTitle>
              <CardDescription>
                Configure analysis parameters and add custom questions
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Custom Questions */}
              <div className="space-y-4">
                <div>
                  <FormLabel>Custom Questions (Optional)</FormLabel>
                  <FormDescription>
                    Add specific questions you want the simulation to answer
                    about the media content
                  </FormDescription>
                </div>

                <div className="flex space-x-2">
                  <Input
                    value={newQuestion}
                    onChange={(e) => setNewQuestion(e.target.value)}
                    placeholder="e.g., How does this image make you feel about the product?"
                    onKeyDown={(e) =>
                      e.key === "Enter" && (e.preventDefault(), addQuestion())
                    }
                    className="flex-1"
                  />
                  <Button
                    type="button"
                    onClick={addQuestion}
                    size="sm"
                    disabled={!newQuestion.trim()}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>

                {questions.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium">
                      Questions ({questions.length})
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {questions.map((question, index) => (
                        <Badge
                          key={index}
                          variant="secondary"
                          className="flex max-w-md items-center gap-2 px-3 py-1"
                        >
                          <span className="truncate">{question}</span>
                          <X
                            className="hover:text-destructive h-3 w-3 flex-shrink-0 cursor-pointer"
                            onClick={() => removeQuestion(index)}
                          />
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Fixed Configuration Display */}
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <FormLabel>Analysis Type</FormLabel>
                  <FormDescription>
                    Analysis depth configuration
                  </FormDescription>
                  <div className="bg-muted/50 rounded-lg border p-3">
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-2 rounded-full bg-green-500" />
                      <span className="font-medium">Detailed</span>
                    </div>
                    <p className="text-muted-foreground mt-1 text-sm">
                      Quick analysis with key insights
                    </p>
                  </div>
                </div>

                <div className="space-y-2">
                  <FormLabel>AI Model</FormLabel>
                  <FormDescription>AI model for analysis</FormDescription>
                  <div className="bg-muted/50 rounded-lg border p-3">
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-2 rounded-full bg-green-500" />
                      <span className="font-medium">Acu 1.0</span>
                    </div>
                    <p className="text-muted-foreground mt-1 text-sm">
                      Fast and efficient analysis
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Submit Section */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col space-y-4">
                {/* Validation Summary */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <div
                      className={cn(
                        "h-2 w-2 rounded-full",
                        mediaFiles.length > 0
                          ? "bg-green-500"
                          : "bg-muted-foreground"
                      )}
                    />
                    <span
                      className={
                        mediaFiles.length > 0
                          ? "text-green-700"
                          : "text-muted-foreground"
                      }
                    >
                      Media files uploaded ({mediaFiles.length})
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <div
                      className={cn(
                        "h-2 w-2 rounded-full",
                        watchedPersonaIds?.length > 0
                          ? "bg-green-500"
                          : "bg-muted-foreground"
                      )}
                    />
                    <span
                      className={
                        watchedPersonaIds?.length > 0
                          ? "text-green-700"
                          : "text-muted-foreground"
                      }
                    >
                      Personas selected ({watchedPersonaIds?.length || 0})
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <div
                      className={cn(
                        "h-2 w-2 rounded-full",
                        watchedProductId
                          ? "bg-green-500"
                          : "bg-muted-foreground"
                      )}
                    />
                    <span
                      className={
                        watchedProductId
                          ? "text-green-700"
                          : "text-muted-foreground"
                      }
                    >
                      Product selected
                    </span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex justify-end space-x-2">
                  <Button
                    type="submit"
                    disabled={isLoading || mediaFiles.length === 0}
                    className="min-w-[150px]"
                  >
                    {isLoading ? (
                      <div className="flex items-center gap-2">
                        <div className="h-4 w-4 animate-spin rounded-full border-b-2 border-white" />
                        Analyzing...
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <Play className="h-4 w-4" />
                        Run Analysis
                      </div>
                    )}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </form>
      </Form>
    </div>
  );
};
