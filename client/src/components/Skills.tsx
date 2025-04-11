import { useState, useEffect, useRef } from "react";

interface Skill {
  name: string;
  percentage: number;
}

export default function Skills() {
  const [animated, setAnimated] = useState(false);
  const skillsRef = useRef<HTMLDivElement>(null);
  
  const frontendSkills: Skill[] = [
    { name: "HTML/CSS", percentage: 95 },
    { name: "JavaScript", percentage: 90 },
    { name: "React", percentage: 85 }
  ];
  
  const backendSkills: Skill[] = [
    { name: "Node.js", percentage: 80 },
    { name: "Python", percentage: 75 },
    { name: "Database (SQL/NoSQL)", percentage: 85 }
  ];

  useEffect(() => {
    const handleScroll = () => {
      if (skillsRef.current) {
        const sectionTop = skillsRef.current.getBoundingClientRect().top;
        const windowHeight = window.innerHeight;
        
        if (sectionTop < windowHeight * 0.75 && !animated) {
          setAnimated(true);
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll(); // Check on initial render
    
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [animated]);

  return (
    <section id="skills" className="py-20">
      <div className="container mx-auto px-4">
        <div ref={skillsRef} className="bg-white shadow-lg rounded-lg p-6 md:p-8 max-w-md mx-auto">
          <h3 className="text-xl font-bold text-gray-800 mb-6">My Skills</h3>
          
          {/* Frontend Skills */}
          {frontendSkills.map((skill, index) => (
            <div className="mb-5" key={`frontend-${index}`}>
              <div className="flex justify-between mb-1">
                <span className="text-gray-700 font-medium">{skill.name}</span>
                <span className="text-gray-600">{skill.percentage}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-primary h-2 rounded-full skill-progress transition-all duration-1500"
                  style={{ width: animated ? `${skill.percentage}%` : "0%" }}
                ></div>
              </div>
            </div>
          ))}
          
          {/* Backend Skills */}
          {backendSkills.map((skill, index) => (
            <div className="mb-5" key={`backend-${index}`}>
              <div className="flex justify-between mb-1">
                <span className="text-gray-700 font-medium">{skill.name}</span>
                <span className="text-gray-600">{skill.percentage}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-primary h-2 rounded-full skill-progress transition-all duration-1500"
                  style={{ width: animated ? `${skill.percentage}%` : "0%" }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
