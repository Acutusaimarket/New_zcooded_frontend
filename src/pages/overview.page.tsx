import { BarChart, DollarSign, LineChart, Users } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export const OverviewPage = () => {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Overview</h1>
      </div>

      <Tabs defaultValue="engagement" className="space-y-4">
        <TabsList>
          <TabsTrigger value="engagement">Engagement</TabsTrigger>
          <TabsTrigger value="demographics">Demographics</TabsTrigger>
          <TabsTrigger value="behavior">Behavior</TabsTrigger>
        </TabsList>
        <TabsContent value="engagement" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Personas
                </CardTitle>
                <Users className="text-muted-foreground h-4 w-4" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">12,234</div>
                <p className="text-muted-foreground text-xs">
                  +49% from last month
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Active Scenarios
                </CardTitle>
                <LineChart className="text-muted-foreground h-4 w-4" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">132</div>
                <p className="text-muted-foreground text-xs">
                  +12% from last month
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Generated Insights
                </CardTitle>
                <BarChart className="text-muted-foreground h-4 w-4" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">573</div>
                <p className="text-muted-foreground text-xs">
                  +18% from last month
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Estimated ROI
                </CardTitle>
                <DollarSign className="text-muted-foreground h-4 w-4" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">$45,231.89</div>
                <p className="text-muted-foreground text-xs">
                  +7% from last month
                </p>
              </CardContent>
            </Card>
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="col-span-4">
              <CardHeader>
                <CardTitle>Engagement Overview</CardTitle>
                <CardDescription>
                  Monthly engagement metrics across personas
                </CardDescription>
              </CardHeader>
              <CardContent className="h-[300px]">
                <div className="text-muted-foreground flex h-full items-center justify-center">
                  Line chart visualization would appear here
                </div>
              </CardContent>
            </Card>
            <Card className="col-span-3">
              <CardHeader>
                <CardTitle>Top Performing Personas</CardTitle>
                <CardDescription>By conversion rate</CardDescription>
              </CardHeader>
              <CardContent className="h-[300px]">
                <div className="text-muted-foreground flex h-full items-center justify-center">
                  Bar chart visualization would appear here
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        <TabsContent value="demographics" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="col-span-4">
              <CardHeader>
                <CardTitle>Demographic Distribution</CardTitle>
                <CardDescription>Across all personas</CardDescription>
              </CardHeader>
              <CardContent className="h-[300px]">
                <div className="text-muted-foreground flex h-full items-center justify-center">
                  Demographics chart visualization would appear here
                </div>
              </CardContent>
            </Card>
            <Card className="col-span-3">
              <CardHeader>
                <CardTitle>Age Distribution</CardTitle>
                <CardDescription>By persona segment</CardDescription>
              </CardHeader>
              <CardContent className="h-[300px]">
                <div className="text-muted-foreground flex h-full items-center justify-center">
                  Age distribution chart would appear here
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        <TabsContent value="behavior" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="col-span-4">
              <CardHeader>
                <CardTitle>Behavior Patterns</CardTitle>
                <CardDescription>Most common behaviors</CardDescription>
              </CardHeader>
              <CardContent className="h-[300px]">
                <div className="text-muted-foreground flex h-full items-center justify-center">
                  Behavior pattern visualization would appear here
                </div>
              </CardContent>
            </Card>
            <Card className="col-span-3">
              <CardHeader>
                <CardTitle>Response Rates</CardTitle>
                <CardDescription>By scenario type</CardDescription>
              </CardHeader>
              <CardContent className="h-[300px]">
                <div className="text-muted-foreground flex h-full items-center justify-center">
                  Response rate chart would appear here
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default OverviewPage;
