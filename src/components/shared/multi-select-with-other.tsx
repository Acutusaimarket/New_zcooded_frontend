import { useEffect, useMemo, useRef, useState } from "react";

import { ChevronDown, Plus, Search, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type Option = {
  label: string;
  value: string;
  description?: string;
};

type MultiSelectWithOtherProps = {
  value: string[];
  onChange: (values: string[]) => void;
  options: Option[];
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  allowCustom?: boolean;
  otherLabel?: string; // UI label for the Other/custom adder
  adderPlacement?: "dropdown" | "inline"; // where to render the custom adder
  addPlaceholder?: string; // placeholder text for custom input
};

const MultiSelectWithOther = ({
  value,
  onChange,
  options,
  placeholder = "Select options",
  disabled,
  className,
  allowCustom = true,
  otherLabel = "Other",
  adderPlacement = "dropdown",
  addPlaceholder,
}: MultiSelectWithOtherProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [customValue, setCustomValue] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);

  const normalizedOptions = useMemo(() => options, [options]);

  const filteredOptions = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    if (!term) return normalizedOptions;
    return normalizedOptions.filter(
      (opt) =>
        opt.label.toLowerCase().includes(term) ||
        opt.value.toLowerCase().includes(term) ||
        (opt.description?.toLowerCase().includes(term) ?? false)
    );
  }, [normalizedOptions, searchTerm]);

  const toggleSelection = (val: string) => {
    if (disabled) return;
    const set = new Set(value ?? []);
    if (set.has(val)) {
      set.delete(val);
    } else {
      set.add(val);
    }
    onChange(Array.from(set));
  };

  const removeValue = (val: string) => {
    if (disabled) return;
    onChange((value || []).filter((v) => v !== val));
  };

  const addCustom = () => {
    const val = customValue.trim();
    if (!val) return;
    if ((value || []).includes(val)) {
      setCustomValue("");
      return;
    }
    onChange([...(value || []), val]);
    setCustomValue("");
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
        setSearchTerm("");
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div className={className}>
      {/* Selected values as tokens */}
      <div className="flex flex-wrap items-center gap-2">
        {(value || []).length === 0 ? (
          <span className="text-muted-foreground text-sm">No selection</span>
        ) : (
          (value || []).map((v) => {
            const opt = normalizedOptions.find((o) => o.value === v);
            const label = opt?.label ?? v;
            return (
              <span
                key={v}
                className="bg-primary/10 text-primary inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs"
              >
                {label}
                <button
                  type="button"
                  onClick={() => removeValue(v)}
                  disabled={disabled}
                  className="disabled:opacity-50"
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            );
          })
        )}
      </div>

      {/* Trigger */}
      <div className="relative mt-2" ref={dropdownRef}>
        <div
          className="border-input bg-background ring-offset-background placeholder:text-muted-foreground focus:ring-ring flex w-full items-center justify-between rounded-md border px-3 py-2 text-sm focus:ring-2 focus:ring-offset-2 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
          onClick={() => !disabled && setIsOpen((o) => !o)}
        >
          <span className="text-sm">{placeholder}</span>
          <ChevronDown className="h-4 w-4 opacity-50" />
        </div>

        {isOpen && (
          <div className="bg-popover border-border absolute z-50 mt-1 w-full rounded-md border shadow-md">
            <div className="border-b p-2">
              <div className="relative">
                <Search className="text-muted-foreground absolute top-2.5 left-2 h-4 w-4" />
                <Input
                  placeholder="Search..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                  autoFocus
                  disabled={disabled}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      e.stopPropagation();
                      if (filteredOptions.length > 0) {
                        toggleSelection(filteredOptions[0].value);
                      } else if (adderPlacement === "dropdown") {
                        const candidate = searchTerm.trim();
                        if (!disabled && candidate.length > 0) {
                          const set = new Set(value || []);
                          if (!set.has(candidate)) {
                            onChange([...set, candidate]);
                          }
                          setSearchTerm("");
                        }
                      }
                    }
                  }}
                />
              </div>
            </div>
            <div className="max-h-60 overflow-y-auto py-1">
              {filteredOptions.length === 0 ? (
                <div className="text-muted-foreground px-3 py-2 text-sm">
                  {searchTerm.trim().length > 0
                    ? `No results. Press Enter to add "${searchTerm.trim()}"`
                    : "No options"}
                </div>
              ) : null}
              {filteredOptions.map((opt) => {
                const checked = (value || []).includes(opt.value);
                return (
                  <div
                    key={opt.value}
                    className="hover:bg-accent hover:text-accent-foreground flex cursor-pointer items-start gap-2 px-3 py-2"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      toggleSelection(opt.value);
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={checked}
                      readOnly
                      className="pointer-events-none mt-0.5 rounded border-gray-300"
                    />
                    <div className="flex flex-col">
                      <span className="text-sm">{opt.label}</span>
                      {opt.description ? (
                        <span className="text-muted-foreground text-xs">
                          {opt.description}
                        </span>
                      ) : null}
                    </div>
                  </div>
                );
              })}
              {/* In dropdown mode, we intentionally avoid a second input.
                  Use the search input + Enter to add custom values. */}
            </div>
          </div>
        )}
      </div>

      {/* Inline Adder */}
      {allowCustom && adderPlacement === "inline" && (
        <div className="mt-2 flex items-center gap-2">
          <Input
            placeholder={
              addPlaceholder || `Add ${otherLabel?.toLowerCase()}...`
            }
            value={customValue}
            onChange={(e) => setCustomValue(e.target.value)}
            disabled={disabled}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                e.stopPropagation();
                addCustom();
              }
            }}
          />
          <Button
            type="button"
            variant="outline"
            onClick={addCustom}
            disabled={disabled || customValue.trim().length === 0}
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
};

export default MultiSelectWithOther;
