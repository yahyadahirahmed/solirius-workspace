// import { Card } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
// import { CheckCircle, MessageCircle, Calendar, Coffee } from "lucide-react";

// interface ConnectionSuccessProps {
//   employeeName?: string;
//   employeeInitials?: string;
// }

// export function ConnectionSuccess({ employeeName = "a colleague", employeeInitials = "CO" }: ConnectionSuccessProps) {
//   return (
//     <Card className="p-8 max-w-2xl mx-auto bg-gradient-warm border-success/30 shadow-glow text-center">
//       <div className="space-y-6">
//         <div className="flex justify-center">
//           <CheckCircle className="w-16 h-16 text-success" />
//         </div>
        
//         <div>
//           <h3 className="text-2xl font-bold text-foreground mb-2">Connection Successful!</h3>
//           <p className="text-foreground/80">You've successfully connected with {employeeName}</p>
//         </div>

//         <div className="flex justify-center">
//           <Avatar className="w-20 h-20 border-4 border-success/30">
//             <AvatarFallback>{employeeInitials}</AvatarFallback>
//           </Avatar>
//         </div>

//         <div className="bg-card/50 rounded-lg p-4">
//           <p className="text-sm text-foreground/80 italic">
//             "Hi! I'd be happy to help with your project. I have some resources and best practices I can share. 
//             Let's set up a quick call this week to discuss your requirements. Looking forward to collaborating!"
//           </p>
//           <div className="text-right mt-2">
//             <span className="text-sm font-medium text-foreground">- {employeeName.split(' ')[0] || 'Colleague'}</span>
//           </div>
//         </div>

//         <div className="flex gap-3 justify-center">
//           <Button className="bg-primary text-primary-foreground shadow-soft">
//             <MessageCircle className="w-4 h-4 mr-2" />
//             Continue Chat
//           </Button>
//           <Button variant="outline" className="border-primary/30">
//             <Calendar className="w-4 h-4 mr-2" />
//             Schedule Meeting
//           </Button>
//           <Button variant="outline" className="border-primary/30">
//             <Coffee className="w-4 h-4 mr-2" />
//             Grab Coffee
//           </Button>
//         </div>
//       </div>
//     </Card>
//   );
// }