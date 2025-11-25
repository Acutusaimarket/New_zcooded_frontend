// import { MessageSquare } from "lucide-react";
// import { Badge } from "@/components/ui/badge";
import { Response } from "@/components/ai-elements/response";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

import type { MediaSimulationData } from "../../types/media-simulation.types";

interface GeneralCustomResponsesProps {
  data: MediaSimulationData;
  className?: string;
}

export const GeneralCustomResponses = ({
  data,
  className,
}: GeneralCustomResponsesProps) => {
  // Check if we have general custom questions responses
  if (
    !data.custom_questions_responses ||
    Object.keys(data.custom_questions_responses).length === 0
  ) {
    return null;
  }

  const responseCount = Object.keys(data.custom_questions_responses).length;

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {/* <MessageSquare className="h-5 w-5" /> */}
          {/* General Custom Questions & Responses */}
          {/* <Badge variant="secondary" className="ml-2">
            {responseCount} {responseCount === 1 ? "Response" : "Responses"}
          </Badge> */}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {Object.entries(data.custom_questions_responses).map(
            ([question, response], index) => (
              <div key={index}>
                <div className="space-y-3">
                  {/* Question */}
                  <div className="rounded-lg border-l-4 border-blue-200 bg-blue-50 p-4 dark:border-blue-900 dark:bg-blue-950/20">
                    <div className="flex items-start gap-3">
                      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-blue-200 text-sm font-bold text-blue-700 dark:bg-blue-900 dark:text-blue-300">
                        Q{index + 1}
                      </span>
                      <div className="flex-1">
                        <p className="text-base leading-relaxed font-semibold text-blue-900 dark:text-blue-100">
                          {question}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Response */}
                  <div className="bg-muted/50 rounded-lg border p-6">
                    <div className="prose prose-sm dark:prose-invert prose-headings:text-foreground prose-p:text-muted-foreground prose-strong:text-foreground prose-li:text-muted-foreground prose-code:text-foreground prose-table:text-muted-foreground prose-th:text-foreground prose-blockquote:border-primary/50 prose-blockquote:text-muted-foreground prose-hr:border-border max-w-none">
                      {/* <ReactMarkdown remarkPlugins={[remarkGfm]}>
                        {response}
                      </ReactMarkdown> */}
                      <Response isAnimating={false}>
                        {response.replace(/\\n/g, "\n")}
                      </Response>
                    </div>
                  </div>
                </div>

                {index < responseCount - 1 && <Separator className="mt-4" />}
              </div>
            )
          )}
        </div>
      </CardContent>
    </Card>
  );
};
