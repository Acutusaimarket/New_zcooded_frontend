import React from "react";

import { Filter, Search, XIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TooltipWrapper } from "@/components/ui/tooltip";

import type { ProductFilters } from "../types";

interface ProductFiltersProps {
  filters: ProductFilters;
  onFiltersChange: (filters: ProductFilters) => void;
  onClearFilters: () => void;
}

export const ProductFiltersComponent: React.FC<ProductFiltersProps> = ({
  filters,
  onFiltersChange,
  onClearFilters,
}) => {
  // const [isExpanded, setIsExpanded] = useState(false);
  const handleFilterChange = (
    key: keyof ProductFilters,
    value: string | number | undefined
  ) => {
    onFiltersChange({
      ...filters,
      [key]: value,
      page: 1, // Reset to first page when filters change
    });
  };

  const hasActiveFilters = Object.entries(filters).some(
    ([key, value]) =>
      key !== "page" &&
      key !== "page_size" &&
      value !== undefined &&
      value !== null &&
      value !== ""
  );

  return (
    <>
      <Collapsible className="bg-card rounded-lg border p-4">
        <CollapsibleTrigger className="flex w-full cursor-pointer items-center justify-between">
          <TooltipWrapper
            triggerProps={{
              asChild: true,
            }}
            content="Filters"
          >
            <div className="flex w-full flex-1 items-center gap-2">
              <Filter className="h-4 w-4" />
              <h3 className="font-medium">Filters</h3>
            </div>
          </TooltipWrapper>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <div className="space-y-4">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
              {/* Search */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Search</label>
                <div className="relative">
                  <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform" />
                  <Input
                    placeholder="Search products..."
                    value={filters.search || ""}
                    onChange={(e) =>
                      handleFilterChange("search", e.target.value || undefined)
                    }
                    className="pl-10"
                  />
                </div>
              </div>

              {/* Product Type */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Product Type</label>
                <Select
                  value={filters.product_type || "all"}
                  onValueChange={(value) =>
                    handleFilterChange(
                      "product_type",
                      value === "all" ? undefined : value
                    )
                  }
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="All types" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All types</SelectItem>
                    <SelectItem value="product">Product</SelectItem>
                    <SelectItem value="variant">Variant</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Currency */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Currency</label>
                <Select
                  value={filters.currency || "all"}
                  onValueChange={(value) =>
                    handleFilterChange(
                      "currency",
                      value === "all" ? undefined : value
                    )
                  }
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="All currencies" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All currencies</SelectItem>
                    <SelectItem value="USD">USD</SelectItem>
                    <SelectItem value="EUR">EUR</SelectItem>
                    <SelectItem value="GBP">GBP</SelectItem>
                    <SelectItem value="JPY">JPY</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Sort By */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Sort By</label>
                <Select
                  value={filters.sort_by || "created_at"}
                  onValueChange={(value) =>
                    handleFilterChange("sort_by", value)
                  }
                >
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="created_at">Created Date</SelectItem>
                    <SelectItem value="name">Name</SelectItem>
                    <SelectItem value="price">Price</SelectItem>
                    <SelectItem value="updated_at">Updated Date</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
              {/* Price Range */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Min Price</label>
                <Input
                  type="number"
                  placeholder="Min price"
                  value={filters.min_price || ""}
                  onChange={(e) =>
                    handleFilterChange(
                      "min_price",
                      e.target.value ? Number(e.target.value) : undefined
                    )
                  }
                  step="0.01"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Max Price</label>
                <Input
                  type="number"
                  placeholder="Max price"
                  value={filters.max_price || ""}
                  onChange={(e) =>
                    handleFilterChange(
                      "max_price",
                      e.target.value ? Number(e.target.value) : undefined
                    )
                  }
                  step="0.01"
                />
              </div>

              {/* Country */}
              {/* <div className="space-y-2">
                <label className="text-sm font-medium">Country</label>
                <Input
                  placeholder="Filter by country"
                  value={filters.country || ""}
                  onChange={(e) =>
                    handleFilterChange("country", e.target.value || undefined)
                  }
                />
              </div> */}

              {/* City */}
              {/* <div className="space-y-2">
                <label className="text-sm font-medium">City</label>
                <Input
                  placeholder="Filter by city"
                  value={filters.city || ""}
                  onChange={(e) =>
                    handleFilterChange("city", e.target.value || undefined)
                  }
                />
              </div> */}
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
              {/* Color */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Color</label>
                <Input
                  placeholder="Filter by color"
                  value={filters.color || ""}
                  onChange={(e) =>
                    handleFilterChange("color", e.target.value || undefined)
                  }
                />
              </div>

              {/* Size */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Size</label>
                <Input
                  placeholder="Filter by size"
                  value={filters.size || ""}
                  onChange={(e) =>
                    handleFilterChange("size", e.target.value || undefined)
                  }
                />
              </div>

              {/* Sort Order */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Sort Order</label>
                <Select
                  value={filters.sort_order || "desc"}
                  onValueChange={(value) =>
                    handleFilterChange("sort_order", value as "asc" | "desc")
                  }
                >
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="desc">Descending</SelectItem>
                    <SelectItem value="asc">Ascending</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Page Size */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Items per page</label>
                <Select
                  value={filters.page_size?.toString() || "10"}
                  onValueChange={(value) =>
                    handleFilterChange("page_size", Number(value))
                  }
                >
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="10">10</SelectItem>
                    <SelectItem value="20">20</SelectItem>
                    <SelectItem value="50">50</SelectItem>
                    <SelectItem value="100">100</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex items-end justify-end gap-2">
              {hasActiveFilters && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onClearFilters}
                  className="text-muted-foreground hover:text-foreground"
                >
                  <XIcon className="mr-1 h-4 w-4" />
                  Clear
                </Button>
              )}
            </div>
          </div>
        </CollapsibleContent>
      </Collapsible>
    </>
  );
};
