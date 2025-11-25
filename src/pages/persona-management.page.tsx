import { PersonaList } from "@/features/persona-management/components/PersonaList";

const PersonaManagementPage = () => {
  return (
    <div className="space-y-6 p-6">
      {/* Header Section */}
      <div className="space-y-2">
        <h1 className="text-primary text-3xl font-bold tracking-tight">
          Persona Management
        </h1>
        <p className="text-muted-foreground">
          Create, edit, and manage personas for your simulations.
        </p>
      </div>

      {/* Main Content */}
      <div className="space-y-6">
        {/* API-based Persona List with advanced filters */}
        <PersonaList />
      </div>
    </div>
  );
};

export default PersonaManagementPage;
