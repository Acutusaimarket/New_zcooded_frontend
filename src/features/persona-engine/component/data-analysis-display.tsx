import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { usePersonaEngineStore } from "../hooks/persona-engine.hooks";

const formatValue = (value: string | number | null): string => {
  if (value === null) return "N/A";
  if (typeof value === "string" && value.length > 50) {
    return value.substring(0, 50) + "...";
  }
  return String(value);
};

const formatUniqueValues = (values: string[] | number[] | string): string => {
  if (typeof values === "string") return values;
  if (Array.isArray(values)) {
    if (values.length > 5) {
      return `${values.slice(0, 5).join(", ")}... (${values.length} total)`;
    }
    return values.join(", ");
  }
  return String(values);
};

export default function DataAnalysisDisplay() {
  const uploadData = usePersonaEngineStore((store) => store.uploadFileResponse);

  if (!uploadData?.analysis) {
    return null;
  }

  const { analysis } = uploadData;

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h1 className="text-primary mt-10 text-3xl font-bold tracking-tight">
          Insight Metrics
        </h1>
      </div>
      {/* Summary Cards */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Rows</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {analysis.total_rows.toLocaleString()}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Columns</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analysis.total_columns}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">File Name</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="truncate text-sm font-medium">
              {uploadData.filename}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Status</CardTitle>
          </CardHeader>
          <CardContent>
            <Badge variant={uploadData.success ? "default" : "destructive"}>
              {uploadData.success ? "Success" : "Failed"}
            </Badge>
          </CardContent>
        </Card>
      </div>

      {/* Tabs for different data views */}
      <Tabs defaultValue="sample_data" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="sample_data">Sample Data</TabsTrigger>
          <TabsTrigger value="column_types">Column Types</TabsTrigger>
          <TabsTrigger value="unique_values">Unique Values</TabsTrigger>
          <TabsTrigger value="missing_values">Missing Values</TabsTrigger>
        </TabsList>

        {/* Sample Data Tab */}
        <TabsContent value="sample_data" className="w-full space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Sample Data Preview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="max-w-3xl min-w-full rounded-md border">
                <div className="w-full overflow-x-auto">
                  <Table className="overflow-x-auto">
                    <TableHeader className="bg-muted/50 sticky top-0 z-10">
                      <TableRow>
                        {analysis.column_names.map((column) => (
                          <TableHead
                            key={column}
                            className="min-w-[120px] whitespace-nowrap"
                          >
                            {column}
                          </TableHead>
                        ))}
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {analysis.sample_data.slice(0, 5).map((row, index) => (
                        <TableRow key={index}>
                          {analysis.column_names.map((column) => (
                            <TableCell key={column} className="wrap-break-word">
                              {formatValue(row[column])}
                            </TableCell>
                          ))}
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
              {analysis.sample_data.length > 5 && (
                <p className="text-muted-foreground mt-2 text-sm">
                  Showing 5 of {analysis.sample_data.length} sample rows
                </p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Column Types Tab */}
        <TabsContent value="column_types">
          <Card>
            <CardHeader>
              <CardTitle>Column Data Types</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="max-w-3xl min-w-full rounded-md border">
                <div className="w-full overflow-x-auto">
                  <Table>
                    <TableHeader className="bg-muted/50 sticky top-0 z-10">
                      <TableRow>
                        <TableHead className="min-w-[120px] whitespace-nowrap">
                          Column Name
                        </TableHead>
                        <TableHead className="min-w-[120px] whitespace-nowrap">
                          Data Type
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {Object.entries(analysis.column_types).map(
                        ([column, type]) => (
                          <TableRow key={column}>
                            <TableCell className="font-medium">
                              {column}
                            </TableCell>
                            <TableCell>
                              <Badge variant="secondary">{type}</Badge>
                            </TableCell>
                          </TableRow>
                        )
                      )}
                    </TableBody>
                  </Table>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Unique Values Tab */}
        <TabsContent value="unique_values">
          <Card>
            <CardHeader>
              <CardTitle>Unique Values Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="max-w-3xl min-w-full rounded-md border">
                <div className="w-full overflow-x-auto">
                  <Table>
                    <TableHeader className="bg-muted/50 sticky top-0 z-10">
                      <TableRow>
                        <TableHead className="min-w-[120px] whitespace-nowrap">
                          Column Name
                        </TableHead>
                        <TableHead className="min-w-[120px] whitespace-nowrap">
                          Unique Values
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {Object.entries(analysis.unique_values).map(
                        ([column, values]) => (
                          <TableRow key={column}>
                            <TableCell className="font-medium">
                              {column}
                            </TableCell>
                            <TableCell>{formatUniqueValues(values)}</TableCell>
                          </TableRow>
                        )
                      )}
                    </TableBody>
                  </Table>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Missing Values Tab */}
        <TabsContent value="missing_values">
          <Card>
            <CardHeader>
              <CardTitle>Missing Values Count</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="max-w-3xl min-w-full rounded-md border">
                <div className="w-full overflow-x-auto">
                  <Table>
                    <TableHeader className="bg-muted/50 sticky top-0 z-10">
                      <TableRow>
                        <TableHead className="min-w-[120px] whitespace-nowrap">
                          Column Name
                        </TableHead>
                        <TableHead className="min-w-[120px] whitespace-nowrap">
                          Missing Values
                        </TableHead>
                        <TableHead className="min-w-[120px] whitespace-nowrap">
                          Percentage
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {Object.entries(analysis.missing_values)
                        .sort(([, a], [, b]) => b - a)
                        .map(([column, count]) => {
                          const percentage = (
                            (count / analysis.total_rows) *
                            100
                          ).toFixed(1);
                          return (
                            <TableRow key={column}>
                              <TableCell className="font-medium">
                                {column}
                              </TableCell>
                              <TableCell>
                                <Badge
                                  variant={
                                    count > 0 ? "destructive" : "default"
                                  }
                                >
                                  {count}
                                </Badge>
                              </TableCell>
                              <TableCell>{percentage}%</TableCell>
                            </TableRow>
                          );
                        })}
                    </TableBody>
                  </Table>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
