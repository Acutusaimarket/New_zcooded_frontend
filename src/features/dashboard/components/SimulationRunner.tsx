import { Download, Play, ThumbsDown, ThumbsUp } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export const SimulationRunner = () => {
  return (
    <Card className="mx-auto w-full max-w-3xl border border-gray-100 bg-white/60 backdrop-blur-sm">
      <CardContent className="p-8">
        {/* Main Run Button */}
        <div className="space-y-6">
          <div className="text-center">
            <h3 className="mb-2 text-lg font-medium text-gray-900">
              Run A/B/C Simulation
            </h3>
            <p className="text-sm text-gray-500">Execute behavioral analysis</p>
          </div>

          <Button
            size="lg"
            className="mx-auto flex h-14 w-full max-w-sm bg-gray-900 text-white hover:bg-gray-800"
            // onClick={() => console.log("Run A/B/C Simulation")}
          >
            <Play className="mr-2 h-5 w-5" />
            Run Simulation
          </Button>

          {/* Action Icons - Minimal Design */}
          <div className="flex items-center justify-center space-x-8 pt-4">
            <Button
              variant="ghost"
              size="sm"
              className="h-10 w-10 rounded-full p-0 hover:bg-gray-50"
              // onClick={() => console.log("Thumbs up")}
            >
              <ThumbsUp className="h-4 w-4 text-gray-400 hover:text-green-500" />
            </Button>

            <Button
              variant="ghost"
              size="sm"
              className="h-10 w-10 rounded-full p-0 hover:bg-gray-50"
              // onClick={() => console.log("Thumbs down")}
            >
              <ThumbsDown className="h-4 w-4 text-gray-400 hover:text-red-500" />
            </Button>

            <Button
              variant="ghost"
              size="sm"
              className="h-10 w-10 rounded-full p-0 hover:bg-gray-50"
              // onClick={() => console.log("Download")}
            >
              <Download className="h-4 w-4 text-gray-400 hover:text-blue-500" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
