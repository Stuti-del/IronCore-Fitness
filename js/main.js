// DOM Elements
const header = document.getElementById('header');
const menuToggle = document.querySelector('.menu-toggle');
const navbar = document.getElementById('navbar');
const navLinks = document.querySelectorAll('#navbar ul li a');
const testimonialDots = document.querySelectorAll('.testimonial-dot');
const testimonialSlides = document.querySelectorAll('.testimonial-slide');
const trialForm = document.getElementById('trial-form');
const contactForm = document.getElementById('contact-form');
const successModal = document.getElementById('success-modal');
const modalMessage = document.getElementById('modal-message');
const closeModal = document.querySelector('.close-modal');
const modalOk = document.getElementById('modal-ok');

// Navigation Menu Toggle
menuToggle.addEventListener('click', () => {
    navbar.classList.toggle('active');
    menuToggle.querySelector('i').classList.toggle('fa-bars');
    menuToggle.querySelector('i').classList.toggle('fa-times');
});

// Hide menu on click outside
document.addEventListener('click', (e) => {
    if (navbar.classList.contains('active') && 
        !navbar.contains(e.target) && 
        !menuToggle.contains(e.target)) {
        navbar.classList.remove('active');
        menuToggle.querySelector('i').classList.add('fa-bars');
        menuToggle.querySelector('i').classList.remove('fa-times');
    }
});

// Navbar scroll behavior
window.addEventListener('scroll', () => {
    if (window.scrollY > 100) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
});

// Smooth scroll for nav links
navLinks.forEach(link => {
    link.addEventListener('click', function(e) {
        e.preventDefault();
        
        // Remove active class from all links
        navLinks.forEach(link => link.classList.remove('active'));
        
        // Add active class to clicked link
        this.classList.add('active');
        
        // Close mobile menu if open
        if (navbar.classList.contains('active')) {
            navbar.classList.remove('active');
            menuToggle.querySelector('i').classList.add('fa-bars');
            menuToggle.querySelector('i').classList.remove('fa-times');
        }
        
        // Scroll to section
        const targetId = this.getAttribute('href');
        const targetSection = document.querySelector(targetId);
        
        if (targetSection) {
            const offsetTop = targetSection.offsetTop - 80;
            
            // Smooth scroll with animation
            smoothScrollTo(offsetTop, 1000);
        }
    });
});

// Enhanced smooth scroll function with easing
function smoothScrollTo(targetPosition, duration) {
    const startPosition = window.pageYOffset;
    const distance = targetPosition - startPosition;
    let startTime = null;
    
    function animation(currentTime) {
        if (startTime === null) startTime = currentTime;
        const timeElapsed = currentTime - startTime;
        const scrollY = easeInOutQuad(timeElapsed, startPosition, distance, duration);
        window.scrollTo(0, scrollY);
        
        if (timeElapsed < duration) {
            requestAnimationFrame(animation);
        }
    }
    
    // Easing function
    function easeInOutQuad(t, b, c, d) {
        t /= d / 2;
        if (t < 1) return c / 2 * t * t + b;
        t--;
        return -c / 2 * (t * (t - 2) - 1) + b;
    }
    
    requestAnimationFrame(animation);
}

// Add active class to nav links on scroll
window.addEventListener('scroll', () => {
    const scrollPosition = window.scrollY + 100;
    const sections = document.querySelectorAll('section');
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        
        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
            const currentId = section.getAttribute('id');
            
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${currentId}`) {
                    link.classList.add('active');
                }
            });
        }
    });
});

// Testimonial Slider
let currentSlide = 0;

function showSlide(n) {
    testimonialSlides.forEach(slide => slide.classList.remove('active'));
    testimonialDots.forEach(dot => dot.classList.remove('active'));
    
    testimonialSlides[n].classList.add('active');
    testimonialDots[n].classList.add('active');
    
    currentSlide = n;
}

// Testimonial dot navigation
testimonialDots.forEach((dot, index) => {
    dot.addEventListener('click', () => {
        showSlide(index);
    });
});

// Auto-rotate testimonials
function autoRotateTestimonials() {
    currentSlide = (currentSlide + 1) % testimonialSlides.length;
    showSlide(currentSlide);
}

// Set initial state and start auto-rotation
showSlide(0);
const testimonialInterval = setInterval(autoRotateTestimonials, 5000);

// Stop auto-rotation on dot click
testimonialDots.forEach(dot => {
    dot.addEventListener('click', () => {
        clearInterval(testimonialInterval);
    });
});

// Form Validation & Submission
trialForm?.addEventListener('submit', function(e) {
    e.preventDefault();
    
    if (validateForm(this)) {
        // In a real application, this would send the form data to a server
        // For demo purposes, we'll just show a success message
        showModal('Your free trial has been booked! We will contact you shortly to confirm your appointment.');
        this.reset();
    }
});

contactForm?.addEventListener('submit', function(e) {
    e.preventDefault();
    
    if (validateForm(this)) {
        // In a real application, this would send the form data to a server
        // For demo purposes, we'll just show a success message
        showModal('Your message has been sent successfully. We\'ll get back to you soon!');
        this.reset();
    }
});

// Form validation
function validateForm(form) {
    let isValid = true;
    const inputs = form.querySelectorAll('input, select, textarea');
    
    inputs.forEach(input => {
        if (input.hasAttribute('required') && !input.value.trim()) {
            isValid = false;
            showError(input, 'This field is required');
        } else if (input.type === 'email' && input.value.trim() && !isValidEmail(input.value)) {
            isValid = false;
            showError(input, 'Please enter a valid email address');
        } else if (input.type === 'tel' && input.value.trim() && !isValidPhone(input.value)) {
            isValid = false;
            showError(input, 'Please enter a valid phone number');
        } else {
            clearError(input);
        }
    });
    
    return isValid;
}

function showError(input, message) {
    // Clear any existing error
    clearError(input);
    
    // Create error element
    const errorElement = document.createElement('div');
    errorElement.className = 'error-message';
    errorElement.textContent = message;
    errorElement.style.color = '#ff3d00';
    errorElement.style.fontSize = '1.4rem';
    errorElement.style.marginTop = '0.5rem';
    
    // Insert error after input
    input.parentNode.appendChild(errorElement);
    
    // Highlight input
    input.style.borderColor = '#ff3d00';
}

function clearError(input) {
    // Remove error message if exists
    const errorElement = input.parentNode.querySelector('.error-message');
    if (errorElement) {
        errorElement.remove();
    }
    
    // Reset input style
    input.style.borderColor = '';
}

function isValidEmail(email) {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}

function isValidPhone(phone) {
    // Basic phone validation - adjust as needed for specific formats
    const re = /^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/;
    return re.test(String(phone));
}

// Modal functions
function showModal(message) {
    modalMessage.textContent = message;
    successModal.classList.add('show');
}

function closeModalHandler() {
    successModal.classList.remove('show');
}

closeModal.addEventListener('click', closeModalHandler);
modalOk.addEventListener('click', closeModalHandler);

// Close modal on outside click
successModal.addEventListener('click', function(e) {
    if (e.target === this) {
        closeModalHandler();
    }
});

// Close modal on Escape key
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && successModal.classList.contains('show')) {
        closeModalHandler();
    }
});

// We've removed the Google Maps implementation and replaced it with a static map
// No JavaScript is needed for the static map solution

// AOS-like animations without library
const animateOnScroll = () => {
    const elements = document.querySelectorAll('.service-card, .trainer-card, .info-item');
    
    elements.forEach(element => {
        const elementPosition = element.getBoundingClientRect().top;
        const windowHeight = window.innerHeight;
        
        if (elementPosition < windowHeight - 100) {
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
        }
    });
};

// Set initial styles for animation
document.addEventListener('DOMContentLoaded', () => {
    const elements = document.querySelectorAll('.service-card, .trainer-card, .info-item');
    
    elements.forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(20px)';
        element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    });
    
    // Trigger initial animation check
    animateOnScroll();
});

// Trigger animations on scroll
window.addEventListener('scroll', animateOnScroll);
