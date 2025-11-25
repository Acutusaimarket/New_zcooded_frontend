import { type ComponentProps } from "react";

import type { Control, FieldValues, Path } from "react-hook-form";

import { cn } from "@/lib/utils";

import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Textarea } from "../ui/textarea";

interface FormTextAreaProps<T extends FieldValues>
  extends ComponentProps<"textarea"> {
  control: Control<T>;
  name: Path<T>;
  label?: string;
  description?: string;
}

const FormTextArea = <T extends FieldValues>({
  control,
  name,
  label,
  description,
  ...props
}: FormTextAreaProps<T>) => {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className={cn("w-full", props.className)}>
          {label && (
            <FormLabel required={props.required} className="relative w-fit">
              {label}
            </FormLabel>
          )}
          <FormControl>
            <div className="relative">
              <Textarea
                {...field}
                {...props}
                className={cn("pr-10", props.className)}
              />
            </div>
          </FormControl>
          {description && <FormDescription>{description}</FormDescription>}
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default FormTextArea;
