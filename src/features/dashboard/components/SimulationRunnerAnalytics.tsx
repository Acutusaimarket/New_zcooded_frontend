import {
  BarChart3,
  Clock,
  Download,
  Play,
  Settings,
  TrendingUp,
  Users,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const SimulationRunnerAnalytics = () => {
  return (
    <div className="space-y-6">
      {/* Main Control Panel */}
      <Card className="border border-gray-200 bg-white">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-xl font-semibold text-gray-900">
                Simulation Control Center
              </CardTitle>
              <p className="mt-1 text-sm text-gray-500">
                Monitor and execute behavioral analysis simulations
              </p>
            </div>
            <Badge variant="outline" className="bg-green-50 text-green-700">
              System Ready
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Quick Stats Row */}
          <div className="grid grid-cols-4 gap-4">
            <div className="rounded-lg bg-blue-50 p-3 text-center">
              <div className="text-2xl font-bold text-blue-600">847</div>
              <div className="text-xs text-blue-600">Total Runs</div>
            </div>
            <div className="rounded-lg bg-green-50 p-3 text-center">
              <div className="text-2xl font-bold text-green-600">94.2%</div>
              <div className="text-xs text-green-600">Success Rate</div>
            </div>
            <div className="rounded-lg bg-purple-50 p-3 text-center">
              <div className="text-2xl font-bold text-purple-600">2.3s</div>
              <div className="text-xs text-purple-600">Avg Duration</div>
            </div>
            <div className="rounded-lg bg-orange-50 p-3 text-center">
              <div className="text-2xl font-bold text-orange-600">15k</div>
              <div className="text-xs text-orange-600">Data Points</div>
            </div>
          </div>

          {/* Main Action Area */}
          <div className="flex items-center space-x-4">
            <Button
              size="lg"
              className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800"
              // onClick={() => console.log("Run A/B/C Simulation")}
            >
              <Play className="mr-2 h-5 w-5" />
              Run A/B/C Simulation
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="border-gray-300"
              // onClick={() => console.log("Advanced Settings")}
            >
              <Settings className="mr-2 h-4 w-4" />
              Configure
            </Button>
          </div>

          {/* Advanced Controls */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Simulation Type
              </label>
              <select className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500">
                <option>A/B/C Analysis</option>
                <option>Cohort Analysis</option>
                <option>Funnel Analysis</option>
                <option>Custom Scenario</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Sample Size
              </label>
              <select className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500">
                <option>1,000 users</option>
                <option>5,000 users</option>
                <option>10,000 users</option>
                <option>Custom</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Performance Analytics */}
      <Card className="border border-gray-200 bg-white">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center text-lg font-semibold text-gray-900">
            <BarChart3 className="mr-2 h-5 w-5 text-blue-600" />
            Performance Analytics
          </CardTitle>
        </CardHeader>
        <CardContent>
          {/* Simulated Chart Area */}
          <div className="space-y-4">
            <div className="h-32 rounded-lg bg-gradient-to-r from-blue-50 to-purple-50 p-4">
              <div className="flex h-full items-end justify-between space-x-2">
                {[65, 45, 78, 52, 91, 67, 83, 59, 74, 88, 95, 72].map(
                  (height, index) => (
                    <div
                      key={index}
                      className="w-6 rounded-t bg-gradient-to-t from-blue-400 to-blue-600"
                      style={{ height: `${height}%` }}
                    />
                  )
                )}
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-lg font-semibold text-gray-900">
                  ↗ 23%
                </div>
                <div className="text-xs text-green-600">Conversion Rate</div>
              </div>
              <div>
                <div className="text-lg font-semibold text-gray-900">1.8s</div>
                <div className="text-xs text-blue-600">Response Time</div>
              </div>
              <div>
                <div className="text-lg font-semibold text-gray-900">99.1%</div>
                <div className="text-xs text-purple-600">Accuracy</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recent Results */}
      <Card className="border border-gray-200 bg-white">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center text-lg font-semibold text-gray-900">
            <Clock className="mr-2 h-5 w-5 text-green-600" />
            Recent Simulation Results
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[
              {
                id: "SIM-2024-001",
                type: "A/B/C Analysis",
                status: "completed",
                duration: "2.3s",
                accuracy: "96.2%",
                timestamp: "2 minutes ago",
              },
              {
                id: "SIM-2024-002",
                type: "Cohort Analysis",
                status: "completed",
                duration: "1.8s",
                accuracy: "94.7%",
                timestamp: "15 minutes ago",
              },
              {
                id: "SIM-2024-003",
                type: "Funnel Analysis",
                status: "running",
                duration: "1.2s",
                accuracy: "—",
                timestamp: "Just now",
              },
            ].map((result) => (
              <div
                key={result.id}
                className="flex items-center justify-between rounded-lg border border-gray-100 p-3 hover:bg-gray-50"
              >
                <div className="flex items-center space-x-3">
                  <div
                    className={`h-2 w-2 rounded-full ${
                      result.status === "completed"
                        ? "bg-green-500"
                        : "animate-pulse bg-blue-500"
                    }`}
                  />
                  <div>
                    <div className="font-medium text-gray-900">{result.id}</div>
                    <div className="text-sm text-gray-500">{result.type}</div>
                  </div>
                </div>
                <div className="flex items-center space-x-4 text-sm">
                  <div className="text-center">
                    <div className="font-medium text-gray-900">
                      {result.duration}
                    </div>
                    <div className="text-gray-500">Duration</div>
                  </div>
                  <div className="text-center">
                    <div className="font-medium text-gray-900">
                      {result.accuracy}
                    </div>
                    <div className="text-gray-500">Accuracy</div>
                  </div>
                  <div className="text-center">
                    <div className="text-gray-500">{result.timestamp}</div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0"
                    // onClick={() => console.log(`Download ${result.id}`)}
                  >
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quick Insights */}
      <div className="grid grid-cols-2 gap-4">
        <Card className="border border-gray-200 bg-white">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="rounded-full bg-green-100 p-2">
                <TrendingUp className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <div className="font-semibold text-gray-900">
                  Performance Improved
                </div>
                <div className="text-sm text-gray-500">
                  +15% efficiency over last week
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border border-gray-200 bg-white">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="rounded-full bg-blue-100 p-2">
                <Users className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <div className="font-semibold text-gray-900">
                  New Data Available
                </div>
                <div className="text-sm text-gray-500">
                  2.3k new user interactions
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
