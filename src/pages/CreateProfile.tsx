import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Switch } from "@/components/ui/switch";
import { DisclaimerDialog } from "@/components/ui/disclaimer-dialog";
import { Camera, MapPin, Plus, X, Eye, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import alexProfile from "@/assets/alex-profile.jpg";

interface Experience {
  id: string;
  title: string;
  company: string;
  duration: string;
  description: string;
  skills: string[];
}

export default function CreateProfile() {
  const navigate = useNavigate();
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [skills, setSkills] = useState<string[]>([]);
  const [newSkill, setNewSkill] = useState("");
  const [showSkillDisclaimer, setShowSkillDisclaimer] = useState(false);
  const [showExperienceDisclaimer, setShowExperienceDisclaimer] = useState(false);

  const addExperience = () => {
    // Always show disclaimer when adding experience
    setShowExperienceDisclaimer(true);
  };

  const handleAddExperienceAfterDisclaimer = () => {
    const newExp: Experience = {
      id: Date.now().toString(),
      title: "",
      company: "",
      duration: "",
      description: "",
      skills: []
    };
    setExperiences([...experiences, newExp]);
  };

  const removeExperience = (id: string) => {
    setExperiences(experiences.filter(exp => exp.id !== id));
  };

  const updateExperience = (id: string, field: keyof Experience, value: string) => {
    setExperiences(experiences.map(exp => 
      exp.id === id ? { ...exp, [field]: value } : exp
    ));
  };

  const addSkill = () => {
    if (!newSkill.trim() || skills.includes(newSkill.trim())) {
      return;
    }

    const alreadyDismissed = localStorage.getItem('disclaimer-skill-dismissed') === 'true';
    
    if (!alreadyDismissed) {
      setShowSkillDisclaimer(true);
      return;
    }
    
    setSkills([...skills, newSkill.trim()]);
    setNewSkill("");
  };

  const handleAddSkillAfterDisclaimer = () => {
    if (newSkill.trim() && !skills.includes(newSkill.trim())) {
      setSkills([...skills, newSkill.trim()]);
      setNewSkill("");
    }
  };

  const removeSkill = (skill: string) => {
    setSkills(skills.filter(s => s !== skill));
  };

  const handleCreateProfile = () => {
    navigate('/dashboard');
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
                <label className="text-sm font-medium text-foreground">Full Name</label>
                <Input placeholder="Enter your full name" className="mt-1" />
              </div>
              
              <div>
                <label className="text-sm font-medium text-foreground">Job Title</label>
                <Input placeholder="e.g., Senior Software Developer" className="mt-1" />
              </div>
              
              <div>
                <label className="text-sm font-medium text-foreground">Department</label>
                <Input placeholder="e.g., Technology Solutions" className="mt-1" />
              </div>
              
              <div>
                <label className="text-sm font-medium text-foreground">Location</label>
                <div className="flex items-center mt-1">
                  <MapPin className="w-4 h-4 text-muted-foreground mr-2" />
                  <Input placeholder="e.g., London Office, Floor 3" />
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
              />
            </div>

            {/* Skills */}
            <div>
              <label className="text-sm font-medium text-foreground mb-3 block">Skills & Expertise</label>
              <div className="flex flex-wrap gap-2 mb-4">
                {skills.map((skill) => (
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
                <Button onClick={addExperience} variant="outline" size="sm" className="border-primary/30">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Experience
                </Button>
              </div>
              
              <div className="space-y-4">
                {experiences.map((exp) => (
                  <Card key={exp.id} className="p-4 border-accent/30">
                    <div className="flex justify-between items-start mb-4">
                      <h4 className="font-medium text-foreground">Experience Entry</h4>
                      <Button 
                        onClick={() => removeExperience(exp.id)}
                        variant="ghost" 
                        size="sm"
                        className="text-destructive hover:text-destructive"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                    
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs font-medium text-muted-foreground">Job Title</label>
                        <Input 
                          placeholder="e.g., Senior Consultant"
                          value={exp.title}
                          onChange={(e) => updateExperience(exp.id, 'title', e.target.value)}
                          className="mt-1"
                        />
                      </div>
                      
                      <div>
                        <label className="text-xs font-medium text-muted-foreground">Company/Project</label>
                        <Input 
                          placeholder="e.g., Solirius Consulting"
                          value={exp.company}
                          onChange={(e) => updateExperience(exp.id, 'company', e.target.value)}
                          className="mt-1"
                        />
                      </div>
                    </div>
                    
                    <div className="mt-4">
                      <label className="text-xs font-medium text-muted-foreground">Duration</label>
                      <Input 
                        placeholder="e.g., 2020 - Present"
                        value={exp.duration}
                        onChange={(e) => updateExperience(exp.id, 'duration', e.target.value)}
                        className="mt-1"
                      />
                    </div>
                    
                    <div className="mt-4">
                      <label className="text-xs font-medium text-muted-foreground">Description</label>
                      <Textarea 
                        placeholder="Describe your role, achievements, and key projects..."
                        value={exp.description}
                        onChange={(e) => updateExperience(exp.id, 'description', e.target.value)}
                        className="mt-1"
                        rows={2}
                      />
                    </div>
                  </Card>
                ))}
              </div>
            </div>

            {/* Privacy Settings */}
            <Card className="p-6 bg-secondary/50 border-accent/30">
              <h4 className="font-medium text-foreground mb-4 flex items-center">
                <Eye className="w-4 h-4 mr-2" />
                Privacy & Visibility Settings
              </h4>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-foreground">Profile visible to all Solirius employees</span>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-foreground">Show contact information</span>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-foreground">Allow direct messages</span>
                  <Switch />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-foreground">Include in skill-based searches</span>
                  <Switch defaultChecked />
                </div>
              </div>
            </Card>

            {/* Create Button */}
            <Button 
              onClick={handleCreateProfile}
              className="w-full bg-gradient-primary text-primary-foreground shadow-glow hover:shadow-soft transition-all duration-300 py-6 text-lg"
            >
              Create Profile & Join Directory
            </Button>
          </div>
        </Card>

        {/* Disclaimer Dialogs */}
        <DisclaimerDialog
          open={showSkillDisclaimer}
          onOpenChange={(open) => {
            setShowSkillDisclaimer(open);
            if (!open) handleAddSkillAfterDisclaimer();
          }}
          type="skill"
        />
        
        <DisclaimerDialog
          open={showExperienceDisclaimer}
          onOpenChange={(open) => {
            setShowExperienceDisclaimer(open);
            if (!open) handleAddExperienceAfterDisclaimer();
          }}
          type="experience"
        />
      </main>
    </div>
  );
}