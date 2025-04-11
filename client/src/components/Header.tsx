import { useState, useEffect } from "react";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const handleScroll = () => {
    const offset = window.scrollY;
    if (offset > 50) {
      setScrolled(true);
    } else {
      setScrolled(false);
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const scrollToSection = (sectionId: string) => {
    const section = document.getElementById(sectionId);
    if (section) {
      window.scrollTo({
        top: section.offsetTop - 80,
        behavior: "smooth",
      });
    }
    setMenuOpen(false);
  };

  return (
    <header className={`fixed w-full bg-white/90 shadow-sm backdrop-blur-sm z-50 transition-all duration-300 ${scrolled ? "py-2" : "py-3"}`}>
      <nav className="container mx-auto px-4 flex justify-between items-center">
        <a 
          href="#home" 
          className="text-2xl font-bold font-heading text-primary"
          onClick={(e) => {
            e.preventDefault();
            scrollToSection("home");
          }}
        >
          GA.
        </a>
        
        <div className="hidden md:flex space-x-8">
          <a 
            href="#home" 
            className="text-gray-700 hover:text-primary transition duration-300"
            onClick={(e) => {
              e.preventDefault();
              scrollToSection("home");
            }}
          >
            Home
          </a>
          <a 
            href="#about" 
            className="text-gray-700 hover:text-primary transition duration-300"
            onClick={(e) => {
              e.preventDefault();
              scrollToSection("about");
            }}
          >
            About
          </a>
          <a 
            href="#skills" 
            className="text-gray-700 hover:text-primary transition duration-300"
            onClick={(e) => {
              e.preventDefault();
              scrollToSection("skills");
            }}
          >
            Skills
          </a>
          <a 
            href="#projects" 
            className="text-gray-700 hover:text-primary transition duration-300"
            onClick={(e) => {
              e.preventDefault();
              scrollToSection("projects");
            }}
          >
            Projects
          </a>
          <a 
            href="#contact" 
            className="text-gray-700 hover:text-primary transition duration-300"
            onClick={(e) => {
              e.preventDefault();
              scrollToSection("contact");
            }}
          >
            Contact
          </a>
        </div>

        <button 
          className="md:hidden text-gray-700 focus:outline-none" 
          onClick={toggleMenu}
        >
          <i className={`fas ${menuOpen ? "fa-times" : "fa-bars"} text-xl`}></i>
        </button>
      </nav>
      
      {/* Mobile menu */}
      <div className={`md:hidden ${menuOpen ? "block" : "hidden"} bg-white`}>
        <div className="px-4 py-2 space-y-3 shadow-lg">
          <a 
            href="#home" 
            className="block py-2 text-gray-700 hover:text-primary transition duration-300"
            onClick={(e) => {
              e.preventDefault();
              scrollToSection("home");
            }}
          >
            Home
          </a>
          <a 
            href="#about" 
            className="block py-2 text-gray-700 hover:text-primary transition duration-300"
            onClick={(e) => {
              e.preventDefault();
              scrollToSection("about");
            }}
          >
            About
          </a>
          <a 
            href="#skills" 
            className="block py-2 text-gray-700 hover:text-primary transition duration-300"
            onClick={(e) => {
              e.preventDefault();
              scrollToSection("skills");
            }}
          >
            Skills
          </a>
          <a 
            href="#projects" 
            className="block py-2 text-gray-700 hover:text-primary transition duration-300"
            onClick={(e) => {
              e.preventDefault();
              scrollToSection("projects");
            }}
          >
            Projects
          </a>
          <a 
            href="#contact" 
            className="block py-2 text-gray-700 hover:text-primary transition duration-300"
            onClick={(e) => {
              e.preventDefault();
              scrollToSection("contact");
            }}
          >
            Contact
          </a>
        </div>
      </div>
    </header>
  );
}
