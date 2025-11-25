import { useCallback, useState } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, Save, Trash2, XIcon } from "lucide-react";
import { useFieldArray, useForm, useFormContext } from "react-hook-form";
import { toast } from "sonner";

import FormInput from "@/components/shared/form-input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useUpdatePersonaMutation } from "@/features/persona-management/api/mutation/use-update-persona.mutation";
import {
  type PersonaFormData,
  personaFormSchema,
} from "@/features/persona-management/schema";
import type { PersonaData, PersonaT } from "@/types/persona.type";

import { useCreatePersonaMutation } from "../api/mutation/use-create-persona.mutation";

const tabs = [
  "basic",
  "demographics",
  "traits",
  "behavioral-patterns",
  "psychological-attributes",
  "review",
];

export const PersonaCreateAndUpdate = ({
  open,
  onOpenChange,
  personaId,
  initialPersonaData,
  onSuccess,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  personaId?: string;
  initialPersonaData?: PersonaFormData | null;
  onSuccess?: (data: PersonaData) => void;
}) => {
  const [activeTab, setActiveTab] = useState("basic");
  const [formData, setFormData] = useState<PersonaT | null>(null);

  const createMutation = useCreatePersonaMutation();
  const updateMutation = useUpdatePersonaMutation();

  const form = useForm<PersonaFormData>({
    resolver: zodResolver(personaFormSchema),
    defaultValues: {
      persona_category: initialPersonaData?.persona_category ?? "",
      name: initialPersonaData?.name ?? "",
      description: initialPersonaData?.description ?? "",
      status: initialPersonaData?.status ?? "published",
      demographic: initialPersonaData?.demographic ?? {
        age_range: "",
        gender: "",
        occupation: "",
        income_tier: "",
        location: "",
        education: "",
      },
      behavior_patterns: initialPersonaData?.behavior_patterns ?? {
        communication_style: "",
        response_tendency: "",
        decision_making_process: "",
        lifestyle: "",
        values: [],
        purchasing_behavior: "",
        price_sensitivity: "",
        media_consumption: "",
      },
      traits: initialPersonaData?.traits ?? [],
      psychological_attributes:
        initialPersonaData?.psychological_attributes ?? {
          personality_type: "",
          emotional_tendencies: "",
          cognitive_style: "",
          motivations: [],
          fears: [],
          stress_triggers: [],
          coping_mechanisms: [],
          learning_style: "",
        },
    },
    mode: "onChange",
  });

  const onSubmit = useCallback(
    (data: PersonaFormData) => {
      const finalData: PersonaT = {
        persona_category: data.persona_category,
        name: data.name,
        description: data.description,
        status: data.status,
        demographic: data.demographic,
        behavior_patterns: data.behavior_patterns,
        traits: data.traits,
        psychological_attributes: data.psychological_attributes,
      };

      setFormData(finalData);
      if (personaId) {
        // Update existing persona
        updateMutation.mutate(
          {
            persona_id: personaId,
            data: finalData,
          },
          {
            onSuccess: (data) => {
              toast.success("Persona updated successfully!");
              onSuccess?.(data);
              onOpenChange(false);
            },
            onError: (error) => {
              toast.error(error?.message);
            },
          }
        );
      } else {
        // console.log("Creating new persona with data:", finalData);

        createMutation.mutate(finalData, {
          onSuccess: (data) => {
            toast.success("Persona created successfully!");
            onSuccess?.(data.data);
            onOpenChange(false); // Close the dialog after successful creation
          },
          onError: (error) => {
            toast.error(error?.message);
          },
        });
      }
    },
    [createMutation, onOpenChange, onSuccess, personaId, updateMutation]
  );

  const canProceed = useCallback(
    async (tabName: string) => {
      switch (tabName) {
        case "basic":
          return await form.trigger([
            "persona_category",
            "name",
            "description",
            "status",
          ]);
        case "demographics":
          return await form.trigger([
            "demographic.age_range",
            "demographic.gender",
            "demographic.occupation",
            "demographic.income_tier",
            "demographic.location",
            "demographic.education",
          ]);
        case "traits":
          return await form.trigger(["traits"]);
        case "behavioral-patterns":
          return await form.trigger(["behavior_patterns"]);
        case "psychological-attributes":
          return await form.trigger(["psychological_attributes"]);
        default:
          return true;
      }
    },
    [form]
  );

  const nextTab = useCallback(async () => {
    const currentIndex = tabs.indexOf(activeTab);
    if (currentIndex < tabs.length - 1) {
      const canProceedToNext = await canProceed(activeTab);
      // console.log(canProceedToNext, "canProceedToNext");
      if (canProceedToNext) {
        setActiveTab(tabs[currentIndex + 1]);
      }
    }
  }, [activeTab, canProceed]);

  const prevTab = useCallback(() => {
    const currentIndex = tabs.indexOf(activeTab);
    if (currentIndex > 0) {
      setActiveTab(tabs[currentIndex - 1]);
    }
  }, [activeTab]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-full sm:max-w-2xl">
        <DialogTitle className="flex items-center gap-2">
          Persona Builder
        </DialogTitle>
        <DialogDescription>
          Create a comprehensive persona profile with demographics, traits, and
          behavioral rules.
        </DialogDescription>
        <div className="max-h-[80vh] overflow-y-auto">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit, (error) =>
                Object.entries(error).forEach(([key, value]) =>
                  toast.error(`${key.replace(/_/g, " ")}:- ${value.message}`)
                )
              )}
              className="space-y-6"
            >
              <Tabs
                value={activeTab}
                onValueChange={setActiveTab}
                className="scrollbar-hide w-full overflow-x-auto"
              >
                <TabsList className="scrollbar-hide sticky top-0 z-10 w-full gap-2 overflow-x-auto">
                  <TabsTrigger className="shrink-0" value="basic">
                    Basic Info
                  </TabsTrigger>
                  <TabsTrigger className="shrink-0" value="demographics">
                    Demographics
                  </TabsTrigger>
                  <TabsTrigger className="shrink-0" value="traits">
                    Traits
                  </TabsTrigger>
                  <TabsTrigger className="shrink-0" value="behavioral-patterns">
                    Behavioral Patterns
                  </TabsTrigger>
                  <TabsTrigger
                    className="shrink-0"
                    value="psychological-attributes"
                  >
                    Psychological Attributes
                  </TabsTrigger>
                  <TabsTrigger className="shrink-0" value="review">
                    Review
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="basic" className="mt-2 space-y-4 px-1.5">
                  <FormInput
                    control={form.control}
                    name="persona_category"
                    placeholder="Enter persona category"
                    label="Persona Category"
                    required
                  />
                  <FormInput
                    control={form.control}
                    name="name"
                    placeholder="Enter persona name"
                    label="Name"
                    required
                  />
                  <FormInput
                    control={form.control}
                    name="description"
                    placeholder="Enter persona description"
                    label="Description"
                    required
                  />
                  <FormField
                    control={form.control}
                    name="status"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Status</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Select status" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="draft">Draft</SelectItem>
                            <SelectItem value="published">Publish</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </TabsContent>

                <TabsContent
                  value="demographics"
                  className="mt-2 grid items-baseline gap-3 px-1 md:grid-cols-2"
                >
                  <FormField
                    control={form.control}
                    name="demographic.age_range"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel required>Age Range</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Select age range" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="18-24">18-24</SelectItem>
                            <SelectItem value="25-34">25-34</SelectItem>
                            <SelectItem value="35-44">35-44</SelectItem>
                            <SelectItem value="45-54">45-54</SelectItem>
                            <SelectItem value="55-64">55-64</SelectItem>
                            <SelectItem value="65+">65+</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="demographic.gender"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel required>Gender</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Select gender" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="Male">Male</SelectItem>
                            <SelectItem value="Female">Female</SelectItem>
                            <SelectItem value="Non-binary">
                              Non-binary
                            </SelectItem>
                            <SelectItem value="Prefer not to say">
                              Prefer not to say
                            </SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormInput
                    control={form.control}
                    name="demographic.occupation"
                    placeholder="Enter occupation"
                    label="Occupation"
                    required
                  />
                  <FormField
                    control={form.control}
                    name="demographic.income_tier"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel required>Income Tier</FormLabel>
                        <FormControl>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            required
                          >
                            <FormControl>
                              <SelectTrigger className="w-full">
                                <SelectValue placeholder="Select income tier" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="Low">Low</SelectItem>
                              <SelectItem value="Middle">Middle</SelectItem>
                              <SelectItem value="Upper">Upper</SelectItem>
                              <SelectItem value="Very High">
                                Very High
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormInput
                    control={form.control}
                    name="demographic.location"
                    placeholder="Enter location"
                    label="Location"
                    required
                  />
                  <FormInput
                    control={form.control}
                    name="demographic.education"
                    placeholder="Enter education level"
                    label="Education"
                    required
                  />
                </TabsContent>

                <TraitsComponentTab />
                <BehavioralPatternsComponentTab />
                <PsychologicalAttributesComponentTab />

                <TabsContent value="review" className="space-y-4 px-1.5">
                  <div className="rounded-lg bg-gray-50 p-4">
                    <h3 className="mb-4 text-lg font-semibold">
                      Review Your Persona
                    </h3>
                    {formData ? (
                      <pre className="max-h-96 overflow-auto rounded border bg-white p-4 text-sm">
                        {JSON.stringify(formData, null, 2)}
                      </pre>
                    ) : (
                      <div className="py-8 text-center text-gray-500">
                        Submit the form to see the generated persona data.
                      </div>
                    )}
                  </div>
                </TabsContent>
              </Tabs>

              <div className="flex justify-between pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={prevTab}
                  disabled={activeTab === "basic"}
                >
                  Previous
                </Button>
                <div className="flex gap-2">
                  {activeTab !== "review" ? (
                    <Button
                      type="button"
                      onClick={nextTab}
                      disabled={!canProceed(activeTab)}
                    >
                      Next
                    </Button>
                  ) : (
                    <Button type="submit" className="flex items-center gap-2">
                      <Save className="h-4 w-4" />
                      Save Persona
                    </Button>
                  )}
                </div>
              </div>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
};

const TraitsComponentTab = () => {
  const form = useFormContext<PersonaFormData>();
  const {
    fields: traitFields,
    append: appendTrait,
    remove: removeTrait,
  } = useFieldArray({
    control: form.control,
    name: "traits",
  });

  const addTrait = () => {
    appendTrait({ name: "", value: 0, reason: "" });
  };
  return (
    <TabsContent value="traits" className="space-y-4 px-1.5">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Personality Traits</h3>
        <Button type="button" onClick={addTrait} variant="outline" size="sm">
          <Plus className="mr-2 h-4 w-4" />
          Add Trait
        </Button>
      </div>
      {traitFields.map((field, index) => (
        <Card key={field.id} className="relative px-2 py-4">
          <div className="grid grid-cols-1 items-end gap-4 md:grid-cols-12">
            <div className="md:col-span-6">
              <FormField
                control={form.control}
                name={`traits.${index}.name`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Trait Name</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., extraversion" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="md:col-span-6">
              <FormField
                control={form.control}
                name={`traits.${index}.value`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Value</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="number"
                        onChange={(e) =>
                          field.onChange(parseFloat(e.target.value) || 0)
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="md:col-span-12">
              <FormField
                control={form.control}
                name={`traits.${index}.reason`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Reason</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Describe the reasoning for this trait..."
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <Button
              type="button"
              variant="outline"
              size="icon"
              className="bg-destructive hover:bg-destructive/90 absolute -top-2 right-2 rounded-full text-white"
              onClick={() => removeTrait(index)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </Card>
      ))}
      {traitFields.length === 0 && (
        <div className="py-8 text-center text-gray-500">
          No traits added yet. Click "Add Trait" to get started.
        </div>
      )}
    </TabsContent>
  );
};

const BehavioralPatternsComponentTab = () => {
  const form = useFormContext<PersonaFormData>();

  return (
    <TabsContent value="behavioral-patterns" className="space-y-4 px-1.5">
      <h3 className="text-lg font-semibold">Behavioral Patterns</h3>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <FormInput
          control={form.control}
          name="behavior_patterns.communication_style"
          placeholder="Enter communication style"
          label="Communication Style"
          required
        />
        <FormInput
          control={form.control}
          name="behavior_patterns.response_tendency"
          placeholder="Enter response tendency"
          label="Response Tendency"
          required
        />
        <FormInput
          control={form.control}
          name="behavior_patterns.decision_making_process"
          placeholder="Enter decision making process"
          label="Decision Making Process"
          required
        />
        <FormInput
          control={form.control}
          name="behavior_patterns.lifestyle"
          placeholder="Enter lifestyle"
          label="Lifestyle"
          required
        />
        <FormInput
          control={form.control}
          name="behavior_patterns.purchasing_behavior"
          placeholder="Enter purchasing behavior"
          label="Purchasing Behavior"
          required
        />
        <FormInput
          control={form.control}
          name="behavior_patterns.price_sensitivity"
          placeholder="Enter price sensitivity"
          label="Price Sensitivity"
          required
        />
        <FormInput
          control={form.control}
          name="behavior_patterns.media_consumption"
          placeholder="Enter media consumption patterns"
          label="Media Consumption"
          required
          className="md:col-span-2"
        />
      </div>
      <div>
        <FormLabel>Values</FormLabel>
        <ValuesArrayField />
      </div>
    </TabsContent>
  );
};

const PsychologicalAttributesComponentTab = () => {
  const form = useFormContext<PersonaFormData>();

  return (
    <TabsContent value="psychological-attributes" className="space-y-4 px-1.5">
      <h3 className="text-lg font-semibold">Psychological Attributes</h3>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <FormInput
          control={form.control}
          name="psychological_attributes.personality_type"
          placeholder="Enter personality type"
          label="Personality Type"
          required
        />
        <FormInput
          control={form.control}
          name="psychological_attributes.emotional_tendencies"
          placeholder="Enter emotional tendencies"
          label="Emotional Tendencies"
          required
        />
        <FormInput
          control={form.control}
          name="psychological_attributes.cognitive_style"
          placeholder="Enter cognitive style"
          label="Cognitive Style"
          required
        />
        <FormInput
          control={form.control}
          name="psychological_attributes.learning_style"
          placeholder="Enter learning style"
          label="Learning Style"
          required
        />
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div>
          <FormLabel>Motivations</FormLabel>
          <MotivationsArrayField />
        </div>
        <div>
          <FormLabel>Fears</FormLabel>
          <FearsArrayField />
        </div>
        <div>
          <FormLabel>Stress Triggers</FormLabel>
          <StressTriggersArrayField />
        </div>
        <div>
          <FormLabel>Coping Mechanisms</FormLabel>
          <CopingMechanismsArrayField />
        </div>
      </div>
    </TabsContent>
  );
};

// Array field components
const ValuesArrayField = () => {
  const form = useFormContext<PersonaFormData>();
  const { fields, append, remove } = useFieldArray<
    PersonaFormData,
    // @ts-expect-error some
    "behavior_patterns.values",
    "id"
  >({
    control: form.control,
    name: "behavior_patterns.values",
  });

  return (
    <div className="space-y-2">
      {fields.map((field, index) => (
        <div key={field.id} className="flex items-center gap-2">
          <FormField
            control={form.control}
            name={`behavior_patterns.values.${index}`}
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormControl>
                  <Input placeholder="Enter a value" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => remove(index)}
          >
            <XIcon className="h-4 w-4" />
          </Button>
        </div>
      ))}
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={() => append("")}
      >
        <Plus className="mr-1 h-4 w-4" />
        Add Value
      </Button>
    </div>
  );
};

const MotivationsArrayField = () => {
  const form = useFormContext<PersonaFormData>();
  const { fields, append, remove } = useFieldArray<
    PersonaFormData,
    // @ts-expect-error some
    "psychological_attributes.motivations",
    "id"
  >({
    control: form.control,
    name: "psychological_attributes.motivations",
  });

  return (
    <div className="space-y-2">
      {fields.map((field, index) => (
        <div key={field.id} className="flex items-center gap-2">
          <FormField
            control={form.control}
            name={`psychological_attributes.motivations.${index}`}
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormControl>
                  <Input placeholder="Enter a motivation" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => remove(index)}
          >
            <XIcon className="h-4 w-4" />
          </Button>
        </div>
      ))}
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={() => append("")}
      >
        <Plus className="mr-1 h-4 w-4" />
        Add Motivation
      </Button>
    </div>
  );
};

const FearsArrayField = () => {
  const form = useFormContext<PersonaFormData>();
  const { fields, append, remove } = useFieldArray<
    PersonaFormData,
    // @ts-expect-error some
    "psychological_attributes.fears",
    "id"
  >({
    control: form.control,
    name: "psychological_attributes.fears",
  });

  return (
    <div className="space-y-2">
      {fields.map((field, index) => (
        <div key={field.id} className="flex items-center gap-2">
          <FormField
            control={form.control}
            name={`psychological_attributes.fears.${index}`}
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormControl>
                  <Input placeholder="Enter a fear" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => remove(index)}
          >
            <XIcon className="h-4 w-4" />
          </Button>
        </div>
      ))}
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={() => append("")}
      >
        <Plus className="mr-1 h-4 w-4" />
        Add Fear
      </Button>
    </div>
  );
};

const StressTriggersArrayField = () => {
  const form = useFormContext<PersonaFormData>();
  const { fields, append, remove } = useFieldArray<
    PersonaFormData,
    // @ts-expect-error some
    "psychological_attributes.stress_triggers",
    "id"
  >({
    control: form.control,
    name: "psychological_attributes.stress_triggers",
  });

  return (
    <div className="space-y-2">
      {fields.map((field, index) => (
        <div key={field.id} className="flex items-center gap-2">
          <FormField
            control={form.control}
            name={`psychological_attributes.stress_triggers.${index}`}
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormControl>
                  <Input placeholder="Enter a stress trigger" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => remove(index)}
          >
            <XIcon className="h-4 w-4" />
          </Button>
        </div>
      ))}
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={() => append("")}
      >
        <Plus className="mr-1 h-4 w-4" />
        Add Stress Trigger
      </Button>
    </div>
  );
};

const CopingMechanismsArrayField = () => {
  const form = useFormContext<PersonaFormData>();
  const { fields, append, remove } = useFieldArray<
    PersonaFormData,
    // @ts-expect-error some
    "psychological_attributes.coping_mechanisms",
    "id"
  >({
    control: form.control,
    name: "psychological_attributes.coping_mechanisms",
  });

  return (
    <div className="space-y-2">
      {fields.map((field, index) => (
        <div key={field.id} className="flex items-center gap-2">
          <FormField
            control={form.control}
            name={`psychological_attributes.coping_mechanisms.${index}`}
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormControl>
                  <Input placeholder="Enter a coping mechanism" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => remove(index)}
          >
            <XIcon className="h-4 w-4" />
          </Button>
        </div>
      ))}
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={() => append("")}
      >
        <Plus className="mr-1 h-4 w-4" />
        Add Coping Mechanism
      </Button>
    </div>
  );
};
