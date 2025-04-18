/**
 * Sovan Das Portfolio - Main JavaScript File
 */

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Navigation functionality
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    const navLinksItems = document.querySelectorAll('.nav-link');
    const backToTopBtn = document.querySelector('.back-to-top');
    const sections = document.querySelectorAll('section');

    // Toggle mobile menu
    hamburger.addEventListener('click', function() {
        hamburger.classList.toggle('active');
        navLinks.classList.toggle('active');
    });

    // Close mobile menu when clicking a link
    navLinksItems.forEach(link => {
        link.addEventListener('click', function() {
            hamburger.classList.remove('active');
            navLinks.classList.remove('active');
        });
    });

    // Back to top button visibility
    window.addEventListener('scroll', function() {
        if (window.scrollY > 500) {
            backToTopBtn.classList.add('active');
        } else {
            backToTopBtn.classList.remove('active');
        }

        // Highlight active navigation based on scroll position
        updateActiveNavOnScroll();
    });

    // Show resume button only on scroll
    const downloadResumeBtn = document.querySelector('.download-resume');
    const heroSection = document.getElementById('home');

    window.addEventListener('scroll', function() {
        if (downloadResumeBtn) {
            // Get the hero section's height
            const heroHeight = heroSection.offsetHeight;
            
            // Show button only when scrolled past hero section
            if (window.scrollY > heroHeight / 2) {
                downloadResumeBtn.style.opacity = '1';
                downloadResumeBtn.style.visibility = 'visible';
            } else {
                downloadResumeBtn.style.opacity = '0';
                downloadResumeBtn.style.visibility = 'hidden';
            }
        }
    });

    // Hide button initially on page load
    if (downloadResumeBtn) {
        downloadResumeBtn.style.opacity = '0';
        downloadResumeBtn.style.visibility = 'hidden';
    }

    // Section animations
    function setupSectionAnimations() {
        // Create animation observer for all sections
        const animationObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const animateItems = entry.target.querySelectorAll('.animate-item');
                    animateItems.forEach((item, index) => {
                        // Determine animation type based on data attribute or default to fadeInUp
                        const animationType = item.dataset.animation || 'fadeInUp';

                        // Apply animation with staggered delay
                        setTimeout(() => {
                            item.classList.add(`animate-${animationType}`);
                        }, 150 * index);
                    });
                    animationObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });

        // Add animation classes to appropriate elements

        // About section
        const aboutDetails = document.querySelector('.about-details');
        if (aboutDetails) {
            aboutDetails.classList.add('animate-item');
            aboutDetails.dataset.animation = 'fadeInUp';
            animationObserver.observe(document.getElementById('about'));
        }

        // Education section
        const educationCard = document.querySelector('.education-card');
        if (educationCard) {
            educationCard.classList.add('animate-item');
            educationCard.dataset.animation = 'fadeInLeft';
            animationObserver.observe(document.getElementById('education'));
        }

        // Experience section
        const expCards = document.querySelectorAll('.exp-card');
        expCards.forEach(card => {
            card.classList.add('animate-item');
            card.dataset.animation = 'fadeInRight';
        });
        if (expCards.length > 0) {
            animationObserver.observe(document.getElementById('experience'));
        }

        // Skills section
        const skillCategories = document.querySelectorAll('.skill-category');
        skillCategories.forEach(category => {
            category.classList.add('animate-item');
            category.dataset.animation = 'fadeInUp';
        });
        if (skillCategories.length > 0) {
            animationObserver.observe(document.getElementById('skills'));
        }

        // Projects section
        const projectCards = document.querySelectorAll('.project-card');
        projectCards.forEach(card => {
            card.classList.add('animate-item');
            card.dataset.animation = 'scaleUp';
        });
        if (projectCards.length > 0) {
            animationObserver.observe(document.getElementById('projects'));
        }

        // Certifications section
        const certificationCards = document.querySelectorAll('.certification-card');
        certificationCards.forEach(card => {
            card.classList.add('animate-item');
            card.dataset.animation = 'fadeInLeft';
        });
        if (certificationCards.length > 0) {
            animationObserver.observe(document.getElementById('certifications-section'));
        }

        // Achievements section
        const achievementCards = document.querySelectorAll('.achievement-card');
        achievementCards.forEach(card => {
            card.classList.add('animate-item');
            card.dataset.animation = 'fadeInRight';
        });
        if (achievementCards.length > 0) {
            const achievementsSection = document.querySelector('.achievements-section');
            if (achievementsSection) {
                animationObserver.observe(achievementsSection);
            }
        }

        // Languages section
        const languageItems = document.querySelectorAll('.language-list li');
        languageItems.forEach(item => {
            item.classList.add('animate-item');
            item.dataset.animation = 'fadeInUp';
        });
        if (languageItems.length > 0) {
            animationObserver.observe(document.getElementById('languages'));
        }

        // Contact section
        const contactItems = document.querySelectorAll('.contact-item');
        contactItems.forEach(item => {
            item.classList.add('animate-item');
            item.dataset.animation = 'fadeInUp';
        });
        if (contactItems.length > 0) {
            animationObserver.observe(document.getElementById('contact'));
        }
    }

    // Initialize section animations
    setupSectionAnimations();

    // Update active navigation link based on scroll position
    function updateActiveNavOnScroll() {
        let currentSection = '';

        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100;
            const sectionHeight = section.offsetHeight;

            if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
                currentSection = section.getAttribute('id');
            }
        });

        navLinksItems.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href').substring(1) === currentSection) {
                link.classList.add('active');
            }
        });
    }

    // Contact form submission with database storage
    const contactForm = document.getElementById('contactForm');
    const formStatus = document.getElementById('formStatus');

    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();

            formStatus.className = '';
            formStatus.style.display = 'none';

            const formData = {
                name: document.getElementById('name').value,
                email: document.getElementById('email').value,
                subject: document.getElementById('subject').value,
                message: document.getElementById('message').value
            };

            fetch('/api/contact', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    formStatus.textContent = data.message;
                    formStatus.className = 'success';
                    formStatus.style.display = 'block';
                    contactForm.reset();
                } else {
                    formStatus.textContent = data.message;
                    formStatus.className = 'error';
                    formStatus.style.display = 'block';
                }
            })
            .catch(error => {
                formStatus.textContent = 'There was an error sending your message. Please try again.';
                formStatus.className = 'error';
                formStatus.style.display = 'block';
                console.error('Error:', error);
            });
        });
    }


    // Optimize skill bars animation
    const skillLevels = document.querySelectorAll('.skill-level');
    
    // Use more efficient animation with better performance
    const skillObserver = new IntersectionObserver((entries, observer) => {
        // Process entries in batches to reduce layout thrashing
        const visibleEntries = entries.filter(entry => entry.isIntersecting);
        
        if (visibleEntries.length > 0) {
            // Use requestAnimationFrame for smoother animations
            requestAnimationFrame(() => {
                visibleEntries.forEach((entry, index) => {
                    const width = entry.target.style.width;
                    entry.target.style.width = '0';
                    
                    // Reduce the number of timeouts by batching animations
                    // and using shorter delays
                    setTimeout(() => {
                        entry.target.style.width = width;
                    }, index * 50); // Shorter delay between animations
                    
                    observer.unobserve(entry.target);
                });
            });
        }
    }, { 
        threshold: 0.1,
        rootMargin: '50px' // Preload a bit earlier
    });
    
    // Batch DOM operations
    const fragment = document.createDocumentFragment();
    skillLevels.forEach(skill => {
        const width = skill.style.width;
        skill.style.width = '0';
        skillObserver.observe(skill);
    });

    // Enhanced typewriter effect with stable prompt
    const typeTextElement = document.getElementById('type-text');
    const promptText = 'root@kali:~# ';
    const textOptions = [
        'Digital Forensics',
        'OSINT',
        'Malware Analysis',
        'DFIR',
        'Bug Bounty',
        'Content Creation',
        'Incident Response',
        'SOC Analyst',
        'SIEM Management',
        'VAPT',
        'Penetration Testing',
        'Cybersecurity'
    ];

    class TypeWriter {
        constructor(element, prompt, words) {
            this.element = element;
            this.prompt = prompt;
            this.words = words;
            this.txt = '';
            this.wordIndex = 0;
            this.isDeleting = false;
            this.typeSpeed = 70; // Slower typing speed
            this.glitchChance = 0.08; // Slightly reduced glitch chance

            // Set the initial prompt text that never changes
            this.updateText();
            this.type();
        }

        getRandomChar() {
            const chars = '!@#$%^&*()_+-=[]{}|;:,.<>?';
            return chars[Math.floor(Math.random() * chars.length)];
        }

        updateText() {
            this.element.innerHTML = `<span style="color: #0f0; opacity: 1;">${this.prompt}</span>${this.txt}`;
        }

        async glitchText() {
            const originalText = this.txt;
            const glitchDuration = 120;
            const iterations = 3;

            for (let i = 0; i < iterations; i++) {
                let glitchedText = '';
                for (let j = 0; j < originalText.length; j++) {
                    glitchedText += Math.random() < 0.3 ? this.getRandomChar() : originalText[j];
                }
                this.element.innerHTML = `<span style="color: #0f0; opacity: 1;">${this.prompt}</span>${glitchedText}`;
                await new Promise(resolve => setTimeout(resolve, glitchDuration / iterations));
            }

            this.updateText();
        }

        type() {
            const current = this.wordIndex % this.words.length;
            const fullTxt = this.words[current];

            if (this.isDeleting) {
                this.txt = fullTxt.substring(0, this.txt.length - 1);
            } else {
                this.txt = fullTxt.substring(0, this.txt.length + 1);
            }

            this.updateText();

            // Random glitch effect
            if (Math.random() < this.glitchChance && this.txt.length > 0) {
                this.glitchText();
            }

            // Adjust typing speeds - slower for typing, faster for deleting
            this.typeSpeed = this.isDeleting ? 40 : 70;

            if (!this.isDeleting && this.txt === fullTxt) {
                // Keep text visible longer for reading (3 seconds)
                this.typeSpeed = 3000; 
                this.isDeleting = true;
            } else if (this.isDeleting && this.txt === '') {
                this.isDeleting = false;
                this.wordIndex++;
                this.typeSpeed = 700; // Slightly longer pause between words
            }

            requestAnimationFrame(() => setTimeout(() => this.type(), this.typeSpeed));
        }
    }

    // Initialize the typewriter effect with stable prompt
    if (typeTextElement) {
        new TypeWriter(typeTextElement, promptText, textOptions);
    }

    // Add smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();

            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);

            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 70, // Adjust for header height
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Lazy load skill sections for better performance
    const lazyLoadSkills = () => {
        const skillSection = document.getElementById('skills');
        
        if (skillSection) {
            const skillCategories = skillSection.querySelectorAll('.skill-category');
            
            const lazyObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        // Only process skill categories when they're about to be visible
                        const category = entry.target;
                        category.classList.add('loaded');
                        lazyObserver.unobserve(category);
                    }
                });
            }, {
                rootMargin: '100px', // Load when within 100px of viewport
                threshold: 0.01
            });
            
            // Observe each skill category
            skillCategories.forEach(category => {
                lazyObserver.observe(category);
            });
        }
    };
    
    // Initialize lazy loading
    lazyLoadSkills();
});