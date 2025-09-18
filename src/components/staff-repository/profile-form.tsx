import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Switch } from "@/components/ui/switch";
import { Camera, MapPin, Briefcase, Award, Users, Eye, EyeOff } from "lucide-react";
import alexProfile from "@/assets/alex-profile.jpg";

interface ProfileFormProps {
  onComplete: () => void;
}

export function ProfileForm({ onComplete }: ProfileFormProps) {
  const skills = ["JavaScript", "React", "TypeScript", "Node.js", "Problem Solving"];
  
  return (
    <Card className="p-6 max-w-2xl mx-auto bg-gradient-subtle border-primary/20">
      <div className="space-y-6">
        <div className="text-center">
          <h3 className="text-2xl font-bold text-foreground mb-2">Create Your Profile</h3>
          <p className="text-muted-foreground">Let your colleagues get to know you better</p>
        </div>

        <div className="flex justify-center">
          <div className="relative">
            <Avatar className="w-24 h-24 border-4 border-primary/20">
              <AvatarImage src={alexProfile} alt="Alex" />
              <AvatarFallback>AK</AvatarFallback>
            </Avatar>
            <Button
              size="sm"
              className="absolute bottom-0 right-0 rounded-full w-8 h-8 p-0 bg-primary shadow-glow"
              variant="default"
            >
              <Camera className="w-4 h-4" />
            </Button>
          </div>
        </div>

        <div className="grid gap-4">
          <div>
            <label className="text-sm font-medium text-foreground">Full Name</label>
            <Input defaultValue="Alex Kumar" className="mt-1" />
          </div>
          
          <div>
            <label className="text-sm font-medium text-foreground">Role</label>
            <Input defaultValue="Software Developer" className="mt-1" />
          </div>
          
          <div>
            <label className="text-sm font-medium text-foreground">Department</label>
            <Input defaultValue="Technology Solutions" className="mt-1" />
          </div>
          
          <div>
            <label className="text-sm font-medium text-foreground">Location</label>
            <div className="flex items-center mt-1">
              <MapPin className="w-4 h-4 text-muted-foreground mr-2" />
              <Input defaultValue="London Office, Floor 3" />
            </div>
          </div>
        </div>

        <div>
          <label className="text-sm font-medium text-foreground">About Me</label>
          <Textarea 
            className="mt-1" 
            rows={3}
            defaultValue="I'm passionate about creating user-friendly applications and solving complex problems. I enjoy collaborating with cross-functional teams and am always eager to learn new technologies."
          />
        </div>

        <div>
          <label className="text-sm font-medium text-foreground mb-3 block">Skills & Expertise</label>
          <div className="flex flex-wrap gap-2">
            {skills.map((skill) => (
              <Badge key={skill} variant="secondary" className="bg-primary/10 text-primary hover:bg-primary/20">
                {skill}
              </Badge>
            ))}
          </div>
        </div>

        <div>
          <label className="text-sm font-medium text-foreground">Past Projects</label>
          <Textarea 
            className="mt-1" 
            rows={2}
            defaultValue="• Led development of customer portal (React/Node.js)
• Improved legacy system performance by 40%
• Mentored 2 junior developers"
          />
        </div>

        <Card className="p-4 bg-secondary/50 border-accent/30">
          <h4 className="font-medium text-foreground mb-3 flex items-center">
            <Eye className="w-4 h-4 mr-2" />
            Privacy & Visibility Settings
          </h4>
          <div className="space-y-3">
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

        <Button 
          onClick={onComplete}
          className="w-full bg-gradient-primary text-primary-foreground shadow-glow hover:shadow-soft transition-all duration-300"
        >
          Create Profile
        </Button>
      </div>
    </Card>
  );
}