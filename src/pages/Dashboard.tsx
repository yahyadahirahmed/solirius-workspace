import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Search, Filter, MessageCircle, Mail, Users, User, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import sarahChen from "@/assets/profiles/sarah-chen.jpg";
import marcusJohnson from "@/assets/profiles/marcus-johnson.jpg";
import emilyRodriguez from "@/assets/profiles/emily-rodriguez.jpg";
import davidKim from "@/assets/profiles/david-kim.jpg";
import lisaThompson from "@/assets/profiles/lisa-thompson.jpg";
import jamesWilson from "@/assets/profiles/james-wilson.jpg";

export default function Dashboard() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  const teamMembers = [
    {
      id: 1,
      name: "Sarah Chen",
      role: "Senior Full Stack Developer",
      department: "Engineering",
      location: "London, UK",
      image: sarahChen,
      description: "Passionate full-stack developer with 6+ years of experience building scalable web...",
      skills: ["React", "TypeScript", "Node.js", "Python"],
      moreSkills: 6
    },
    {
      id: 2,
      name: "Marcus Johnson",
      role: "DevOps Engineer",
      department: "Infrastructure", 
      location: "Manchester, UK",
      image: marcusJohnson,
      description: "DevOps specialist focused on automation, scalability, and reliability. Expert in cloud...",
      skills: ["AWS", "Kubernetes", "Docker", "Terraform"],
      moreSkills: 6
    },
    {
      id: 3,
      name: "Emily Rodriguez",
      role: "UX/UI Designer",
      department: "Design",
      location: "Remote",
      image: emilyRodriguez, 
      description: "Creative designer passionate about user-centered design and accessibility. Experience...",
      skills: ["Figma", "Adobe Creative Suite", "User Research", "Prototyping"],
      moreSkills: 5
    },
    {
      id: 4,
      name: "David Kim",
      role: "Data Scientist", 
      department: "Analytics",
      location: "Edinburgh, UK",
      image: davidKim,
      description: "Data scientist with expertise in machine learning and statistical analysis. Love turning...",
      skills: ["Python", "R", "Machine Learning", "SQL"],
      moreSkills: 4
    },
    {
      id: 5,
      name: "Lisa Thompson",
      role: "Product Manager",
      department: "Product",
      location: "Birmingham, UK", 
      image: lisaThompson,
      description: "Product manager with a background in software engineering. Expert in agile methodologies an...",
      skills: ["Product Strategy", "Agile", "Roadmapping", "Analytics"],
      moreSkills: 3
    },
    {
      id: 6,
      name: "James Wilson",
      role: "Security Engineer",
      department: "Security",
      location: "London, UK",
      image: jamesWilson,
      description: "Cybersecurity specialist focused on application security and threat detection. Passionate abo...",
      skills: ["Security", "Penetration Testing", "Risk Assessment", "Compliance"],
      moreSkills: 7
    }
  ];

  const [filteredMembers, setFilteredMembers] = useState(teamMembers);

  const handleSearch = () => {
    if (!searchTerm.trim()) {
      setFilteredMembers(teamMembers);
      return;
    }

    const filtered = teamMembers.filter(member => {
      const searchLower = searchTerm.toLowerCase();
      return (
        member.name.toLowerCase().includes(searchLower) ||
        member.role.toLowerCase().includes(searchLower) ||
        member.department.toLowerCase().includes(searchLower) ||
        member.skills.some(skill => skill.toLowerCase().includes(searchLower)) ||
        member.description.toLowerCase().includes(searchLower)
      );
    });
    
    setFilteredMembers(filtered);
  };

  // Auto-search as user types
  React.useEffect(() => {
    const timeoutId = setTimeout(() => {
      handleSearch();
    }, 300);
    
    return () => clearTimeout(timeoutId);
  }, [searchTerm]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/20">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center gap-4">
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => navigate('/')}
                className="text-muted-foreground hover:text-foreground"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
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
                onClick={() => navigate('/profile')}
                className="rounded-full p-2"
              >
                <User className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>
      </header>

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

          {/* Search Section */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input 
                placeholder="Search by name, role, skills, or department..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              />
            </div>
            <Button 
              onClick={handleSearch}
              className="bg-gradient-primary text-primary-foreground shadow-glow shrink-0"
            >
              <Search className="w-4 h-4 mr-2" />
              Search
            </Button>
          </div>

          {/* Filters */}
          <Card className="p-4 bg-gradient-subtle border-primary/20">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium text-foreground">Filters</h3>
                <p className="text-sm text-muted-foreground">Filter by skills and expertise</p>
              </div>
              <Button 
                variant="outline" 
                onClick={() => setShowFilters(!showFilters)}
                className="border-primary/30"
              >
                <Filter className="w-4 h-4 mr-2" />
                Show Filters
              </Button>
            </div>
          </Card>

          {/* Results */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-semibold text-foreground">
                {filteredMembers.length} team member{filteredMembers.length !== 1 ? 's' : ''}
                {searchTerm && (
                  <span className="text-sm font-normal text-muted-foreground ml-2">
                    matching "{searchTerm}"
                  </span>
                )}
              </h3>
              {searchTerm && (
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => {
                    setSearchTerm("");
                    setFilteredMembers(teamMembers);
                  }}
                  className="text-muted-foreground hover:text-foreground"
                >
                  Clear search
                </Button>
              )}
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredMembers.length === 0 ? (
                <div className="col-span-full text-center py-12">
                  <div className="text-muted-foreground">
                    <Search className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <h3 className="text-lg font-medium mb-2">No matches found</h3>
                    <p className="text-sm">Try adjusting your search terms or clear the search to see all members.</p>
                  </div>
                </div>
              ) : (
                filteredMembers.map((member) => (
                  <Card 
                    key={member.id} 
                    className="p-6 transition-all duration-300 hover:shadow-soft border-muted bg-card cursor-pointer hover:border-primary/30"
                    onClick={() => navigate(`/user/${member.id}`)}
                  >
                  <div className="space-y-4">
                    {/* Profile Header */}
                    <div className="flex items-start gap-4">
                      <Avatar className="w-12 h-12 border-2 border-primary/20 shrink-0">
                        <AvatarImage src={member.image} alt={member.name} />
                        <AvatarFallback>{member.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                      </Avatar>
                      
                      <div className="min-w-0 flex-1">
                        <h4 className="font-semibold text-foreground truncate">{member.name}</h4>
                        <p className="text-sm text-muted-foreground truncate">{member.role}</p>
                        <div className="flex items-center text-xs text-muted-foreground mt-1">
                          <span className="mr-3">📍 {member.department}</span>
                          <span>📍 {member.location}</span>
                        </div>
                      </div>
                    </div>

                    {/* Description */}
                    <p className="text-sm text-foreground line-clamp-2">
                      {member.description}
                    </p>

                    {/* Skills */}
                    <div className="space-y-2">
                      <div className="flex flex-wrap gap-1">
                        {member.skills.map((skill) => (
                          <Badge 
                            key={skill} 
                            variant="outline" 
                            className="text-xs border-primary/30 text-primary bg-primary/5"
                          >
                            {skill}
                          </Badge>
                        ))}
                        {member.moreSkills > 0 && (
                          <Badge 
                            variant="outline" 
                            className="text-xs border-muted text-muted-foreground"
                          >
                            +{member.moreSkills} more
                          </Badge>
                        )}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2 pt-2">
                      <Button size="sm" className="bg-gradient-primary text-primary-foreground flex-1">
                        <MessageCircle className="w-3 h-3 mr-1" />
                        Connect
                      </Button>
                      <Button size="sm" variant="outline" className="border-primary/30">
                        <Users className="w-3 h-3" />
                      </Button>
                      <Button size="sm" variant="outline" className="border-primary/30">
                        <Mail className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                </Card>
                ))
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}