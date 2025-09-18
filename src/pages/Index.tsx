import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ProgressIndicator } from "@/components/ui/progress-indicator";
import { StoryChapter } from "@/components/story/story-chapter";
import { ProfileForm } from "@/components/staff-repository/profile-form";
import { SearchInterface } from "@/components/staff-repository/search-interface";
import { ConnectionSuccess } from "@/components/staff-repository/connection-success";
import { ChevronRight, Users, Search, UserPlus, Building } from "lucide-react";
import alexOffice from "@/assets/alex-office.jpg";

const Index = () => {
  const [currentChapter, setCurrentChapter] = useState(0);
  
  const nextChapter = () => setCurrentChapter(prev => prev + 1);

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Building className="w-8 h-8 text-primary" />
            <h1 className="text-3xl font-bold text-foreground">Solirius Staff Repository</h1>
          </div>
          <p className="text-lg text-muted-foreground mb-6">Alex's Journey of Discovery</p>
          <ProgressIndicator currentStep={currentChapter + 1} totalSteps={5} className="max-w-md mx-auto" />
        </div>

        {/* Story Chapters */}
        <div className="max-w-6xl mx-auto space-y-8">
          {/* Chapter 1: Introduction */}
          {currentChapter >= 0 && (
            <StoryChapter>
              <div className="grid md:grid-cols-2 gap-8 items-center">
                <div>
                  <h2 className="text-2xl font-bold text-foreground mb-4">Chapter 1: A New Beginning</h2>
                  <div className="space-y-4 text-foreground/80">
                    <p>
                      Alex Kumar stepped into the bustling Solirius office on his first Monday morning, coffee in hand and laptop bag 
                      slung over his shoulder. The sleek glass walls and collaborative spaces impressed him, but as he navigated 
                      through the maze of desks and meeting rooms, a familiar feeling crept in—he was lost.
                    </p>
                    <p>
                      "Where's the coffee machine again?" he muttered to himself, having already forgotten the directions from the 
                      brief office tour on Friday. More importantly, he had a challenging project deadline approaching and desperately 
                      needed to find someone who could help him with business case writing—but who?
                    </p>
                    <p>
                      That's when his manager mentioned something that would change everything: <strong>"Have you checked out our 
                      Staff Repository yet? It's a game-changer for finding the right people."</strong>
                    </p>
                  </div>
                  {currentChapter === 0 && (
                    <Button 
                      onClick={nextChapter}
                      className="mt-6 bg-gradient-primary text-primary-foreground shadow-glow"
                    >
                      Discover the Staff Repository <ChevronRight className="w-4 h-4 ml-2" />
                    </Button>
                  )}
                </div>
                <div>
                  <img 
                    src={alexOffice} 
                    alt="Alex in the office" 
                    className="rounded-lg shadow-soft w-full"
                  />
                </div>
              </div>
            </StoryChapter>
          )}

          {/* Chapter 2: Discovering the Tool */}
          {currentChapter >= 1 && (
            <StoryChapter variant="highlight">
              <div className="text-center">
                <Users className="w-16 h-16 text-primary mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-foreground mb-4">Chapter 2: First Impressions</h2>
                <div className="max-w-3xl mx-auto space-y-4 text-foreground/80">
                  <p>
                    Alex opened his laptop and navigated to the internal portal. There it was—the <strong>Solirius Staff Repository</strong>. 
                    The clean, intuitive interface immediately caught his attention. Unlike the overwhelming corporate directories he'd 
                    used at previous companies, this felt... human.
                  </p>
                  <p>
                    "Create your profile to get started," the welcome message read. Alex hesitated for a moment. He'd always been 
                    a bit shy about putting himself out there, but the thoughtful privacy controls he noticed gave him confidence. 
                    He could control exactly who saw what information.
                  </p>
                  <p>
                    <em>"Maybe this won't be so bad after all,"</em> he thought, rolling up his sleeves to get started.
                  </p>
                </div>
                {currentChapter === 1 && (
                  <Button 
                    onClick={nextChapter}
                    className="mt-6 bg-gradient-primary text-primary-foreground shadow-glow"
                  >
                    Help Alex Create His Profile <UserPlus className="w-4 h-4 ml-2" />
                  </Button>
                )}
              </div>
            </StoryChapter>
          )}

          {/* Chapter 3: Creating Profile */}
          {currentChapter >= 2 && (
            <StoryChapter variant="interactive">
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-foreground mb-4">Chapter 3: Building His Digital Identity</h2>
                <p className="text-foreground/80 max-w-2xl mx-auto">
                  Alex carefully fills out his profile, taking time to showcase his skills while using the privacy settings 
                  to feel comfortable about sharing his information with colleagues.
                </p>
              </div>
              
              <ProfileForm onComplete={currentChapter === 2 ? nextChapter : () => {}} />
              
              {currentChapter > 2 && (
                <div className="mt-6 text-center">
                  <div className="inline-flex items-center gap-2 bg-success/20 text-success px-4 py-2 rounded-full">
                    <UserPlus className="w-4 h-4" />
                    Profile Created Successfully!
                  </div>
                </div>
              )}
            </StoryChapter>
          )}

          {/* Chapter 4: The Search */}
          {currentChapter >= 3 && (
            <StoryChapter variant={currentChapter === 3 ? "interactive" : "default"}>
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-foreground mb-4">Chapter 4: The Search for Expertise</h2>
                <div className="max-w-3xl mx-auto space-y-4 text-foreground/80">
                  <p>
                    With his profile complete, Alex felt a surge of confidence. Now came the real test—finding someone who could 
                    help him with his business case. He remembered his project requirements: he needed someone experienced in 
                    financial modeling, stakeholder communication, and most importantly, business case writing.
                  </p>
                  <p>
                    <em>"Here goes nothing,"</em> he thought as he clicked on the search function.
                  </p>
                </div>
              </div>

              <SearchInterface onConnect={currentChapter === 3 ? nextChapter : () => {}} />
            </StoryChapter>
          )}

          {/* Chapter 5: Success and Connection */}
          {currentChapter >= 4 && (
            <StoryChapter variant="interactive">
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-foreground mb-4">Chapter 5: Connection Made</h2>
                <div className="max-w-3xl mx-auto space-y-4 text-foreground/80 mb-8">
                  <p>
                    Alex couldn't believe it—Sarah Chen was exactly what he was looking for! Her profile showed extensive 
                    experience in business case development, and her recent projects were directly relevant to his needs. 
                    Better yet, she was available and seemed approachable.
                  </p>
                  <p>
                    With a deep breath, Alex clicked "Connect" and sent a brief message explaining his project and asking 
                    for guidance. To his surprise, Sarah responded within minutes with enthusiasm and helpful suggestions.
                  </p>
                </div>
              </div>

              <ConnectionSuccess />

              <div className="mt-8 text-center">
                <Card className="p-6 bg-gradient-primary text-primary-foreground shadow-glow max-w-2xl mx-auto">
                  <h3 className="text-xl font-bold mb-4">The End... or Just the Beginning?</h3>
                  <p className="mb-4">
                    Alex's simple search transformed his experience at Solirius. What started as feeling lost in a new office 
                    became a story of connection, collaboration, and confidence. The Staff Repository didn't just help him 
                    find expertise—it helped him build relationships.
                  </p>
                  <p className="text-sm opacity-90">
                    Within a week, Alex had not only completed his business case with Sarah's mentorship but had also connected 
                    with three other colleagues who became valuable collaborators on future projects. He went from feeling 
                    isolated to feeling truly part of the Solirius community.
                  </p>
                </Card>
              </div>
            </StoryChapter>
          )}
        </div>

        {/* Footer */}
        <div className="text-center mt-12 py-8 border-t border-border">
          <p className="text-muted-foreground">
            Experience the power of connection with the Solirius Staff Repository
          </p>
        </div>
      </div>
    </div>
  );
};

export default Index;
