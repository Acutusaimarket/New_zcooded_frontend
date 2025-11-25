import { HelpCircle } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

interface CustomQuestionsSectionProps {
  customQuestionsResponses?: Record<string, string>;
  className?: string;
}

export const CustomQuestionsSection = ({
  customQuestionsResponses,
  className,
}: CustomQuestionsSectionProps) => {
  if (
    !customQuestionsResponses ||
    Object.keys(customQuestionsResponses).length === 0
  ) {
    return null;
  }

  const questionCount = Object.keys(customQuestionsResponses).length;

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <HelpCircle className="h-5 w-5" />
          Custom Questions & Responses
          <Badge variant="secondary" className="ml-2">
            {questionCount} {questionCount === 1 ? "Question" : "Questions"}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {Object.entries(customQuestionsResponses).map(
            ([question, response], index) => (
              <div key={index}>
                <div className="space-y-3">
                  <div className="bg-primary/5 border-primary/20 rounded-lg border-l-4 p-4">
                    <div className="mb-2 flex items-start gap-2">
                      <span className="bg-primary/20 text-primary flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold">
                        Q
                      </span>
                      <p className="text-primary flex-1 text-sm leading-relaxed font-semibold">
                        {question}
                      </p>
                    </div>
                  </div>

                  <div className="bg-muted/50 rounded-lg border p-4">
                    <div className="flex items-start gap-2">
                      <span className="bg-muted-foreground/20 text-muted-foreground flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold">
                        A
                      </span>
                      <p className="text-muted-foreground flex-1 text-sm leading-relaxed">
                        {response}
                      </p>
                    </div>
                  </div>
                </div>

                {index < questionCount - 1 && <Separator className="mt-4" />}
              </div>
            )
          )}
        </div>
      </CardContent>
    </Card>
  );
};
