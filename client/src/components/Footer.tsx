export default function Footer() {
  const currentYear = new Date().getFullYear();
  
  const scrollToSection = (sectionId: string) => {
    const section = document.getElementById(sectionId);
    if (section) {
      window.scrollTo({
        top: section.offsetTop - 80,
        behavior: "smooth"
      });
    }
  };

  return (
    <footer className="bg-dark text-white py-10">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-6 md:mb-0">
            <a 
              href="#home" 
              onClick={(e) => {
                e.preventDefault();
                scrollToSection("home");
              }}
              className="text-2xl font-bold font-heading text-white"
            >
              Gaurav Anand
            </a>
            <p className="text-gray-400 mt-2">Web Developer & Designer</p>
          </div>
          
          <div className="flex space-x-6 mb-6 md:mb-0">
            <a 
              href="#home" 
              onClick={(e) => {
                e.preventDefault();
                scrollToSection("home");
              }}
              className="text-gray-400 hover:text-white transition duration-300"
            >
              Home
            </a>
            <a 
              href="#about" 
              onClick={(e) => {
                e.preventDefault();
                scrollToSection("about");
              }}
              className="text-gray-400 hover:text-white transition duration-300"
            >
              About
            </a>
            <a 
              href="#projects" 
              onClick={(e) => {
                e.preventDefault();
                scrollToSection("projects");
              }}
              className="text-gray-400 hover:text-white transition duration-300"
            >
              Projects
            </a>
            <a 
              href="#contact" 
              onClick={(e) => {
                e.preventDefault();
                scrollToSection("contact");
              }}
              className="text-gray-400 hover:text-white transition duration-300"
            >
              Contact
            </a>
          </div>
        </div>
        
        <div className="border-t border-gray-700 mt-6 pt-6 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm">© {currentYear} Gaurav Anand. All rights reserved.</p>
          
          <div className="flex space-x-4 mt-4 md:mt-0">
            <a href="#" className="text-gray-400 hover:text-white transition duration-300">
              <i className="fab fa-facebook-f"></i>
            </a>
            <a href="#" className="text-gray-400 hover:text-white transition duration-300">
              <i className="fab fa-twitter"></i>
            </a>
            <a href="#" className="text-gray-400 hover:text-white transition duration-300">
              <i className="fab fa-instagram"></i>
            </a>
            <a href="#" className="text-gray-400 hover:text-white transition duration-300">
              <i className="fab fa-linkedin-in"></i>
            </a>
            <a href="#" className="text-gray-400 hover:text-white transition duration-300">
              <i className="fab fa-github"></i>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
