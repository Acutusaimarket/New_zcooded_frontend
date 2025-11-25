import { useState } from "react";

import {
  Activity,
  Calendar,
  FileText,
  MapPin,
  UserCheck,
  Users,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { usePersonaStatsQuery } from "../api";

export const StatsCards = () => {
  const { data: stats, isLoading, error } = usePersonaStatsQuery();
  const [showAllLocations, setShowAllLocations] = useState(false);
  const [showAllAgeRanges, setShowAllAgeRanges] = useState(false);

  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Loading...</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">-</div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="grid gap-4 md:grid-cols-1">
        <Card>
          <CardContent className="pt-6">
            <p className="text-red-500">Error loading stats: {error.message}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!stats) return null;

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Personas</CardTitle>
          <Users className="text-muted-foreground h-4 w-4" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.total_personas}</div>
          <p className="text-muted-foreground text-xs">
            {stats.created_this_month} created this month
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Published</CardTitle>
          <Activity className="text-muted-foreground h-4 w-4" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {stats.personas_by_status.published}
          </div>
          <p className="text-muted-foreground text-xs">Currently active</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Draft Personas</CardTitle>
          <FileText className="text-muted-foreground h-4 w-4" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {stats.personas_by_status.draft}
          </div>
          <p className="text-muted-foreground text-xs">Need completion</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Gender Distribution
          </CardTitle>
          <UserCheck className="text-muted-foreground h-4 w-4" />
        </CardHeader>
        <CardContent>
          <div className="space-y-1">
            {Object.entries(stats.personas_by_gender).map(([gender, count]) => (
              <div key={gender} className="flex justify-between text-sm">
                <span>{gender}:</span>
                <span className="font-medium">{count}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Locations</CardTitle>
          <MapPin className="text-muted-foreground h-4 w-4" />
        </CardHeader>
        <CardContent>
          <div className="space-y-1">
            {Object.entries(stats.personas_by_location)
              .slice(0, showAllLocations ? undefined : 2)
              .map(([location, count]) => (
                <div key={location} className="flex justify-between text-sm">
                  <span>{location}:</span>
                  <span className="font-medium">{count}</span>
                </div>
              ))}
            {Object.entries(stats.personas_by_location).length > 4 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowAllLocations(!showAllLocations)}
                className="mt-2 h-auto p-0 text-xs text-blue-600 hover:text-blue-800"
              >
                {showAllLocations ? "Show Less" : "Show More"}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Age Ranges</CardTitle>
          <Calendar className="text-muted-foreground h-4 w-4" />
        </CardHeader>
        <CardContent>
          <div className="space-y-1">
            {Object.entries(stats.age_distribution)
              .slice(0, showAllAgeRanges ? undefined : 2)
              .map(([ageRange, count]) => (
                <div key={ageRange} className="flex justify-between text-sm">
                  <span>{ageRange}:</span>
                  <span className="font-medium">{count}</span>
                </div>
              ))}
            {Object.entries(stats.age_distribution).length > 4 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowAllAgeRanges(!showAllAgeRanges)}
                className="mt-2 h-auto p-0 text-xs text-blue-600 hover:text-blue-800"
              >
                {showAllAgeRanges ? "Show Less" : "Show More"}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
