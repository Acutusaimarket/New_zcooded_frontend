import React from "react";

import { BarChart3, Lightbulb } from "lucide-react";

const MediaSimulationEmbed: React.FC = () => {
  const metrics = [
    { label: "Engagement", value: 65.0, color: "bg-blue-500" },
    { label: "Clarity", value: 75.0, color: "#42BD00" },
    { label: "Conversion", value: 30.0, color: "bg-red-500" },
    { label: "Brand", value: 85.0, color: "bg-purple-500" },
  ];

  const radarData = [
    { label: "Message Clarity", value: 80 },
    { label: "Emotion", value: 70 },
    { label: "Brand Consistency", value: 90 },
    { label: "Production Quality", value: 60 },
    { label: "Engagement Score", value: 65 },
    { label: "Visual Appeal", value: 75 },
  ];

  return (
    <div
      className="w-full rounded-lg border border-gray-200 bg-white p-3 shadow-sm sm:p-6"
      style={{ fontFamily: "'Cormorant Garamond', sans-serif" }}
    >
      {/* Header */}
      <div className="mb-4 flex flex-col gap-3 sm:mb-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center space-x-2 sm:space-x-3">
          <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-blue-100 sm:h-8 sm:w-8">
            <BarChart3 className="h-3 w-3 text-blue-600 sm:h-5 sm:w-5" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-gray-900 sm:text-lg">
              Media Simulation
            </h3>
            <p className="text-xs text-gray-500 sm:text-sm">
              Media performance insights
            </p>
          </div>
        </div>
        <button
          className="flex w-full items-center justify-center space-x-2 rounded-lg px-3 py-2 text-xs font-medium text-white transition-colors sm:w-auto sm:justify-start sm:px-4 sm:text-sm"
          style={{ backgroundColor: "#42BD00" }}
          onMouseEnter={(e) =>
            ((e.target as HTMLButtonElement).style.backgroundColor = "#369900")
          }
          onMouseLeave={(e) =>
            ((e.target as HTMLButtonElement).style.backgroundColor = "#42BD00")
          }
        >
          <Lightbulb className="h-4 w-4" />
          <span>Recommendations</span>
        </button>
      </div>

      {/* Navigation Tabs */}
      <div className="mb-4 flex space-x-1 overflow-x-auto rounded-lg bg-gray-100 p-1">
        {[
          "Overview",
          "Analysis",
          "Comparison",
          "Persona",
          "Recommendations",
        ].map((tab) => (
          <button
            key={tab}
            className={`flex-shrink-0 rounded-md px-2 py-1.5 text-xs font-medium whitespace-nowrap transition-colors sm:px-3 sm:py-2 sm:text-sm ${
              tab === "Analysis"
                ? "bg-white text-gray-900 shadow-sm"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Analysis Summary Card */}
      <div className="mb-4 rounded-lg bg-gray-50 p-3 sm:mb-6 sm:p-4">
        <div className="mb-3 flex items-start justify-between">
          <div className="min-w-0 flex-1">
            <h4 className="truncate text-sm font-semibold text-gray-900 sm:text-base">
              Acutus-AI.jpg v/s Mudita
            </h4>
            <p className="text-xs text-gray-500">7 Oct 2025</p>
          </div>
          <div className="ml-2 flex-shrink-0 text-right">
            <p className="text-[10px] text-gray-500 sm:text-[11px]">60/100</p>
            <p className="text-[10px] text-gray-500 sm:text-[11px]">eMRRACY</p>
          </div>
        </div>

        {/* Metrics Row */}
        <div className="mb-3 grid grid-cols-2 gap-2 sm:grid-cols-4 sm:gap-4">
          {metrics.map((metric, index) => (
            <div key={index} className="text-center">
              <p className="text-lg font-semibold text-gray-900 sm:text-xl">
                {metric.value.toFixed(1)}
              </p>
              <p className="text-xs text-gray-500">{metric.label}</p>
            </div>
          ))}
        </div>

        {/* Details toggle removed per design */}
      </div>

      {/* KPI Breakdown Card */}
      <div className="rounded-lg border border-gray-200 bg-white p-3 sm:p-4">
        <h4 className="mb-3 text-sm font-semibold text-gray-900 sm:mb-4 sm:text-base">
          KPI Breakdown
        </h4>

        {/* Radar Chart Placeholder */}
        <div className="relative mb-3 h-48 w-full sm:mb-4 sm:h-64">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="relative h-32 w-32 sm:h-48 sm:w-48">
              {/* Enhanced Radar Chart */}
              <svg viewBox="0 0 200 200" className="h-full w-full">
                {/* Hexagonal grid */}
                {[1, 2, 3, 4, 5].map((level) => {
                  const r = (level / 5) * 80;
                  const points = Array.from({ length: 6 })
                    .map((_, i) => {
                      const a = i * 60 * (Math.PI / 180);
                      const px = 100 + r * Math.cos(a - Math.PI / 2);
                      const py = 100 + r * Math.sin(a - Math.PI / 2);
                      return `${px},${py}`;
                    })
                    .join(" ");
                  return (
                    <polygon
                      key={level}
                      points={points}
                      fill="none"
                      stroke="#e5e7eb"
                      strokeWidth="1"
                    />
                  );
                })}

                {/* Axes and labels */}
                {radarData.map((item, index) => {
                  const angle = index * 60 * (Math.PI / 180);
                  const x = 100 + 80 * Math.cos(angle - Math.PI / 2);
                  const y = 100 + 80 * Math.sin(angle - Math.PI / 2);
                  const lx = 100 + 92 * Math.cos(angle - Math.PI / 2);
                  const ly = 100 + 92 * Math.sin(angle - Math.PI / 2);
                  const anchor =
                    Math.cos(angle - Math.PI / 2) > 0.05
                      ? "start"
                      : Math.cos(angle - Math.PI / 2) < -0.05
                        ? "end"
                        : "middle";
                  return (
                    <g key={index}>
                      <line
                        x1="100"
                        y1="100"
                        x2={x}
                        y2={y}
                        stroke="#e5e7eb"
                        strokeWidth="1"
                      />
                      <text
                        x={lx}
                        y={ly}
                        textAnchor={anchor}
                        dominantBaseline="middle"
                        fontSize="9"
                        fill="#6b7280"
                      >
                        {item.label}
                      </text>
                    </g>
                  );
                })}

                {/* Data area with point markers */}
                {(() => {
                  const pts = radarData.map((item, index) => {
                    const angle = index * 60 * (Math.PI / 180);
                    const radius = (item.value / 100) * 80;
                    const dx = 100 + radius * Math.cos(angle - Math.PI / 2);
                    const dy = 100 + radius * Math.sin(angle - Math.PI / 2);
                    return { dx, dy };
                  });
                  return (
                    <g>
                      <polygon
                        points={pts.map((p) => `${p.dx},${p.dy}`).join(" ")}
                        fill="rgba(66, 189, 0, 0.15)"
                        stroke="#42BD00"
                        strokeWidth="2.5"
                      />
                      {pts.map((p, i) => (
                        <circle
                          key={i}
                          cx={p.dx}
                          cy={p.dy}
                          r="4"
                          fill="#42BD00"
                          stroke="#ffffff"
                          strokeWidth="2"
                        />
                      ))}
                    </g>
                  );
                })()}
              </svg>
            </div>
          </div>
        </div>

        {/* Legend */}
        <div className="flex items-center justify-center space-x-4">
          <div className="flex items-center space-x-2">
            <div
              className="h-3 w-3 rounded"
              style={{ backgroundColor: "#42BD00" }}
            ></div>
            <span className="text-sm text-gray-600">KPI Score</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MediaSimulationEmbed;
