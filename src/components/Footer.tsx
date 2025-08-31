import { Heart, Mail, Phone, MapPin } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-foreground text-background py-12">
      <div className="container mx-auto px-6">
        <div className="grid md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <h3 className="text-xl font-bold">IdentityFirst</h3>
            <p className="text-background/80 text-sm leading-relaxed">
              Restoring dignity through identity. Providing unique identification 
              cards to homeless individuals across the nation.
            </p>
          </div>
          
          <div className="space-y-4">
            <h4 className="font-semibold">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#about" className="text-background/80 hover:text-accent transition-colors">About Us</a></li>
              <li><a href="#team" className="text-background/80 hover:text-accent transition-colors">Our Team</a></li>
              <li><a href="#id-generator" className="text-background/80 hover:text-accent transition-colors">Get ID Card</a></li>
              <li><a href="#volunteer" className="text-background/80 hover:text-accent transition-colors">Volunteer</a></li>
            </ul>
          </div>
          
          <div className="space-y-4">
            <h4 className="font-semibold">Contact Info</h4>
            <div className="space-y-3 text-sm">
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-accent" />
                <span className="text-background/80">+91 98765 43210</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-accent" />
                <span className="text-background/80">info@identityfirst.org</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-accent" />
                <span className="text-background/80">New Delhi, India</span>
              </div>
            </div>
          </div>
          
          <div className="space-y-4">
            <h4 className="font-semibold">Support Our Mission</h4>
            <p className="text-background/80 text-sm">
              Every donation helps us provide more ID cards and restore dignity.
            </p>
            <button className="bg-accent text-accent-foreground px-4 py-2 rounded-md text-sm font-semibold hover:bg-accent-hover transition-colors">
              Donate Now
            </button>
          </div>
        </div>
        
        <div className="border-t border-background/20 mt-8 pt-8 text-center">
          <p className="text-background/60 text-sm flex items-center justify-center gap-1">
            Made with <Heart className="w-4 h-4 text-accent" /> for humanity
            • © 2024 IdentityFirst. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;