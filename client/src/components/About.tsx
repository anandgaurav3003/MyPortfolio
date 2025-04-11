import { useEffect, useRef } from "react";

export default function About() {
  const aboutRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("animate-fadeIn");
          }
        });
      },
      { threshold: 0.2 }
    );

    if (aboutRef.current) {
      observer.observe(aboutRef.current);
    }

    return () => {
      if (aboutRef.current) {
        observer.unobserve(aboutRef.current);
      }
    };
  }, []);

  return (
    <section id="about" className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold font-heading text-gray-800 mb-4">About Me</h2>
          <div className="w-20 h-1 bg-primary mx-auto rounded-full"></div>
        </div>
        
        <div className="flex flex-col md:flex-row items-center" ref={aboutRef}>
          <div className="md:w-1/2 mb-8 md:mb-0">
            <div className="bg-white shadow-lg rounded-lg p-6 md:p-8 max-w-md mx-auto md:mr-8">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Who I Am</h3>
              <p className="text-gray-600 mb-4">
                I'm a passionate web developer with a strong foundation in frontend and backend technologies. My journey in web development started 5 years ago, and I've been creating digital experiences ever since.
              </p>
              <p className="text-gray-600 mb-4">
                I believe in clean, efficient code and user-centered design. Every project I take on is an opportunity to create something meaningful and impactful.
              </p>
              <h3 className="text-xl font-bold text-gray-800 mb-4 mt-8">Education</h3>
              <div className="mb-4">
                <h4 className="font-semibold text-gray-800">B.Tech in Computer Science</h4>
                <p className="text-gray-600">Indian Institute of Technology</p>
                <p className="text-sm text-gray-500">2016 - 2020</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
