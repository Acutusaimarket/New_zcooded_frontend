import React from "react";

import { formatDate } from "date-fns";
import {
  FileImage,
  FileVideo,
  HelpCircle,
  ImageIcon,
  User,
} from "lucide-react";
import { useNavigate } from "react-router";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";

import type { MediaHistoryItem } from "../types/media-history.types";

interface SimulationCardProps {
  simulation: MediaHistoryItem;
  className?: string;
}

// Helper function to format date
// const formatDate = (dateString: string) => {
//   return new Date(dateString).toLocaleDateString("en-US", {
//     year: "numeric",
//     month: "short",
//     day: "numeric",
//     hour: "2-digit",
//     minute: "2-digit",
//   });
// };

// Helper function to format file size
const formatFileSize = (bytes: number) => {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
};

// Helper function to get media type icon
const getMediaTypeIcon = (mediaType: string) => {
  if (mediaType.startsWith("image/")) {
    return <FileImage className="h-4 w-4" />;
  } else if (mediaType.startsWith("video/")) {
    return <FileVideo className="h-4 w-4" />;
  }
  return <ImageIcon className="h-4 w-4" />;
};

// Helper function to get total file size
const getTotalFileSize = (mediaFiles: MediaHistoryItem["media_files"]) => {
  return mediaFiles.reduce((total, file) => total + file.media_size, 0);
};

export const SimulationCard: React.FC<SimulationCardProps> = ({
  simulation,
  className,
}) => {
  const primaryPersona = simulation.participated_personas[0];
  const totalFileSize = getTotalFileSize(simulation.media_files);
  const navigate = useNavigate();

  const handleViewSimulation = () => {
    console.log("View Simulation button clicked!");
    console.log("Simulation ID:", simulation._id);
    console.log(
      "Navigating to:",
      `/dashboard/media-simulation/history/result/${simulation._id}`
    );

    // Navigate to the Media Simulation Result page with the simulation ID
    navigate(`/dashboard/media-simulation/history/result/${simulation._id}`);

    console.log("Navigation called");
  };

  return (
    <Card
      className={cn(
        "group transition-all duration-200 hover:shadow-lg",
        className
      )}
    >
      <CardHeader className="relative pt-2 pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            {/* <CardTitle className="text-lg font-semibold">
              {simulation.model_used}
            </CardTitle> */}
            <p className="text-muted-foreground absolute top-2 right-4 mt-1 text-sm">
              {formatDate(new Date(simulation.created_at), "dd MMMM yyyy")}
            </p>
            {/* Custom Questions Badge */}
            {simulation.custom_questions &&
              simulation.custom_questions.length > 0 && (
                <Badge
                  variant="secondary"
                  className="mt-1 flex w-fit items-center gap-1"
                >
                  <HelpCircle className="h-3 w-3" />
                  {simulation.custom_questions.length} Custom Question
                  {simulation.custom_questions.length > 1 ? "s" : ""}
                </Badge>
              )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Media Section */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <ImageIcon className="text-muted-foreground h-4 w-4" />
            <span className="text-sm font-medium">Media Files</span>
            <Badge variant="secondary" className="text-xs">
              {simulation.media_files.length}
            </Badge>
          </div>
          <div className="flex flex-wrap gap-2">
            {simulation.media_files.slice(0, 3).map((file) => (
              <div
                key={file.media_id}
                className="bg-muted flex items-center gap-1 rounded-md px-2 py-1"
              >
                {getMediaTypeIcon(file.media_type)}
                <span className="text-muted-foreground text-xs">
                  {formatFileSize(file.media_size)}
                </span>
              </div>
            ))}
            {simulation.media_files.length > 3 && (
              <div className="bg-muted flex items-center gap-1 rounded-md px-2 py-1">
                <span className="text-muted-foreground text-xs">
                  +{simulation.media_files.length - 3} more
                </span>
              </div>
            )}
          </div>
          <p className="text-muted-foreground text-xs">
            Total: {formatFileSize(totalFileSize)}
          </p>
        </div>

        {/* Persona Section */}
        {primaryPersona && (
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <User className="text-muted-foreground h-4 w-4" />
              <span className="text-sm font-medium">Personas</span>
              <Badge variant="secondary" className="text-xs">
                {simulation.participated_personas.length}
              </Badge>
            </div>
            <div className="bg-muted rounded-md p-3">
              <p className="text-sm font-medium">{primaryPersona.name}</p>
              {simulation.participated_personas.length > 1 && (
                <p className="text-muted-foreground text-xs">
                  +{simulation.participated_personas.length - 1} more
                </p>
              )}
            </div>
          </div>
        )}

        {/* Product Section */}
        {/* <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Package className="text-muted-foreground h-4 w-4" />
            <span className="text-sm font-medium">Product</span>
          </div>
          <div className="bg-muted space-y-2 rounded-md p-3">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium">
                  {simulation.participated_product.name}
                </p>
                <p className="text-muted-foreground line-clamp-2 text-xs">
                  {simulation.participated_product.description}
                </p>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold">
                {simulation.participated_product.currency}{" "}
                {simulation.participated_product.price.toFixed(2)}
              </p>
              <p className="text-muted-foreground text-xs">
                {simulation.participated_product.city},{" "}
                {simulation.participated_product.country}
              </p>
            </div>
          </div>
        </div> */}
      </CardContent>

      <CardFooter>
        <Button
          className="w-full"
          variant="default"
          onClick={handleViewSimulation}
        >
          View Simulation
        </Button>
      </CardFooter>
    </Card>
  );
};
