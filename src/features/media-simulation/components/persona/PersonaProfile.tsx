import {
  Briefcase,
  GraduationCap,
  IndianRupee,
  MapPin,
  Target,
  User,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

import type { MediaSimulationData } from "../../types/media-simulation.types";
import { KPIRadarChart } from "../charts/KPIRadarChart";

interface PersonaProfileProps {
  data: MediaSimulationData;
  className?: string;
}

export const PersonaProfile = ({ data, className }: PersonaProfileProps) => {
  const personas = data.participated_personas || [];
  // Commented out - will be used later when media_recommendations is available
  const personaInsights =
    data.media_recommendations?.persona_specific_insights || [];
  // const personaInsights: never[] = [];

  if (personas.length === 0) {
    return (
      <div className={cn("flex h-64 items-center justify-center", className)}>
        <p className="text-muted-foreground">No persona data available</p>
      </div>
    );
  }

  // Function to render individual persona content
  const renderPersonaContent = (
    persona: (typeof personas)[0],
    personaInsight?: (typeof personaInsights)[0]
  ) => {
    // Transform persona traits for radar chart
    const traitData = persona.traits.map((trait) => ({
      metric: trait.name
        .replace(/_/g, " ")
        .replace(/\b\w/g, (l) => l.toUpperCase()),
      value: trait.value * 100, // Already in 0-100 scale
      fullMark: 100,
    }));

    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="bg-primary/10 rounded-full p-3">
            <User className="text-primary h-6 w-6" />
          </div>
          <div>
            <h2 className="text-2xl font-bold">{persona.name}</h2>
            <p className="text-muted-foreground">{persona.persona_category}</p>
          </div>
        </div>

        {/* Basic Demographics */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Demographics
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              <div className="flex items-center gap-3">
                <Target className="text-muted-foreground h-4 w-4" />
                <div>
                  <p className="text-muted-foreground text-sm">Age Range</p>
                  <p className="font-medium">{persona.demographic.age_range}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <User className="text-muted-foreground h-4 w-4" />
                <div>
                  <p className="text-muted-foreground text-sm">Gender</p>
                  <p className="font-medium">{persona.demographic.gender}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <MapPin className="text-muted-foreground h-4 w-4" />
                <div>
                  <p className="text-muted-foreground text-sm">Location</p>
                  <p className="font-medium">{persona.demographic.location}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Briefcase className="text-muted-foreground h-4 w-4" />
                <div>
                  <p className="text-muted-foreground text-sm">Occupation</p>
                  <p className="font-medium">
                    {persona.demographic.occupation}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <IndianRupee className="text-muted-foreground h-4 w-4" />
                <div>
                  <p className="text-muted-foreground text-sm">Income</p>
                  <p className="font-medium">
                    {persona.demographic.income_tier}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <GraduationCap className="text-muted-foreground h-4 w-4" />
                <div>
                  <p className="text-muted-foreground text-sm">Education</p>
                  <p className="font-medium">{persona.demographic.education}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Description */}
        <Card>
          <CardHeader>
            <CardTitle>Description</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground leading-relaxed">
              {persona.description}
            </p>
          </CardContent>
        </Card>

        {/* Behavioral Patterns & Traits */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Behavioral Patterns */}
          <Card>
            <CardHeader>
              <CardTitle>Behavioral Patterns</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="mb-2 font-semibold">Communication Style</h4>
                <p className="text-muted-foreground text-sm">
                  {persona.behavior_patterns.communication_style}
                </p>
              </div>

              <div>
                <h4 className="mb-2 font-semibold">Decision Making</h4>
                <p className="text-muted-foreground text-sm">
                  {persona.behavior_patterns.decision_making_process}
                </p>
              </div>

              <div>
                <h4 className="mb-2 font-semibold">Values</h4>
                <div className="flex flex-wrap gap-2">
                  {persona.behavior_patterns.values.map((value, index) => (
                    <Badge key={index} variant="secondary">
                      {value}
                    </Badge>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="mb-2 font-semibold">Price Sensitivity</h4>
                <p className="text-muted-foreground text-sm">
                  {persona.behavior_patterns.price_sensitivity}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Personality Traits Radar */}
          <Card>
            <CardHeader>
              <CardTitle>Personality Traits</CardTitle>
            </CardHeader>
            <CardContent>
              <KPIRadarChart data={traitData} height={300} />
            </CardContent>
          </Card>
        </div>

        {/* Psychological Attributes */}
        <Card>
          <CardHeader>
            <CardTitle>Psychological Profile</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <h4 className="mb-2 font-semibold">Personality Type</h4>
                <p className="text-muted-foreground text-sm">
                  {persona.psychological_attributes.personality_type}
                </p>
              </div>

              <div>
                <h4 className="mb-2 font-semibold">Learning Style</h4>
                <p className="text-muted-foreground text-sm">
                  {persona.psychological_attributes.learning_style}
                </p>
              </div>
            </div>

            <Separator />

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div>
                <h4 className="mb-2 font-semibold text-green-700">
                  Motivations
                </h4>
                <ul className="space-y-1">
                  {persona.psychological_attributes.motivations.map(
                    (motivation, index) => (
                      <li
                        key={index}
                        className="flex items-start gap-2 text-sm text-green-600"
                      >
                        <span className="mt-1 text-green-500">•</span>
                        {motivation}
                      </li>
                    )
                  )}
                </ul>
              </div>

              <div>
                <h4 className="mb-2 font-semibold text-red-700">Fears</h4>
                <ul className="space-y-1">
                  {persona.psychological_attributes.fears.map((fear, index) => (
                    <li
                      key={index}
                      className="flex items-start gap-2 text-sm text-red-600"
                    >
                      <span className="mt-1 text-red-500">•</span>
                      {fear}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div>
              <h4 className="mb-2 font-semibold">Stress Triggers</h4>
              <div className="flex flex-wrap gap-2">
                {persona.psychological_attributes.stress_triggers.map(
                  (trigger, index) => (
                    <Badge key={index} variant="destructive">
                      {trigger}
                    </Badge>
                  )
                )}
              </div>
            </div>

            <div>
              <h4 className="mb-2 font-semibold">Coping Mechanisms</h4>
              <div className="flex flex-wrap gap-2">
                {persona.psychological_attributes.coping_mechanisms.map(
                  (mechanism, index) => (
                    <Badge key={index} variant="outline">
                      {mechanism}
                    </Badge>
                  )
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Media-Persona Alignment */}
        {personaInsight && (
          <Card>
            <CardHeader>
              <CardTitle>Media Alignment Analysis</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="mb-2 font-semibold">Best Performing Media</h4>
                <Badge variant="default">
                  {personaInsight?.best_performing_media}
                </Badge>
              </div>

              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div>
                  <h4 className="mb-2 font-semibold text-blue-700">
                    Messaging Opportunities
                  </h4>
                  <ul className="ml-5 list-disc text-sm text-blue-600">
                    {personaInsight?.key_messaging_opportunities?.map(
                      (opportunity, index) => (
                        <li key={index} className="">
                          {/* <span className="mt-1 text-blue-500">•</span> */}
                          {opportunity}
                        </li>
                      )
                    )}
                  </ul>
                </div>

                <div>
                  <h4 className="mb-2 font-semibold text-orange-700">
                    Content Gaps
                  </h4>
                  <ul className="ml-5 list-disc text-sm text-orange-600">
                    {personaInsight?.content_gaps?.map((gap, index) => (
                      <li key={index} className="">
                        {gap}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div>
                <h4 className="mb-2 font-semibold">Recommended Improvements</h4>
                <ul className="ml-5 list-disc text-sm">
                  {personaInsight?.recommended_improvements?.map(
                    (improvement, index) => (
                      <li key={index} className="">
                        {improvement}
                      </li>
                    )
                  )}
                </ul>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Trait Details */}
        <Card>
          <CardHeader>
            <CardTitle>Trait Analysis</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {persona.traits.map((trait, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-medium capitalize">
                      {trait.name.replace(/_/g, " ")}
                    </span>
                    <span className="text-muted-foreground text-sm">
                      {(trait.value * 100).toFixed(0)}%
                    </span>
                  </div>
                  <Progress value={trait.value * 100} className="h-2" />
                  <p className="text-muted-foreground text-xs">
                    {trait.reason}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  return (
    <div className={cn("space-y-6", className)}>
      {personas.length === 1 ? (
        // Single persona - render directly
        renderPersonaContent(
          personas[0],
          personaInsights.find(
            (insight) => insight.persona_id === personas[0]._id
          )
        )
      ) : (
        // Multiple personas - use tabs
        <>
          <div className="mb-6 flex items-center gap-3">
            <div className="bg-primary/10 rounded-full p-3">
              <User className="text-primary h-6 w-6" />
            </div>
            <div>
              <h2 className="text-2xl font-bold">Persona Analysis</h2>
              <p className="text-muted-foreground">
                {personas.length} personas analyzed
              </p>
            </div>
          </div>

          <Tabs defaultValue={personas[0]?._id} className="w-full">
            <TabsList className="grid w-full grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {personas.map((persona) => (
                <TabsTrigger
                  key={persona._id}
                  value={persona._id}
                  className="text-sm"
                >
                  {persona.name}
                </TabsTrigger>
              ))}
            </TabsList>

            {personas.map((persona) => (
              <TabsContent
                key={persona._id}
                value={persona._id}
                className="mt-6"
              >
                {renderPersonaContent(
                  persona,
                  personaInsights.find(
                    (insight) => insight.persona_id === persona._id
                  )
                )}
              </TabsContent>
            ))}
          </Tabs>
        </>
      )}
    </div>
  );
};
