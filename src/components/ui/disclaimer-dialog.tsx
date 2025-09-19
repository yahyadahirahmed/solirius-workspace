import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Shield, AlertTriangle } from "lucide-react";

interface DisclaimerDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  type: "skill" | "experience";
}

export function DisclaimerDialog({ open, onOpenChange, type }: DisclaimerDialogProps) {
  const [dontShowAgain, setDontShowAgain] = useState(false);

  const handleConfirm = () => {
    if (dontShowAgain) {
      localStorage.setItem(`disclaimer-${type}-dismissed`, "true");
    }
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-primary" />
            Privacy & Information Guidelines
          </DialogTitle>
          <DialogDescription>
            Before adding {type === "skill" ? "skills" : "experience"}, please review these important guidelines.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="flex items-start gap-3 p-3 bg-accent/50 rounded-lg border border-accent">
            <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
            <div className="space-y-2">
              <h4 className="font-medium text-foreground">Personal Information</h4>
              <p className="text-sm text-muted-foreground">
                Please avoid including personal details such as home addresses, personal phone numbers, 
                private email addresses, or any sensitive personal information.
              </p>
            </div>
          </div>
          
          <div className="flex items-start gap-3 p-3 bg-primary/5 rounded-lg border border-primary/20">
            <Shield className="w-5 h-5 text-primary shrink-0 mt-0.5" />
            <div className="space-y-2">
              <h4 className="font-medium text-foreground">Visibility Encouraged</h4>
              <p className="text-sm text-muted-foreground">
                We encourage keeping your {type === "skill" ? "skills" : "experience"} visible to help 
                colleagues discover your expertise and facilitate collaboration across teams.
              </p>
            </div>
          </div>
        </div>

        <DialogFooter className="flex-col sm:flex-row gap-2">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <input
              type="checkbox"
              id="dont-show"
              checked={dontShowAgain}
              onChange={(e) => setDontShowAgain(e.target.checked)}
              className="rounded border-input"
            />
            <label htmlFor="dont-show" className="cursor-pointer">
              Don't show this again
            </label>
          </div>
          <Button onClick={handleConfirm} className="bg-gradient-primary text-primary-foreground">
            I Understand
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}