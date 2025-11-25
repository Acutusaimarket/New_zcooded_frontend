import { Plus } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";

interface CreatePersonaCardProps {
  onCreateClick: () => void;
}

export const CreatePersonaCard = ({
  onCreateClick,
}: CreatePersonaCardProps) => {
  return (
    <Card
      className="group border-muted-foreground/25 bg-muted/5 hover:border-primary/50 hover:bg-primary/5 cursor-pointer border-2 border-dashed transition-all duration-300"
      onClick={onCreateClick}
      role="button"
      tabIndex={1}
    >
      <CardContent className="flex min-h-[280px] flex-col items-center justify-center p-8 text-center">
        <div className="bg-primary/10 group-hover:bg-primary/20 mb-4 rounded-full p-4 transition-colors">
          <Plus className="text-primary h-8 w-8" />
        </div>
        <h3 className="mb-2 text-lg font-semibold">Create New Persona</h3>
        <p className="text-muted-foreground text-sm">
          Start building a new behavioral profile for your simulations
        </p>
      </CardContent>
    </Card>
  );
};
