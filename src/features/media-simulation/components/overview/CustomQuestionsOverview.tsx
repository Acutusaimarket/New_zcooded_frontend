import { HelpCircle } from "lucide-react";
import ReactMarkdown from "react-markdown";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

import type { MediaSimulationData } from "../../types/media-simulation.types";

interface CustomQuestionsOverviewProps {
  data: MediaSimulationData;
  className?: string;
}

export const CustomQuestionsOverview = ({
  data,
  className,
}: CustomQuestionsOverviewProps) => {
  // Check if we have custom questions
  if (!data.custom_questions || data.custom_questions.length === 0) {
    return null;
  }

  // Organize responses by question across all analyses
  const responsesByQuestion = data.custom_questions.reduce(
    (acc, question) => {
      acc[question] = [];
      return acc;
    },
    {} as Record<string, Array<{ personaName: string; response: string }>>
  );

  // Collect all responses for each question
  data.individual_analysis.forEach((analysis) => {
    if (analysis.custom_questions_responses) {
      const persona = data.participated_personas.find(
        (p) => p._id === analysis.persona_id
      );
      const personaName = persona?.name || "Unknown Persona";

      Object.entries(analysis.custom_questions_responses).forEach(
        ([question, response]) => {
          if (responsesByQuestion[question]) {
            responsesByQuestion[question].push({
              personaName,
              response,
            });
          }
        }
      );
    }
  });

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <HelpCircle className="h-5 w-5" />
          Custom Questions Analysis
          <Badge variant="secondary" className="ml-2">
            {data.custom_questions.length}{" "}
            {data.custom_questions.length === 1 ? "Question" : "Questions"}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {data.custom_questions.map((question, questionIndex) => {
            const responses = responsesByQuestion[question] || [];

            return (
              <div key={questionIndex}>
                <div className="space-y-4">
                  {/* Question */}
                  <div className="bg-primary/5 border-primary/20 rounded-lg border-l-4 p-4">
                    <div className="flex items-start gap-3">
                      <span className="bg-primary/20 text-primary flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-sm font-bold">
                        Q{questionIndex + 1}
                      </span>
                      <div className="flex-1">
                        <p className="text-primary text-base leading-relaxed font-semibold">
                          {question}
                        </p>
                        <p className="text-muted-foreground mt-1 text-xs">
                          {responses.length}{" "}
                          {responses.length === 1 ? "response" : "responses"}{" "}
                          collected
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Responses from all personas */}
                  <div className="ml-10 space-y-3">
                    {responses.length > 0 ? (
                      responses.map((responseItem, responseIndex) => (
                        <div
                          key={responseIndex}
                          className="bg-muted/50 rounded-lg border p-4"
                        >
                          <div className="mb-3 flex items-center gap-2">
                            <Badge variant="outline" className="text-xs">
                              {responseItem.personaName}
                            </Badge>
                          </div>
                          <div className="prose prose-sm dark:prose-invert prose-headings:text-foreground prose-p:text-muted-foreground prose-strong:text-foreground prose-li:text-muted-foreground prose-code:text-foreground prose-table:text-muted-foreground prose-th:text-foreground prose-blockquote:border-primary/50 prose-blockquote:text-muted-foreground prose-hr:border-border max-w-none">
                            <ReactMarkdown>
                              {responseItem.response}
                            </ReactMarkdown>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-muted-foreground rounded-lg border border-dashed p-4 text-center text-sm">
                        No responses collected for this question
                      </div>
                    )}
                  </div>
                </div>

                {questionIndex < (data.custom_questions?.length ?? 0) - 1 && (
                  <Separator className="mt-6" />
                )}
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};
