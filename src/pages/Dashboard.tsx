import { Users } from "lucide-react";
import DashBoardNavBar from "../components/DashBoard/DashBoardNavBar";
import DashboardSearch from "../components/DashBoard/DashboardSearch";
import { useEffect, useState } from "react";  
import { employeeService } from "@/services/employeeService";
import { useAuth } from "@/contexts/AuthContext";

export default function Dashboard() {
  const { user } = useAuth();
  const [userID, setUserID] = useState<number | null>(null);

  useEffect(() => {
    const getEmployeeDBid = async () => {
      const employeeDBid = await employeeService.getEmployeeDBId(user?.id || "");
      if (employeeDBid) {
        setUserID(employeeDBid);
      }
    };
    getEmployeeDBid();
  }, [user]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/20">
      {/* Header */}
      <DashBoardNavBar employeeId={userID} />

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