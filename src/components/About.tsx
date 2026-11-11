import { Users, FileText, Heart, Globe } from "lucide-react";
import HowItWorks from "./HowItWorks";

const About = () => {
  const stats = [
    { icon: Users, label: "People Helped", value: "10,000+" },
    { icon: FileText, label: "ID Cards Issued", value: "8,500+" },
    { icon: Heart, label: "Volunteers", value: "500+" },
    { icon: Globe, label: "Cities Covered", value: "25+" },
  ];

  return (
    <section id="about" className="scroll-mt-20 py-16 lg:py-24 bg-background">
      <div className="container mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <div className="text-accent lg:text-5xl font-semibold uppercase tracking-wider">
              About Us
            </div>
            <h2 className="text-3xl lg:text-5xl font-bold text-foreground">
              We bring dignity through identity
            </h2>
            <p className="text-muted-foreground text-lg leading-relaxed">
              Every person deserves recognition and access to basic services. Our unique identification 
              system provides homeless individuals with official documentation that opens doors to 
              healthcare, employment opportunities, and social services.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              Without an address, many are denied basic rights. Our ID cards focus on identity, 
              not location, ensuring everyone can access the services they need to rebuild their lives.
            </p>
            
            <div className="mt-6">
              <HowItWorks
                triggerLabel="Learn More"
                showPlayIcon={false}
                triggerVariant="yellow"
              />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-6">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div
                  key={index}
                  className="card-motion rounded-lg border bg-card p-6 text-center shadow-lg"
                  style={{ animationDelay: `${index * 90}ms` }}
                >
                  <Icon className="w-8 h-8 text-primary mx-auto mb-3" />
                  <div className="text-2xl font-bold text-foreground mb-1">{stat.value}</div>
                  <div className="text-muted-foreground text-sm">{stat.label}</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;