import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Camera, MapPin, Plus, X, Eye, ArrowLeft, Edit3, Save, LogOut } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { employeeService } from "@/services/employeeService";
import type { Employee } from "@/types/employee";


export default function Profile() {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [newSkill, setNewSkill] = useState("");
  const [newExperience, setNewExperience] = useState({
    role: "",
    project: "",
    startDate: "",
    endDate: "",
    description: ""
  });
  const { id } = useParams();
  const [user, setUser] = useState<Employee | null>(null);
  
  // Form state for editing
  const [formData, setFormData] = useState({
    name: "",
    currentRole: "",
    about: "",
    skillTags: [] as string[],
    previousExperiences: [] as any[]
  });
    
  const addSkill = () => {
    if (newSkill.trim() && !formData.skillTags.includes(newSkill.trim())) {
      setFormData(prev => ({
        ...prev,
        skillTags: [...prev.skillTags, newSkill.trim()]
      }));
      setNewSkill("");
    }
  };

  const removeSkill = (skill: string) => {
    setFormData(prev => ({
      ...prev,
      skillTags: prev.skillTags.filter(s => s !== skill)
    }));
  };

  const handleSave = async () => {
    try {
      if (!user) return;
      
      const updatedEmployee = await employeeService.updateEmployee(user.id, formData);
      setUser(updatedEmployee);
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  const startEditing = () => {
    if (user) {
      setFormData({
        name: user.name,
        currentRole: user.currentRole,
        about: user.about,
        skillTags: [...(user.skillTags || [])],
        previousExperiences: [...(user.previousExperiences || [])]
      });
    }
    setIsEditing(true);
  };

  const addExperience = () => {
    if (newExperience.role.trim() && newExperience.project.trim()) {
      const experienceToAdd = {
        id: Date.now(),
        ...newExperience,
        startDate: newExperience.startDate || new Date().toISOString().split('T')[0],
        endDate: newExperience.endDate || new Date().toISOString().split('T')[0]
      };
      setFormData(prev => ({
        ...prev,
        previousExperiences: [...prev.previousExperiences, experienceToAdd]
      }));
      setNewExperience({
        role: "",
        project: "",
        startDate: "",
        endDate: "",
        description: ""
      });
    }
  };

  const removeExperience = (index: number) => {
    setFormData(prev => ({
      ...prev,
      previousExperiences: prev.previousExperiences.filter((_, i) => i !== index)
    }));
  };


  
    useEffect(() => {
      if (id) {
        employeeService.getEmployeeById(parseInt(id)).then(setUser);
      }
    }, [id]);
    
    if (!user) {
      return (
        <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/20 flex items-center justify-center">
          <p className="text-muted-foreground">Loading profile...</p>
        </div>
      );
    }
  
  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error("Logout failed:", error);
    }
  }

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
                onClick={() => navigate('/dashboard')}
                className="text-muted-foreground hover:text-foreground"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Directory
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-foreground">My Profile</h1>
                <p className="text-muted-foreground">Manage your professional presence</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                onClick={isEditing ? handleSave : startEditing}
                variant={isEditing ? "default" : "outline"}
                className={isEditing ? "bg-gradient-primary text-primary-foreground" : "border-primary/30"}
              >
                {isEditing ? <Save className="w-4 h-4 mr-2" /> : <Edit3 className="w-4 h-4 mr-2" />}
                {isEditing ? "Save Changes" : "Edit Profile"}
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          {/* Profile Header */}
          <Card className="p-8 bg-gradient-subtle border-primary/20">
            <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
              <div className="relative">
                <Avatar className="w-32 h-32 border-4 border-primary/20">
                  <AvatarFallback>{user.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                </Avatar>
                {isEditing && (
                  <Button
                    size="sm"
                    className="absolute bottom-0 right-0 rounded-full w-10 h-10 p-0 bg-primary shadow-glow"
                    variant="default"
                  >
                    <Camera className="w-5 h-5" />
                  </Button>
                )}
              </div>
              
              <div className="flex-1 text-center md:text-left space-y-4">
                {isEditing ? (
                  <div className="space-y-4">
                    <Input 
                      value={formData.name}
                      onChange={(e) => setFormData(prev => ({...prev, name: e.target.value}))}
                      className="text-2xl font-bold" 
                    />
                    <Input 
                      value={formData.currentRole}
                      onChange={(e) => setFormData(prev => ({...prev, currentRole: e.target.value}))}
                    />
                    <div className="flex items-center">
                      <MapPin className="w-4 h-4 text-muted-foreground mr-2" />
                      <span className="text-muted-foreground">{user.location}</span>
                    </div>
                  </div>
                ) : (
                  <div>
                    <h2 className="text-3xl font-bold text-foreground">{user.name}</h2>
                    <p className="text-xl text-muted-foreground">{user.currentRole}</p>
                    <div className="flex items-center justify-center md:justify-start text-muted-foreground mt-2">
                      <MapPin className="w-4 h-4 mr-2" />
                      {user.location}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </Card>

          {/* Profile Content */}
          <Tabs defaultValue="overview" className="space-y-6">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="experience">Experience</TabsTrigger>
            </TabsList>
            
            <TabsContent value="overview" className="space-y-6">
              {/* About */}
              <Card className="p-6 bg-gradient-subtle border-primary/20">
                <h3 className="text-lg font-semibold text-foreground mb-4">About Me</h3>
                {isEditing ? (
                  <Textarea 
                    rows={4}
                    value={formData.about}
                    onChange={(e) => setFormData(prev => ({...prev, about: e.target.value}))}
                  />
                ) : (
                  <p className="text-foreground">
                    {user.about}
                  </p>
                )}
              </Card>

              {/* Skills */}
              <Card className="p-6 bg-gradient-subtle border-primary/20">
                <h3 className="text-lg font-semibold text-foreground mb-4">Skills & Expertise</h3>
                <div className="space-y-4">
                  <div className="flex flex-wrap gap-2">
                    {(isEditing ? formData.skillTags : user.skillTags).map((skill) => (
                      <Badge 
                        key={skill} 
                        variant="secondary" 
                        className="bg-primary/10 text-primary hover:bg-primary/20 cursor-pointer"
                        onClick={() => isEditing && removeSkill(skill)}
                      >
                        {skill}
                        {isEditing && <X className="w-3 h-3 ml-1" />}
                      </Badge>
                    ))}
                  </div>
                  
                  {isEditing && (
                    <div className="flex gap-2">
                      <Input 
                        placeholder="Add a skill..."
                        value={newSkill}
                        onChange={(e) => setNewSkill(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && addSkill()}
                      />
                      <Button onClick={addSkill} variant="outline" className="border-primary/30">
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>
                  )}
                </div>
              </Card>
            </TabsContent>
            
            <TabsContent value="experience" className="space-y-6">
              <Card className="p-6 bg-gradient-subtle border-primary/20">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold text-foreground">Professional Experience</h3>
                </div>
                
                <div className="space-y-4">
                  <div className="border-l-2 border-primary/20 pl-4">
                     {(isEditing ? formData.previousExperiences : user.previousExperiences || []).map((experience, index) => (
                      <div key={experience.id || index} className="mb-6 p-4 bg-background/50 rounded-lg">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <h4 className="font-medium">{experience.role}</h4>
                            <p className="text-sm text-muted-foreground">{experience.project}</p>
                            <p className="text-xs text-muted-foreground">
                              {experience.startDate ? new Date(experience.startDate).toLocaleDateString() : 'No start date'} - 
                              {experience.endDate ? new Date(experience.endDate).toLocaleDateString() : 'No end date'}
                            </p>
                            <p className="text-sm mt-2">{experience.description}</p>
                          </div>
                          {isEditing && (
                            <Button 
                              onClick={() => removeExperience(index)}
                              variant="ghost" 
                              size="sm"
                              className="ml-2 text-destructive hover:text-destructive"
                            >
                              <X className="w-4 h-4" />
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}
                    
                    {isEditing && (
                      <div className="mt-4 p-4 bg-background/30 rounded-lg border-2 border-dashed border-primary/30">
                        <h4 className="text-sm font-medium mb-3">Add New Experience</h4>
                        <div className="space-y-3">
                          <Input 
                            placeholder="Job Title/Role"
                            value={newExperience.role}
                            onChange={(e) => setNewExperience(prev => ({...prev, role: e.target.value}))}
                          />
                          <Input 
                            placeholder="Project/Company"
                            value={newExperience.project}
                            onChange={(e) => setNewExperience(prev => ({...prev, project: e.target.value}))}
                          />
                          <div className="flex gap-2">
                            <Input 
                              type="date"
                              placeholder="Start Date"
                              value={newExperience.startDate}
                              onChange={(e) => setNewExperience(prev => ({...prev, startDate: e.target.value}))}
                            />
                            <Input 
                              type="date"
                              placeholder="End Date"
                              value={newExperience.endDate}
                              onChange={(e) => setNewExperience(prev => ({...prev, endDate: e.target.value}))}
                            />
                          </div>
                          <Textarea 
                            placeholder="Description"
                            value={newExperience.description}
                            onChange={(e) => setNewExperience(prev => ({...prev, description: e.target.value}))}
                            rows={3}
                          />
                          <Button onClick={addExperience} variant="outline" className="border-primary/30">
                            <Plus className="w-4 h-4 mr-2" />
                            Add Experience
                          </Button>
                        </div>
                      </div>
                    )}
                    
                    {(!(isEditing ? formData.previousExperiences : user.previousExperiences) || 
                      (isEditing ? formData.previousExperiences : user.previousExperiences).length === 0) && !isEditing && (
                      <p className="text-muted-foreground italic">No previous experience added yet.</p>
                    )}
                  </div>
                </div>
              </Card>
            </TabsContent>
          </Tabs>
          <Button 
              onClick={handleLogout}
              variant="outline" 
              className="border-destructive/30 text-destructive hover:bg-destructive hover:text-destructive-foreground px-8 py-3"
              size="lg"
            >
              <LogOut className="w-5 h-5 mr-2" />
              Log Out
            </Button>
        </div>
      </main>
    </div>
  );
}