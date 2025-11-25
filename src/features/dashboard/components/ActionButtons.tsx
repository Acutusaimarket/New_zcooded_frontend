import { Plus, Search, Upload } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export const ActionButtons = () => {
  const actions = [
    {
      id: "create",
      title: "Create New Simulation",
      description: "Start a new behavioral simulation",
      icon: Plus,
      variant: "primary" as const,
      // onClick: () => console.log("Create new simulation"),
    },
    {
      id: "view",
      title: "View Persona Library",
      description: "Browse available personas",
      icon: Search,
      variant: "secondary" as const,
      // onClick: () => console.log("View persona library"),
    },
    {
      id: "import",
      title: "Import Real Behavior Data (Optional)",
      description: "Upload behavioral datasets",
      icon: Upload,
      variant: "secondary" as const,
      // onClick: () => console.log("Import behavior data"),
    },
  ];

  return (
    <div className="grid gap-6 md:grid-cols-3">
      {actions.map((action) => (
        <Card
          key={action.id}
          className="group cursor-pointer border-0 shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
          // onClick={action.onClick}
        >
          <CardHeader className="pb-4">
            <div className="flex items-center justify-center">
              <div
                className={`flex h-16 w-16 items-center justify-center rounded-full ${
                  action.variant === "primary" ? "bg-primary/10" : "bg-muted/50"
                }`}
              >
                <action.icon
                  className={`h-8 w-8 ${
                    action.variant === "primary"
                      ? "text-primary"
                      : "text-muted-foreground"
                  }`}
                />
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-0 text-center">
            <CardTitle className="mb-2 text-lg leading-tight">
              {action.title}
            </CardTitle>
            <CardDescription className="text-sm">
              {action.description}
            </CardDescription>
          </CardContent>

          {/* Hover effect overlay */}
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/20 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
        </Card>
      ))}
    </div>
  );
};
