import { useState } from "react";

import { useQueryClient } from "@tanstack/react-query";
import { AlertCircleIcon, CloudUpload, UploadIcon, XIcon } from "lucide-react";
import { toast } from "sonner";

import {
  AnimatedUploadButton,
  type UploadState,
} from "@/components/enhance-button";
import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { TooltipWrapper } from "@/components/ui/tooltip";
import {
  type FileWithPreview,
  formatBytes,
  useFileUpload,
} from "@/hooks/use-file-upload";

import { usePersonaEngineUploadDataMutation } from "../api/mutation/use-upload-data.mutation";
import { usePersonaEngineStore } from "../hooks/persona-engine.hooks";
import { getFileIcon } from "../utils";

const maxSize = 100 * 1024 * 1024; // 100MB default
const maxFiles = 1;
const acceptedFileTypes = ".xls,.xlsx,.csv";

export default function PersonaEngineFileUploader() {
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadState, setUploadState] = useState<UploadState>("idle");
  const queryClient = useQueryClient();
  const isCollapsibleOpen = usePersonaEngineStore(
    (state) => state.isFileUploadOpen
  );

  const setIsCollapsibleOpen = usePersonaEngineStore(
    (state) => state.setIsFileUploadOpen
  );
  const setIsGenerateOpen = usePersonaEngineStore(
    (state) => state.setIsGeneratePersonaOpen
  );

  const [
    { files, isDragging, errors },
    {
      handleDragEnter,
      handleDragLeave,
      handleDragOver,
      handleDrop,
      openFileDialog,
      removeFile,
      getInputProps,
    },
  ] = useFileUpload({
    multiple: false,
    maxFiles,
    maxSize,
    accept: acceptedFileTypes,
  });

  const uploadMutation = usePersonaEngineUploadDataMutation();

  const handleFileUpload = (file?: FileWithPreview) => {
    if (!file?.file) {
      toast.error("No file selected for upload.");
      return;
    }
    setUploadState("uploading");
    setUploadProgress(0);
    uploadMutation.mutate(
      {
        file: file.file as File,
        onProgress: setUploadProgress,
      },
      {
        onSuccess: () => {
          toast.success("File uploaded successfully!");
          setIsCollapsibleOpen(false);
          setIsGenerateOpen(true);
          setUploadState("success");
          const element = document.getElementById("analysis-data-preview");
          if (element) {
            // console.log("first element", element);
            element.scrollTo({ top: 0, behavior: "smooth" });
          }
          queryClient.invalidateQueries({
            queryKey: ["metadata-list"],
          });
        },
        onError: (e) => {
          toast.error(e.message || "Failed to upload file. Please try again.");
          setUploadProgress(0);
          setUploadState("error");
          setIsGenerateOpen(false);
        },
      }
    );
  };

  // Handle file upload
  return (
    <Collapsible open={isCollapsibleOpen} onOpenChange={setIsCollapsibleOpen}>
      <TooltipWrapper
        triggerProps={{
          className: "w-full",
          asChild: true,
        }}
        content={
          isCollapsibleOpen
            ? "Close file upload section"
            : "Open file upload section"
        }
      >
        <CollapsibleTrigger className="hover:bg-secondary/20 bg-secondary/30 border-input mb-1 flex w-full cursor-pointer items-center justify-between rounded-lg border-2 px-4 py-3 shadow-sm transition-all duration-200 hover:shadow-md">
          <h2 className="text-lg font-semibold">Files Upload</h2>
        </CollapsibleTrigger>
      </TooltipWrapper>
      <CollapsibleContent className="shadow-md">
        <div className="flex flex-col gap-2">
          <div
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            data-dragging={isDragging || undefined}
            data-files={files.length > 0 || undefined}
            className="border-input has-[input:focus]:border-ring has-[input:focus]:ring-ring/50 flex min-h-[300px] flex-col items-center rounded-lg border-2 border-dashed bg-green-50/50 p-4 py-5 shadow-sm transition-all duration-200 not-data-[files]:justify-center hover:shadow-md has-[input:focus]:ring-2 data-[dragging=true]:border-green-300 data-[dragging=true]:bg-green-50"
          >
            <input
              {...getInputProps()}
              className="sr-only"
              aria-label="Upload files"
              disabled={uploadMutation.isPending}
            />

            {files.length > 0 ? (
              <div className="flex w-full flex-col gap-3">
                <div className="w-full space-y-2">
                  {files.map((file) => (
                    <div
                      key={file.id}
                      className="bg-background flex items-center justify-between gap-2 rounded-lg border p-3 shadow-sm transition-all duration-200 hover:shadow-md"
                    >
                      <div className="flex items-center gap-3 overflow-hidden">
                        <div className="flex aspect-square size-10 shrink-0 items-center justify-center rounded border">
                          {getFileIcon(file)}
                        </div>
                        <div className="flex min-w-0 flex-col gap-0.5">
                          <p className="truncate text-[13px] font-medium">
                            {file.file instanceof File
                              ? file.file.name
                              : file.file.name}
                          </p>
                          <p className="text-muted-foreground text-xs">
                            {formatBytes(
                              file.file instanceof File
                                ? file.file.size
                                : file.file.size
                            )}
                          </p>
                        </div>
                      </div>

                      <Button
                        size="icon"
                        variant="ghost"
                        className="text-muted-foreground/80 hover:text-foreground -me-2 size-8 hover:bg-transparent"
                        onClick={() => removeFile(file.id)}
                        aria-label="Remove file"
                        disabled={uploadMutation.isPending}
                      >
                        <XIcon className="size-4" aria-hidden="true" />
                      </Button>
                    </div>
                  ))}
                  {files.length === maxFiles && (
                    <AnimatedUploadButton
                      disabled={
                        uploadMutation.isPending || uploadMutation.isSuccess
                      }
                      className="w-full"
                      onClick={() => handleFileUpload(files?.[0])}
                      state={uploadState}
                      progress={uploadProgress}
                      errorMessage={
                        uploadMutation.isError
                          ? uploadMutation.error.message
                          : ""
                      }
                      successMessage="File uploaded successfully"
                    >
                      <UploadIcon
                        className="-ms-1 opacity-60"
                        aria-hidden="true"
                      />
                      Upload File
                    </AnimatedUploadButton>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center gap-4 text-center">
                <div
                  className="flex size-16 shrink-0 items-center justify-center rounded-full border-2 border-green-500"
                  aria-hidden="true"
                >
                  <CloudUpload className="size-8 text-green-500" />
                </div>
                <div className="flex flex-col items-center gap-1">
                  <p className="text-sm font-medium">
                    Drag & drop files or{" "}
                    <button
                      type="button"
                      onClick={openFileDialog}
                      className="cursor-pointer text-blue-600 underline hover:text-blue-700"
                      disabled={uploadMutation.isPending}
                    >
                      Browse
                    </button>
                  </p>
                  <p className="text-xs text-gray-500">
                    Max {maxFiles} files • Up to {formatBytes(maxSize)}
                  </p>
                </div>
                <Button
                  disabled={uploadMutation.isPending}
                  className="mt-4 bg-green-500 text-white shadow-sm transition-all duration-200 hover:bg-green-600 hover:shadow-md"
                  onClick={openFileDialog}
                >
                  Upload file
                </Button>
              </div>
            )}
          </div>

          {errors.length > 0 && (
            <div
              className="text-destructive flex items-center gap-1 text-xs"
              role="alert"
            >
              <AlertCircleIcon className="size-3 shrink-0" />
              <span>{errors[0]}</span>
            </div>
          )}
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
}
