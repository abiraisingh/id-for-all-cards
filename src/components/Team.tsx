import founderImage from "@/assets/team-founder.jpg";
import coordinatorImage from "@/assets/team-coordinator.jpg";
import volunteerManagerImage from "@/assets/team-volunteer-manager.jpg";
import outreachImage from "@/assets/team-outreach.jpg";

const Team = () => {
  const teamMembers = [
    {
      name: "Priya Sharma",
      role: "Founder & Director",
      image: founderImage,
      description: "Leads the organization with a vision to create lasting social impact through innovative identity solutions."
    },
    {
      name: "Raj Patel",
      role: "Program Coordinator",
      image: coordinatorImage,
      description: "Oversees community programs and ensures effective project delivery across all locations."
    },
    {
      name: "Anita Singh",
      role: "Volunteer Manager",
      image: volunteerManagerImage,
      description: "Manages volunteer recruitment and engagement to support our mission initiatives."
    },
    {
      name: "Arjun Kumar",
      role: "Outreach Officer",
      image: outreachImage,
      description: "Drives outreach efforts to connect with homeless communities and provide essential services."
    }
  ];

  return (
    <section id="team" className="py-16 lg:py-24 bg-primary text-primary-foreground">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold mb-4">Our Team</h2>
          <p className="text-primary-foreground/90 text-lg max-w-2xl mx-auto">
            Meet the dedicated individuals working tirelessly to restore dignity through identity
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {teamMembers.map((member, index) => (
            <div key={index} className="bg-primary-foreground/10 rounded-lg p-6 text-center backdrop-blur-sm">
              <div className="relative mb-4">
                <img 
                  src={member.image} 
                  alt={`${member.name}, ${member.role}`}
                  className="w-24 h-24 rounded-full mx-auto object-cover border-4 border-accent"
                />
              </div>
              <h3 className="text-xl font-bold mb-1">{member.name}</h3>
              <p className="text-accent font-semibold mb-3">{member.role}</p>
              <p className="text-primary-foreground/80 text-sm leading-relaxed">
                {member.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Team;