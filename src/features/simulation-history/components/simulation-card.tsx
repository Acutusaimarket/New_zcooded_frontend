import { ArrowRight, Calendar, Cpu, MapPin, Users } from "lucide-react";
import { Link } from "react-router";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

import type { SimulationHistoryItem } from "../types/simulation.types";
import {
  getSimulationTypeVariant,
  truncateText,
} from "../utils/simulation.utils";

interface SimulationCardProps {
  simulation: SimulationHistoryItem;
}

export const SimulationCard = ({ simulation }: SimulationCardProps) => {
  const timeAgo = new Date(simulation.created_at).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return (
    <Card className="group hover:shadow-primary/5 border-border/50 relative overflow-hidden transition-all duration-200 hover:-translate-y-1 hover:shadow-lg">
      {/* Gradient overlay for visual appeal */}
      <div className="from-primary/5 to-secondary/5 absolute inset-0 bg-gradient-to-br via-transparent opacity-0 transition-opacity duration-200 group-hover:opacity-100" />

      <CardHeader className="relative pb-4">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1 space-y-2">
            <CardTitle className="group-hover:text-primary line-clamp-2 text-lg leading-tight font-semibold transition-colors">
              {simulation.product_name}
            </CardTitle>
            <p className="text-muted-foreground line-clamp-2 text-sm leading-relaxed">
              {truncateText(simulation.product_details.description, 120)}
            </p>
          </div>
          <Badge
            variant={getSimulationTypeVariant(simulation.simulation_type)}
            className="shrink-0 px-2.5 py-1 text-xs font-medium"
          >
            {simulation.simulation_type}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="relative space-y-4">
        {/* Key Metrics Grid */}
        <div className="grid grid-cols-2 gap-3">
          <div className="flex items-center gap-2 text-sm">
            <div className="bg-primary/10 rounded-md p-1.5">
              <Calendar className="text-primary h-3.5 w-3.5" />
            </div>
            <div className="min-w-0">
              <p className="text-muted-foreground text-xs">Created</p>
              <p className="truncate text-sm font-medium">{timeAgo}</p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-sm">
            <div className="rounded-md bg-blue-500/10 p-1.5">
              <Users className="h-3.5 w-3.5 text-blue-500" />
            </div>
            <div className="min-w-0">
              <p className="text-muted-foreground text-xs">Personas</p>
              <p className="text-sm font-medium">
                {simulation.personas.length}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-sm">
            <div className="rounded-md bg-green-500/10 p-1.5">
              <Cpu className="h-3.5 w-3.5 text-green-500" />
            </div>
            <div className="min-w-0">
              <p className="text-muted-foreground text-xs">Model</p>
              <p className="truncate text-sm font-medium">Acu 1</p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-sm">
            <div className="rounded-md bg-orange-500/10 p-1.5">
              <MapPin className="h-3.5 w-3.5 text-orange-500" />
            </div>
            <div className="min-w-0">
              <p className="text-muted-foreground text-xs">Location</p>
              <p className="truncate text-sm font-medium">
                {simulation.product_details.city}
              </p>
            </div>
          </div>
        </div>

        <Separator className="opacity-50" />

        {/* Product Details */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Price</span>
            <span className="font-semibold">
              {simulation.product_details.currency}{" "}
              {simulation.product_details.price}
            </span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Country</span>
            <span className="font-medium">
              {simulation.product_details.country}
            </span>
          </div>
        </div>

        {/* Action Button */}
        <div className="flex justify-end pt-2">
          <Button
            asChild
            variant="outline"
            size="sm"
            className="group/btn hover:bg-primary hover:text-primary-foreground w-full gap-2 transition-all duration-200"
          >
            <Link to={`/dashboard/simulation-history/${simulation._id}`}>
              View Details
              <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover/btn:translate-x-0.5" />
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
