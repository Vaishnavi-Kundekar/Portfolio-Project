// DOM Content Loaded
document.addEventListener('DOMContentLoaded', function() {
    initializePortfolio();
});

function initializePortfolio() {
    handleLoading();
    initializeNavigation();
    initializeTypewriter();
    initializeAnimations();
    initializeParticles();
    initializeCounters();
    initializeSkillBars();
    initializeForms();
    loadProjects();
}

// Loading Screen
function handleLoading() {
    const loader = document.getElementById('loader');
    
    window.addEventListener('load', () => {
        setTimeout(() => {
            loader.style.opacity = '0';
            setTimeout(() => {
                loader.style.display = 'none';
            }, 500);
        }, 1500);
    });
}

// Navigation
function initializeNavigation() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');
    
    // Mobile menu toggle
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });
    
    // Close mobile menu when clicking on a link
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });
    
    // Smooth scrolling for navigation links
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                targetSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
    
    // Navbar scroll effect
    window.addEventListener('scroll', () => {
        const navbar = document.querySelector('.navbar');
        if (window.scrollY > 50) {
            navbar.style.background = 'rgba(255, 255, 255, 0.98)';
            navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
        } else {
            navbar.style.background = 'rgba(255, 255, 255, 0.95)';
            navbar.style.boxShadow = 'none';
        }
    });
}

// Typewriter Effect
function initializeTypewriter() {
    const typewriterElement = document.getElementById('typewriter');
    const roles = [
        'Full-Stack Developer',
        'UI/UX Designer', 
        'Database Architect',
        'Problem Solver',
        'Creative Thinker'
    ];
    
    let roleIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typeSpeed = 100;
    
    function typeWriter() {
        const currentRole = roles[roleIndex];
        
        if (isDeleting) {
            typewriterElement.textContent = currentRole.substring(0, charIndex - 1);
            charIndex--;
            typeSpeed = 50;
        } else {
            typewriterElement.textContent = currentRole.substring(0, charIndex + 1);
            charIndex++;
            typeSpeed = 100;
        }
        
        if (!isDeleting && charIndex === currentRole.length) {
            typeSpeed = 2000;
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            roleIndex = (roleIndex + 1) % roles.length;
            typeSpeed = 500;
        }
        
        setTimeout(typeWriter, typeSpeed);
    }
    
    typeWriter();
}

// Scroll Animations
function initializeAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);
    
    // Add animation classes and observe elements
    const animatedElements = document.querySelectorAll('.about-card, .skill-category, .project-card, .contact-item');
    animatedElements.forEach((el, index) => {
        el.classList.add('fade-in');
        el.style.transitionDelay = `${index * 0.1}s`;
        observer.observe(el);
    });
}

// Particles Background
function initializeParticles() {
    const particlesContainer = document.getElementById('particles');
    
    function createParticle() {
        const particle = document.createElement('div');
        particle.classList.add('particle');
        
        const size = Math.random() * 4 + 2;
        const startPosition = Math.random() * window.innerWidth;
        const animationDuration = Math.random() * 10 + 10;
        const delay = Math.random() * 5;
        
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        particle.style.left = `${startPosition}px`;
        particle.style.animationDuration = `${animationDuration}s`;
        particle.style.animationDelay = `${delay}s`;
        
        particlesContainer.appendChild(particle);
        
        // Remove particle after animation
        setTimeout(() => {
            if (particle.parentNode) {
                particle.parentNode.removeChild(particle);
            }
        }, (animationDuration + delay) * 1000);
    }
    
    // Create particles periodically
    setInterval(createParticle, 300);
}

// Counter Animation
function initializeCounters() {
    const counters = document.querySelectorAll('.stat-number');
    
    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counter = entry.target;
                const target = parseInt(counter.getAttribute('data-count'));
                let current = 0;
                const increment = target / 100;
                
                const timer = setInterval(() => {
                    current += increment;
                    if (current >= target) {
                        counter.textContent = target + '+';
                        clearInterval(timer);
                    } else {
                        counter.textContent = Math.floor(current) + '+';
                    }
                }, 20);
                
                counterObserver.unobserve(counter);
            }
        });
    });
    
    counters.forEach(counter => {
        counterObserver.observe(counter);
    });
}

// Skill Bars Animation
function initializeSkillBars() {
    const skillBars = document.querySelectorAll('.skill-progress');
    
    const skillObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const skillBar = entry.target;
                const width = skillBar.getAttribute('data-width');
                setTimeout(() => {
                    skillBar.style.width = width + '%';
                }, 200);
                skillObserver.unobserve(skillBar);
            }
        });
    });
    
    skillBars.forEach(skillBar => {
        skillObserver.observe(skillBar);
    });
}

// Forms Handling
function initializeForms() {
    initializeContactForm();
    initializeProjectForm();
}

function initializeContactForm() {
    const contactForm = document.getElementById('contactForm');
    
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const formData = {
            name: document.getElementById('name').value,
            email: document.getElementById('email').value,
            subject: document.getElementById('subject').value,
            message: document.getElementById('message').value
        };
        
        try {
            const response = await fetch('/api/contact', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });
            
            const result = await response.json();
            
            if (response.ok) {
                showNotification('Message sent successfully!', 'success');
                contactForm.reset();
            } else {
                showNotification(result.message || 'Error sending message', 'error');
            }
        } catch (error) {
            console.error('Error:', error);
            showNotification('Network error. Please try again.', 'error');
        }
    });
}

function initializeProjectForm() {
    const projectForm = document.getElementById('projectForm');
    
    projectForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const formData = {
            title: document.getElementById('projectTitle').value,
            description: document.getElementById('projectDescription').value,
            image: document.getElementById('projectImage').value,
            demo_url: document.getElementById('projectDemo').value,
            github_url: document.getElementById('projectGithub').value,
            technologies: document.getElementById('projectTech').value
        };
        
        try {
            const response = await fetch('/api/projects', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });
            
            const result = await response.json();
            
            if (response.ok) {
                showNotification('Project added successfully!', 'success');
                projectForm.reset();
                loadProjects(); // Reload projects
            } else {
                showNotification(result.message || 'Error adding project', 'error');
            }
        } catch (error) {
            console.error('Error:', error);
            showNotification('Network error. Please try again.', 'error');
        }
    });
}

// Load Projects from Database
async function loadProjects() {
    try {
        const response = await fetch('/api/projects');
        const projects = await response.json();
        
        if (response.ok) {
            displayProjects(projects);
        } else {
            console.error('Error loading projects:', projects.message);
            // Display default projects if database is not available
            displayDefaultProjects();
        }
    } catch (error) {
        console.error('Error loading projects:', error);
        displayDefaultProjects();
    }
}

function displayProjects(projects) {
    const projectsGrid = document.getElementById('projectsGrid');
    
    if (!projectsGrid) {
        console.error('Projects grid element not found');
        return;
    }
    
    if (projects.length === 0) {
        projectsGrid.innerHTML = '<p>No projects found.</p>';
        return;
    }
    
    projectsGrid.innerHTML = projects.map(project => `
        <div class="project-card fade-in">
            <div class="project-image" style="background-image: url('${project.image || 'https://via.placeholder.com/400x200/667eea/ffffff?text=Project'}')">
                <div class="project-overlay">
                    <div class="project-links">
                        ${project.demo_url ? `<a href="${project.demo_url}" target="_blank">Live Demo</a>` : ''}
                        ${project.github_url ? `<a href="${project.github_url}" target="_blank">GitHub</a>` : ''}
                    </div>
                </div>
            </div>
            <div class="project-content">
                <h3 class="project-title">${project.title}</h3>
                <p class="project-description">${project.description}</p>
                <div class="project-tech">
                    ${project.technologies.split(',').map(tech => `<span class="tech-tag">${tech.trim()}</span>`).join('')}
                </div>
            </div>
        </div>
    `).join('');
    
    // Add animation classes
    const newCards = projectsGrid.querySelectorAll('.project-card');
    newCards.forEach((card, index) => {
        card.style.transitionDelay = `${index * 0.1}s`;
        setTimeout(() => card.classList.add('visible'), 100);
    });
    
    console.log(`✅ Displayed ${projects.length} projects successfully`);
}

function displayDefaultProjects() {
    const defaultProjects = [
        {
            id: 1,
            title: "E-Commerce Platform",
            description: "Full-featured online shopping platform with user authentication, payment integration, and admin dashboard.",
            image: "https://via.placeholder.com/400x200/667eea/ffffff?text=E-Commerce",
            demo_url: "https://example.com/ecommerce",
            github_url: "https://github.com/vaishnavi/ecommerce",
            technologies: "React, Node.js, Express, MySQL, Stripe API"
        },
        {
            id: 2,
            title: "Task Management App",
            description: "Collaborative task management application with real-time updates and team collaboration features.",
            image: "https://via.placeholder.com/400x200/764ba2/ffffff?text=Task+Manager",
            demo_url: "https://example.com/taskmanager",
            github_url: "https://github.com/vaishnavi/taskmanager",
            technologies: "React, Socket.io, Node.js, MongoDB"
        },
        {
            id: 3,
            title: "Weather Dashboard",
            description: "Real-time weather monitoring dashboard with interactive charts and location-based forecasts.",
            image: "https://via.placeholder.com/400x200/f093fb/ffffff?text=Weather+App",
            demo_url: "https://example.com/weather",
            github_url: "https://github.com/vaishnavi/weather-dashboard",
            technologies: "JavaScript, Chart.js, Weather API, CSS3"
        }
    ];
    
    displayProjects(defaultProjects);
}

// Notification System
function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    // Style the notification
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 20px;
        background: ${type === 'success' ? '#4CAF50' : type === 'error' ? '#f44336' : '#2196F3'};
        color: white;
        border-radius: 5px;
        z-index: 10000;
        font-weight: 500;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        transform: translateX(400px);
        transition: transform 0.3s ease;
    `;
    
    // Add to DOM
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Remove after 5 seconds
    setTimeout(() => {
        notification.style.transform = 'translateX(400px)';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 5000);
}

// Utility Functions
function debounce(func, wait, immediate) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            timeout = null;
            if (!immediate) func(...args);
        };
        const callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func(...args);
    };
}

// Smooth scroll for all internal links
document.addEventListener('click', (e) => {
    if (e.target.matches('a[href^="#"]')) {
        e.preventDefault();
        const target = document.querySelector(e.target.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    }
});

// Handle window resize
window.addEventListener('resize', debounce(() => {
    // Recalculate animations or layouts if needed
    console.log('Window resized');
}, 250));

// Handle visibility change (for performance optimization)
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        // Pause animations when tab is not visible
        console.log('Tab hidden - pausing animations');
    } else {
        // Resume animations when tab becomes visible
        console.log('Tab visible - resuming animations');
    }
});

// Keyboard navigation support
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        // Close mobile menu if open
        const hamburger = document.querySelector('.hamburger');
        const navMenu = document.querySelector('.nav-menu');
        
        if (navMenu.classList.contains('active')) {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        }
    }
});

// Console welcome message
console.log(`
🚀 Welcome to Vaishnavi's Portfolio!
Built with love using HTML, CSS, JavaScript, Node.js & MySQL
Feel free to explore the code and reach out for collaborations!
`);
// Force load projects on page load (fallback)
window.addEventListener('load', () => {
    setTimeout(() => {
        if (document.getElementById('projectsGrid').innerHTML.trim() === '') {
            console.log('Projects not loaded, showing defaults...');
            displayDefaultProjects();
        }
    }, 2000);
});




