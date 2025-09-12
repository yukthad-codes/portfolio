// EmailJS Configuration
const emailConfig = {
    serviceId: 'service_37hr0pt',
    templateId: 'template_r4l0dtc',
    publicKey: 'DyCeQgXEp0pjcr8nt'
};

// Email Template Configuration
// Template variable names that will be used in EmailJS dashboard setup
// 
// EmailJS Dashboard Setup Instructions:
// When creating your email template in EmailJS dashboard, use these variable names:
// - {{from_name}} - Will be replaced with the user's name
// - {{from_email}} - Will be replaced with the user's email address
// - {{subject}} - Will be replaced with the form subject
// - {{message}} - Will be replaced with the user's message
// - {{reply_to}} - Will be replaced with the user's email for easy replies
//
// Example template content:
// Subject: Portfolio Contact: {{subject}}
// Body: 
// Name: {{from_name}}
// Email: {{from_email}}
// Subject: {{subject}}
// 
// Message:
// {{message}}
const emailTemplateVars = {
    FROM_NAME: 'from_name',        // User's name from the form
    FROM_EMAIL: 'from_email',      // User's email address  
    SUBJECT: 'subject',            // Subject line from the form
    MESSAGE: 'message',            // Message content from the form
    REPLY_TO: 'reply_to'           // Reply-to email (same as from_email)
};

// Template parameters structure that matches the contact form fields
const templateParamsStructure = {
    from_name: '',      // string - User's full name (required)
    from_email: '',     // string - User's email address (required, valid email format)
    subject: '',        // string - Email subject line (required)
    message: '',        // string - Email message content (required)
    reply_to: ''        // string - Reply-to email address (same as from_email)
};

/**
 * Template parameter mapping function to convert form data to EmailJS format
 * @param {Object} formData - Form data object with name, email, subject, message
 * @returns {Object} EmailJS template parameters object
 */
function mapFormDataToEmailTemplate(formData) {
    return {
        [emailTemplateVars.FROM_NAME]: formData.name || '',
        [emailTemplateVars.FROM_EMAIL]: formData.email || '',
        [emailTemplateVars.SUBJECT]: formData.subject || '',
        [emailTemplateVars.MESSAGE]: formData.message || '',
        [emailTemplateVars.REPLY_TO]: formData.email || ''
    };
}

// Initialize EmailJS
(function() {
    emailjs.init(emailConfig.publicKey);
})();

// Mobile Navigation Toggle
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
});

// Close mobile menu when clicking on a link
document.querySelectorAll('.nav-link').forEach(n => n.addEventListener('click', () => {
    hamburger.classList.remove('active');
    navMenu.classList.remove('active');
}));

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Navbar background change on scroll
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

// Intersection Observer for animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe elements for animation
document.addEventListener('DOMContentLoaded', () => {
    const animateElements = document.querySelectorAll('.project-card, .skill-item, .about-text, .contact-info, .contact-form');
    
    animateElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
});

// Contact form handling
const contactForm = document.getElementById('contactForm');

contactForm.addEventListener('submit', async function(e) {
    e.preventDefault();
    
    // Get form data
    const formData = new FormData(this);
    const name = formData.get('name');
    const email = formData.get('email');
    const subject = formData.get('subject');
    const message = formData.get('message');
    
    // Enhanced form validation with specific field validation messages
    if (!name || !email || !subject || !message) {
        // Identify which specific fields are missing
        const missingFields = [];
        if (!name) missingFields.push('Name');
        if (!email) missingFields.push('Email');
        if (!subject) missingFields.push('Subject');
        if (!message) missingFields.push('Message');
        
        const fieldText = missingFields.length === 1 ? 'field' : 'fields';
        showNotification(`Please fill in the following ${fieldText}: ${missingFields.join(', ')}.`, 'error');
        return;
    }
    
    if (!isValidEmail(email)) {
        showNotification('Please enter a valid email address.', 'error');
        return;
    }
    
    // Additional validation for field lengths
    if (name.length > 100) {
        showNotification('Name must be less than 100 characters.', 'error');
        return;
    }
    
    if (subject.length > 200) {
        showNotification('Subject must be less than 200 characters.', 'error');
        return;
    }
    
    if (message.length > 2000) {
        showNotification('Message must be less than 2000 characters.', 'error');
        return;
    }
    
    // Enhanced form submission with EmailJS integration
    await handleFormSubmission({
        name: name,
        email: email,
        subject: subject,
        message: message
    }, this);
});

/**
 * Enhanced form submission handler with EmailJS integration
 * @param {Object} formData - Form data object with name, email, subject, message
 * @param {HTMLFormElement} formElement - The form element for resetting on success
 */
async function handleFormSubmission(formData, formElement) {
    const submitButton = formElement.querySelector('button[type="submit"]');
    const originalButtonText = submitButton.textContent;
    
    try {
        // Implement loading state for the submit button during email sending
        setButtonLoadingState(submitButton, true);
        
        // Map form data to EmailJS template parameters
        const templateParams = mapFormDataToEmailTemplate(formData);
        
        // Send email via EmailJS with async/await pattern
        const response = await emailjs.send(
            emailConfig.serviceId,
            emailConfig.templateId,
            templateParams
        );
        
        // Handle successful email sending with proper success handling and form reset
        if (response.status === 200) {
            // Show success notification
            showNotification('Thank you for your message! I\'ll get back to you soon.', 'success');
            
            // Reset form fields on successful submission (requirement 4.3)
            formElement.reset();
            
            // Optional: Clear any validation error states
            const formGroups = formElement.querySelectorAll('.form-group');
            formGroups.forEach(group => {
                const input = group.querySelector('input, textarea');
                if (input) {
                    input.classList.remove('error');
                }
            });
        } else {
            throw new Error('Email service returned unexpected status: ' + response.status);
        }
        
    } catch (error) {
        // Implement proper error handling for EmailJS service calls
        // Form data is preserved on error (not reset) so user doesn't lose their input
        handleEmailError(error);
    } finally {
        // Reset button to original state
        setButtonLoadingState(submitButton, false, originalButtonText);
    }
}

/**
 * Set loading state for submit button with visual loading indicator
 * @param {HTMLButtonElement} button - The submit button element
 * @param {boolean} isLoading - Whether to show loading state
 * @param {string} originalText - Original button text to restore when not loading
 */
function setButtonLoadingState(button, isLoading, originalText = 'Send Message') {
    if (isLoading) {
        // Disable form submission during email sending to prevent duplicate requests
        button.disabled = true;
        
        // Add visual loading indicator (spinner or text change) on the submit button
        button.innerHTML = `
            <span class="loading-spinner"></span>
            Sending...
        `;
        
        // Add loading class for additional styling
        button.classList.add('loading');
    } else {
        // Re-enable button and restore original state
        button.disabled = false;
        button.textContent = originalText;
        button.classList.remove('loading');
    }
}

/**
 * Enhanced EmailJS error handler with specific error messages for different failure scenarios
 * @param {Error} error - The error object from EmailJS service call
 */
function handleEmailError(error) {
    console.error('EmailJS Error:', error);
    
    let errorMessage = 'Failed to send message. Please try again or contact directly via email.';
    
    // Handle specific EmailJS error scenarios with detailed error messages
    if (error.text) {
        const errorText = error.text.toLowerCase();
        
        // Configuration-related errors
        if (errorText.includes('invalid template id') || errorText.includes('template not found')) {
            errorMessage = 'Email service configuration error. Please try again later or contact directly via email.';
        } else if (errorText.includes('invalid service id') || errorText.includes('service not found')) {
            errorMessage = 'Email service is temporarily unavailable. Please try again later.';
        } else if (errorText.includes('invalid public key') || errorText.includes('unauthorized')) {
            errorMessage = 'Email service authentication failed. Please try again later.';
        }
        // Rate limiting and quota errors
        else if (errorText.includes('rate limit') || errorText.includes('too many requests')) {
            errorMessage = 'Too many requests. Please wait a moment before sending another message.';
        } else if (errorText.includes('quota') || errorText.includes('limit exceeded')) {
            errorMessage = 'Email service quota exceeded. Please try again later or contact directly via email.';
        }
        // Network and connection errors
        else if (errorText.includes('network') || errorText.includes('connection') || errorText.includes('timeout')) {
            errorMessage = 'Unable to send message. Please check your connection and try again.';
        } else if (errorText.includes('cors') || errorText.includes('blocked')) {
            errorMessage = 'Email service is temporarily blocked. Please try again later.';
        }
        // Template and parameter errors
        else if (errorText.includes('template') && errorText.includes('parameter')) {
            errorMessage = 'Email template error. Please try again or contact directly via email.';
        } else if (errorText.includes('invalid email') || errorText.includes('email format')) {
            errorMessage = 'Invalid email format detected. Please check your email address and try again.';
        }
    } 
    // Handle JavaScript/Network errors
    else if (error.message) {
        const errorMessage_lower = error.message.toLowerCase();
        
        if (errorMessage_lower.includes('fetch') || errorMessage_lower.includes('network')) {
            errorMessage = 'Unable to send message. Please check your connection and try again.';
        } else if (errorMessage_lower.includes('timeout')) {
            errorMessage = 'Request timed out. Please check your connection and try again.';
        } else if (errorMessage_lower.includes('cors')) {
            errorMessage = 'Email service access blocked. Please try again later.';
        }
    }
    // Handle status code errors
    else if (error.status) {
        switch (error.status) {
            case 400:
                errorMessage = 'Invalid request. Please check your information and try again.';
                break;
            case 401:
                errorMessage = 'Email service authentication failed. Please try again later.';
                break;
            case 403:
                errorMessage = 'Email service access denied. Please try again later.';
                break;
            case 404:
                errorMessage = 'Email service not found. Please try again later.';
                break;
            case 429:
                errorMessage = 'Too many requests. Please wait a moment before sending another message.';
                break;
            case 500:
            case 502:
            case 503:
                errorMessage = 'Email service is temporarily unavailable. Please try again later.';
                break;
            default:
                errorMessage = 'Failed to send message. Please try again or contact directly via email.';
        }
    }
    
    // Display the appropriate error message
    showNotification(errorMessage, 'error');
}

// Enhanced email validation function with more comprehensive checks
function isValidEmail(email) {
    // Basic format check
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    // Additional validation checks
    if (!email || email.length === 0) return false;
    if (email.length > 254) return false; // RFC 5321 limit
    if (!emailRegex.test(email)) return false;
    
    // Check for common invalid patterns
    if (email.startsWith('.') || email.endsWith('.')) return false;
    if (email.includes('..')) return false; // Consecutive dots
    
    return true;
}

// Enhanced notification system with EmailJS-specific error handling
function showNotification(message, type) {
    // Remove existing notifications
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    // Enhanced styles with better visual feedback
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 20px;
        border-radius: 8px;
        color: white;
        font-weight: 500;
        z-index: 10000;
        transform: translateX(400px);
        transition: transform 0.3s ease;
        max-width: 350px;
        word-wrap: break-word;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        ${type === 'success' ? 
            'background-color: #27ae60; border-left: 4px solid #1e8449;' : 
            'background-color: #e74c3c; border-left: 4px solid #c0392b;'}
    `;
    
    // Add to page
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Remove after 5 seconds for success, 7 seconds for errors (more time to read)
    const displayTime = type === 'success' ? 5000 : 7000;
    setTimeout(() => {
        notification.style.transform = 'translateX(400px)';
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, displayTime);
}

// Typing animation for home section
function typeWriter(element, text, speed = 100) {
    let i = 0;
    element.innerHTML = '';
    
    function type() {
        if (i < text.length) {
            element.innerHTML += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    }
    
    type();
}

// Initialize typing animation when page loads
window.addEventListener('load', () => {
    const homeTitle = document.querySelector('.home-title');
    if (homeTitle) {
        const originalText = homeTitle.textContent;
        setTimeout(() => {
            typeWriter(homeTitle, originalText, 80);
        }, 1000);
    }
});

// Parallax effect for home section
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const homeSection = document.querySelector('.home');
    const rate = scrolled * -0.5;
    
    if (homeSection) {
        homeSection.style.transform = `translateY(${rate}px)`;
    }
});

// Add loading animation
window.addEventListener('load', () => {
    document.body.classList.add('loaded');
});

// Add CSS for loading state
const loadingStyles = `
    body:not(.loaded) {
        overflow: hidden;
    }
    
    body:not(.loaded)::before {
        content: '';
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: #667eea;
        z-index: 10000;
        display: flex;
        align-items: center;
        justify-content: center;
    }
    
    body:not(.loaded)::after {
        content: '';
        position: fixed;
        top: 50%;
        left: 50%;
        width: 50px;
        height: 50px;
        border: 3px solid rgba(255, 255, 255, 0.3);
        border-top: 3px solid white;
        border-radius: 50%;
        animation: spin 1s linear infinite;
        z-index: 10001;
        transform: translate(-50%, -50%);
    }
    
    @keyframes spin {
        0% { transform: translate(-50%, -50%) rotate(0deg); }
        100% { transform: translate(-50%, -50%) rotate(360deg); }
    }
`;

// Add loading styles to head
const styleSheet = document.createElement('style');
styleSheet.textContent = loadingStyles;
document.head.appendChild(styleSheet);