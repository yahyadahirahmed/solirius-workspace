import { Button } from "@/components/ui/button";
import { User } from "lucide-react";
import { useNavigate } from "react-router-dom";    


export default function DashBoardNavBar({ employeeId }: { employeeId: number | null }) {
    const navigate = useNavigate();
    
    const handleProfileClick = () => {
      if (employeeId) {
        navigate(`/profile/${employeeId}`);
      } else {
        console.warn('Cannot navigate to profile: employeeId is null');
      }
    };
    
    return (
        <>
       {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center gap-4">
              <div>
                <h1 className="text-2xl font-bold text-foreground">Solirius Consulting</h1>
                <p className="text-muted-foreground">Internal Staff Directory</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-sm text-muted-foreground">
                Secure • Internal Access Only
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleProfileClick}
                disabled={!employeeId}
                className="rounded-full p-2"
              >
                <User className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>
      </header>
      </>
    );
};
