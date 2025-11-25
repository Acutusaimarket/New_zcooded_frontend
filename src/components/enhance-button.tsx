import { type VariantProps } from "class-variance-authority";
import { CheckIcon, LoaderIcon } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";

import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type UploadState = "idle" | "uploading" | "success" | "error";

interface AnimatedUploadButtonProps
  extends React.ComponentProps<"button">,
    VariantProps<typeof buttonVariants> {
  state: UploadState;
  progress?: number;
  children?: React.ReactNode;
  successMessage?: string;
  errorMessage?: string;
  asChild?: boolean;
}

function AnimatedUploadButton({
  state = "idle",
  progress = 0,
  children,
  successMessage = "Uploaded!",
  errorMessage = "Failed",
  className,
  variant,
  size,
  asChild = false,
  disabled,
  ...props
}: AnimatedUploadButtonProps) {
  const isUploading = state === "uploading";
  const isSuccess = state === "success";
  const isError = state === "error";
  const isDisabled = disabled || isUploading;

  return (
    <Button
      className={cn(
        "relative overflow-hidden",
        isSuccess && "bg-green-600 hover:bg-green-600",
        isError && "bg-red-600 hover:bg-red-600",
        className
      )}
      variant={variant}
      size={size}
      asChild={asChild}
      disabled={isDisabled}
      {...props}
    >
      {/* Progress bar background */}
      <AnimatePresence>
        {isUploading && (
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${Math.min(Math.max(progress, 0), 100)}%` }}
            exit={{ width: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="bg-secondary/20 absolute inset-0 rounded-md"
          />
        )}
      </AnimatePresence>

      {/* Button content */}
      <div className="relative flex items-center justify-center gap-2">
        <AnimatePresence mode="wait">
          {state === "idle" && (
            <motion.div
              key="idle"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.2 }}
              className="flex items-center gap-2"
            >
              {children || "Upload File"}
            </motion.div>
          )}

          {state === "uploading" && (
            <motion.div
              key="uploading"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.2 }}
              className="flex items-center gap-2"
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{
                  duration: 1,
                  repeat: Infinity,
                  ease: "linear",
                }}
              >
                <LoaderIcon className="size-4" />
              </motion.div>
              <span>{progress}%</span>
            </motion.div>
          )}

          {state === "success" && (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.2 }}
              className="flex items-center gap-2"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.1, type: "spring", stiffness: 500 }}
              >
                <CheckIcon className="size-4" />
              </motion.div>
              <span>{successMessage}</span>
            </motion.div>
          )}

          {state === "error" && (
            <motion.div
              key="error"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.2 }}
              className="flex items-center gap-2"
            >
              <span>{errorMessage}</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </Button>
  );
}

export { AnimatedUploadButton, type UploadState };
