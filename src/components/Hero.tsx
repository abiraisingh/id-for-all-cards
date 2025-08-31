import { Button } from "@/components/ui/button";
import { Play } from "lucide-react";
import heroImage from "@/assets/hero-volunteers.jpg";

const Hero = () => {
  return (
    <section className="bg-gradient-hero text-primary-foreground py-20 lg:py-32">
      <div className="container mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div className="space-y-4">
              <h1 className="text-4xl lg:text-6xl font-bold leading-tight">
                Identity is <span className="text-accent underline decoration-4">Dignity</span>
                <br />
                For Everyone!
              </h1>
              <p className="text-lg lg:text-xl text-primary-foreground/90 max-w-lg">
                Providing unique identification cards to homeless individuals, 
                empowering them with access to essential services and restoring their dignity.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Button variant="yellow" size="lg" className="text-lg px-8">
                Get Started
              </Button>
              <Button variant="yellow-outline" size="lg" className="text-lg px-8">
                <Play className="w-5 h-5 mr-2" />
                How it Works
              </Button>
            </div>
          </div>
          
          <div className="relative">
            <div className="rounded-full overflow-hidden shadow-2xl">
              <img 
                src={heroImage} 
                alt="Volunteers helping homeless individuals" 
                className="w-full h-auto object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;