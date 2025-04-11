import { useEffect, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";

interface Project {
  id: number;
  title: string;
  description: string;
  tags: string[];
  imageUrl: string;
  projectUrl?: string | null;
  githubUrl?: string | null;
  createdAt: string;
}

export default function Projects() {
  const projectsRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  
  // Default projects to show while loading or if there's an error
  const defaultProjects: Project[] = [
    {
      id: 1,
      title: "E-commerce Platform",
      description: "A full-featured e-commerce platform with product management, cart functionality, and payment integration.",
      tags: ["React", "Node.js", "MongoDB"],
      imageUrl: "https://via.placeholder.com/300x200",
      projectUrl: "#",
      githubUrl: "https://github.com",
      createdAt: new Date().toISOString()
    },
    {
      id: 2,
      title: "Finance Dashboard",
      description: "Interactive dashboard displaying financial data, trends, and forecasts with real-time updates.",
      tags: ["JavaScript", "Chart.js", "API"],
      imageUrl: "https://via.placeholder.com/300x200",
      projectUrl: "#",
      githubUrl: "https://github.com",
      createdAt: new Date().toISOString()
    },
    {
      id: 3,
      title: "Travel Blog",
      description: "A blog platform for travel enthusiasts to share their adventures, tips, and photography.",
      tags: ["React", "Firebase", "Tailwind CSS"],
      imageUrl: "https://via.placeholder.com/300x200",
      projectUrl: "#",
      githubUrl: "https://github.com",
      createdAt: new Date().toISOString()
    }
  ];
  
  // Fetch projects from the API
  const { data: projects, isLoading, error } = useQuery({
    queryKey: ['/api/projects'],
    staleTime: 60000 // 1 minute
  });

  // Show error toast if there's an error
  useEffect(() => {
    if (error) {
      toast({
        title: "Error",
        description: "Failed to load projects. Using default projects instead.",
        variant: "destructive",
      });
    }
  }, [error, toast]);

  // Setup intersection observer for animation
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("animate-fadeIn");
          }
        });
      },
      { threshold: 0.1 }
    );

    if (projectsRef.current) {
      const cards = projectsRef.current.querySelectorAll(".card");
      cards.forEach((card) => {
        observer.observe(card);
      });
    }

    return () => {
      if (projectsRef.current) {
        const cards = projectsRef.current.querySelectorAll(".card");
        cards.forEach((card) => {
          observer.unobserve(card);
        });
      }
    };
  }, [projects]);

  // Determine which projects to display - ensure we always have an array
  const projectsData = Array.isArray(projects) ? projects as Project[] : [];
  const displayProjects: Project[] = (isLoading || error || !projects) ? defaultProjects : projectsData;

  return (
    <section id="projects" className="py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold font-heading text-gray-800 mb-4">My Projects</h2>
          <div className="w-20 h-1 bg-primary mx-auto rounded-full"></div>
          <p className="text-gray-600 mt-4 max-w-xl mx-auto">
            Here are some of the projects I've worked on. Each project represents my skills and passion for web development.
          </p>
        </div>
        
        {isLoading && (
          <div className="flex justify-center mb-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        )}
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8" ref={projectsRef}>
          {displayProjects && displayProjects.map((project: Project, index: number) => (
            <div key={project.id} className="card bg-white rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 opacity-0">
              <div className="h-48 overflow-hidden bg-gray-100 flex items-center justify-center">
                {project.imageUrl ? (
                  <img 
                    src={project.imageUrl} 
                    alt={project.title} 
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = 'https://via.placeholder.com/300x200?text=No+Image';
                    }}
                  />
                ) : (
                  <svg className="w-24 h-24 text-gray-300" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M5 3h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5c0-1.1.9-2 2-2zm0 2v14h14V5H5zm8.5 2h3v3h-3V7zm0 4.5h3v3h-3v-3zM7 7h3v3H7V7zm0 4.5h3v3H7v-3zm0 4.5h3v3H7v-3zm4.5 0h3v3h-3v-3z" />
                  </svg>
                )}
              </div>
              <div className="p-6">
                <div className="flex flex-wrap gap-2 mb-4">
                  {project.tags.map((tag: string, tagIndex: number) => (
                    <span 
                      key={tagIndex} 
                      className={`bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded`}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">{project.title}</h3>
                <p className="text-gray-600 mb-4">{project.description}</p>
                <div className="flex justify-between items-center">
                  {project.projectUrl && (
                    <a 
                      href={project.projectUrl} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="text-primary hover:text-blue-700 font-medium flex items-center"
                    >
                      View Project <i className="fas fa-arrow-right ml-2"></i>
                    </a>
                  )}
                  {project.githubUrl && (
                    <a 
                      href={project.githubUrl} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="text-gray-600 hover:text-gray-800"
                    >
                      <i className="fab fa-github text-xl"></i>
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="text-center mt-12">
          <a href="#" className="inline-block border-2 border-primary text-primary hover:bg-primary hover:text-white font-medium px-6 py-3 rounded-lg transition duration-300">
            View All Projects
          </a>
        </div>
      </div>
    </section>
  );
}
