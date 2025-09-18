import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Users, Building2, Search, UserPlus } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Welcome() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/20">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div>
              <h1 className="text-2xl font-bold text-foreground">Solirius Consulting</h1>
              <p className="text-muted-foreground">Internal Staff Directory</p>
            </div>
            <div className="text-sm text-muted-foreground">
              Secure • Internal Access Only
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center space-y-8">
          <div className="space-y-4">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-primary rounded-full shadow-glow">
              <Users className="w-10 h-10 text-primary-foreground" />
            </div>
            <h2 className="text-4xl font-bold text-foreground">
              Welcome to the Staff Directory
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Discover colleagues, explore expertise, and build multi-disciplinary teams across Solirius
            </p>
          </div>

          {/* Feature Cards */}
          <div className="grid md:grid-cols-3 gap-6 mt-12">
            <Card className="p-6 bg-gradient-subtle border-primary/20">
              <Building2 className="w-8 h-8 text-primary mx-auto mb-4" />
              <h3 className="font-semibold text-foreground mb-2">Connect</h3>
              <p className="text-sm text-muted-foreground">
                Find colleagues across departments and build meaningful professional relationships
              </p>
            </Card>
            
            <Card className="p-6 bg-gradient-subtle border-primary/20">
              <Search className="w-8 h-8 text-primary mx-auto mb-4" />
              <h3 className="font-semibold text-foreground mb-2">Discover</h3>
              <p className="text-sm text-muted-foreground">
                Search by skills, expertise, or project experience to find the right person for your needs
              </p>
            </Card>
            
            <Card className="p-6 bg-gradient-subtle border-primary/20">
              <UserPlus className="w-8 h-8 text-primary mx-auto mb-4" />
              <h3 className="font-semibold text-foreground mb-2">Collaborate</h3>
              <p className="text-sm text-muted-foreground">
                Share your expertise and contribute to cross-functional project teams
              </p>
            </Card>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mt-12">
            <Button 
              onClick={() => navigate('/create-profile')}
              className="bg-gradient-primary text-primary-foreground shadow-glow hover:shadow-soft transition-all duration-300 px-8 py-3"
              size="lg"
            >
              <UserPlus className="w-5 h-5 mr-2" />
              Create Your Profile
            </Button>
            
            <Button 
              onClick={() => navigate('/dashboard')}
              variant="outline" 
              className="border-primary/30 px-8 py-3"
              size="lg"
            >
              <Search className="w-5 h-5 mr-2" />
              Browse Directory
            </Button>
          </div>

          <p className="text-sm text-muted-foreground mt-8">
            Already have a profile? Visit the{" "}
            <button 
              onClick={() => navigate('/dashboard')}
              className="text-primary hover:underline font-medium"
            >
              Staff Directory
            </button>
          </p>
        </div>
      </main>
    </div>
  );
}