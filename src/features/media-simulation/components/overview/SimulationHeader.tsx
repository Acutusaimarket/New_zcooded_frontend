// import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

import type { MediaSimulationData } from "../../types/media-simulation.types";
import { formatTimestamp } from "../../utils/data-formatters";
import MediaGallery from "../media-gallery";

interface SimulationHeaderProps {
  data: MediaSimulationData;
  className?: string;
}

export const SimulationHeader = ({
  data,
  className,
}: SimulationHeaderProps) => {
  const totalMediaFiles = data.media_files?.length || 0;
  const totalAnalyses = data.individual_analysis?.length || 0;

  return (
    <Card className={cn("w-full", className)}>
      <CardHeader className="pb-3">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-1">
            <CardTitle className="text-2xl font-bold">
              Media Simulation Analysis
            </CardTitle>
            {/* <p className="text-muted-foreground">Simulation ID: {data._id}</p> */}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-4">
          {/* Media Files Count */}
          <div className="space-y-2">
            <p className="text-muted-foreground text-sm font-medium">
              Media Files
            </p>
            <p className="text-2xl font-bold">{totalMediaFiles}</p>
            <p className="text-muted-foreground text-xs">
              {totalAnalyses} analyses completed
            </p>
          </div>

          {/* Model Used */}
          <div className="space-y-2">
            <p className="text-muted-foreground text-sm font-medium">
              AI Model
            </p>
            <p className="text-lg font-semibold">Acu Model 1</p>
            <p className="text-muted-foreground text-xs">Analysis engine</p>
          </div>

          {/* Created Date */}
          <div className="space-y-2">
            <p className="text-muted-foreground text-sm font-medium">Created</p>
            <p className="text-lg font-semibold">
              {formatTimestamp(data.created_at)}
            </p>
            <p className="text-muted-foreground text-xs">
              Last updated: {formatTimestamp(data.updated_at)}
            </p>
          </div>
        </div>

        <Separator className="my-6" />

        {/* Product & Persona Info */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {/* Product - Commented out as participated_product will be used later */}
          {/* <div className="space-y-3">
            <h3 className="text-lg font-semibold">Analyzed Product</h3>
            <div className="space-y-2">
              <p className="font-medium">{data.participated_product?.name}</p>
              <p className="text-muted-foreground line-clamp-3 text-sm">
                {data.participated_product?.description}
              </p>
              <div className="flex items-center gap-2">
                <Badge variant="outline">
                  {data.participated_product?.price?.toLocaleString()}{" "}
                  {data.participated_product?.currency}
                </Badge>
                <Badge variant="outline">
                  {data.participated_product?.country}
                </Badge>
              </div>
            </div>
          </div> */}

          {/* Persona */}
          <div className="">
            <h3 className="text-lg font-semibold">Target Personas</h3>
            <ul className="ml-5 list-disc">
              {data.participated_personas.map((persona) => (
                <li key={persona._id}>
                  <p className="text-secondary-foreground text-sm font-medium">
                    {persona.name}
                  </p>
                </li>
              ))}
            </ul>
          </div>

          {/* Custom Questions */}
          {data.custom_questions && data.custom_questions.length > 0 && (
            <div className="">
              <h3 className="text-lg font-semibold">Custom Questions</h3>
              <ul className="ml-5 list-disc">
                {data.custom_questions.map((question, index) => (
                  <li key={index}>
                    <p className="text-muted-foreground text-sm">{question}</p>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Media Gallery */}
        {data.media_files && data.media_files.length > 0 && (
          <>
            <Separator className="my-6" />
            <MediaGallery media={data.media_files} />
          </>
        )}
      </CardContent>
    </Card>
  );
};
