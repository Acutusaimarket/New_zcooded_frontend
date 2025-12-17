import React, { useCallback, useRef } from "react";

import {
  AlertCircle,
  FileImage,
  FileVideo,
  Play,
  Upload,
  X,
} from "lucide-react";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import type { MediaFile } from "@/types/media-simulation.type";

interface MediaUploadStepProps {
  mediaFiles: MediaFile[];
  onFilesChange: (files: MediaFile[]) => void;
}

export const MediaUploadStep: React.FC<MediaUploadStepProps> = ({
  mediaFiles,
  onFilesChange,
}) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
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

      // Restrict to only one file
      if (files.length === 0) return;

      // If user tries to upload multiple files, only take the first one
      const file = files[0];

      // If there's already a file, remove it first
      if (mediaFiles.length > 0) {
        mediaFiles.forEach((f) => URL.revokeObjectURL(f.preview));
      }

      const isImage = file.type.startsWith("image/");
      const isVideo = file.type.startsWith("video/");

      if (!isImage && !isVideo) {
        alert("Please upload only image or video files");
        event.target.value = "";
        return;
      }

      // Check file size - 30MB limit for all files (images and videos)
      const maxSize = 30 * 1024 * 1024; // 30MB maximum for all files
      if (file.size > maxSize) {
        const fileType = isVideo ? "Video" : "File";
        alert(`${fileType} ${file.name} is too large. Maximum size is 30MB.`);
        event.target.value = "";
        return;
      }

      // Additional validation for image files
      if (isImage) {
        const validImageTypes = ["image/jpeg", "image/jpg", "image/png"];
        if (!validImageTypes.includes(file.type)) {
          alert(
            `Unsupported image format: ${file.type}. Please use JPEG, PNG, GIF, or WebP.`
          );
          event.target.value = "";
          return;
        }
      }

      // Additional validation for video files
      if (isVideo) {
        const validVideoTypes = ["video/mp4"];
        if (!validVideoTypes.includes(file.type)) {
          alert(`Unsupported video format: ${file.type}. Please use MP4`);
          event.target.value = "";
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
        event.target.value = "";
        return;
      }

      if (isVideo && fileExtension && !["mp4"].includes(fileExtension)) {
        alert(
          `File extension .${fileExtension} doesn't match video type ${file.type}`
        );
        event.target.value = "";
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

      // Replace existing files with the new single file
      onFilesChange([mediaFile]);

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
    <div className="space-y-6">
      {/* <div className="space-y-2">
        <h3 className="text-lg font-semibold">Upload Media Files</h3>
        <p className="text-muted-foreground text-sm">
          Upload images or videos to analyze. Supported formats: JPG, PNG, GIF, MP4, MOV, AVI (Max: 10MB per file)
        </p>
      </div> */}

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5" />
            Media Files Upload
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Upload area styled like the reference image */}
          <div
            className="block cursor-pointer rounded-lg border-2 border-dashed border-[#42bd00]/30 bg-[#e6ffeF] p-10 text-center transition-colors hover:border-[#42bd00]/60 hover:bg-[#d9ffe5]"
            onClick={() => fileInputRef.current?.click()}
          >
            <div className="flex flex-col items-center justify-center space-y-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-full border border-[#42bd00]/50 bg-white">
                <Upload className="h-7 w-7 text-[#42bd00]" />
              </div>
              <div className="space-y-1 text-center">
                <p className="text-sm font-semibold text-gray-900">
                  Drag &amp; drop files or{" "}
                  <span className="text-[#0070f3] underline">Browse</span>
                </p>
                <p className="text-xs text-gray-600">
                  Upload images or videos to analyze. Supported formats: JPG, PNG,
                  GIF, MP4, MOV, AVI (Max 30MB per file)
                </p>
              </div>
              <Button
                type="button"
                className="mt-2 rounded-full bg-[#42bd00] px-8 text-sm font-semibold text-white hover:bg-[#329600]"
              >
                Upload media
              </Button>
            </div>
          </div>
          <Input
            ref={fileInputRef}
            type="file"
            accept="image/*,video/*"
            onChange={handleFileUpload}
            className="hidden"
            // Single file upload only - no multiple attribute
          />

          {mediaFiles.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="font-medium">Uploaded File</h4>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={clearAllFiles}
                >
                  Remove
                </Button>
              </div>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
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
                      <p className="truncate text-xs font-medium">
                        {file.name}
                      </p>
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
                Please upload one media file to proceed with the simulation.
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
