import { useState, useEffect, useRef } from "react";

export default function Hero() {
  const [displayText, setDisplayText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [roleIndex, setRoleIndex] = useState(0);
  const [typingSpeed, setTypingSpeed] = useState(100);
  
  const roles = ["Web Developer", "UI/UX Designer", "Full Stack Developer"];
  const textRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const typeWriter = () => {
      const currentRole = roles[roleIndex];
      const currentLength = displayText.length;
      
      if (!isDeleting && currentLength < currentRole.length) {
        setDisplayText(currentRole.substring(0, currentLength + 1));
        setTypingSpeed(100);
      } else if (isDeleting && currentLength > 0) {
        setDisplayText(currentRole.substring(0, currentLength - 1));
        setTypingSpeed(50);
      } else if (currentLength === 0) {
        setIsDeleting(false);
        setRoleIndex((prev) => (prev + 1) % roles.length);
        setTypingSpeed(500);
      } else if (currentLength === currentRole.length) {
        setIsDeleting(true);
        setTypingSpeed(1500);
      }
    };
    
    const timer = setTimeout(typeWriter, typingSpeed);
    return () => clearTimeout(timer);
  }, [displayText, isDeleting, roleIndex, roles, typingSpeed]);

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
    <section id="home" className="min-h-screen flex items-center justify-center pt-20">
      <div className="container mx-auto px-4 py-16 flex flex-col md:flex-row items-center">
        <div className="md:w-1/2 text-center md:text-left mb-10 md:mb-0">
          <p className="text-lg text-gray-600 mb-3">Hello, I'm</p>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold font-heading mb-4 text-gray-800">
            Gaurav Anand
          </h1>
          <div className="h-12 overflow-hidden">
            <div className="inline-block overflow-hidden">
              <span 
                ref={textRef}
                className="text-xl md:text-2xl text-primary font-medium typing-text"
              >
                {displayText}
              </span>
            </div>
          </div>
          <p className="text-gray-600 my-6 max-w-lg mx-auto md:mx-0">
            I create beautiful, functional and responsive websites. Passionate about crafting digital experiences that users love.
          </p>
          <div className="flex space-x-4 justify-center md:justify-start">
            <button 
              onClick={() => scrollToSection("projects")}
              className="bg-primary hover:bg-blue-600 text-white px-6 py-3 rounded-lg transition duration-300 font-medium"
            >
              View My Work
            </button>
            <button 
              onClick={() => scrollToSection("contact")}
              className="border border-primary text-primary hover:bg-primary hover:text-white px-6 py-3 rounded-lg transition duration-300 font-medium"
            >
              Contact Me
            </button>
          </div>
        </div>
        <div className="md:w-1/2 flex justify-center">
          <div className="relative w-64 h-64 md:w-80 md:h-80 rounded-full overflow-hidden border-4 border-primary/20 shadow-xl">
            <svg 
              className="w-full h-full text-gray-300" 
              fill="currentColor" 
              viewBox="0 0 24 24"
            >
              <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
            </svg>
          </div>
        </div>
      </div>
    </section>
  );
}
