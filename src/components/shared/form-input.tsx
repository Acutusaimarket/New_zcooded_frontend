import { type ComponentProps, useState } from "react";

import { EyeIcon, EyeOffIcon } from "lucide-react";
import type { Control, FieldValues, Path } from "react-hook-form";

import { cn } from "@/lib/utils";

import { Button } from "../ui/button";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";

interface FromInputProps<T extends FieldValues>
  extends ComponentProps<"input"> {
  control: Control<T>;
  name: Path<T>;
  label?: string;
  description?: string;
}

const FromInput = <T extends FieldValues>({
  control,
  name,
  label,
  description,
  ...props
}: FromInputProps<T>) => {
  const [showPassword, setShowPassword] = useState(false);

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
              <Input
                {...field}
                {...props}
                className={cn("pr-10", props.className)}
                type={
                  props.type !== "password"
                    ? props.type
                    : // biome-ignore lint/style/noNestedTernary: actually needed for password toggle
                      showPassword
                      ? "text"
                      : "password"
                }
              />
              {props.type === "password" && (
                <Button
                  className="absolute top-1/2 right-0.5 -translate-y-1/2"
                  onClick={() => setShowPassword((prev) => !prev)}
                  size={"sm"}
                  variant={"ghost"}
                >
                  {showPassword ? <EyeOffIcon /> : <EyeIcon />}
                </Button>
              )}
            </div>
          </FormControl>
          {description && <FormDescription>{description}</FormDescription>}
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default FromInput;
