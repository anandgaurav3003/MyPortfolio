// This script runs after the page has loaded and handles various interactions

document.addEventListener('DOMContentLoaded', function() {
  // Smooth scrolling for all links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      
      const targetId = this.getAttribute('href').substring(1);
      const target = document.getElementById(targetId);
      
      if (target) {
        window.scrollTo({
          top: target.offsetTop - 80,
          behavior: 'smooth'
        });
      }
    });
  });

  // Set active navigation link based on scroll position
  function setActiveNavLink() {
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('nav a');
    
    let currentSection = '';
    
    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.clientHeight;
      
      if (window.scrollY >= (sectionTop - 100)) {
        currentSection = section.getAttribute('id');
      }
    });
    
    navLinks.forEach(link => {
      link.classList.remove('text-primary');
      link.classList.add('text-gray-700');
      
      if (link.getAttribute('href') === `#${currentSection}`) {
        link.classList.remove('text-gray-700');
        link.classList.add('text-primary');
      }
    });
  }
  
  window.addEventListener('scroll', setActiveNavLink);
  
  // Initialize setting the active nav link
  setActiveNavLink();
  
  // Add scroll animation for skill progress bars
  const animateElements = document.querySelectorAll('.animate-on-scroll');
  
  function checkAnimations() {
    animateElements.forEach(element => {
      const elementTop = element.getBoundingClientRect().top;
      const windowHeight = window.innerHeight;
      
      if (elementTop < windowHeight * 0.8) {
        element.classList.add('animated');
      }
    });
  }
  
  window.addEventListener('scroll', checkAnimations);
  checkAnimations(); // Check on page load
});
