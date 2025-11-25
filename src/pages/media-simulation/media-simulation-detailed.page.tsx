import { useParams } from "react-router";

import { MediaSimulationDashboard } from "@/features/media-simulation/containers/MediaSimulationDashboard";

export default function MediaSimulationPage() {
  const { id } = useParams<{ id: string }>();

  if (!id) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900">
            Invalid Simulation ID
          </h1>
          <p className="mt-2 text-gray-600">
            Please provide a valid simulation ID in the URL.
          </p>
        </div>
      </div>
    );
  }

  return <MediaSimulationDashboard simulationId={id} />;
}
