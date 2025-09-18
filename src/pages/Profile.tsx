import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Camera, MapPin, Plus, X, Eye, ArrowLeft, Edit3, Save } from "lucide-react";
import { useNavigate } from "react-router-dom";
import alexProfile from "@/assets/alex-profile.jpg";

export default function Profile() {
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [skills, setSkills] = useState(["JavaScript", "React", "TypeScript", "Node.js", "Problem Solving"]);
  const [newSkill, setNewSkill] = useState("");

  const addSkill = () => {
    if (newSkill.trim() && !skills.includes(newSkill.trim())) {
      setSkills([...skills, newSkill.trim()]);
      setNewSkill("");
    }
  };

  const removeSkill = (skill: string) => {
    setSkills(skills.filter(s => s !== skill));
  };

  const handleSave = () => {
    setIsEditing(false);
    // Save logic would go here
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
                onClick={() => setIsEditing(!isEditing)}
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
                  <AvatarImage src={alexProfile} alt="Alex Kumar" />
                  <AvatarFallback>AK</AvatarFallback>
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
                    <Input defaultValue="Alex Kumar" className="text-2xl font-bold" />
                    <Input defaultValue="Software Developer" />
                    <div className="flex items-center">
                      <MapPin className="w-4 h-4 text-muted-foreground mr-2" />
                      <Input defaultValue="Technology Solutions • London Office, Floor 3" />
                    </div>
                  </div>
                ) : (
                  <div>
                    <h2 className="text-3xl font-bold text-foreground">Alex Kumar</h2>
                    <p className="text-xl text-muted-foreground">Software Developer</p>
                    <div className="flex items-center justify-center md:justify-start text-muted-foreground mt-2">
                      <MapPin className="w-4 h-4 mr-2" />
                      Technology Solutions • London Office, Floor 3
                    </div>
                  </div>
                )}
              </div>
            </div>
          </Card>

          {/* Profile Content */}
          <Tabs defaultValue="overview" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="experience">Experience</TabsTrigger>
              <TabsTrigger value="privacy">Privacy</TabsTrigger>
            </TabsList>
            
            <TabsContent value="overview" className="space-y-6">
              {/* About */}
              <Card className="p-6 bg-gradient-subtle border-primary/20">
                <h3 className="text-lg font-semibold text-foreground mb-4">About Me</h3>
                {isEditing ? (
                  <Textarea 
                    defaultValue="I'm passionate about creating user-friendly applications and solving complex problems. I enjoy collaborating with cross-functional teams and am always eager to learn new technologies."
                    rows={4}
                  />
                ) : (
                  <p className="text-foreground">
                    I'm passionate about creating user-friendly applications and solving complex problems. 
                    I enjoy collaborating with cross-functional teams and am always eager to learn new technologies.
                  </p>
                )}
              </Card>

              {/* Skills */}
              <Card className="p-6 bg-gradient-subtle border-primary/20">
                <h3 className="text-lg font-semibold text-foreground mb-4">Skills & Expertise</h3>
                <div className="space-y-4">
                  <div className="flex flex-wrap gap-2">
                    {skills.map((skill) => (
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
                  {isEditing && (
                    <Button variant="outline" size="sm" className="border-primary/30">
                      <Plus className="w-4 h-4 mr-2" />
                      Add Experience
                    </Button>
                  )}
                </div>
                
                <div className="space-y-4">
                  <div className="border-l-2 border-primary/20 pl-4">
                    <h4 className="font-medium text-foreground">Software Developer</h4>
                    <p className="text-sm text-muted-foreground">Solirius Consulting • 2022 - Present</p>
                    <p className="text-sm text-foreground mt-2">
                      Led development of customer portal using React and Node.js. 
                      Improved legacy system performance by 40% and mentored 2 junior developers.
                    </p>
                  </div>
                </div>
              </Card>
            </TabsContent>
            
            <TabsContent value="privacy" className="space-y-6">
              <Card className="p-6 bg-secondary/50 border-accent/30">
                <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center">
                  <Eye className="w-5 h-5 mr-2" />
                  Privacy & Visibility Settings
                </h3>
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
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
}