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

type StringArrayPath<T extends FieldValues> = {
  [K in ArrayPath<T>]: PathValue<T, K> extends Array<string> | undefined
    ? K
    : PathValue<T, K> extends Array<string>
      ? K
      : never;
}[ArrayPath<T>];

interface ArrayInputFormProps<T extends FieldValues>
  extends Omit<ComponentProps<"input">, "name" | "value" | "onChange"> {
  control: Control<T>;
  name: StringArrayPath<T> | string; // Works with any array path
  label?: string;
  description?: string;
  placeholder?: string;
  maxItems?: number;
  minItems?: number;
}

const ArrayInputForm = <T extends FieldValues>({
  control,
  name,
  label,
  description,
  placeholder = "Add new item",
  maxItems,
  minItems = 0,
  className,
  required,
  ...props
}: ArrayInputFormProps<T>) => {
  const { fields, append, remove } = useFieldArray({
    control,
    name: name as ArrayPath<T>,
  });

  const handleAdd = () => {
    // Type-safe append of empty string
    append("" as PathValue<T, ArrayPath<T>>[number]);
  };

  const handleRemove = (index: number) => {
    if (fields.length > minItems) {
      remove(index);
    }
  };

  return (
    <FormItem className={cn("w-full", className)}>
      {label && (
        <FormLabel required={required} className="relative w-fit">
          {label}
        </FormLabel>
      )}

      <div className="space-y-2">
        {fields.map((field, index) => (
          <div key={field.id} className="flex items-start gap-2">
            <FromInput
              control={control}
              name={`${name}.${index}` as Path<T>}
              placeholder={placeholder}
              {...props}
              className="flex-1"
              type="text" // Ensure it's always text input for strings
            />
            <Button
              type="button"
              onClick={() => handleRemove(index)}
              size="sm"
              variant="outline"
              className="mt-0 shrink-0"
              disabled={fields.length <= minItems || props.disabled}
            >
              <X className="h-4 w-4" />
              <span className="sr-only">Remove Item</span>
            </Button>
          </div>
        ))}

        {fields.length === 0 && (
          <div className="text-muted-foreground rounded-md border-2 border-dashed py-4 text-center text-sm">
            No items added yet. Click "Add Item" to get started.
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
          Add Item
        </Button>
      </div>

      {description && <FormDescription>{description}</FormDescription>}
    </FormItem>
  );
};

export default ArrayInputForm;
