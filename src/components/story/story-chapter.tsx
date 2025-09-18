import { ReactNode } from "react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface StoryChapterProps {
  children: ReactNode;
  className?: string;
  variant?: "default" | "highlight" | "interactive";
}

export function StoryChapter({ children, className, variant = "default" }: StoryChapterProps) {
  return (
    <Card className={cn(
      "p-8 transition-all duration-700 hover:shadow-soft",
      variant === "highlight" && "bg-gradient-subtle border-primary/20",
      variant === "interactive" && "bg-gradient-warm border-accent/30 shadow-glow",
      className
    )}>
      {children}
    </Card>
  );
}