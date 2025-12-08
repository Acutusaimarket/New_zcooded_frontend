import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useDeletePersonaMutation } from "@/features/persona-management/api/mutation/use-delete-persona.mutation";
import { useUpdatePersonaMutation } from "@/features/persona-management/api/mutation/use-update-persona.mutation";
import { PersonaCreateAndUpdate } from "@/features/persona-management/components/CreateAndUpdatePersonaDialog";
import { PersonaCard } from "@/features/persona-management/components/PersonaCard";
import type { PersonaFormData } from "@/features/persona-management/schema";
import type { PersonaData } from "@/types/persona.type";

interface GeneratePersonaPreviewProps {
  generateResult: PersonaData[] | null | undefined;
}

export const GeneratePersonaPreview = ({
  generateResult,
}: GeneratePersonaPreviewProps) => {
  const [generatePersonaResult, setGeneratePersonaResult] = useState<
    PersonaData[]
  >(() => {
    // Ensure we always initialize with an array
    if (Array.isArray(generateResult)) {
      return generateResult;
    }
    return [];
  });
  const [editPersona, setEditPersona] = useState<
    | {
        personaData: PersonaFormData;
        id: string;
      }
    | undefined
  >(undefined);
  const navigate = useNavigate();
  const updatePersonaMutation = useUpdatePersonaMutation();
  const deletePersonaMutation = useDeletePersonaMutation();

  // Sync prop with state when it changes
  useEffect(() => {
    // Always ensure we have an array
    if (Array.isArray(generateResult)) {
      setGeneratePersonaResult(generateResult);
    } else {
      // Handle null, undefined, or any non-array value
      setGeneratePersonaResult([]);
    }
  }, [generateResult]);

  const handleUpdateStatusPersona = useCallback(
    (personaId: string, updatedData: Partial<PersonaData>) => {
      updatePersonaMutation.mutate(
        {
          persona_id: personaId,
          data: {
            status: updatedData.status || "draft",
          },
        },
        {
          onSuccess: (updatedData) => {
            const newPersonas = Array.isArray(generatePersonaResult)
              ? generatePersonaResult.map((p) => {
                  if (p._id === updatedData._id) {
                    return updatedData;
                  }
                  return p;
                })
              : [];
            setGeneratePersonaResult(newPersonas);
          },
        }
      );
    },
    [generatePersonaResult, updatePersonaMutation]
  );

  const handleDeletePersona = useCallback(
    (personaId: string) => {
      deletePersonaMutation.mutate(
        { persona_id: personaId },
        {
          onSuccess: () => {
            setGeneratePersonaResult((prev) => {
              if (!Array.isArray(prev)) return [];
              return prev.filter((persona) => persona._id !== personaId);
            });
          },
        }
      );
    },
    [deletePersonaMutation]
  );

  const handleEdit = useCallback((persona: PersonaData) => {
    const personaData: PersonaFormData = {
      persona_category: persona.persona_category,
      name: persona.name,
      description: persona.description,
      status: persona.status,
      demographic: {
        age_range: persona.demographic.age_range || "",
        gender: persona.demographic.gender || "",
        occupation: persona.demographic.occupation || "",
        income_tier: persona.demographic.income_tier || "",
        location: persona.demographic.location || "",
        education: persona.demographic.education || "",
      },
      behavior_patterns: {
        communication_style:
          persona.behavior_patterns.communication_style || "",
        response_tendency: persona.behavior_patterns.response_tendency || "",
        decision_making_process:
          persona.behavior_patterns.decision_making_process || "",
        lifestyle: persona.behavior_patterns.lifestyle || "",
        values: persona.behavior_patterns.values || [],
        purchasing_behavior:
          persona.behavior_patterns.purchasing_behavior || "",
        price_sensitivity: persona.behavior_patterns.price_sensitivity || "",
        media_consumption: persona.behavior_patterns.media_consumption || "",
      },
      traits: persona.traits || [],
      psychological_attributes: {
        personality_type:
          persona.psychological_attributes.personality_type || "",
        emotional_tendencies:
          persona.psychological_attributes.emotional_tendencies || "",
        cognitive_style: persona.psychological_attributes.cognitive_style || "",
        motivations: persona.psychological_attributes.motivations || [],
        fears: persona.psychological_attributes.fears || [],
        stress_triggers: persona.psychological_attributes.stress_triggers || [],
        coping_mechanisms:
          persona.psychological_attributes.coping_mechanisms || [],
        learning_style: persona.psychological_attributes.learning_style || "",
      },
    };

    setEditPersona({ personaData, id: persona._id });
  }, []);

  const handleViewPersona = useCallback(() => {
    navigate("/dashboard/persona-studio/management");
  }, [navigate]);

  // console.log(generatePersonaResult);

  return (
    <>
      <Card className="bg-muted/60 border-none">
        <CardHeader className="pb-2">
          <CardTitle>Generated Personas</CardTitle>
          <CardDescription>
            View the personas generated from your data.
          </CardDescription>
          <Button
            className="mt-2 w-fit"
            onClick={handleViewPersona}
          >
            View Persona
          </Button>
        </CardHeader>
        <CardContent className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-2">
          {Array.isArray(generatePersonaResult) &&
            generatePersonaResult.map((person) => (
              <PersonaCard
                onEdit={handleEdit}
                onDelete={() => handleDeletePersona(person._id)}
                onStatusChange={() =>
                  handleUpdateStatusPersona(person._id, {
                    status: person.status === "draft" ? "published" : "draft",
                  })
                }
                key={person._id}
                persona={person}
              />
            ))}
        </CardContent>
      </Card>
      <PersonaCreateAndUpdate
        key={editPersona?.id || "create-persona-dialog"}
        open={!!editPersona?.id}
        onOpenChange={() => setEditPersona(undefined)}
        personaId={editPersona?.id}
        initialPersonaData={editPersona?.personaData}
        onSuccess={(persona) => {
          // console.log({ persona });
          // console.log({ generatePersonaResult });
          const newPersonas = Array.isArray(generatePersonaResult)
            ? generatePersonaResult.map((p) => {
                if (p._id === persona._id) {
                  return persona;
                }
                return p;
              })
            : [];
          setGeneratePersonaResult(newPersonas);
        }}
      />
    </>
  );
};

export default GeneratePersonaPreview;
