import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Search, Users, User, ArrowLeft, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useEmployees, useEmployeeSearch } from "@/hooks/useEmployees";

export default function Dashboard() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");

  // Use database hooks instead of dummy data
  const { employees, loading, error } = useEmployees();
  const { results: searchResults, loading: searchLoading, search, clearResults } = useEmployeeSearch();
  
  // Show search results if we have them, otherwise show all employees
  const displayedEmployees = searchResults?.employees || employees;
  const isSearching = searchTerm.trim().length > 0;
  const displayLoading = loading || (isSearching && searchLoading);

  const handleSearch = () => {
    if (!searchTerm.trim()) {
      clearResults();
      return;
    }
    console.log('Searching for:', searchTerm); // Debug log
    search(searchTerm);
  };

  // Auto-search as user types with improved logic
  React.useEffect(() => {
    if (searchTerm.trim()) {
      const timeoutId = setTimeout(() => {
        console.log('Auto-searching for:', searchTerm); // Debug log
        search(searchTerm);
      }, 300);
      
      return () => clearTimeout(timeoutId);
    } else {
      clearResults();
    }
  }, [searchTerm, search, clearResults]);

  const handleClearSearch = () => {
    setSearchTerm("");
    clearResults();
  };

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

          {/* Results */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-semibold text-foreground">
                {displayedEmployees.length} team member{displayedEmployees.length !== 1 ? 's' : ''}
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
                  onClick={handleClearSearch}
                  className="text-muted-foreground hover:text-foreground"
                >
                  Clear search
                </Button>
              )}
            </div>

            {/* Loading State */}
            {displayLoading && (
              <div className="text-center py-12">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-primary rounded-full shadow-glow mb-4">
                  <Loader2 className="w-6 h-6 text-primary-foreground animate-spin" />
                </div>
                <h3 className="text-lg font-medium text-foreground mb-2">Loading Staff Directory</h3>
                <p className="text-muted-foreground">Please wait while we fetch the latest information...</p>
              </div>
            )}

            {/* Error State */}
            {error && (
              <div className="text-center py-12">
                <div className="text-destructive">
                  <Users className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <h3 className="text-lg font-medium mb-2">Unable to Load Staff Directory</h3>
                  <p className="text-sm mb-4">{error}</p>
                  <p className="text-xs text-muted-foreground">
                    Check your database connection and ensure you have added some employee data.
                  </p>
                </div>
              </div>
            )}

            {/* Employee Grid */}
            {!displayLoading && !error && (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {displayedEmployees.length === 0 ? (
                  <div className="col-span-full text-center py-12">
                    <div className="text-muted-foreground">
                      <Search className="w-12 h-12 mx-auto mb-4 opacity-50" />
                      <h3 className="text-lg font-medium mb-2">
                        {searchTerm ? "No matches found" : "No employees found"}
                      </h3>
                      <p className="text-sm">
                        {searchTerm 
                          ? "Try adjusting your search terms or clear the search to see all members." 
                          : "Add some employees to get started."
                        }
                      </p>
                    </div>
                  </div>
                ) : (
                  displayedEmployees.map((member) => (
                    <Card 
                      key={member.id} 
                      className="p-6 transition-all duration-300 hover:shadow-soft border-muted bg-card cursor-pointer hover:border-primary/30"
                      onClick={() => navigate(`/user/${member.id}`)}
                    >
                  <div className="space-y-4">
                    {/* Profile Header */}
                    <div className="flex items-start gap-4">
                      <Avatar className="w-12 h-12 border-2 border-primary/20 shrink-0">
                        <AvatarFallback>{member.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                      </Avatar>
                      
                      <div className="min-w-0 flex-1">
                        <h4 className="font-semibold text-foreground truncate">{member.name}</h4>
                        <p className="text-sm text-muted-foreground truncate">{member.currentRole}</p>
                        <div className="flex items-center text-xs text-muted-foreground mt-1">
                          <span className="mr-3">{member.location}</span>
                          <span>{member.currentProject}</span>
                        </div>
                      </div>
                    </div>

                    {/* Description */}
                    <p className="text-sm text-foreground line-clamp-2">
                      {member.about}
                    </p>

                    {/* Skills */}
                    <div className="space-y-2">
                      <div className="flex flex-wrap gap-1">
                        {member.skillTags.slice(0, 4).map((skill) => (
                          <Badge 
                            key={skill} 
                            variant="outline" 
                            className="text-xs border-primary/30 text-primary bg-primary/5"
                          >
                            {skill}
                          </Badge>
                        ))}
                        {member.skillTags.length > 4 && (
                          <Badge 
                            variant="outline" 
                            className="text-xs border-muted text-muted-foreground"
                          >
                            +{member.skillTags.length - 4} more
                          </Badge>
                        )}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2 pt-2">
                      <Button size="sm" className="bg-gradient-primary text-primary-foreground flex-1">
                        <Users className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                </Card>
                  ))
                )}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}