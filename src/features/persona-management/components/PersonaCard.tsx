import { useMemo, useRef, useState } from "react";

import {
  Activity,
  Calendar,
  CloudUploadIcon,
  Download,
  Edit,
  Eye,
  FilePenIcon,
  InfoIcon,
  MoreVertical,
  Trash2,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { TooltipWrapper } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import type { PersonaData } from "@/types/persona.type";

import { personalityTypes } from "../constants";
import { generatePersonaPDF } from "../utils/generatePersonaPDF";

interface PersonaCardProps {
  persona: PersonaData;
  onEdit?: (persona: PersonaData) => void;
  onDelete?: (personaId: string) => void;
  onDuplicate?: (persona: PersonaData) => void;
  onDownload?: (persona: PersonaData) => void;
  onStatusChange?: (persona: PersonaData) => void;
  onSelect?: (persona: PersonaData | null) => void;
  disabledActionButton?: boolean;
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

export const PersonaCard = ({
  persona,
  onEdit,
  onDelete,
  onSelect,
  disabledActionButton,
  onStatusChange,
}: PersonaCardProps) => {
  const [checked, setChecked] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const detailsContentRef = useRef<HTMLDivElement>(null);
  const handleSelect = () => {
    setChecked((prev) => {
      const newChecked = !prev;
      if (newChecked) {
        onSelect?.(persona);
      } else {
        onSelect?.(null);
      }
      return newChecked;
    });
  };

  const haveDefinition = useMemo(
    () =>
      personalityTypes.find((type) =>
        new RegExp(`${type.type}`, "i").test(
          persona.psychological_attributes.personality_type
        )
      ),
    [persona.psychological_attributes.personality_type]
  );

  const handleDownload = async () => {
    if (!detailsContentRef.current) {
      return;
    }

    try {
      setIsDownloading(true);
      await generatePersonaPDF(persona, detailsContentRef.current);
    } catch (error) {
      console.error("Failed to download persona card", error);
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <Card
      className={cn(
        "relative overflow-hidden rounded-lg border-2 shadow-sm transition-all duration-200 hover:shadow-md",
        persona.status === "published" &&
          "border-emerald-500/50 hover:border-emerald-500",
        persona.status === "draft" &&
          "border-amber-500/50 hover:border-amber-500",
        checked && "border-primary hover:border-primary/80"
      )}
      role="button"
      tabIndex={0}
    >
      <CardHeader
        className={cn(
          "pb-2",
          persona?.status === "published" && "bg-emerald-500/10",
          persona?.status === "draft" && "bg-amber-500/10"
        )}
      >
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg font-bold">{persona?.name}</CardTitle>
            <p className="text-ellipsis-2 text-muted-foreground text-sm">
              {persona?.description}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Badge
              className={cn(
                "text-xs capitalize",
                persona?.status === "published"
                  ? "bg-emerald-500 text-white"
                  : persona?.status === "draft"
                    ? "bg-amber-500 text-white"
                    : "bg-gray-300 text-gray-800"
              )}
            >
              {persona.status}
            </Badge>
            <DropdownMenu modal={false}>
              <TooltipWrapper
                content="Actions"
                triggerProps={{
                  asChild: true,
                }}
              >
                {!disabledActionButton && (
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      disabled={disabledActionButton}
                      className="hover:bg-muted/80 size-7 rounded-lg"
                    >
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                )}
              </TooltipWrapper>
              <DropdownMenuContent className="min-w-[200px]" align="end">
                <DropdownMenuItem onClick={() => onStatusChange?.(persona)}>
                  {persona?.status === "draft"
                    ? "Publish persona"
                    : "Draft persona"}
                  <DropdownMenuShortcut>
                    {persona?.status === "draft" ? (
                      <CloudUploadIcon />
                    ) : (
                      <FilePenIcon />
                    )}
                  </DropdownMenuShortcut>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onEdit?.(persona)}>
                  Edit
                  <DropdownMenuShortcut>
                    <Edit />
                  </DropdownMenuShortcut>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleSelect}>
                  Select Persona
                  <DropdownMenuShortcut>
                    <Checkbox checked={checked} />
                  </DropdownMenuShortcut>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => onDelete?.(persona?._id ?? "")}
                  className="text-destructive focus:text-destructive"
                >
                  Delete
                  <DropdownMenuShortcut>
                    <Trash2 className="stroke-destructive" />
                  </DropdownMenuShortcut>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-2 pb-4">
        <div className="flex items-center justify-between">
          <div className="text-muted-foreground flex items-center gap-4 text-xs">
            <div className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              {formatDate(persona?.created_at || new Date().toISOString())}
            </div>
            <div className="flex items-center gap-1">
              <Activity className="h-3 w-3" />
              Updated
            </div>
          </div>
          <Dialog>
            <DialogTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="h-8 shadow-sm transition-all duration-200 hover:shadow-md"
              >
                <Eye className="mr-2 h-4 w-4" />
                View Details
              </Button>
            </DialogTrigger>
            <DialogContent className="max-h-[90vh] overflow-hidden md:max-w-5xl">
              <DialogHeader>
                <div className="flex items-center justify-between gap-4">
                  <DialogTitle className="text-xl font-bold">
                    {persona?.name}
                  </DialogTitle>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleDownload}
                    className="h-8 shadow-sm transition-all duration-200 hover:shadow-md"
                    disabled={isDownloading}
                  >
                    <Download className="mr-2 h-4 w-4" />
                    {isDownloading ? "Preparing..." : "Download"}
                  </Button>
                </div>
              </DialogHeader>
              <div className="max-h-[calc(90vh-120px)] w-full overflow-y-auto pr-2">
                <div ref={detailsContentRef}>
                  <PersonaDetailsContent
                    persona={persona}
                    haveDefinition={haveDefinition}
                  />
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </CardContent>
    </Card>
  );
};

const PersonaDetailsContent = ({
  persona,
  haveDefinition,
}: {
  persona: PersonaData;
  haveDefinition:
    | {
        type: string;
        meaning: string;
      }
    | undefined;
}) => {
  return (
    <div className="w-full space-y-6">
      {/* Description */}
      <div>
        <h3 className="mb-2 text-lg font-semibold">Description</h3>
        <p className="text-muted-foreground text-sm">{persona?.description}</p>
      </div>

      {/* Demographics */}
      <div>
        <Level level="Demographics (Level 1)" />
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <strong>Age:</strong> {persona?.demographic?.age_range || "N/A"}
          </div>
          <div>
            <strong>Occupation:</strong>{" "}
            {persona?.demographic?.occupation || "N/A"}
          </div>
          {persona.demographic?.location && (
            <div>
              <strong>Location:</strong>
              <span className="ml-1">{persona?.demographic?.location}</span>
            </div>
          )}
          {persona.demographic?.gender && (
            <div>
              <strong>Gender:</strong>
              <span className="ml-1">{persona?.demographic?.gender}</span>
            </div>
          )}
          {persona.demographic?.education && (
            <div>
              <strong>Education:</strong>
              <span className="ml-1">{persona?.demographic?.education}</span>
            </div>
          )}
          {persona.demographic?.income_tier && (
            <div className="col-span-2">
              <strong>Income Tier:</strong>
              <span className="ml-1">
                {persona?.demographic?.income_tier || "N/A"}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Behavioral Patterns */}
      {persona?.behavior_patterns && (
        <div>
          <Level level="Behavioral Patterns (Level 2)" />
          <div className="space-y-3 text-sm">
            {persona?.behavior_patterns?.communication_style && (
              <div>
                <strong>Communication Style:</strong>{" "}
                {persona?.behavior_patterns?.communication_style}
              </div>
            )}
            {persona?.behavior_patterns?.decision_making_process && (
              <div>
                <strong>Decision Making:</strong>{" "}
                {persona?.behavior_patterns?.decision_making_process}
              </div>
            )}
            {persona?.behavior_patterns?.lifestyle && (
              <div>
                <strong>Lifestyle:</strong>{" "}
                {persona?.behavior_patterns?.lifestyle}
              </div>
            )}
            {persona?.behavior_patterns?.values &&
              persona?.behavior_patterns?.values?.length > 0 && (
                <div>
                  <strong>Values:</strong>{" "}
                  {persona?.behavior_patterns?.values?.join(", ")}
                </div>
              )}
          </div>
        </div>
      )}

      {/* Traits */}
      <div>
        <Level level="Traits (Level 3)" />
        {persona?.traits && persona?.traits?.length > 0 && (
          <div className="grid grid-cols-1 gap-3">
            {persona?.traits
              .sort((a, b) => b.value - a.value)
              .map((trait, index) => (
                <div className="text-sm" key={index}>
                  <div className="mb-2 flex items-center justify-between">
                    <div className="flex items-center gap-1 capitalize">
                      <span className="font-medium">
                        {trait?.name?.replace(/_/g, " ")}
                      </span>
                      <TooltipWrapper
                        triggerProps={{ asChild: true }}
                        content={trait?.reason}
                      >
                        <button className="text-muted-foreground cursor-help">
                          <InfoIcon className="h-3 w-3" />
                        </button>
                      </TooltipWrapper>
                    </div>
                    <span className="font-medium">
                      {(trait?.value * 100).toFixed(2)}%
                    </span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-gray-200">
                    <div
                      className="bg-primary h-2 rounded-full transition-all duration-300"
                      style={{
                        width: `${Math.min(trait?.value * 100, 100)}%`,
                      }}
                    />
                  </div>
                </div>
              ))}
          </div>
        )}
      </div>

      {/* Psychological Attributes */}
      {persona?.psychological_attributes && (
        <div>
          <Level level="Psychological Attributes (Level 4)" />
          <div className="space-y-3 text-sm">
            {persona?.psychological_attributes?.personality_type && (
              <div className="flex items-center gap-2">
                <strong>Personality Type:</strong>
                <div className="flex items-center gap-1">
                  {persona?.psychological_attributes?.personality_type}
                  {haveDefinition && (
                    <TooltipWrapper content={haveDefinition.meaning}>
                      <InfoIcon className="text-muted-foreground h-3 w-3 cursor-help" />
                    </TooltipWrapper>
                  )}
                </div>
              </div>
            )}
            {persona?.psychological_attributes?.emotional_tendencies && (
              <div>
                <strong>Emotional Tendencies:</strong>{" "}
                {persona?.psychological_attributes?.emotional_tendencies}
              </div>
            )}
            {persona?.psychological_attributes?.motivations &&
              persona?.psychological_attributes?.motivations?.length > 0 && (
                <div>
                  <strong>Motivations:</strong>{" "}
                  {persona?.psychological_attributes?.motivations?.join(", ")}
                </div>
              )}
            {persona?.psychological_attributes?.fears &&
              persona?.psychological_attributes?.fears?.length > 0 && (
                <div>
                  <strong>Fears:</strong>{" "}
                  {persona?.psychological_attributes?.fears?.join(", ")}
                </div>
              )}
          </div>
        </div>
      )}

      {/* Status and Metadata */}
      <div className="border-t pt-4">
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-4">
            <Badge
              className={cn(
                "text-xs capitalize",
                persona?.status === "published"
                  ? "bg-emerald-500 text-white"
                  : persona?.status === "draft"
                    ? "bg-amber-500 text-white"
                    : "bg-gray-300 text-gray-800"
              )}
            >
              {persona.status}
            </Badge>
            <div className="text-muted-foreground flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              Created:{" "}
              {formatDate(persona?.created_at || new Date().toISOString())}
            </div>
          </div>
          <div className="text-muted-foreground flex items-center gap-1">
            <Activity className="h-3 w-3" />
            Last Updated
          </div>
        </div>
      </div>
    </div>
  );
};

const Level = ({ level }: { level: string }) => {
  return (
    <span className="mb-3 flex items-center">
      <span
        className="border-b-primary/50 h-px flex-1 border-b border-dashed"
        aria-hidden
      ></span>

      <span className="shrink-0 px-3 text-sm font-semibold uppercase">
        {level}
      </span>

      <span
        className="border-b-primary/50 h-px flex-1 border-b border-dashed"
        aria-hidden
      ></span>
    </span>
  );
};
