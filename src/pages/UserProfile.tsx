import { useParams, useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { ArrowLeft, MapPin, Calendar, MessageCircle, Mail, Phone, Briefcase, Award } from "lucide-react";
import sarahChen from "@/assets/profiles/sarah-chen.jpg";
import marcusJohnson from "@/assets/profiles/marcus-johnson.jpg";
import emilyRodriguez from "@/assets/profiles/emily-rodriguez.jpg";
import davidKim from "@/assets/profiles/david-kim.jpg";
import lisaThompson from "@/assets/profiles/lisa-thompson.jpg";
import jamesWilson from "@/assets/profiles/james-wilson.jpg";

const teamMembers = [
  {
    id: 1,
    name: "Sarah Chen",
    role: "Senior Full Stack Developer",
    department: "Engineering",
    location: "London, UK",
    image: sarahChen,
    description: "Passionate full-stack developer with 6+ years of experience building scalable web applications. I love working with modern technologies and mentoring junior developers.",
    skills: ["React", "TypeScript", "Node.js", "Python", "AWS", "PostgreSQL", "GraphQL", "Docker", "Jest", "Git"],
    email: "sarah.chen@solirius.com",
    phone: "+44 20 1234 5678",
    joinDate: "March 2019",
    experience: [
      {
        title: "Senior Full Stack Developer",
        company: "Solirius Consulting",
        duration: "March 2019 - Present",
        description: "Leading development of enterprise web applications using React, TypeScript, and Node.js. Mentoring team of 4 junior developers and implementing best practices for code quality and testing.",
        skills: ["React", "TypeScript", "Node.js", "AWS"]
      },
      {
        title: "Full Stack Developer",
        company: "TechStart Ltd",
        duration: "June 2017 - February 2019", 
        description: "Developed and maintained multiple client projects using modern web technologies. Collaborated with design team to implement responsive user interfaces.",
        skills: ["JavaScript", "Python", "Django", "PostgreSQL"]
      }
    ]
  },
  {
    id: 2,
    name: "Marcus Johnson",
    role: "DevOps Engineer",
    department: "Infrastructure",
    location: "Manchester, UK",
    image: marcusJohnson,
    description: "DevOps specialist focused on automation, scalability, and reliability. Expert in cloud infrastructure and container orchestration with 5+ years of experience.",
    skills: ["AWS", "Kubernetes", "Docker", "Terraform", "Jenkins", "Prometheus", "Grafana", "Linux", "Python", "Bash"],
    email: "marcus.johnson@solirius.com",
    phone: "+44 161 234 5678",
    joinDate: "August 2020",
    experience: [
      {
        title: "DevOps Engineer",
        company: "Solirius Consulting",
        duration: "August 2020 - Present",
        description: "Managing cloud infrastructure and CI/CD pipelines. Implemented monitoring solutions and automated deployment processes reducing deployment time by 75%.",
        skills: ["AWS", "Kubernetes", "Terraform", "Jenkins"]
      },
      {
        title: "Systems Administrator",
        company: "CloudTech Solutions",
        duration: "January 2018 - July 2020",
        description: "Maintained Linux servers and implemented backup solutions. Migrated legacy systems to cloud infrastructure.",
        skills: ["Linux", "Docker", "AWS", "Monitoring"]
      }
    ]
  },
  {
    id: 3,
    name: "Emily Rodriguez",
    role: "UX/UI Designer",
    department: "Design",
    location: "Remote",
    image: emilyRodriguez,
    description: "Creative designer passionate about user-centered design and accessibility. Experience in both web and mobile design with focus on creating inclusive digital experiences.",
    skills: ["Figma", "Adobe Creative Suite", "User Research", "Prototyping", "Accessibility", "Design Systems", "Sketch", "InVision", "Usability Testing", "Wireframing"],
    email: "emily.rodriguez@solirius.com",
    phone: "+34 91 234 5678",
    joinDate: "January 2021",
    experience: [
      {
        title: "UX/UI Designer",
        company: "Solirius Consulting",
        duration: "January 2021 - Present",
        description: "Leading design for multiple client projects. Conducted user research and created design systems that improved user satisfaction by 40%.",
        skills: ["Figma", "User Research", "Prototyping", "Design Systems"]
      },
      {
        title: "Junior UX Designer",
        company: "Design Studio Pro",
        duration: "March 2019 - December 2020",
        description: "Worked on mobile app designs and web interfaces. Collaborated with developers to ensure design implementation quality.",
        skills: ["Sketch", "Adobe XD", "Wireframing", "User Testing"]
      }
    ]
  },
  {
    id: 4,
    name: "David Kim",
    role: "Data Scientist",
    department: "Analytics",
    location: "Edinburgh, UK", 
    image: davidKim,
    description: "Data scientist with expertise in machine learning and statistical analysis. Love turning complex data into actionable insights that drive business decisions.",
    skills: ["Python", "R", "Machine Learning", "SQL", "TensorFlow", "Pandas", "Scikit-learn", "Tableau", "Power BI", "Statistics"],
    email: "david.kim@solirius.com",
    phone: "+44 131 234 5678",
    joinDate: "September 2020",
    experience: [
      {
        title: "Data Scientist",
        company: "Solirius Consulting",
        duration: "September 2020 - Present",
        description: "Building predictive models and analytics dashboards. Developed ML models that improved client decision making and reduced operational costs by 25%.",
        skills: ["Python", "Machine Learning", "TensorFlow", "SQL"]
      },
      {
        title: "Data Analyst",
        company: "Analytics Corp",
        duration: "June 2018 - August 2020",
        description: "Created reports and visualizations for business stakeholders. Analyzed customer behavior patterns and market trends.",
        skills: ["R", "SQL", "Tableau", "Statistics"]
      }
    ]
  },
  {
    id: 5,
    name: "Lisa Thompson",
    role: "Product Manager",
    department: "Product",
    location: "Birmingham, UK",
    image: lisaThompson,
    description: "Product manager with a background in software engineering. Expert in agile methodologies and passionate about delivering user-centric products that solve real problems.",
    skills: ["Product Strategy", "Agile", "Roadmapping", "Analytics", "User Stories", "Scrum", "Jira", "A/B Testing", "Market Research", "Stakeholder Management"],
    email: "lisa.thompson@solirius.com",
    phone: "+44 121 234 5678",
    joinDate: "February 2020",
    experience: [
      {
        title: "Product Manager",
        company: "Solirius Consulting",
        duration: "February 2020 - Present",
        description: "Managing product roadmap and feature prioritization. Led successful launch of 3 major products resulting in 150% increase in user engagement.",
        skills: ["Product Strategy", "Agile", "Roadmapping", "Analytics"]
      },
      {
        title: "Technical Product Owner",
        company: "StartupTech",
        duration: "April 2018 - January 2020",
        description: "Worked closely with engineering teams to deliver features. Managed product backlog and coordinated with stakeholders.",
        skills: ["Scrum", "User Stories", "Jira", "Stakeholder Management"]
      }
    ]
  },
  {
    id: 6,
    name: "James Wilson",
    role: "Security Engineer",
    department: "Security",
    location: "London, UK",
    image: jamesWilson,
    description: "Cybersecurity specialist focused on application security and threat detection. Passionate about protecting digital assets and educating teams on security best practices.",
    skills: ["Security", "Penetration Testing", "Risk Assessment", "Compliance", "OWASP", "Vulnerability Assessment", "Incident Response", "Firewalls", "SIEM", "Cryptography"],
    email: "james.wilson@solirius.com",
    phone: "+44 20 9876 5432",
    joinDate: "November 2019",
    experience: [
      {
        title: "Security Engineer",
        company: "Solirius Consulting",
        duration: "November 2019 - Present",
        description: "Implementing security frameworks and conducting security assessments. Reduced security incidents by 60% through proactive monitoring and team training.",
        skills: ["Penetration Testing", "Risk Assessment", "OWASP", "SIEM"]
      },
      {
        title: "Cybersecurity Analyst",
        company: "SecureNet Ltd",
        duration: "January 2017 - October 2019",
        description: "Monitored network security and responded to incidents. Conducted vulnerability assessments and security audits.",
        skills: ["Vulnerability Assessment", "Incident Response", "Firewalls", "Compliance"]
      }
    ]
  }
];

export default function UserProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const user = teamMembers.find(member => member.id === parseInt(id || "0"));
  
  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/20 flex items-center justify-center">
        <Card className="p-8 text-center">
          <h2 className="text-2xl font-bold text-foreground mb-2">User Not Found</h2>
          <p className="text-muted-foreground mb-4">The requested profile could not be found.</p>
          <Button onClick={() => navigate('/dashboard')}>Back to Dashboard</Button>
        </Card>
      </div>
    );
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

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          {/* Profile Header */}
          <Card className="p-8 bg-gradient-subtle border-primary/20">
            <div className="flex flex-col md:flex-row gap-8">
              <div className="flex flex-col items-center md:items-start">
                <Avatar className="w-32 h-32 border-4 border-primary/20 mb-4">
                  <AvatarImage src={user.image} alt={user.name} />
                  <AvatarFallback className="text-2xl">{user.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                </Avatar>
                <div className="flex gap-2">
                  <Button className="bg-gradient-primary text-primary-foreground shadow-glow">
                    <MessageCircle className="w-4 h-4 mr-2" />
                    Connect
                  </Button>
                  <Button variant="outline" className="border-primary/30">
                    <Mail className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              
              <div className="flex-1 space-y-4">
                <div>
                  <h2 className="text-3xl font-bold text-foreground">{user.name}</h2>
                  <p className="text-xl text-primary font-medium">{user.role}</p>
                  <div className="flex flex-wrap gap-4 mt-2 text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Briefcase className="w-4 h-4" />
                      {user.department}
                    </div>
                    <div className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      {user.location}
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      Joined {user.joinDate}
                    </div>
                  </div>
                </div>
                
                <p className="text-foreground leading-relaxed">{user.description}</p>
                
                <div className="grid md:grid-cols-2 gap-4 pt-4 border-t border-accent/30">
                  <div>
                    <div className="flex items-center gap-1 text-muted-foreground mb-1">
                      <Mail className="w-4 h-4" />
                      <span className="text-sm">Email</span>
                    </div>
                    <p className="text-foreground">{user.email}</p>
                  </div>
                  <div>
                    <div className="flex items-center gap-1 text-muted-foreground mb-1">
                      <Phone className="w-4 h-4" />
                      <span className="text-sm">Phone</span>
                    </div>
                    <p className="text-foreground">{user.phone}</p>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* Skills */}
          <Card className="p-6">
            <h3 className="text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
              <Award className="w-5 h-5 text-primary" />
              Skills & Expertise
            </h3>
            <div className="flex flex-wrap gap-2">
              {user.skills.map((skill) => (
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

          {/* Experience */}
          <Card className="p-6">
            <h3 className="text-xl font-semibold text-foreground mb-6 flex items-center gap-2">
              <Briefcase className="w-5 h-5 text-primary" />
              Professional Experience
            </h3>
            <div className="space-y-6">
              {user.experience.map((exp, index) => (
                <div key={index} className="border-l-2 border-primary/20 pl-6 pb-6 last:pb-0 relative">
                  <div className="absolute w-3 h-3 bg-primary rounded-full -left-2 top-1"></div>
                  <div className="space-y-3">
                    <div>
                      <h4 className="text-lg font-semibold text-foreground">{exp.title}</h4>
                      <p className="text-primary font-medium">{exp.company}</p>
                      <p className="text-sm text-muted-foreground">{exp.duration}</p>
                    </div>
                    <p className="text-foreground leading-relaxed">{exp.description}</p>
                    <div className="flex flex-wrap gap-1">
                      {exp.skills.map((skill) => (
                        <Badge 
                          key={skill} 
                          variant="outline" 
                          className="text-xs border-accent text-muted-foreground"
                        >
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </main>
    </div>
  );
}