import { useState } from "react";

import { Calculator, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router";

import { CreditCalculator } from "@/lib/credit-calculator";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const CreditCalculatorPage = () => {
  const navigate = useNavigate();

  // Media Simulation
  const [mediaPersonaCount, setMediaPersonaCount] = useState<number>(1);
  const [mediaEnvironmentCount, setMediaEnvironmentCount] = useState<number>(1);
  const [mediaFileSizes, setMediaFileSizes] = useState<string>("");
  const [mediaResult, setMediaResult] = useState<number | null>(null);

  // Concept Simulation
  const [conceptPersonaCount, setConceptPersonaCount] = useState<number>(1);
  const [conceptEnvironmentCount, setConceptEnvironmentCount] =
    useState<number>(1);
  const [conceptResult, setConceptResult] = useState<number | null>(null);

  // OCR
  const [ocrFileSizes, setOcrFileSizes] = useState<string>("");
  const [ocrResult, setOcrResult] = useState<number | null>(null);

  // Persona Clustering
  const [clusteringFileSize, setClusteringFileSize] = useState<string>("");
  const [clusteringResult, setClusteringResult] = useState<number | null>(null);

  // Persona Chat
  const [chatPersonaCount, setChatPersonaCount] = useState<number>(1);
  const [isFirstGeneration, setIsFirstGeneration] = useState<boolean>(true);
  const [chatResult, setChatResult] = useState<number | null>(null);

  const parseFileSizes = (input: string): number[] => {
    return input
      .split(",")
      .map((size) => parseFloat(size.trim()))
      .filter((size) => !isNaN(size) && size > 0)
      .map((size) => size * 1024 * 1024); // Convert MB to bytes
  };

  const parseFileSizeMB = (input: string): number => {
    const size = parseFloat(input.trim());
    if (isNaN(size) || size <= 0) return 0;
    return size * 1024 * 1024; // Convert MB to bytes
  };

  const calculateMediaSimulation = () => {
    const fileSizesBytes = parseFileSizes(mediaFileSizes);
    const result = CreditCalculator.calculateMediaSimulationCredits(
      mediaPersonaCount,
      fileSizesBytes,
      mediaEnvironmentCount
    );
    setMediaResult(result);
  };

  const calculateConceptSimulation = () => {
    const result = CreditCalculator.calculateConceptSimulationCredits(
      conceptPersonaCount,
      conceptEnvironmentCount
    );
    setConceptResult(result);
  };

  const calculateOcr = () => {
    const fileSizesBytes = parseFileSizes(ocrFileSizes);
    const result = CreditCalculator.calculateOcrCredits(fileSizesBytes);
    setOcrResult(result);
  };

  const calculatePersonaClustering = () => {
    const fileSizeBytes = parseFileSizeMB(clusteringFileSize);
    const result =
      CreditCalculator.calculatePersonaClusteringCredits(fileSizeBytes);
    setClusteringResult(result);
  };

  const calculatePersonaChat = () => {
    const result = CreditCalculator.calculatePersonaChatCredits(
      chatPersonaCount,
      isFirstGeneration
    );
    setChatResult(result);
  };

  return (
    <div
      className="min-h-screen overflow-x-hidden px-4 py-8 sm:px-6 sm:py-12 md:py-16"
      style={{
        backgroundColor: "#F8FAF7",
        fontFamily: "Alina",
      }}
    >
      <div className="mx-auto max-w-4xl">
        <div className="mb-8 flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate(-1)}
            className="h-8"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
          <div className="flex items-center gap-3">
            <Calculator className="h-6 w-6 text-[#42BD00]" />
            <h1 className="text-2xl font-bold sm:text-3xl md:text-4xl">
              Credit <span className="text-[#42BD00]">Calculator</span>
            </h1>
          </div>
        </div>

        <p className="mb-6 text-sm leading-relaxed text-gray-700 sm:text-base">
          Calculate the credits required for different operations. Enter the
          details below to get an estimate.
        </p>

        <Tabs defaultValue="media" className="w-full">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="media">Media</TabsTrigger>
            <TabsTrigger value="concept">Concept</TabsTrigger>
            <TabsTrigger value="ocr">OCR</TabsTrigger>
            <TabsTrigger value="clustering">Clustering</TabsTrigger>
            <TabsTrigger value="chat">Chat</TabsTrigger>
          </TabsList>

          {/* Media Simulation */}
          <TabsContent value="media">
            <Card>
              <CardHeader>
                <CardTitle>Media Simulation</CardTitle>
                <CardDescription>
                  Calculate credits for media simulation based on personas,
                  environments, and media file sizes.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="media-personas">Number of Personas</Label>
                  <Input
                    id="media-personas"
                    type="number"
                    min="1"
                    value={mediaPersonaCount}
                    onChange={(e) =>
                      setMediaPersonaCount(parseInt(e.target.value) || 1)
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="media-environments">
                    Number of Environments
                  </Label>
                  <Input
                    id="media-environments"
                    type="number"
                    min="1"
                    value={mediaEnvironmentCount}
                    onChange={(e) =>
                      setMediaEnvironmentCount(parseInt(e.target.value) || 1)
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="media-files">
                    Media File Sizes (MB, comma-separated)
                  </Label>
                  <Input
                    id="media-files"
                    type="text"
                    placeholder="e.g., 5, 10, 15"
                    value={mediaFileSizes}
                    onChange={(e) => setMediaFileSizes(e.target.value)}
                  />
                  <p className="text-xs text-gray-500">
                    Enter file sizes in MB, separated by commas
                  </p>
                </div>
                <Button
                  onClick={calculateMediaSimulation}
                  className="w-full bg-[#42BD00] hover:bg-[#369900]"
                >
                  Calculate
                </Button>
                {mediaResult !== null && (
                  <div className="rounded-lg bg-green-50 p-4">
                    <p className="text-sm font-medium text-gray-700">
                      Estimated Credits:
                    </p>
                    <p className="text-2xl font-bold text-[#42BD00]">
                      {mediaResult.toFixed(2)}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Concept Simulation */}
          <TabsContent value="concept">
            <Card>
              <CardHeader>
                <CardTitle>Concept Simulation</CardTitle>
                <CardDescription>
                  Calculate credits for concept simulation based on personas and
                  environments.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="concept-personas">Number of Personas</Label>
                  <Input
                    id="concept-personas"
                    type="number"
                    min="1"
                    value={conceptPersonaCount}
                    onChange={(e) =>
                      setConceptPersonaCount(parseInt(e.target.value) || 1)
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="concept-environments">
                    Number of Environments
                  </Label>
                  <Input
                    id="concept-environments"
                    type="number"
                    min="1"
                    value={conceptEnvironmentCount}
                    onChange={(e) =>
                      setConceptEnvironmentCount(parseInt(e.target.value) || 1)
                    }
                  />
                </div>
                <Button
                  onClick={calculateConceptSimulation}
                  className="w-full bg-[#42BD00] hover:bg-[#369900]"
                >
                  Calculate
                </Button>
                {conceptResult !== null && (
                  <div className="rounded-lg bg-green-50 p-4">
                    <p className="text-sm font-medium text-gray-700">
                      Estimated Credits:
                    </p>
                    <p className="text-2xl font-bold text-[#42BD00]">
                      {conceptResult.toFixed(2)}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* OCR */}
          <TabsContent value="ocr">
            <Card>
              <CardHeader>
                <CardTitle>OCR Credits</CardTitle>
                <CardDescription>
                  Calculate credits for OCR based on image file sizes.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="ocr-files">
                    Image File Sizes (MB, comma-separated)
                  </Label>
                  <Input
                    id="ocr-files"
                    type="text"
                    placeholder="e.g., 2, 3, 5"
                    value={ocrFileSizes}
                    onChange={(e) => setOcrFileSizes(e.target.value)}
                  />
                  <p className="text-xs text-gray-500">
                    Enter file sizes in MB, separated by commas
                  </p>
                </div>
                <Button
                  onClick={calculateOcr}
                  className="w-full bg-[#42BD00] hover:bg-[#369900]"
                >
                  Calculate
                </Button>
                {ocrResult !== null && (
                  <div className="rounded-lg bg-green-50 p-4">
                    <p className="text-sm font-medium text-gray-700">
                      Estimated Credits:
                    </p>
                    <p className="text-2xl font-bold text-[#42BD00]">
                      {ocrResult.toFixed(2)}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Persona Clustering */}
          <TabsContent value="clustering">
            <Card>
              <CardHeader>
                <CardTitle>Persona With Data File</CardTitle>
                <CardDescription>
                  Calculate credits for persona clustering based on data file
                  size.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="clustering-file">Data File Size (MB)</Label>
                  <Input
                    id="clustering-file"
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder="e.g., 10"
                    value={clusteringFileSize}
                    onChange={(e) => setClusteringFileSize(e.target.value)}
                  />
                </div>
                <Button
                  onClick={calculatePersonaClustering}
                  className="w-full bg-[#42BD00] hover:bg-[#369900]"
                >
                  Calculate
                </Button>
                {clusteringResult !== null && (
                  <div className="rounded-lg bg-green-50 p-4">
                    <p className="text-sm font-medium text-gray-700">
                      Estimated Credits:
                    </p>
                    <p className="text-2xl font-bold text-[#42BD00]">
                      {clusteringResult.toFixed(2)}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Persona Chat */}
          <TabsContent value="chat">
            <Card>
              <CardHeader>
                <CardTitle>Persona Chat</CardTitle>
                <CardDescription>
                  Calculate credits for persona chat based on number of
                  personas and generation type.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="chat-personas">Number of Personas</Label>
                  <Input
                    id="chat-personas"
                    type="number"
                    min="1"
                    value={chatPersonaCount}
                    onChange={(e) =>
                      setChatPersonaCount(parseInt(e.target.value) || 1)
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="chat-generation">Generation Type</Label>
                  <Select
                    value={isFirstGeneration ? "first" : "subsequent"}
                    onValueChange={(value) =>
                      setIsFirstGeneration(value === "first")
                    }
                  >
                    <SelectTrigger id="chat-generation">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="first">First Generation</SelectItem>
                      <SelectItem value="subsequent">
                        Subsequent Message
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button
                  onClick={calculatePersonaChat}
                  className="w-full bg-[#42BD00] hover:bg-[#369900]"
                >
                  Calculate
                </Button>
                {chatResult !== null && (
                  <div className="rounded-lg bg-green-50 p-4">
                    <p className="text-sm font-medium text-gray-700">
                      Estimated Credits:
                    </p>
                    <p className="text-2xl font-bold text-[#42BD00]">
                      {chatResult.toFixed(2)}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default CreditCalculatorPage;

