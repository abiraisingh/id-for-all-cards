import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button, type ButtonProps } from "@/components/ui/button";
import { Play, UserPlus, Camera, FileText, Shield, Heart } from "lucide-react";

interface HowItWorksProps {
  triggerLabel?: string;
  showPlayIcon?: boolean;
  triggerVariant?: ButtonProps["variant"];
}

const HowItWorks = ({
  triggerLabel = "How it Works",
  showPlayIcon = true,
  triggerVariant = "yellow-outline",
}: HowItWorksProps) => {
  const steps = [
    {
      icon: UserPlus,
      title: "Register Information",
      description: "Fill out basic personal details including name, father's name, date of birth, and contact information."
    },
    {
      icon: Camera,
      title: "Capture Photo & Biometrics",
      description: "Use your device's camera to take a photo and capture biometric data for secure identification."
    },
    {
      icon: FileText,
      title: "Generate ID Card",
      description: "Our system creates a unique identification card with a secure ID number and all your information."
    },
    {
      icon: Shield,
      title: "Secure & Verified",
      description: "Each ID card is digitally secured and can be verified by service providers and organizations."
    },
    {
      icon: Heart,
      title: "Access Services",
      description: "Use your ID card to access healthcare, employment opportunities, social services, and more."
    }
  ];

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant={triggerVariant} size="lg" className="text-lg px-8">
          {showPlayIcon && <Play className="w-5 h-5 mr-2" />}
          {triggerLabel}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center mb-6">
            How IdentityFirst Works
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-8">
          <div className="text-center">
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Our simple, secure process helps homeless individuals obtain official identification 
              that opens doors to essential services and opportunities.
            </p>
          </div>

          <div className="grid gap-6">
            {steps.map((step, index) => {
              const Icon = step.icon;
              return (
                <div key={index} className="flex gap-4 p-4 rounded-lg border bg-card">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-lg">
                      {index + 1}
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <Icon className="w-6 h-6 text-primary" />
                      <h3 className="text-xl font-semibold">{step.title}</h3>
                    </div>
                    <p className="text-muted-foreground leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="bg-primary/10 p-6 rounded-lg">
            <h4 className="text-lg font-semibold mb-3 text-primary">Why This Matters</h4>
            <ul className="space-y-2 text-muted-foreground">
              <li className="flex items-start gap-2">
                <span className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></span>
                <span>Many homeless individuals lack official identification, preventing access to basic services</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></span>
                <span>Traditional ID systems require permanent addresses, which homeless people don't have</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></span>
                <span>Our system focuses on identity verification, not address requirements</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></span>
                <span>Each ID card helps restore dignity and opens pathways to stability</span>
              </li>
            </ul>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default HowItWorks;