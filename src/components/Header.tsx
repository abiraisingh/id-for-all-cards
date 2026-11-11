import { useEffect, useState } from "react";
import { HandHeart, Menu, X } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";

const sectionLinks = [
  { label: "About", href: "/#about" },
  { label: "Our Team", href: "/#team" },
  { label: "Get ID Card", href: "/#id-generator" },
];

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    if (!location.hash) return;

    const frame = window.requestAnimationFrame(() => {
      document.getElementById(location.hash.slice(1))?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    });

    return () => window.cancelAnimationFrame(frame);
  }, [location.hash, location.pathname]);

  const closeMenu = () => setIsMenuOpen(false);

  const links = (
    <>
      {sectionLinks.map((item) => (
        <Link
          key={item.href}
          to={item.href}
          onClick={closeMenu}
          className="rounded-md px-3 py-2 text-sm font-medium text-foreground/75 transition-colors hover:bg-primary/10 hover:text-primary"
        >
          {item.label}
        </Link>
      ))}
      <Link
        to="/volunteer"
        onClick={closeMenu}
        className={`rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-primary/10 hover:text-primary ${
          location.pathname === "/volunteer" ? "bg-primary/10 text-primary" : "text-foreground/75"
        }`}
      >
        Volunteer
      </Link>
      <Link
        to="/verify"
        onClick={closeMenu}
        className={`rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-primary/10 hover:text-primary ${
          location.pathname === "/verify" ? "bg-primary/10 text-primary" : "text-foreground/75"
        }`}
      >
        Verify ID
      </Link>
      <Link
        to="/contact"
        onClick={closeMenu}
        className={`rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-primary/10 hover:text-primary ${
          location.pathname === "/contact" ? "bg-primary/10 text-primary" : "text-foreground/75"
        }`}
      >
        Contact
      </Link>
    </>
  );

  return (
    <header className="sticky top-0 z-50 border-b border-border/70 bg-background/95 shadow-sm backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className="container mx-auto flex min-h-16 items-center justify-between gap-4 px-4 sm:px-6">
        <Link
          to="/"
          onClick={closeMenu}
          aria-label="IdentityFirst home"
          className="flex shrink-0 items-center gap-2 text-primary"
        >
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm">
            <HandHeart className="h-5 w-5" aria-hidden="true" />
          </span>
          <span className="text-lg font-bold tracking-tight sm:text-xl">IdentityFirst</span>
        </Link>

        <nav aria-label="Main navigation" className="hidden items-center gap-1 lg:flex">
          {links}
        </nav>

        <div className="flex items-center gap-2">
          <Button asChild variant="yellow" className="hidden font-semibold sm:inline-flex">
            <Link to="/donate">Donate</Link>
          </Button>
          <Button
            type="button"
            variant="outline"
            size="icon"
            className="lg:hidden"
            aria-label={isMenuOpen ? "Close navigation menu" : "Open navigation menu"}
            aria-expanded={isMenuOpen}
            aria-controls="mobile-navigation"
            onClick={() => setIsMenuOpen((open) => !open)}
          >
            {isMenuOpen ? <X /> : <Menu />}
          </Button>
        </div>
      </div>

      {isMenuOpen && (
        <nav
          id="mobile-navigation"
          aria-label="Mobile navigation"
          className="container mx-auto flex flex-col gap-1 border-t border-border/70 px-4 py-3 sm:px-6 lg:hidden"
        >
          {links}
          <Button asChild variant="yellow" className="mt-2 font-semibold sm:hidden">
            <Link to="/donate" onClick={closeMenu}>Donate</Link>
          </Button>
        </nav>
      )}
    </header>
  );
};

export default Header;
