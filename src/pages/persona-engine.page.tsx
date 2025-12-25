import { parseAsStringEnum, useQueryState } from "nuqs";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import CreatePersonaLLM from "@/features/persona-engine/component/create-persona-llm";
import DataAnalysisDisplay from "@/features/persona-engine/component/data-analysis-display";
import PersonaEngineFileUploader from "@/features/persona-engine/component/file-uploader";
import GeneratePersona from "@/features/persona-engine/component/generate-persona";
import PersonaHistory from "@/features/persona-engine/component/persona-history";
import { PersonaEngineProvider } from "@/features/persona-engine/context/persona-engine.context";

const PersonaEnginePage = () => {
  const [activeTab, setActiveTab] = useQueryState(
    "tab",
    parseAsStringEnum(["upload-data", "history", "create-persona"]).withDefault(
      "upload-data"
    )
  );
  const [historyTab, setHistoryTab] = useQueryState(
    "history-tab",
    parseAsStringEnum(["active", "completed", "failed", "pending"]).withDefault(
      "active"
    )
  );

  return (
    <div className="container mx-auto space-y-6">
      {/* Header Section */}
      {activeTab !== "history" && (
        <div className="mt-4 space-y-1">
          <h1 className="text-primary text-3xl font-bold tracking-tight">
            Persona Engine
          </h1>
          <p className="text-muted-foreground text-sm">
            Upload your data files to automatically generate detailed personas
            based on your audience insights and behavioral patterns.
          </p>
        </div>
      )}
      <Tabs
        onValueChange={(value) =>
          setActiveTab(value as "upload-data" | "history" | "create-persona")
        }
        value={activeTab}
      >
        <TabsList>
          <TabsTrigger value="upload-data">Upload Data</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
          {/* <TabsTrigger value="create-persona">Create Persona</TabsTrigger> */}
        </TabsList>
        <TabsContent value="upload-data">
          <PersonaEngineProvider>
            {/* File Uploader */}
            <PersonaEngineFileUploader />

            {/* Data Analysis Display */}
            <div id="analysis-data-preview">
              <DataAnalysisDisplay />
            </div>

            <GeneratePersona
              onGenerationSuccess={(data) => {
                // Navigate only after successful response
                if (data?.success === true) {
                  setActiveTab("history");
                  setHistoryTab("active");
                }
              }}
            />
          </PersonaEngineProvider>
        </TabsContent>
        <TabsContent value="history">
          <PersonaHistory
            activeTab={
              historyTab as "active" | "completed" | "failed" | "pending"
            }
            onTabChange={(tab) => setHistoryTab(tab)}
          />
        </TabsContent>
        <TabsContent value="create-persona">
          <CreatePersonaLLM />
        </TabsContent>
      </Tabs>
      {/* Persona Cards Display - shown only when personas are generated */}
      {/* {generatedPersonas && <PersonaCards />} */}
    </div>
  );
};

export default PersonaEnginePage;
