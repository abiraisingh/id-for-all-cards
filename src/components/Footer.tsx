import { Heart, Mail, Phone, MapPin } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const Footer = () => {
  return (
    <footer className="bg-foreground text-background py-12">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-4">
          <div className="min-w-0 space-y-4">
            <h3 className="text-xl font-bold">IdentityFirst</h3>
            <p className="text-background/80 text-sm leading-relaxed">
              Restoring dignity through identity. Providing unique identification 
              cards to homeless individuals across the nation.
            </p>
          </div>
          
          <div className="min-w-0 space-y-4">
            <h4 className="font-semibold">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/#about" className="text-background/80 hover:text-accent transition-colors">About Us</Link></li>
              <li><Link to="/#team" className="text-background/80 hover:text-accent transition-colors">Our Team</Link></li>
              <li><Link to="/#id-generator" className="text-background/80 hover:text-accent transition-colors">Get ID Card</Link></li>
              <li><Link to="/volunteer" className="text-background/80 hover:text-accent transition-colors">Volunteer</Link></li>
              <li><Link to="/verify" className="text-background/80 hover:text-accent transition-colors">Verify ID</Link></li>
              <li><Link to="/contact" className="text-background/80 hover:text-accent transition-colors">Contact</Link></li>
            </ul>
          </div>
          
          <div className="min-w-0 space-y-4">
            <h4 className="font-semibold">Contact Info</h4>
            <div className="space-y-3 text-sm">
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-accent" />
                <span className="text-background/80">+91 98765 43210</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-accent" />
                <a href="mailto:info@identityfirst.org" className="break-all text-background/80 hover:text-accent">
                  info@identityfirst.org
                </a>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-accent" />
                <span className="text-background/80">New Delhi, India</span>
              </div>
            </div>
          </div>
          
          <div className="min-w-0 space-y-4">
            <h4 className="font-semibold">Support Our Mission</h4>
            <p className="text-background/80 text-sm">
              Every donation helps us provide more ID cards and restore dignity.
            </p>
            <Button asChild variant="yellow">
              <Link to="/donate">Donate Now</Link>
            </Button>
          </div>
        </div>
        
        <div className="mt-8 border-t border-background/20 pt-6 text-center">
          <div className="flex flex-col items-center gap-2 text-sm text-background/60 sm:flex-row sm:justify-center sm:gap-1">
            <p className="flex items-center justify-center gap-1 whitespace-nowrap">
              <span>Made with</span>
              <Heart className="h-4 w-4 shrink-0 text-accent" aria-label="love" />
              <span>for humanity</span>
            </p>
            <p>© 2024 IdentityFirst. All rights reserved.</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;