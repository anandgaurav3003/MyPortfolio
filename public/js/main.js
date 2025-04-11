// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize various components
    initNavigation();
    initTypingEffect();
    initSkillsAnimation();
    loadProjects();
    initContactForm();
    initBackToTop();
});

// ===== NAVIGATION FUNCTIONS =====
function initNavigation() {
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    const navItems = document.querySelectorAll('.nav-links a');
    const header = document.querySelector('header');

    // Toggle mobile menu
    if (hamburger) {
        hamburger.addEventListener('click', function() {
            navLinks.classList.toggle('active');
            hamburger.classList.toggle('active');
        });
    }

    // Close mobile menu when clicking on a link
    navItems.forEach(item => {
        item.addEventListener('click', function() {
            navLinks.classList.remove('active');
            hamburger.classList.remove('active');
            
            // Set active link
            navItems.forEach(link => link.classList.remove('active'));
            this.classList.add('active');
        });
    });

    // Change header style on scroll
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
        
        // Update active menu item based on scroll position
        setActiveNavLink();
    });
}

// Set active navigation link based on scroll position
function setActiveNavLink() {
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-links a');
    
    let currentSection = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop - 100;
        const sectionHeight = section.offsetHeight;
        if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
            currentSection = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${currentSection}`) {
            link.classList.add('active');
        }
    });
}

// ===== TYPING EFFECT FUNCTION =====
function initTypingEffect() {
    const typingElement = document.getElementById('typingText');
    const phrases = ['Web Developer', 'Frontend Designer', 'Backend Developer', 'Freelancer'];
    let phraseIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typingDelay = 200;

    function type() {
        const currentPhrase = phrases[phraseIndex];
        
        if (isDeleting) {
            // Remove a character
            typingElement.textContent = currentPhrase.substring(0, charIndex - 1);
            charIndex--;
            typingDelay = 100;
        } else {
            // Add a character
            typingElement.textContent = currentPhrase.substring(0, charIndex + 1);
            charIndex++;
            typingDelay = 200;
        }
        
        // If word is complete, start deleting after a pause
        if (!isDeleting && charIndex === currentPhrase.length) {
            isDeleting = true;
            typingDelay = 1000; // Pause before deleting
        }
        
        // If deletion is complete, move to next word
        if (isDeleting && charIndex === 0) {
            isDeleting = false;
            phraseIndex = (phraseIndex + 1) % phrases.length;
            typingDelay = 500; // Pause before typing next word
        }
        
        setTimeout(type, typingDelay);
    }
    
    if (typingElement) {
        setTimeout(type, 1000); // Start the typing animation after a pause
    }
}

// ===== SKILLS ANIMATION FUNCTION =====
function initSkillsAnimation() {
    const skillsSection = document.getElementById('skills');
    const progressBars = document.querySelectorAll('.skill-progress');
    
    // Function to animate skill bars when in viewport
    function animateSkillBars() {
        if (isElementInViewport(skillsSection)) {
            progressBars.forEach(bar => {
                const percent = bar.getAttribute('data-percent');
                bar.style.width = percent + '%';
            });
            // Remove the scroll event listener once animation is triggered
            window.removeEventListener('scroll', animateSkillBars);
        }
    }
    
    // Add scroll event listener
    window.addEventListener('scroll', animateSkillBars);
    
    // Check on initial load as well
    animateSkillBars();
}

// Check if an element is in the viewport
function isElementInViewport(el) {
    if (!el) return false;
    
    const rect = el.getBoundingClientRect();
    return (
        rect.top <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.bottom >= 0
    );
}

// ===== PROJECTS FUNCTIONS =====
async function loadProjects() {
    const projectsContainer = document.getElementById('projects-container');
    const filterBtns = document.querySelectorAll('.filter-btn');
    
    if (!projectsContainer) return;
    
    try {
        // Show loading spinner
        const loadingSpinner = projectsContainer.querySelector('.loading-spinner');
        if (loadingSpinner) {
            loadingSpinner.style.display = 'flex';
        }
        
        // Fetch projects from the API
        const response = await fetch('/api/projects');
        
        if (!response.ok) {
            throw new Error('Failed to fetch projects');
        }
        
        const projects = await response.json();
        
        // Hide loading spinner
        if (loadingSpinner) {
            loadingSpinner.style.display = 'none';
        }
        
        // If no projects, use default projects
        if (!projects || projects.length === 0) {
            renderDefaultProjects(projectsContainer);
        } else {
            renderProjects(projectsContainer, projects);
        }
        
        // Initialize project filtering
        if (filterBtns.length) {
            initProjectFiltering(filterBtns, projectsContainer);
        }
        
    } catch (error) {
        console.error('Error loading projects:', error);
        
        // Hide loading spinner
        const loadingSpinner = projectsContainer.querySelector('.loading-spinner');
        if (loadingSpinner) {
            loadingSpinner.style.display = 'none';
        }
        
        // Use default projects if there's an error
        renderDefaultProjects(projectsContainer);
    }
}

function renderProjects(container, projects) {
    // Clear container except the loading spinner
    const loadingSpinner = container.querySelector('.loading-spinner');
    container.innerHTML = '';
    if (loadingSpinner) {
        container.appendChild(loadingSpinner);
    }
    
    // Create project cards with delay for animation
    projects.forEach((project, index) => {
        setTimeout(() => {
            const projectCard = createProjectCard(project);
            container.appendChild(projectCard);
            
            // Add animation classes with a delay
            setTimeout(() => {
                projectCard.style.opacity = 1;
                projectCard.style.transform = 'translateY(0)';
            }, 100);
        }, index * 100);
    });
}

function createProjectCard(project) {
    const projectCard = document.createElement('div');
    projectCard.className = 'project-card';
    projectCard.dataset.category = project.category || 'web'; // Default to web if not specified
    
    projectCard.innerHTML = `
        <div class="project-image">
            <img src="${project.imageUrl || 'https://via.placeholder.com/300x200?text=Project'}" alt="${project.title}" 
                onerror="this.src='https://via.placeholder.com/300x200?text=No+Image'">
        </div>
        <div class="project-tags">
            ${project.tags.map(tag => `<span class="project-tag">${tag}</span>`).join('')}
        </div>
        <div class="project-info">
            <h3>${project.title}</h3>
            <p>${project.description}</p>
            <div class="project-links">
                ${project.projectUrl ? 
                    `<a href="${project.projectUrl}" target="_blank">View Project <i class="fas fa-arrow-right"></i></a>` : ''}
                ${project.githubUrl ? 
                    `<a href="${project.githubUrl}" target="_blank"><i class="fab fa-github"></i></a>` : ''}
            </div>
        </div>
    `;
    
    return projectCard;
}

function renderDefaultProjects(container) {
    // Default projects to use if API fails
    const defaultProjects = [
        {
            title:  "DreamPrep",
            description: "A fully responsive exam preparation & time management wep application.",
            tags: ["HTML", "CSS","python", "Flask","mySQL"],
            imageUrl: "DreamPrep.PNG",
            projectUrl: "https://github.com/anandgaurav3003/DreamPrep",
            githubUrl: "https://github.com/anandgaurav3003",
            category: "web"
        },
        {
            title: "Portfolio Template",
            description: "A clean and modern portfolio template for creatives and developers.",
            tags: ["HTML", "CSS", "JavaScript",],
            imageUrl: "port.PNG",
            projectUrl: "#",
            githubUrl: "https://github.com/anandgaurav3003",
            category: "design"
        },
        {
            title: "Amazon Clone",
            description: "A simple clone of Amazon.com ",
            tags: ["HTML", "CSS"],
            imageUrl: "homePage.PNG",
            projectUrl: "https://github.com/anandgaurav3003/Amazon-Clone",
            githubUrl: "https://github.com/anandgaurav3003",
            category: "app"
        },
        {
            title: "Connect Four Game",
            description: "A two-player Connect Four game developed using Python ",
            tags: ["Python"],
            imageUrl: "CONNECT.PNG",
            projectUrl: "https://github.com/anandgaurav3003/Connect-Four-Game",
            githubUrl: "https://github.com/anandgaurav3003",
            category: "app"
        },
        {
            title: "Tic-Tac-Toe Game",
            description: "A classic Tic-Tac-Toe game built with pygame module featuring a simple and interactive UI.",
            tags: ["Python","Pygame"],
            imageUrl: "tictoe.PNG",
            projectUrl: "https://github.com/anandgaurav3003/Tic-Tac-Toe-Game",
            githubUrl: "https://github.com/anandgaurav3003",
            category: "web"
        },
        {
            title: "Snake Game",
            description: "A classic Snake game built using Python and the Pygame module, featuring smooth gameplay and a simple UI.",
            tags: ["Python","Pygame Module"],
            imageUrl: "snake.PNG",
            projectUrl: "https://github.com/anandgaurav3003/SnakeGame",
            githubUrl: "https://github.com/anandgaurav3003",
            category: "design"
        }
    ];
    
    renderProjects(container, defaultProjects);
}

function initProjectFiltering(filterBtns, projectsContainer) {
    filterBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            // Update active filter button
            filterBtns.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            // Get filter category
            const filterValue = this.getAttribute('data-filter');
            
            // Filter projects
            const projectCards = projectsContainer.querySelectorAll('.project-card');
            projectCards.forEach(card => {
                if (filterValue === 'all' || card.dataset.category === filterValue) {
                    card.style.display = 'block';
                    setTimeout(() => {
                        card.style.opacity = 1;
                        card.style.transform = 'translateY(0)';
                    }, 100);
                } else {
                    card.style.opacity = 0;
                    card.style.transform = 'translateY(20px)';
                    setTimeout(() => {
                        card.style.display = 'none';
                    }, 500);
                }
            });
        });
    });
}

// ===== CONTACT FORM FUNCTIONS =====
function initContactForm() {
    const contactForm = document.getElementById('contactForm');
    const formStatus = document.getElementById('formStatus');
    
    if (!contactForm) return;
    
    contactForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        // Reset error messages
        const errorElements = document.querySelectorAll('.error-message');
        errorElements.forEach(el => el.textContent = '');
        
        if (formStatus) {
            formStatus.className = '';
            formStatus.textContent = '';
        }
        
        // Get form data
        const formData = {
            name: document.getElementById('name').value.trim(),
            email: document.getElementById('email').value.trim(),
            subject: document.getElementById('subject').value.trim(),
            message: document.getElementById('message').value.trim()
        };
        
        // Validate form data
        let isValid = true;
        
        if (!formData.name) {
            document.getElementById('nameError').textContent = 'Please enter your name';
            isValid = false;
        }
        
        if (!formData.email) {
            document.getElementById('emailError').textContent = 'Please enter your email';
            isValid = false;
        } else if (!isValidEmail(formData.email)) {
            document.getElementById('emailError').textContent = 'Please enter a valid email address';
            isValid = false;
        }
        
        if (!formData.subject) {
            document.getElementById('subjectError').textContent = 'Please enter a subject';
            isValid = false;
        }
        
        if (!formData.message) {
            document.getElementById('messageError').textContent = 'Please enter your message';
            isValid = false;
        }
        
        if (!isValid) return;
        
        try {
            // Show processing message
            if (formStatus) {
                formStatus.textContent = 'Sending message...';
            }
            
            // Send form data to the server
            const response = await fetch('/api/contact', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });
            
            // Process response
            if (response.ok) {
                // Clear form
                contactForm.reset();
                
                // Show success message
                if (formStatus) {
                    formStatus.className = 'success';
                    formStatus.textContent = 'Your message has been sent successfully! I\'ll get back to you soon.';
                }
            } else {
                // Show error message
                const error = await response.json();
                if (formStatus) {
                    formStatus.className = 'error';
                    formStatus.textContent = error.message || 'Failed to send message. Please try again later.';
                }
            }
        } catch (error) {
            console.error('Error submitting contact form:', error);
            
            // Show error message
            if (formStatus) {
                formStatus.className = 'error';
                formStatus.textContent = 'There was a problem sending your message. Please try again later.';
            }
        }
    });
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// ===== BACK TO TOP FUNCTION =====
function initBackToTop() {
    const backToTopBtn = document.querySelector('.back-to-top');
    
    if (!backToTopBtn) return;
    
    // Show/hide back to top button
    window.addEventListener('scroll', function() {
        if (window.scrollY > 300) {
            backToTopBtn.classList.add('active');
        } else {
            backToTopBtn.classList.remove('active');
        }
    });
    
    // Scroll to top when button is clicked
    backToTopBtn.addEventListener('click', function(e) {
        e.preventDefault();
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}