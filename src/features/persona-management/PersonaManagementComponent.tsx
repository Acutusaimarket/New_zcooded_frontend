import { Card } from "@/components/ui/card";

const PersonaManagementComponent = () => {
  return (
    <div className="p-6">
      <Card className="mb-6 p-6">
        <h2 className="mb-2 text-2xl font-bold">👥 Persona Management</h2>
        <p className="mb-4 text-gray-600">
          Create and manage personas with detailed cognitive profiles.
        </p>
        <Card className="mb-4 p-4">
          <h3 className="mb-2 font-semibold">Available Personas</h3>
          <div
            id="personasList"
            className="grid grid-cols-1 gap-4 md:grid-cols-2"
          ></div>
        </Card>
        <Card className="p-4">
          <h3 className="mb-2 font-semibold">Create Custom Persona</h3>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Persona Name
                </label>
                <input
                  type="text"
                  id="customPersonaName"
                  className="w-full rounded-lg border p-2"
                  placeholder="e.g., Curious Buyer"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Age Range
                </label>
                <select
                  id="customAgeRange"
                  className="w-full rounded-lg border p-2"
                >
                  <option value="18-25">18-25</option>
                  <option value="26-35">26-35</option>
                  <option value="36-45">36-45</option>
                  <option value="46+">46+</option>
                </select>
              </div>
            </div>
            <div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Income Level
                </label>
                <select
                  id="customIncome"
                  className="w-full rounded-lg border p-2"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Impulsivity (0-1)
                </label>
                <input
                  type="range"
                  id="customImpulsivity"
                  className="w-full"
                  min="0"
                  max="1"
                  step="0.1"
                  defaultValue="0.5"
                />
                <span id="impulsivityValue" className="text-sm text-gray-600">
                  0.5
                </span>
              </div>
            </div>
            <div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Attention Span (0-1)
                </label>
                <input
                  type="range"
                  id="customAttentionSpan"
                  className="w-full"
                  min="0"
                  max="1"
                  step="0.1"
                  defaultValue="0.5"
                />
                <span id="attentionSpanValue" className="text-sm text-gray-600">
                  0.5
                </span>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Price Sensitivity (0-1)
                </label>
                <input
                  type="range"
                  id="customPriceSensitivity"
                  className="w-full"
                  min="0"
                  max="1"
                  step="0.1"
                  defaultValue="0.5"
                />
                <span
                  id="priceSensitivityValue"
                  className="text-sm text-gray-600"
                >
                  0.5
                </span>
              </div>
            </div>
          </div>
          <button className="rounded-lg bg-gradient-to-r from-indigo-500 to-purple-600 px-6 py-2 text-white transition-transform hover:translate-y-[-2px]">
            Create Persona
          </button>
        </Card>
      </Card>
    </div>
  );
};

export default PersonaManagementComponent;
