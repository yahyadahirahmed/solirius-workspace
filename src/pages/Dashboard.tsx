import { Users } from "lucide-react";
import DashBoardNavBar from "../components/DashBoard/DashBoardNavBar";
import DashboardSearch from "../components/DashBoard/DashboardSearch";
import { useAuth } from "@/contexts/AuthContext";

export default function Dashboard() {
  const { employee } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/20">
      {/* Header */}
      <DashBoardNavBar employeeId={employee?.id ?? null} />

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          {/* Title Section */}
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-primary rounded-full shadow-glow mb-4">
              <Users className="w-6 h-6 text-primary-foreground" />
            </div>
            <h2 className="text-3xl font-bold text-foreground mb-2">Staff Directory</h2>
            <p className="text-muted-foreground">
              Discover colleagues, explore expertise, and build multi-disciplinary teams 
            </p>
          </div>

          <DashboardSearch />
        </div>
      </main>
    </div>
  );
}