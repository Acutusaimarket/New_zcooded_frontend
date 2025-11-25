import { Shimmer } from "@/components/ai-elements/shimmer";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { PersonaData } from "@/types/persona.type";

interface PersonaPreviewCardProps {
  persona?: Partial<PersonaData>;
  isLoading?: boolean;
  className?: string;
}

export const PersonaPreviewCard = ({
  persona,
  isLoading = false,
  className,
}: PersonaPreviewCardProps) => {
  const name = persona?.name || "Generating persona...";
  const description = persona?.description || "Building persona profile...";
  const status = persona?.status || "draft";

  return (
    <Card
      className={cn(
        "relative overflow-hidden rounded-lg border-2 transition-all",
        status === "published" &&
          "border-emerald-500 hover:border-emerald-500/50",
        status === "draft" && "border-amber-500 hover:border-amber-500/50",
        isLoading && "animate-pulse",
        className
      )}
    >
      <CardHeader
        className={cn(
          "pb-2",
          status === "published" && "bg-emerald-500/10",
          status === "draft" && "bg-amber-500/10"
        )}
      >
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg font-bold">
              {isLoading ? <Shimmer>{name}</Shimmer> : name}
            </CardTitle>
            <p className="text-muted-foreground mt-1 text-sm">
              {isLoading ? <Shimmer>{description}</Shimmer> : description}
            </p>
          </div>
          <Badge
            className={cn(
              "ml-2 text-xs capitalize",
              status === "published"
                ? "bg-emerald-500 text-white"
                : status === "draft"
                  ? "bg-amber-500 text-white"
                  : "bg-gray-300 text-gray-800"
            )}
          >
            {isLoading ? <Shimmer>{status}</Shimmer> : status}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="pt-4">
        <div className="space-y-3">
          {/* Demographics Preview */}
          {persona?.demographic && (
            <div className="space-y-1">
              <h4 className="text-muted-foreground text-sm font-semibold">
                Demographics
              </h4>
              <div className="grid grid-cols-2 gap-1 text-sm">
                {persona.demographic.age_range && (
                  <div>
                    <strong>Age:</strong>{" "}
                    {isLoading ? (
                      <Shimmer>{persona.demographic.age_range}</Shimmer>
                    ) : (
                      persona.demographic.age_range
                    )}
                  </div>
                )}
                {persona.demographic.occupation && (
                  <div className="truncate">
                    <strong>Occupation:</strong>{" "}
                    {isLoading ? (
                      <Shimmer>{persona.demographic.occupation}</Shimmer>
                    ) : (
                      persona.demographic.occupation
                    )}
                  </div>
                )}
                {persona.demographic.location && (
                  <div className="truncate">
                    <strong>Location:</strong>{" "}
                    {isLoading ? (
                      <Shimmer>{persona.demographic.location}</Shimmer>
                    ) : (
                      persona.demographic.location
                    )}
                  </div>
                )}
                {persona.demographic.gender && (
                  <div>
                    <strong>Gender:</strong>{" "}
                    {isLoading ? (
                      <Shimmer>{persona.demographic.gender}</Shimmer>
                    ) : (
                      persona.demographic.gender
                    )}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Personality Type */}
          {persona?.psychological_attributes?.personality_type && (
            <div className="space-y-1">
              <h4 className="text-muted-foreground text-sm font-semibold">
                Personality
              </h4>
              <div className="text-sm">
                {isLoading ? (
                  <Shimmer>
                    {persona.psychological_attributes.personality_type}
                  </Shimmer>
                ) : (
                  persona.psychological_attributes.personality_type
                )}
              </div>
            </div>
          )}

          {/* Top Traits Preview */}
          {persona?.traits && persona.traits.length > 0 && (
            <div className="space-y-1">
              <h4 className="text-muted-foreground text-sm font-semibold">
                Key Traits
              </h4>
              <div className="space-y-1">
                {persona.traits.slice(0, 3).map((trait, index) => (
                  <div key={index} className="text-xs">
                    <div className="flex items-center justify-between">
                      <span className="capitalize">
                        {trait.name.replace(/_/g, " ")}
                      </span>
                      <span className="font-medium">
                        {(trait.value * 100).toFixed(0)}%
                      </span>
                    </div>
                    <div className="mt-1 h-1 w-full rounded-full bg-gray-200">
                      <div
                        className="bg-primary h-1 rounded-full transition-all"
                        style={{
                          width: isLoading
                            ? "0%"
                            : `${Math.min(trait.value * 100, 100)}%`,
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Loading state when no data */}
          {!persona?.demographic && !persona?.traits && isLoading && (
            <div className="space-y-2">
              <Shimmer>Loading persona details...</Shimmer>
              <Shimmer>Analyzing demographics...</Shimmer>
              <Shimmer>Building psychological profile...</Shimmer>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
