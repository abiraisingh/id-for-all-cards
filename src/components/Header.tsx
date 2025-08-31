import { Button } from "@/components/ui/button";

const Header = () => {
  return (
    <header className="bg-primary text-primary-foreground">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="text-2xl font-bold">IdentityFirst</div>
          </div>
          
          <nav className="hidden md:flex items-center space-x-8">
            <a href="#about" className="hover:text-accent transition-colors">About Us</a>
            <a href="#team" className="hover:text-accent transition-colors">Our Team</a>
            <a href="#id-generator" className="hover:text-accent transition-colors">Get ID Card</a>
            <a href="#volunteer" className="hover:text-accent transition-colors">Volunteer</a>
            <a href="#contact" className="hover:text-accent transition-colors">Contact</a>
          </nav>
          
          <Button variant="yellow" className="font-semibold">
            Donate Now
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;