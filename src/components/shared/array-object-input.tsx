import { type ComponentProps } from "react";

import { Plus, X } from "lucide-react";
import type {
  ArrayPath,
  Control,
  FieldValues,
  Path,
  PathValue,
} from "react-hook-form";
import { useFieldArray } from "react-hook-form";

import { cn } from "@/lib/utils";

import { Button } from "../ui/button";
import { FormDescription, FormItem, FormLabel } from "../ui/form";
import FromInput from "./form-input";

// Type to restrict name field to only array of object paths that represent key-value records
type RecordArrayPath<T extends FieldValues> = {
  [K in ArrayPath<T>]: PathValue<T, K> extends
    | Array<{
        key: string;
        value: string;
      }>
    | undefined
    ? K
    : PathValue<T, K> extends Array<{
          key: string;
          value: string;
        }>
      ? K
      : never;
}[ArrayPath<T>];

interface ArrayObjectInputProps<T extends FieldValues>
  extends Omit<ComponentProps<"input">, "name" | "value" | "onChange"> {
  control: Control<T>;
  name: RecordArrayPath<T>; // Works with array of key-value objects
  label?: string;
  description?: string;
  keyPlaceholder?: string;
  valuePlaceholder?: string;
  maxItems?: number;
  minItems?: number;
  keyLabel?: string;
  valueLabel?: string;
}

const ArrayObjectInput = <T extends FieldValues>({
  control,
  name,
  label,
  description,
  keyPlaceholder = "Enter key",
  valuePlaceholder = "Enter value",
  maxItems,
  minItems = 0,
  className,
  required,
  keyLabel = "Key",
  valueLabel = "Value",
  ...props
}: ArrayObjectInputProps<T>) => {
  const { fields, append, remove } = useFieldArray({
    control,
    name: name as ArrayPath<T>,
  });

  const handleAdd = () => {
    // Type-safe append of key-value object
    append({ key: "", value: "" } as PathValue<T, ArrayPath<T>>[number]);
  };

  const handleRemove = (index: number) => {
    if (fields.length > minItems) {
      remove(index);
    }
  };

  // Get duplicate keys for validation
  const getDuplicateKeys = (): string[] => {
    const keys = fields
      .map((_, index) => control._getWatch(`${name}.${index}.key` as Path<T>))
      .filter(Boolean)
      .map((key: string) => key.trim());

    const duplicates = keys.filter(
      (key, index) => keys.indexOf(key) !== index && key !== ""
    );
    return [...new Set(duplicates)];
  };

  const duplicateKeys = getDuplicateKeys();

  return (
    <FormItem className={cn("w-full", className)}>
      {label && (
        <FormLabel required={required} className="relative w-fit">
          {label}
        </FormLabel>
      )}

      <div className="space-y-2">
        {fields.length > 0 && (
          <div className="space-y-2">
            <div className="text-muted-foreground grid grid-cols-2 gap-2 text-sm font-medium">
              <span>{keyLabel}</span>
              <span>{valueLabel}</span>
            </div>
          </div>
        )}

        {fields.map((field, index) => {
          const currentKey = control._getWatch(
            `${name}.${index}.key` as Path<T>
          );
          const hasError =
            duplicateKeys.includes(currentKey?.trim()) &&
            currentKey?.trim() !== "";

          return (
            <div key={field.id} className="flex items-start gap-2">
              <div className="grid flex-1 grid-cols-2 gap-2">
                <div className="space-y-1">
                  <FromInput
                    control={control}
                    name={`${name}.${index}.key` as Path<T>}
                    placeholder={keyPlaceholder}
                    {...props}
                    className={cn(
                      hasError &&
                        "border-destructive focus-visible:ring-destructive"
                    )}
                    type="text"
                  />
                  {hasError && (
                    <p className="text-destructive text-xs">Duplicate key</p>
                  )}
                </div>
                <FromInput
                  control={control}
                  name={`${name}.${index}.value` as Path<T>}
                  placeholder={valuePlaceholder}
                  {...props}
                  type="text"
                />
              </div>
              <Button
                type="button"
                onClick={() => handleRemove(index)}
                size="sm"
                variant="outline"
                className="mt-0 shrink-0"
                disabled={fields.length <= minItems || props.disabled}
              >
                <X className="h-4 w-4" />
                <span className="sr-only">Remove pair</span>
              </Button>
            </div>
          );
        })}

        {fields.length === 0 && (
          <div className="text-muted-foreground rounded-md border-2 border-dashed py-4 text-center text-sm">
            No key-value pairs added yet. Click "Add Pair" to get started.
          </div>
        )}

        <Button
          type="button"
          onClick={handleAdd}
          size="sm"
          variant="outline"
          className="w-full"
          disabled={maxItems ? fields.length >= maxItems : props.disabled}
        >
          <Plus className="mr-2 h-4 w-4" />
          Add Pair
        </Button>
      </div>

      {description && <FormDescription>{description}</FormDescription>}
    </FormItem>
  );
};

export default ArrayObjectInput;
