import {
  Activity,
  BarChart3,
  Calendar,
  Clock,
  FileText,
  MapPin,
  PieChart,
  TrendingUp,
  UserCheck,
  Users,
} from "lucide-react";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";

import { usePersonaStatsQuery } from "../api";

export const PersonaAnalytics = () => {
  const { data, isLoading, error } = usePersonaStatsQuery();

  if (isLoading) {
    return (
      <div className="space-y-6 p-6">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <Card key={i}>
              <CardHeader className="pb-2">
                <Skeleton className="h-4 w-24" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-16" />
              </CardContent>
            </Card>
          ))}
        </div>
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-6 w-32" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-32 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <Alert variant="destructive">
          <AlertDescription>
            {error.message || "Failed to load persona analytics"}
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  if (!data || !data.success) {
    return (
      <div className="p-6">
        <Alert>
          <AlertDescription>
            No persona data available at the moment.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  const getTopEntries = (obj: Record<string, number>, limit = 5) => {
    return Object.entries(obj)
      .sort(([, a], [, b]) => b - a)
      .slice(0, limit);
  };

  const getProgressValue = (value: number, total: number) => {
    return total > 0 ? (value / total) * 100 : 0;
  };

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Persona Analytics</h1>
        <p className="text-muted-foreground">
          Comprehensive insights into your persona collection
        </p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Personas
            </CardTitle>
            <Users className="text-muted-foreground h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.total_personas}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Published</CardTitle>
            <UserCheck className="text-muted-foreground h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {data.personas_by_status.published}
            </div>
            <p className="text-muted-foreground text-xs">
              {data.personas_by_status.draft} in draft
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">This Month</CardTitle>
            <Calendar className="text-muted-foreground h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.created_this_month}</div>
            <p className="text-muted-foreground text-xs">
              {data.created_this_week} this week
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Growth Rate</CardTitle>
            <TrendingUp className="text-muted-foreground h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {data.total_personas > 0
                ? Math.round(
                    (data.created_this_month / data.total_personas) * 100
                  )
                : 0}
              %
            </div>
            <p className="text-muted-foreground text-xs">Monthly growth</p>
          </CardContent>
        </Card>
      </div>

      {/* Status Distribution */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Status Distribution
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Published</span>
              <Badge variant="default">
                {data.personas_by_status.published}
              </Badge>
            </div>
            <Progress
              value={getProgressValue(
                data.personas_by_status.published,
                data.total_personas
              )}
              className="h-2"
            />
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Draft</span>
              <Badge variant="secondary">{data.personas_by_status.draft}</Badge>
            </div>
            <Progress
              value={getProgressValue(
                data.personas_by_status.draft,
                data.total_personas
              )}
              className="h-2"
            />
          </div>
        </CardContent>
      </Card>

      {/* Demographics and Distribution */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Gender Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PieChart className="h-5 w-5" />
              Gender Distribution
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {getTopEntries(data.personas_by_gender).map(([gender, count]) => (
                <div key={gender} className="flex items-center justify-between">
                  <span className="text-sm font-medium capitalize">
                    {gender}
                  </span>
                  <div className="flex items-center gap-2">
                    <Progress
                      value={getProgressValue(count, data.total_personas)}
                      className="h-2 w-20"
                    />
                    <Badge variant="outline">{count}</Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Age Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Age Distribution
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {getTopEntries(data.age_distribution).map(([ageRange, count]) => (
                <div
                  key={ageRange}
                  className="flex items-center justify-between"
                >
                  <span className="text-sm font-medium">{ageRange}</span>
                  <div className="flex items-center gap-2">
                    <Progress
                      value={getProgressValue(count, data.total_personas)}
                      className="h-2 w-20"
                    />
                    <Badge variant="outline">{count}</Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Location Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              Top Locations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {getTopEntries(data.personas_by_location).map(
                ([location, count]) => (
                  <div
                    key={location}
                    className="flex items-center justify-between"
                  >
                    <span className="text-sm font-medium">{location}</span>
                    <div className="flex items-center gap-2">
                      <Progress
                        value={getProgressValue(count, data.total_personas)}
                        className="h-2 w-20"
                      />
                      <Badge variant="outline">{count}</Badge>
                    </div>
                  </div>
                )
              )}
            </div>
          </CardContent>
        </Card>

        {/* Platform Stats */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Platform Usage
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {getTopEntries(data.platform_stats).map(([platform, count]) => (
                <div
                  key={platform}
                  className="flex items-center justify-between"
                >
                  <span className="text-sm font-medium capitalize">
                    {platform}
                  </span>
                  <div className="flex items-center gap-2">
                    <Progress
                      value={getProgressValue(count, data.total_personas)}
                      className="h-2 w-20"
                    />
                    <Badge variant="outline">{count}</Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Content and Traits Analysis */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Content Stats */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Content Statistics
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {getTopEntries(data.content_stats).map(([contentType, count]) => (
                <div
                  key={contentType}
                  className="flex items-center justify-between"
                >
                  <span className="text-sm font-medium capitalize">
                    {contentType.replace(/_/g, " ")}
                  </span>
                  <Badge variant="secondary">{count}</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Traits Averages */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Average Traits
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {Object.entries(data.traits_averages).map(([trait, average]) => (
                <div key={trait} className="space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium capitalize">
                      {trait.replace(/_/g, " ")}
                    </span>
                    <span className="text-muted-foreground text-sm">
                      {typeof average === "number"
                        ? average.toFixed(1)
                        : average}
                    </span>
                  </div>
                  {typeof average === "number" && (
                    <Progress value={average} className="h-1" />
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
