import React, { useState } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useFieldArray } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { subscriptionApiEndPoint } from "@/lib/api-end-point";
import { axiosPrivateInstance } from "@/lib/axios";

interface CustomPlanDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const customSubscriptionSchema = z.object({
  name: z.string().min(1, "Plan name is required"),
  pricing: z
    .array(
      z.object({
        monthly: z.coerce.number().min(0, "Monthly price must be non-negative"),
        yearly: z.coerce.number().min(0, "Yearly price must be non-negative"),
        currency: z.string().min(1, "Currency is required"),
      })
    )
    .min(1, "At least one pricing option is required"),
  max_users: z.coerce.number().min(0, "Max users must be non-negative"),
  features: z.array(z.string()),
  credits: z.coerce.number().min(0, "Credits must be non-negative"),
  api_access: z.boolean(),
  priority_support: z.boolean(),
  no_of_parallel_simulations: z.coerce.number().min(0, "Must be non-negative"),
  has_restrictions: z.boolean(),
  is_persona_generation_limited: z.boolean(),
  is_media_simulation_limited: z.boolean(),
  is_concept_simulation_limited: z.boolean(),
  is_chat_simulation_limited: z.boolean(),
  persona_count_limit: z.coerce.number().min(0),
  concept_count_limit: z.coerce.number().min(0),
  media_count_limit: z.coerce.number().min(0),
  chat_count_limit: z.coerce.number().min(0),
  additional_credits_pricing: z.array(
    z.object({
      currency: z.string().min(1, "Currency is required"),
      price: z.coerce.number().min(0, "Price must be non-negative"),
      credit_count: z.coerce.number().min(1, "Credit count must be at least 1"),
      base_credit_count: z.coerce
        .number()
        .min(1, "Base credit count must be at least 1"),
    })
  ),
  username: z.string().min(1, "Username is required"),
  email: z.string().email("Invalid email address").min(1, "Email is required"),
  platform_access_name: z.string().min(1, "Platform access name is required"),
});

type CustomSubscriptionFormData = z.infer<typeof customSubscriptionSchema>;

export const CustomPlanDialog: React.FC<CustomPlanDialogProps> = ({
  open,
  onOpenChange,
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<CustomSubscriptionFormData>({
    resolver: zodResolver(customSubscriptionSchema),
    defaultValues: {
      name: "",
      pricing: [{ monthly: 0, yearly: 0, currency: "USD" }],
      max_users: 0,
      features: [],
      credits: 0,
      api_access: true,
      priority_support: true,
      no_of_parallel_simulations: 0,
      has_restrictions: false,
      is_persona_generation_limited: false,
      is_media_simulation_limited: false,
      is_concept_simulation_limited: false,
      is_chat_simulation_limited: false,
      persona_count_limit: 0,
      concept_count_limit: 0,
      media_count_limit: 0,
      chat_count_limit: 0,
      additional_credits_pricing: [
        {
          currency: "USD",
          price: 0,
          credit_count: 1,
          base_credit_count: 1,
        },
      ],
      username: "",
      email: "",
      platform_access_name: "api",
    },
  });

  const { fields: pricingFields } = useFieldArray({
    control: form.control,
    name: "pricing",
  });

  const { fields: featuresFields } = useFieldArray({
    control: form.control,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    name: "features" as any,
  });

  const { fields: additionalCreditsFields } = useFieldArray({
    control: form.control,
    name: "additional_credits_pricing",
  });

  const onSubmit = async (data: CustomSubscriptionFormData) => {
    try {
      setIsSubmitting(true);
      await axiosPrivateInstance.post(
        subscriptionApiEndPoint.createCustomSubscription,
        data
      );
      toast.success("Custom subscription plan created successfully!");
      form.reset();
      onOpenChange(false);
    } catch (error: unknown) {
      console.error("Error creating custom subscription:", error);
      if (error && typeof error === "object" && "response" in error) {
        const axiosError = error as {
          response?: { data?: { message?: string } };
        };
        toast.error(
          axiosError.response?.data?.message ||
            "Failed to create custom subscription plan"
        );
      } else {
        toast.error("Failed to create custom subscription plan");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto md:max-w-4xl">
        <DialogHeader>
          <DialogTitle>Create Custom Subscription Plan</DialogTitle>
          <DialogDescription>
            Create a custom subscription plan with specific features and limits.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Basic Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Basic Information</h3>

              <FormField<CustomSubscriptionFormData, "name">
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel required>Plan Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter plan name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-2 gap-4">
                <FormField<CustomSubscriptionFormData, "username">
                  control={form.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel required>Username</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter username" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField<CustomSubscriptionFormData, "email">
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel required>Email</FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="user@example.com"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField<CustomSubscriptionFormData, "platform_access_name">
                control={form.control}
                name="platform_access_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Platform Access Name</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select platform access" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="api">API</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Pricing */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Pricing</h3>

              {pricingFields.map((field, index) => (
                <div key={field.id} className="space-y-4 rounded-lg border p-4">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium">Pricing</h4>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <FormField<
                      CustomSubscriptionFormData,
                      `pricing.${number}.monthly`
                    >
                      control={form.control}
                      name={`pricing.${index}.monthly`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Monthly Price</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              step="0.01"
                              placeholder="0"
                              {...field}
                              onChange={(e) =>
                                field.onChange(parseFloat(e.target.value) || 0)
                              }
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField<
                      CustomSubscriptionFormData,
                      `pricing.${number}.yearly`
                    >
                      control={form.control}
                      name={`pricing.${index}.yearly`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Yearly Price</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              step="0.01"
                              placeholder="0"
                              {...field}
                              onChange={(e) =>
                                field.onChange(parseFloat(e.target.value) || 0)
                              }
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField<
                      CustomSubscriptionFormData,
                      `pricing.${number}.currency`
                    >
                      control={form.control}
                      name={`pricing.${index}.currency`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel required>Currency</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select currency" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="USD">USD</SelectItem>
                              <SelectItem value="INR">INR</SelectItem>
                              <SelectItem value="EUR">EUR</SelectItem>
                              <SelectItem value="GBP">GBP</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Limits & Quotas */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Limits & Quotas</h3>

              <div className="grid grid-cols-2 gap-4">
                <FormField<CustomSubscriptionFormData, "max_users">
                  control={form.control}
                  name="max_users"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel required>Max Users</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="0"
                          {...field}
                          onChange={(e) =>
                            field.onChange(parseInt(e.target.value) || 0)
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField<CustomSubscriptionFormData, "credits">
                  control={form.control}
                  name="credits"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel required>Credits</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="0"
                          {...field}
                          onChange={(e) =>
                            field.onChange(parseInt(e.target.value) || 0)
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField<
                  CustomSubscriptionFormData,
                  "no_of_parallel_simulations"
                >
                  control={form.control}
                  name="no_of_parallel_simulations"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel required>Parallel Simulations</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="0"
                          {...field}
                          onChange={(e) =>
                            field.onChange(parseInt(e.target.value) || 0)
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Features */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Features</h3>

              {featuresFields.map((field, index) => (
                <FormField<CustomSubscriptionFormData, `features.${number}`>
                  key={field.id}
                  control={form.control}
                  name={`features.${index}`}
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input placeholder="Enter feature" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              ))}
            </div>

            {/* Restrictions */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Restrictions</h3>

              <FormField<CustomSubscriptionFormData, "has_restrictions">
                control={form.control}
                name="has_restrictions"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-y-0 space-x-3 rounded-md border p-4">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>Has Restrictions</FormLabel>
                    </div>
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-2 gap-4">
                <FormField<
                  CustomSubscriptionFormData,
                  "is_persona_generation_limited"
                >
                  control={form.control}
                  name="is_persona_generation_limited"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-y-0 space-x-3 rounded-md border p-4">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>Persona Generation Limited</FormLabel>
                      </div>
                    </FormItem>
                  )}
                />

                <FormField<
                  CustomSubscriptionFormData,
                  "is_media_simulation_limited"
                >
                  control={form.control}
                  name="is_media_simulation_limited"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-y-0 space-x-3 rounded-md border p-4">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>Media Simulation Limited</FormLabel>
                      </div>
                    </FormItem>
                  )}
                />

                <FormField<
                  CustomSubscriptionFormData,
                  "is_concept_simulation_limited"
                >
                  control={form.control}
                  name="is_concept_simulation_limited"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-y-0 space-x-3 rounded-md border p-4">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>Concept Simulation Limited</FormLabel>
                      </div>
                    </FormItem>
                  )}
                />

                <FormField<
                  CustomSubscriptionFormData,
                  "is_chat_simulation_limited"
                >
                  control={form.control}
                  name="is_chat_simulation_limited"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-y-0 space-x-3 rounded-md border p-4">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>Chat Simulation Limited</FormLabel>
                      </div>
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <FormField<CustomSubscriptionFormData, "persona_count_limit">
                  control={form.control}
                  name="persona_count_limit"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Persona Count Limit</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="0"
                          {...field}
                          onChange={(e) =>
                            field.onChange(parseInt(e.target.value) || 0)
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField<CustomSubscriptionFormData, "concept_count_limit">
                  control={form.control}
                  name="concept_count_limit"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Concept Count Limit</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="0"
                          {...field}
                          onChange={(e) =>
                            field.onChange(parseInt(e.target.value) || 0)
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField<CustomSubscriptionFormData, "media_count_limit">
                  control={form.control}
                  name="media_count_limit"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Media Count Limit</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="0"
                          {...field}
                          onChange={(e) =>
                            field.onChange(parseInt(e.target.value) || 0)
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField<CustomSubscriptionFormData, "chat_count_limit">
                  control={form.control}
                  name="chat_count_limit"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Chat Count Limit</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="0"
                          {...field}
                          onChange={(e) =>
                            field.onChange(parseInt(e.target.value) || 0)
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Additional Credits Pricing */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">
                Additional Credits Pricing
              </h3>

              {additionalCreditsFields.map((field, index) => (
                <div key={field.id} className="space-y-4 rounded-lg border p-4">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium">Additional Credits Pricing</h4>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <FormField<
                      CustomSubscriptionFormData,
                      `additional_credits_pricing.${number}.currency`
                    >
                      control={form.control}
                      name={`additional_credits_pricing.${index}.currency`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel required>Currency</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select currency" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="USD">USD</SelectItem>
                              <SelectItem value="INR">INR</SelectItem>
                              <SelectItem value="EUR">EUR</SelectItem>
                              <SelectItem value="GBP">GBP</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField<
                      CustomSubscriptionFormData,
                      `additional_credits_pricing.${number}.price`
                    >
                      control={form.control}
                      name={`additional_credits_pricing.${index}.price`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel required>Price</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              step="0.01"
                              placeholder="0"
                              {...field}
                              onChange={(e) =>
                                field.onChange(parseFloat(e.target.value) || 0)
                              }
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField<
                      CustomSubscriptionFormData,
                      `additional_credits_pricing.${number}.credit_count`
                    >
                      control={form.control}
                      name={`additional_credits_pricing.${index}.credit_count`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel required>Credit Count</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              placeholder="1"
                              {...field}
                              onChange={(e) =>
                                field.onChange(parseInt(e.target.value) || 1)
                              }
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField<
                      CustomSubscriptionFormData,
                      `additional_credits_pricing.${number}.base_credit_count`
                    >
                      control={form.control}
                      name={`additional_credits_pricing.${index}.base_credit_count`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel required>Base Credit Count</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              placeholder="1"
                              {...field}
                              onChange={(e) =>
                                field.onChange(parseInt(e.target.value) || 1)
                              }
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Additional Options */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Additional Options</h3>

              <div className="grid grid-cols-2 gap-4">
                <FormField<CustomSubscriptionFormData, "api_access">
                  control={form.control}
                  name="api_access"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-y-0 space-x-3 rounded-md border p-4">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>API Access</FormLabel>
                      </div>
                    </FormItem>
                  )}
                />

                <FormField<CustomSubscriptionFormData, "priority_support">
                  control={form.control}
                  name="priority_support"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-y-0 space-x-3 rounded-md border p-4">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>Priority Support</FormLabel>
                      </div>
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Form Actions */}
            <div className="flex justify-end gap-4 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Creating..." : "Create Plan"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
