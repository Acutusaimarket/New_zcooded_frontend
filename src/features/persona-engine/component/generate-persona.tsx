import { useCallback } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { AnimatePresence, motion } from "motion/react";
import { useForm } from "react-hook-form";

import FormInput from "@/components/shared/form-input";
import UploadFileSelect from "@/components/shared/uploaded-file-select";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { TooltipWrapper } from "@/components/ui/tooltip";

import { useGeneratePersonasMutation } from "../api";
import { usePersonaEngineStore } from "../hooks/persona-engine.hooks";
import { type PersonaEngineSchema, personaEngineSchema } from "../schema";
import GeneratePersonaPreview from "./generate-persona-preview";

// const MODELS = [
//   { value: "gpt-4o", label: "GPT-4 Omni" },
//   { value: "gpt-4o-mini", label: "GPT-4 Omni Mini" },
//   { value: "gpt-5", label: "GPT-5" },
// ];

const GeneratePersona = () => {
  const uploadFileData = usePersonaEngineStore(
    (state) => state.uploadFileResponse
  );
  const isCollapsed = usePersonaEngineStore(
    (state) => state.isGeneratePersonaOpen
  );
  const setIsGeneratePersonaOpen = usePersonaEngineStore(
    (state) => state.setIsGeneratePersonaOpen
  );
  const queryClient = useQueryClient();

  const generatePersonaFrom = useForm({
    mode: "onChange",
    resolver: zodResolver(personaEngineSchema),
    defaultValues: {
      num_personas: 1,
      model: "gpt-5" as const,
      meta_data_id: uploadFileData?.id || "",
    },
  });

  const generatePersonaMutation = useGeneratePersonasMutation({});
  const onSubmit = useCallback(
    (data: PersonaEngineSchema) => {
      generatePersonaMutation.mutate(
        {
          model: data.model,
          meta_data_id: data.meta_data_id,
          num_personas: data.num_personas,
        },
        {
          onSuccess: () => {
            queryClient.invalidateQueries({
              queryKey: ["personas-list"],
            });
            setIsGeneratePersonaOpen(false);
            const doc = document.getElementById("persona-engine-form");
            if (doc) {
              doc.scrollTo({
                top: 0,
                behavior: "smooth",
              });
            }
          },
        }
      );
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [generatePersonaMutation]
  );

  return (
    <>
      <Card className="mt-4">
        <Collapsible open={isCollapsed} onOpenChange={setIsGeneratePersonaOpen}>
          <TooltipWrapper
            triggerProps={{
              className: "w-full",
              asChild: true,
            }}
            content={isCollapsed ? "Click to close" : "Click to open"}
          >
            <CollapsibleTrigger className="hover:bg-muted/50 hover:ring-muted flex w-full cursor-pointer items-start justify-between space-y-1.5 p-6 pb-3 transition-[border,color] hover:rounded-md hover:ring-2">
              <CardHeader className="w-fit items-start p-0">
                <CardTitle>Generate Persona</CardTitle>
                <p className="text-muted-foreground text-sm">
                  Click the button below to generate personas based on your
                  uploaded data.
                </p>
              </CardHeader>
            </CollapsibleTrigger>
          </TooltipWrapper>
          <CollapsibleContent>
            <CardContent className="mt-1.5">
              <Form {...generatePersonaFrom}>
                <form
                  className="space-y-4"
                  onSubmit={generatePersonaFrom.handleSubmit(onSubmit)}
                >
                  <FormInput
                    control={generatePersonaFrom.control}
                    name="num_personas"
                    type="number"
                    min={1}
                    max={10}
                    step={1}
                    label="Number of Personas"
                    placeholder="Enter number of personas to generate"
                    description="Specify how many personas you want to generate."
                    required
                  />
                  <FormField
                    control={generatePersonaFrom.control}
                    name="meta_data_id"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel required className="w-fit">
                          Select File
                        </FormLabel>
                        <FormControl>
                          {/* <Select></Select> */}
                          <UploadFileSelect
                            disabled={generatePersonaMutation.isPending}
                            defaultValue={field.value}
                            onChange={(data) => {
                              field.onChange(data?.id);
                            }}
                            placeholder="Select metadata file"
                          />
                        </FormControl>
                        <FormDescription>
                          Select the metadata file you want to use for persona
                          generation.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  {/* <FormField
                    control={generatePersonaFrom.control}
                    name="model"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel required className="w-fit">
                          Model
                        </FormLabel>
                        <FormControl>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            disabled={generatePersonaMutation.isPending}
                          >
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Select model" />
                            </SelectTrigger>
                            <SelectContent>
                              {MODELS.map((model) => (
                                <SelectItem
                                  key={model.value}
                                  value={model.value}
                                >
                                  {model.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormMessage />
                        <FormDescription>
                          Choose the model you want to use for persona
                          generation.
                        </FormDescription>
                      </FormItem>
                    )}
                  /> */}

                  <Button
                    className="w-full"
                    type="submit"
                    disabled={generatePersonaMutation.isPending}
                  >
                    {generatePersonaMutation.isPending
                      ? "Generating Personas..."
                      : "Generate Personas"}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </CollapsibleContent>
        </Collapsible>
      </Card>
      <div className="generate-persona-preview mt-6">
        {generatePersonaMutation.isSuccess && (
          <AnimatePresence>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.3 }}
            >
              <GeneratePersonaPreview
                generateResult={generatePersonaMutation?.data?.data || []}
              />
            </motion.div>
          </AnimatePresence>
        )}
      </div>
    </>
  );
};

export default GeneratePersona;
