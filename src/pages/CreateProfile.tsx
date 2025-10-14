import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Switch } from "@/components/ui/switch";
import { Camera, MapPin, Plus, X, Eye, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { employeeService } from "@/services/employeeService";
import type { CreateEmployeeInput, CreatePreviousExperienceInput, Location } from "@/types/employee";

export default function CreateProfile() {
  const navigate = useNavigate();
  const [newSkill, setNewSkill] = useState("");
  const [emailError, setEmailError] = useState("");
  const [newExperience, setNewExperience] = useState({
    role: "",
    project: "",
    startDate: "",
    endDate: "",
    description: ""
  });
  
  // Form data matching CreateEmployeeInput interface
  const [formData, setFormData] = useState<CreateEmployeeInput>({
    name: "",
    currentRole: "",
    currentProject: "",
    email: "",
    location: "LONDON" as Location,
    about: "",
    skillTags: [],
    previousExperiences: []
  });

  const addExperience = () => {
    if (newExperience.role.trim() && newExperience.project.trim()) {
      const experienceToAdd: CreatePreviousExperienceInput = {
        role: newExperience.role,
        project: newExperience.project,
        startDate: new Date(newExperience.startDate || new Date().toISOString().split('T')[0]),
        endDate: new Date(newExperience.endDate || new Date().toISOString().split('T')[0]),
        description: newExperience.description,
        employeeId: 0 // This will be set by the server
      };
      
      setFormData(prev => ({
        ...prev,
        previousExperiences: [...(prev.previousExperiences || []), experienceToAdd]
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
      previousExperiences: prev.previousExperiences?.filter((_, i) => i !== index) || []
    }));
  };

  const addSkill = () => {
    if (!newSkill.trim() || formData.skillTags.includes(newSkill.trim())) {
      return;
    }
    
    setFormData(prev => ({
      ...prev,
      skillTags: [...prev.skillTags, newSkill.trim()]
    }));
    setNewSkill("");
  };

  const removeSkill = (skill: string) => {
    setFormData(prev => ({
      ...prev,
      skillTags: prev.skillTags.filter(s => s !== skill)
    }));
  };

  const validateEmail = (email: string) => {
    if (!email.endsWith('@solirius.com')) {
      setEmailError('Email must end with @solirius.com');
      return false;
    }
    setEmailError('');
    return true;
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const email = e.target.value;
    setFormData(prev => ({...prev, email}));
    
    // Clear error when user starts typing
    if (emailError) {
      setEmailError('');
    }
  };

  const handleCreateProfile = async () => {
    // Validate email before submission
    if (!validateEmail(formData.email)) {
      return;
    }

    // Validate other required fields
    if (!formData.name.trim() || !formData.currentRole.trim() || !formData.email.trim()) {
      alert('Please fill in all required fields');
      return;
    }

    try {
      console.log('Creating profile with data:', formData);
      const createdEmployee = await employeeService.createEmployee(formData);
      console.log('Profile created successfully:', createdEmployee);
      navigate('/dashboard');
    } catch (error) {
      console.error('Error creating profile:', error);
    }
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
            <div className="text-sm text-muted-foreground">
              Secure • Internal Access Only
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card className="p-8 bg-gradient-subtle border-primary/20">
          <div className="space-y-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-foreground mb-2">Create Your Profile</h2>
              <p className="text-muted-foreground">Share your expertise and connect with colleagues</p>
            </div>

            {/* Profile Photo */}
            <div className="flex justify-center">
              <div className="relative">
                <Avatar className="w-32 h-32 border-4 border-primary/20">
                  <AvatarFallback className="text-lg">You</AvatarFallback>
                </Avatar>
                <Button
                  size="sm"
                  className="absolute bottom-0 right-0 rounded-full w-10 h-10 p-0 bg-primary shadow-glow"
                  variant="default"
                >
                  <Camera className="w-5 h-5" />
                </Button>
              </div>
            </div>

            {/* Basic Information */}
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="text-sm font-medium text-foreground">Full Name *</label>
                <Input 
                  placeholder="Enter your full name" 
                  className="mt-1"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({...prev, name: e.target.value}))}
                />
              </div>
              
              <div>
                <label className="text-sm font-medium text-foreground">Job Title *</label>
                <Input 
                  placeholder="e.g., Senior Software Developer" 
                  className="mt-1"
                  value={formData.currentRole}
                  onChange={(e) => setFormData(prev => ({...prev, currentRole: e.target.value}))}
                />
              </div>
              
              <div>
                <label className="text-sm font-medium text-foreground">Current Project</label>
                <Input 
                  placeholder="e.g., Digital Transformation Initiative" 
                  className="mt-1"
                  value={formData.currentProject}
                  onChange={(e) => setFormData(prev => ({...prev, currentProject: e.target.value}))}
                />
              </div>
              
              <div>
                <label className="text-sm font-medium text-foreground">Email *</label>
                <Input 
                  placeholder="e.g., john.doe@solirius.com" 
                  className={`mt-1 ${emailError ? 'border-destructive' : ''}`}
                  type="email"
                  value={formData.email}
                  onChange={handleEmailChange}
                  onBlur={() => validateEmail(formData.email)}
                />
                {emailError && (
                  <p className="text-destructive text-sm mt-1">{emailError}</p>
                )}
                <p className="text-muted-foreground text-xs mt-1">Must be a @solirius.com email address</p>
              </div>
            </div>

            {/* Location */}
            <div>
              <label className="text-sm font-medium text-foreground">Office Location</label>
              <div className="flex items-center mt-1 gap-4">
                <MapPin className="w-4 h-4 text-muted-foreground" />
                <div className="flex gap-4">
                  <label className="flex items-center">
                    <input 
                      type="radio" 
                      name="location" 
                      value="LONDON" 
                      checked={formData.location === "LONDON"}
                      onChange={(e) => setFormData(prev => ({...prev, location: e.target.value as Location}))}
                      className="mr-2"
                    />
                    London
                  </label>
                  <label className="flex items-center">
                    <input 
                      type="radio" 
                      name="location" 
                      value="MANCHESTER" 
                      checked={formData.location === "MANCHESTER"}
                      onChange={(e) => setFormData(prev => ({...prev, location: e.target.value as Location}))}
                      className="mr-2"
                    />
                    Manchester
                  </label>
                </div>
              </div>
            </div>

            {/* About */}
            <div>
              <label className="text-sm font-medium text-foreground">About Me</label>
              <Textarea 
                className="mt-1" 
                rows={3}
                placeholder="Tell colleagues about yourself, your interests, and what you're passionate about..."
                value={formData.about}
                onChange={(e) => setFormData(prev => ({...prev, about: e.target.value}))}
              />
            </div>

            {/* Skills */}
            <div>
              <label className="text-sm font-medium text-foreground mb-3 block">Skills & Expertise</label>
              <div className="flex flex-wrap gap-2 mb-4">
                {formData.skillTags.map((skill) => (
                  <Badge 
                    key={skill} 
                    variant="secondary" 
                    className="bg-primary/10 text-primary hover:bg-primary/20 cursor-pointer"
                    onClick={() => removeSkill(skill)}
                  >
                    {skill}
                    <X className="w-3 h-3 ml-1" />
                  </Badge>
                ))}
              </div>
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
            </div>

            {/* Experiences */}
            <div>
              <div className="flex justify-between items-center mb-4">
                <label className="text-sm font-medium text-foreground">Professional Experience</label>
              </div>
              
              <div className="space-y-4">
                {formData.previousExperiences?.map((exp, index) => (
                  <Card key={index} className="p-4 border-accent/30">
                    <div className="flex justify-between items-start mb-4">
                      <h4 className="font-medium text-foreground">Experience Entry</h4>
                      <Button 
                        onClick={() => removeExperience(index)}
                        variant="ghost" 
                        size="sm"
                        className="text-destructive hover:text-destructive"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                    
                    <div className="mb-4 p-4 bg-background/50 rounded-lg">
                      <h5 className="font-medium">{exp.role}</h5>
                      <p className="text-sm text-muted-foreground">{exp.project}</p>
                      <p className="text-xs text-muted-foreground">
                        {exp.startDate ? new Date(exp.startDate).toLocaleDateString() : 'No start date'} - 
                        {exp.endDate ? new Date(exp.endDate).toLocaleDateString() : 'No end date'}
                      </p>
                      <p className="text-sm mt-2">{exp.description}</p>
                    </div>
                  </Card>
                ))}
                
                {/* Add New Experience Form */}
                <Card className="p-4 bg-background/30 rounded-lg border-2 border-dashed border-primary/30">
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
                </Card>
              </div>
            </div>

            {/* Create Button */}
            <Button 
              onClick={handleCreateProfile}
              disabled={!!emailError || !formData.email.endsWith('@solirius.com') || !formData.name.trim() || !formData.currentRole.trim()}
              className="w-full bg-gradient-primary text-primary-foreground shadow-glow hover:shadow-soft transition-all duration-300 py-6 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Create Profile & Join Directory
            </Button>
          </div>
        </Card>
      </main>
    </div>
  );
}
