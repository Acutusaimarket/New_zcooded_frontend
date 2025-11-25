import React from "react";

import {
  Edit,
  Eye,
  Filter,
  MoreVertical,
  Plus,
  Search,
  Trash2,
  Users,
} from "lucide-react";

const PersonaStudioEmbed: React.FC = () => {
  const personas = [
    {
      id: 1,
      name: "Tech-Savvy Gen Z",
      description: "Urban, college-educated, early adopters",
      tags: ["Tech", "Gaming", "Social Media"],
      status: "Active",
      lastUpdated: "2 hours ago",
      icon: "👤",
      color: "bg-purple-100",
    },
    {
      id: 2,
      name: "Eco-Conscious Millennial",
      description: "Environmentally aware, sustainable lifestyle",
      tags: ["Sustainability", "Health", "Fashion"],
      status: "Active",
      lastUpdated: "1 day ago",
      icon: "🌱",
      color: "bg-green-100",
    },
  ];

  return (
    <div
      className="w-full rounded-lg border border-gray-200 bg-white p-3 shadow-sm sm:p-6"
      style={{ fontFamily: "'Cormorant Garamond', sans-serif" }}
    >
      {/* Header */}
      <div className="mb-4 flex flex-col gap-3 sm:mb-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center space-x-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-100">
            <Users className="h-5 w-5 text-blue-600" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-gray-900 sm:text-lg">
              Persona Studio
            </h3>
            <p className="text-xs text-gray-500 sm:text-sm">
              Manage your digital personas
            </p>
          </div>
        </div>
        <button
          className="w-full rounded-lg px-3 py-2 text-xs font-medium text-white transition-colors sm:w-auto sm:px-4 sm:text-sm"
          style={{ backgroundColor: "#42BD00" }}
          onMouseEnter={(e) =>
            ((e.target as HTMLButtonElement).style.backgroundColor = "#369900")
          }
          onMouseLeave={(e) =>
            ((e.target as HTMLButtonElement).style.backgroundColor = "#42BD00")
          }
        >
          <div className="flex items-center space-x-2">
            <Plus className="h-4 w-4" />
            <span>Create Persona</span>
          </div>
        </button>
      </div>

      {/* Search and Filter */}
      <div className="mb-4 flex flex-col gap-3 sm:mb-6 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform text-gray-400" />
          <input
            type="text"
            placeholder="Search personas..."
            className="w-full rounded-lg border border-gray-300 py-2 pr-4 pl-10 text-sm focus:border-transparent focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <button className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-700 transition-colors hover:bg-gray-50 sm:w-auto sm:px-4">
          <div className="flex items-center justify-center space-x-2 sm:justify-start">
            <Filter className="h-4 w-4" />
            <span>Filter</span>
          </div>
        </button>
      </div>

      {/* Summary Cards */}
      <div className="mb-4 grid grid-cols-2 gap-2 sm:mb-6 sm:gap-4">
        <div className="rounded-lg bg-gray-50 p-3 sm:p-4">
          <div className="flex items-center space-x-2 sm:space-x-3">
            <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-blue-100 sm:h-8 sm:w-8">
              <Users className="h-3 w-3 text-blue-600 sm:h-4 sm:w-4" />
            </div>
            <div>
              <p className="text-xs text-gray-500 sm:text-sm">Total Personas</p>
              <p className="text-lg font-bold text-gray-900 sm:text-2xl">2</p>
            </div>
          </div>
        </div>
        <div className="rounded-lg bg-gray-50 p-3 sm:p-4">
          <div className="flex items-center space-x-2 sm:space-x-3">
            <div
              className="h-2 w-2 rounded-full"
              style={{ backgroundColor: "#42BD00" }}
            ></div>
            <div>
              <p className="text-xs text-gray-500 sm:text-sm">Active</p>
              <p className="text-lg font-bold text-gray-900 sm:text-2xl">2</p>
            </div>
          </div>
        </div>
      </div>

      {/* Persona List */}
      <div className="space-y-3 sm:space-y-4">
        {personas.map((persona) => (
          <div
            key={persona.id}
            className="rounded-lg border border-gray-200 p-3 transition-shadow hover:shadow-md sm:p-4"
          >
            <div className="mb-3 flex items-start justify-between sm:mb-0">
              <div className="flex min-w-0 flex-1 items-start space-x-2 sm:space-x-3">
                <div
                  className={`h-8 w-8 sm:h-10 sm:w-10 ${persona.color} flex flex-shrink-0 items-center justify-center rounded-lg text-sm sm:text-lg`}
                >
                  {persona.icon}
                </div>
                <div className="min-w-0 flex-1">
                  <h4 className="mb-1 truncate text-sm font-medium text-gray-900 sm:text-base">
                    {persona.name}
                  </h4>
                  <p className="mb-2 line-clamp-2 text-xs text-gray-600 sm:text-sm">
                    {persona.description}
                  </p>
                  <div className="mb-2 flex flex-wrap gap-1">
                    {persona.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="rounded-full border border-gray-200 bg-white px-1.5 py-0.5 text-xs text-gray-700 sm:px-2"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  <span
                    className="inline-flex rounded-full px-1.5 py-0.5 text-xs font-medium sm:px-2"
                    style={{
                      backgroundColor: "rgba(66, 189, 0, 0.1)",
                      color: "#42BD00",
                    }}
                  >
                    {persona.status}
                  </span>
                </div>
              </div>
              <div className="flex flex-shrink-0 items-start space-x-1 sm:space-x-2">
                <p className="hidden text-xs text-gray-500 sm:block">
                  {persona.lastUpdated}
                </p>
                <button className="rounded p-1 hover:bg-gray-100">
                  <MoreVertical className="h-4 w-4 text-gray-400" />
                </button>
              </div>
            </div>
            <div className="mt-3 flex items-center justify-between sm:mt-4">
              <div className="flex items-center space-x-1 sm:space-x-2">
                <button className="inline-flex items-center space-x-1 rounded-md border border-gray-300 px-2 py-1 text-xs text-gray-700 transition-colors hover:bg-gray-50 sm:px-3 sm:text-sm">
                  <Eye className="h-3 w-3" />
                  <span className="hidden sm:inline">View</span>
                </button>
                <button className="inline-flex items-center space-x-1 rounded-md border border-gray-300 px-2 py-1 text-xs text-gray-700 transition-colors hover:bg-gray-50 sm:px-3 sm:text-sm">
                  <Edit className="h-3 w-3" />
                  <span className="hidden sm:inline">Edit</span>
                </button>
              </div>
              <button className="rounded-full border border-red-200 p-1.5 text-red-600 transition-colors hover:bg-red-50 sm:p-2">
                <Trash2 className="h-3 w-3 sm:h-4 sm:w-4" />
              </button>
            </div>
            <div className="mt-2 sm:hidden">
              <p className="text-xs text-gray-500">{persona.lastUpdated}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PersonaStudioEmbed;
