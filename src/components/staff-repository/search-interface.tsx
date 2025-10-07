import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Search, Filter, Mail, Users, Award } from "lucide-react";
import { useEmployeeSearch } from "@/hooks/useEmployees";

interface SearchInterfaceProps {
  // No props needed for search functionality
}

export function SearchInterface({}: SearchInterfaceProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [showResults, setShowResults] = useState(false);
  const { results: searchResults, loading, error, search } = useEmployeeSearch();

  const handleSearch = () => {
    if (searchTerm.trim()) {
      search(searchTerm);
      setShowResults(true);
    }
  };

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
                {searchResults?.employees.length || 0} matches found
              </Badge>
            </div>

            {loading && (
              <div className="text-center py-8">
                <p className="text-muted-foreground">Searching...</p>
              </div>
            )}

            {error && (
              <div className="text-center py-8">
                <p className="text-destructive">{error}</p>
              </div>
            )}

            {searchResults?.employees && searchResults.employees.length > 0 && (
              <div className="space-y-4">
                {searchResults.employees.map((employee, index) => (
                  <Card key={employee.id} className={`p-4 transition-all duration-300 hover:shadow-soft ${
                    index === 0 ? 'border-success/50 bg-success/5' : 'border-muted'
                  }`}>
                <div className="flex items-start gap-4">
                  <Avatar className="w-16 h-16 border-2 border-primary/20">
                    <AvatarFallback>{employee.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                  </Avatar>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h5 className="font-semibold text-foreground flex items-center gap-2">
                          {employee.name}
                          {index === 0 && (
                            <Badge className="bg-success/20 text-success border-success/30">
                              Best Match
                            </Badge>
                          )}
                          <Badge variant="default" className="bg-success/20 text-success">
                            Available
                          </Badge>
                        </h5>
                        <p className="text-sm text-muted-foreground">{employee.currentRole}</p>
                        <p className="text-sm text-muted-foreground">{employee.location}</p>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold text-primary">95%</div>
                        <div className="text-xs text-muted-foreground">match</div>
                      </div>
                    </div>
                    
                    <div className="mb-3">
                      <p className="text-sm text-foreground mb-2">{employee.currentProject}</p>
                      <div className="flex flex-wrap gap-1">
                        {employee.skillTags.map((skill, skillIndex) => (
                          <Badge 
                            key={skillIndex} 
                            variant="outline" 
                            className="text-xs border-primary/30 text-primary"
                          >
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
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

            {searchResults?.employees && searchResults.employees.length === 0 && (
              <div className="text-center py-8">
                <p className="text-muted-foreground">No employees found matching your search criteria.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </Card>
  );
}