import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Search, Filter, MessageCircle, Mail, Users, Award } from "lucide-react";

interface SearchInterfaceProps {
  onConnect: () => void;
}

export function SearchInterface({ onConnect }: SearchInterfaceProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [showResults, setShowResults] = useState(false);

  const handleSearch = () => {
    setShowResults(true);
  };

  const colleagues = [
    {
      name: "Sarah Chen",
      role: "Senior Business Analyst",
      department: "Strategy & Operations",
      skills: ["Business Case Writing", "Financial Modeling", "Process Optimization", "Stakeholder Management"],
      projects: "Led business case development for 3 major digital transformation initiatives",
      image: "/placeholder.svg",
      match: 95,
      available: true
    },
    {
      name: "Marcus Thompson", 
      role: "Principal Consultant",
      department: "Business Solutions",
      skills: ["Business Strategy", "Case Development", "ROI Analysis", "Project Management"],
      projects: "Authored business cases resulting in £2M+ approved investments",
      image: "/placeholder.svg", 
      match: 88,
      available: false
    },
    {
      name: "Elena Rodriguez",
      role: "Business Development Manager", 
      department: "Commercial",
      skills: ["Business Planning", "Financial Analysis", "Proposal Writing", "Client Relations"],
      projects: "Developed winning proposals for 15+ client engagements",
      image: "/placeholder.svg",
      match: 82,
      available: true
    }
  ];

  return (
    <Card className="p-6 max-w-4xl mx-auto bg-gradient-subtle border-primary/20">
      <div className="space-y-6">
        <div className="text-center">
          <h3 className="text-2xl font-bold text-foreground mb-2">Find Colleagues</h3>
          <p className="text-muted-foreground">Search by skills, expertise, or project experience</p>
        </div>

        <div className="flex gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input 
              placeholder="Search for 'business case writing' or specific skills..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            />
          </div>
          <Button 
            onClick={handleSearch}
            className="bg-gradient-primary text-primary-foreground shadow-glow"
          >
            <Search className="w-4 h-4 mr-2" />
            Search
          </Button>
          <Button variant="outline" className="border-primary/30">
            <Filter className="w-4 h-4 mr-2" />
            Filters
          </Button>
        </div>

        {showResults && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-lg font-semibold text-foreground">Search Results</h4>
              <Badge variant="secondary" className="bg-primary/10 text-primary">
                {colleagues.length} matches found
              </Badge>
            </div>

            {colleagues.map((colleague, index) => (
              <Card key={index} className={`p-4 transition-all duration-300 hover:shadow-soft ${
                index === 0 ? 'border-success/50 bg-success/5' : 'border-muted'
              }`}>
                <div className="flex items-start gap-4">
                  <Avatar className="w-16 h-16 border-2 border-primary/20">
                    <AvatarImage src={colleague.image} alt={colleague.name} />
                    <AvatarFallback>{colleague.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                  </Avatar>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h5 className="font-semibold text-foreground flex items-center gap-2">
                          {colleague.name}
                          {index === 0 && (
                            <Badge className="bg-success/20 text-success border-success/30">
                              Best Match
                            </Badge>
                          )}
                          <Badge variant={colleague.available ? "default" : "secondary"} className={
                            colleague.available ? "bg-success/20 text-success" : "bg-muted"
                          }>
                            {colleague.available ? "Available" : "Busy"}
                          </Badge>
                        </h5>
                        <p className="text-sm text-muted-foreground">{colleague.role}</p>
                        <p className="text-sm text-muted-foreground">{colleague.department}</p>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold text-primary">{colleague.match}%</div>
                        <div className="text-xs text-muted-foreground">match</div>
                      </div>
                    </div>
                    
                    <div className="mb-3">
                      <p className="text-sm text-foreground mb-2">{colleague.projects}</p>
                      <div className="flex flex-wrap gap-1">
                        {colleague.skills.map((skill, skillIndex) => (
                          <Badge 
                            key={skillIndex} 
                            variant="outline" 
                            className={`text-xs ${
                              skill.toLowerCase().includes('business case') || skill.toLowerCase().includes('case development')
                                ? 'border-success bg-success/10 text-success' 
                                : 'border-primary/30 text-primary'
                            }`}
                          >
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      <Button 
                        size="sm" 
                        onClick={index === 0 ? onConnect : undefined}
                        className={index === 0 ? "bg-gradient-primary text-primary-foreground shadow-glow" : ""}
                        disabled={!colleague.available}
                      >
                        <MessageCircle className="w-4 h-4 mr-2" />
                        {colleague.available ? "Connect" : "Unavailable"}
                      </Button>
                      <Button size="sm" variant="outline" className="border-primary/30">
                        <Users className="w-4 h-4 mr-2" />
                        View Profile
                      </Button>
                      <Button size="sm" variant="outline" className="border-primary/30">
                        <Mail className="w-4 h-4 mr-2" />
                        Email
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </Card>
  );
}