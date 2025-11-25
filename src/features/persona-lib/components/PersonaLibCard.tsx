import React from "react";

import { Calendar, MapPin, Tag, User } from "lucide-react";

import { Badge } from "../../../components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../../components/ui/card";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "../../../components/ui/collapsible";
import type { PersonaLibItem } from "../types";

interface PersonaLibCardProps {
  persona: PersonaLibItem;
}
const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

export const PersonaLibCard: React.FC<PersonaLibCardProps> = ({ persona }) => {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <Card className="transition-shadow hover:shadow-lg">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="mb-2 text-lg font-semibold">
              {persona.name}
            </CardTitle>
            <div className="mb-2 flex items-center gap-2">
              <Badge
                variant={
                  persona.status === "published" ? "default" : "secondary"
                }
              >
                {persona.status}
              </Badge>
              <Badge variant="outline">{persona.persona_category}</Badge>
            </div>
            <p className="text-ellipsis-2 text-sm text-gray-600">
              {persona.description}
            </p>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Basic Info */}
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="flex items-center gap-2">
            <User className="h-4 w-4 text-gray-500" />
            <span className="font-medium">Age:</span>
            <span>{persona.demographic.age_range}</span>
          </div>
          <div className="flex items-center gap-2">
            <Tag className="h-4 w-4 text-gray-500" />
            <span className="font-medium">Gender:</span>
            <span>{persona.demographic.gender}</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-gray-500" />
            <span className="font-medium">Location:</span>
            <span>{persona.demographic.location}</span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-gray-500" />
            <span className="font-medium">Created:</span>
            <span>{formatDate(persona.created_at)}</span>
          </div>
        </div>

        {/* Collapsible Details */}
        <Collapsible open={isOpen} onOpenChange={setIsOpen}>
          <CollapsibleTrigger className="flex h-auto w-full items-center justify-between p-0 font-medium hover:underline">
            <span>View Details</span>
          </CollapsibleTrigger>
          <CollapsibleContent className="space-y-4 pt-4">
            {/* Demographics */}
            <div className="space-y-3">
              <h4 className="text-sm font-medium text-gray-700">
                Demographics
              </h4>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <span className="font-medium">Occupation:</span>{" "}
                  {persona.demographic.occupation}
                </div>
                <div>
                  <span className="font-medium">Income:</span>{" "}
                  {persona.demographic.income_tier}
                </div>
                <div>
                  <span className="font-medium">Education:</span>{" "}
                  {persona.demographic.education}
                </div>
              </div>
            </div>

            {/* Behavior Patterns */}
            <div className="space-y-3">
              <h4 className="text-sm font-medium text-gray-700">
                Behavior Patterns
              </h4>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <span className="font-medium">Communication:</span>{" "}
                  {persona.behavior_patterns.communication_style}
                </div>
                <div>
                  <span className="font-medium">Lifestyle:</span>{" "}
                  {persona.behavior_patterns.lifestyle}
                </div>
                <div>
                  <span className="font-medium">Price Sensitivity:</span>{" "}
                  {persona.behavior_patterns.price_sensitivity}
                </div>
                <div>
                  <span className="font-medium">Media:</span>{" "}
                  {persona.behavior_patterns.media_consumption}
                </div>
              </div>
              <div className="space-y-2">
                <div className="text-sm">
                  <span className="font-medium">Values:</span>
                  <div className="mt-1 flex flex-wrap gap-1">
                    {persona.behavior_patterns.values.map((value, index) => (
                      <Badge
                        key={index}
                        variant="secondary"
                        className="text-xs"
                      >
                        {value}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Psychological Attributes */}
            <div className="space-y-3">
              <h4 className="text-sm font-medium text-gray-700">
                Psychological Attributes
              </h4>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <span className="font-medium">Personality:</span>{" "}
                  {persona.psychological_attributes.personality_type}
                </div>
                <div>
                  <span className="font-medium">Learning Style:</span>{" "}
                  {persona.psychological_attributes.learning_style}
                </div>
              </div>
              <div className="space-y-2">
                <div className="text-sm">
                  <span className="font-medium">Motivations:</span>
                  <div className="mt-1 flex flex-wrap gap-1">
                    {persona.psychological_attributes.motivations.map(
                      (motivation, index) => (
                        <Badge
                          key={index}
                          variant="outline"
                          className="text-xs"
                        >
                          {motivation}
                        </Badge>
                      )
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Traits */}
            {persona.traits.length > 0 && (
              <div className="space-y-3">
                <h4 className="text-sm font-medium text-gray-700">Traits</h4>
                <div className="space-y-2">
                  {persona.traits.map((trait, index) => (
                    <div
                      key={index}
                      className="bg-black-50 rounded p-2 text-sm"
                    >
                      <div className="mb-1 flex items-center justify-between">
                        <span className="font-medium">{trait.name}</span>
                        <span className="text-gray-600">{trait.value}/10</span>
                      </div>
                      <p className="text-xs text-gray-600">{trait.reason}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CollapsibleContent>
        </Collapsible>
      </CardContent>
    </Card>
  );
};
