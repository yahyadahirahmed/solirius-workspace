import { useParams, useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ArrowLeft, MapPin, Calendar, MessageCircle, Mail, Briefcase, Award, Loader2 } from "lucide-react";
import { useEmployee } from "@/hooks/useEmployees";

export default function UserProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const { employee: user, loading, error } = useEmployee(parseInt(id || "0"));
  
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/20 flex items-center justify-center">
        <Card className="p-8 text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-primary rounded-full shadow-glow mb-4">
            <Loader2 className="w-6 h-6 text-primary-foreground animate-spin" />
          </div>
          <h2 className="text-2xl font-bold text-foreground mb-2">Loading Profile</h2>
          <p className="text-muted-foreground">Please wait while we fetch the profile information...</p>
        </Card>
      </div>
    );
  }
  
  if (error || !user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/20 flex items-center justify-center">
        <Card className="p-8 text-center">
          <h2 className="text-2xl font-bold text-foreground mb-2">Profile Not Found</h2>
          <p className="text-muted-foreground mb-4">The requested profile could not be found.</p>
          <Button onClick={() => navigate('/dashboard')}>Back to Dashboard</Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/20">
      <header className="border-b bg-card/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center gap-4">
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => navigate('/dashboard')}
                className="text-muted-foreground hover:text-foreground"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Directory
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-foreground">Solirius Consulting</h1>
                <p className="text-muted-foreground">Staff Profile</p>
              </div>
            </div>
            <div className="text-sm text-muted-foreground">
              Secure • Internal Access Only
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          <Card className="p-8 bg-gradient-subtle border-primary/20">
            <div className="flex flex-col md:flex-row gap-8">
              <div className="flex flex-col items-center md:items-start">
                <Avatar className="w-32 h-32 border-4 border-primary/20 mb-4">
                  <AvatarFallback className="text-2xl">{user.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                </Avatar>
                <div className="flex gap-2">
                  <Button className="bg-gradient-primary text-primary-foreground shadow-glow">
                    <MessageCircle className="w-4 h-4 mr-2" />
                    Message
                  </Button>
                  <Button variant="outline" className="border-primary/30">
                    <Mail className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              
              <div className="flex-1 space-y-4">
                <div>
                  <h2 className="text-3xl font-bold text-foreground">{user.name}</h2>
                  <p className="text-xl text-primary font-medium">{user.currentRole}</p>
                  <div className="flex flex-wrap gap-4 mt-2 text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Briefcase className="w-4 h-4" />
                      {user.currentProject}
                    </div>
                    <div className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      {user.location}
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      Member since {new Date(user.createdAt).toLocaleDateString('en-GB', { month: 'long', year: 'numeric' })}
                    </div>
                  </div>
                </div>
                
                <p className="text-foreground leading-relaxed">{user.about}</p>
                
                <div className="grid md:grid-cols-1 gap-4 pt-4 border-t border-accent/30">
                  <div>
                    <div className="flex items-center gap-1 text-muted-foreground mb-1">
                      <Mail className="w-4 h-4" />
                      <span className="text-sm">Email</span>
                    </div>
                    <p className="text-foreground">{user.email}</p>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
              <Award className="w-5 h-5 text-primary" />
              Skills & Expertise
            </h3>
            <div className="flex flex-wrap gap-2">
              {user.skillTags.map((skill) => (
                <Badge 
                  key={skill} 
                  variant="secondary" 
                  className="bg-primary/10 text-primary border-primary/20 hover:bg-primary/20 transition-colors"
                >
                  {skill}
                </Badge>
              ))}
            </div>
          </Card>

          {user.previousExperiences && user.previousExperiences.length > 0 && (
            <Card className="p-6">
              <h3 className="text-xl font-semibold text-foreground mb-6 flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-primary" />
                Previous Experience
              </h3>
              <div className="space-y-6">
                {user.previousExperiences.map((exp) => (
                  <div key={exp.id} className="border-l-2 border-primary/20 pl-6 pb-6 last:pb-0 relative">
                    <div className="absolute w-3 h-3 bg-primary rounded-full -left-2 top-1"></div>
                    <div className="space-y-3">
                      <div>
                        <h4 className="text-lg font-semibold text-foreground">{exp.role}</h4>
                        <p className="text-primary font-medium">{exp.project}</p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(exp.startDate).toLocaleDateString('en-GB', { month: 'long', year: 'numeric' })} - {new Date(exp.endDate).toLocaleDateString('en-GB', { month: 'long', year: 'numeric' })}
                        </p>
                      </div>
                      <p className="text-foreground leading-relaxed">{exp.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          )}
        </div>
      </main>
    </div>
  );
}
