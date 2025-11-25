import { Link } from "react-router";

import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { PersonaAnalytics, StatsCards } from "./components";

const PersonaStudio = () => {
  return (
    <div className="space-y-6 p-6">
      <div className="space-y-2">
        <h1 className="text-primary text-3xl font-bold tracking-tight">
          Persona Studio
        </h1>
        <p className="text-muted-foreground">
          Design and manage personas for your synthetic data-driven digital twin
          simulator.
        </p>
      </div>

      {/* Stats Overview */}
      <StatsCards />

      {/* Main Content */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          {/* <TabsTrigger value="analytics">Analytics</TabsTrigger> */}
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Overview content */}
          <div className="rounded-lg border p-6">
            <h3 className="mb-4 text-xl font-medium">
              Persona Studio Overview
            </h3>
            <p className="text-muted-foreground mb-4">
              The Persona Studio provides tools for creating, analyzing, and
              managing personas for your simulations.
            </p>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="hover:border-primary rounded-lg border p-4 transition-colors">
                <h4 className="mb-2 text-lg font-medium">Persona Engine</h4>
                <p className="text-muted-foreground mb-4 text-sm">
                  Generate new personas with the AI engine
                </p>
                <Button asChild size="sm">
                  <Link to="/dashboard/persona-studio/engine">Use Engine</Link>
                </Button>
              </div>
              <div className="hover:border-primary rounded-lg border p-4 transition-colors">
                <h4 className="mb-2 text-lg font-medium">Persona Management</h4>
                <p className="text-muted-foreground mb-4 text-sm">
                  Create, edit, and manage your personas
                </p>
                <Button asChild size="sm">
                  <Link to="/dashboard/persona-studio/management">
                    Manage Personas
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <PersonaAnalytics />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PersonaStudio;
