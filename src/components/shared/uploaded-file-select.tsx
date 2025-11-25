import { useCallback, useMemo, useState } from "react";

import { FileChartLineIcon } from "lucide-react";

import { useMetadataListQuery } from "@/api/query/use-metadata-list.query";
import { useDebounce } from "@/hooks/use-debounce";
import { cn } from "@/lib/utils";
import type { MetadataListResponse } from "@/types/metadata.type";

import { Combobox, type ComboboxOption } from "../ui/combobox";

interface UploadFileSelectProps {
  onChange?: (data: MetadataListResponse["items"][number] | undefined) => void;
  defaultValue?: string;
  className?: string;
  disabled?: boolean;
  placeholder?: string;
}

const UploadFileSelect = ({
  onChange,
  defaultValue,
  className,
  disabled = false,
  placeholder = "Select Metadata ID...",
}: UploadFileSelectProps) => {
  // Fetch metadata list with search functionality
  const [metadataSearchQuery, setMetadataSearchQuery] = useState(
    () => defaultValue || ""
  );
  const debouncedMetadataSearch = useDebounce(metadataSearchQuery, 300);
  const {
    data: metadataList,
    isLoading: isLoadingMetadata,
    error: metadataError,
  } = useMetadataListQuery({
    search: debouncedMetadataSearch,
    per_page: 50,
  });

  const handleMetadataFilterChange = useCallback(
    (value: string) => {
      if (value === "clear") {
        onChange?.(undefined);
      } else if (value === "all") {
        onChange?.(undefined);
      } else {
        const selectedMetadata = metadataList?.items.find(
          (item) => item.id === value
        );
        onChange?.(selectedMetadata);
      }
    },
    [metadataList?.items, onChange]
  );

  const customFilter = useCallback(
    (value: string, search: string) => {
      if (!search) return 1;

      // Find the metadata item for this value
      const metadata = metadataList?.items.find((item) => item.id === value);
      if (!metadata) return 0;

      const searchLower = search.toLowerCase();

      // Search across multiple fields
      const searchableFields = [metadata.filename];

      // Calculate match score based on how many fields match
      let score = 0;
      searchableFields.forEach((field) => {
        const fieldLower = field.toLowerCase();
        if (fieldLower.includes(searchLower)) {
          // Give higher score for exact matches and beginning matches
          if (fieldLower === searchLower) score += 10;
          else if (fieldLower.startsWith(searchLower)) score += 5;
          else score += 1;
        }
      });

      return score;
    },
    [metadataList?.items]
  );

  const comboboxOptions: ComboboxOption[] = useMemo(() => {
    const options: ComboboxOption[] = [];

    // Add special options
    options.push({
      value: "clear",
      label: "Clear Selection",
    });

    options.push({
      value: "all",
      label: `All Metadata ${metadataList?.total_count ? `(${metadataList.total_count})` : ""}`,
    });

    // Add loading state
    if (isLoadingMetadata) {
      options.push({
        value: "loading",
        label: "Loading...",
        disabled: true,
      });
    }

    // Add error state
    if (metadataError) {
      options.push({
        value: "error",
        label: "Error loading metadata",
        disabled: true,
      });
    }

    // Add no data state
    if (
      !isLoadingMetadata &&
      !metadataError &&
      metadataList?.items.length === 0
    ) {
      options.push({
        value: "no-data",
        label: "No metadata found",
        disabled: true,
      });
    }

    // Add metadata items
    if (metadataList?.items) {
      metadataList.items.forEach((metadata) => {
        options.push({
          value: metadata.id,
          label: (
            <div className="flex w-full items-center justify-between">
              <div className="flex flex-1 items-center gap-1 truncate capitalize">
                <FileChartLineIcon className="size-4" /> {metadata.filename}
              </div>
              {metadata.file_size && (
                <span className="bg-muted text-muted-foreground rounded-full px-2 py-0.5 text-xs">
                  {(metadata.file_size / 1024 / 1024).toFixed(1)}MB
                </span>
              )}
            </div>
          ),
        });
      });
    }

    return options;
  }, [metadataList, isLoadingMetadata, metadataError]);

  return (
    <div className={cn("relative min-w-[200px]", className)}>
      <Combobox
        options={comboboxOptions}
        disabled={disabled}
        value={defaultValue}
        onValueChange={handleMetadataFilterChange}
        onSearchChange={setMetadataSearchQuery}
        filter={customFilter}
        placeholder={placeholder}
        searchPlaceholder="Search metadata..."
        emptyText="No metadata found"
        loading={isLoadingMetadata}
        className="w-full"
      />
    </div>
  );
};

export default UploadFileSelect;
