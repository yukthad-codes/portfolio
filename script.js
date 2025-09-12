// ============================================================================
// EMAILJS CONFIGURATION
// ============================================================================
// This section contains the EmailJS service configuration required for 
// sending emails from the contact form. These values are obtained from 
// the EmailJS dashboard after setting up your email service and template.
//
// SETUP INSTRUCTIONS:
// 1. Create account at https://www.emailjs.com/
// 2. Add your email service (Gmail, Outlook, etc.)
// 3. Create an email template with the required variables
// 4. Replace the placeholder values below with your actual credentials
//
// SECURITY NOTE: The public key is safe to expose in client-side code.
// EmailJS handles authentication and email delivery securely.
const emailConfig = {
    serviceId: 'service_37hr0pt',    // Your EmailJS Service ID from dashboard
    templateId: 'template_r4l0dtc',  // Your EmailJS Template ID from dashboard  
    publicKey: 'DyCeQgXEp0pjcr8nt'   // Your EmailJS Public Key from dashboard
};

// ============================================================================
// EMAIL TEMPLATE CONFIGURATION
// ============================================================================
// This section defines the template variable mapping between the contact form
// fields and the EmailJS template variables. These variable names must match
// exactly with the template variables defined in your EmailJS dashboard.
//
// EMAILJS TEMPLATE SETUP INSTRUCTIONS:
// When creating your email template in the EmailJS dashboard, use these exact
// variable names (including the double curly braces):
//
// Template Subject Line:
//   Portfolio Contact: {{subject}}
//
// Template Body Content:
//   From: {{from_name}}
//   Email: {{from_email}}
//   Subject: {{subject}}
//   
//   Message:
//   {{message}}
//   
//   ---
//   Reply directly to this email to respond to {{from_name}}.
//
// Template Settings:
//   - To Email: your-email@domain.com (where you want to receive messages)
//   - Reply To: {{from_email}} (enables direct replies to the sender)
//
// VARIABLE MAPPING:
// These constants define the exact variable names used in the EmailJS template
const emailTemplateVars = {
    FROM_NAME: 'from_name',        // Maps to {{from_name}} in template
    FROM_EMAIL: 'from_email',      // Maps to {{from_email}} in template
    SUBJECT: 'subject',            // Maps to {{subject}} in template  
    MESSAGE: 'message',            // Maps to {{message}} in template
    REPLY_TO: 'reply_to'           // Maps to {{reply_to}} in template (for replies)
};

// ============================================================================
// TEMPLATE PARAMETERS STRUCTURE
// ============================================================================
// This structure documents the expected format of data sent to EmailJS.
// It serves as a reference for developers and ensures type safety.
//
// FIELD VALIDATION RULES:
// - from_name: Required, max 100 characters, no special validation
// - from_email: Required, must be valid email format, max 254 characters (RFC 5321)
// - subject: Required, max 200 characters, no special validation  
// - message: Required, max 2000 characters, no special validation
// - reply_to: Automatically set to same value as from_email
//
// TESTING SCENARIOS:
// Test with these data combinations to verify proper handling:
// 1. Valid data: All fields filled with reasonable content
// 2. Missing fields: Empty name, email, subject, or message
// 3. Invalid email: "invalid-email", "test@", "@domain.com"
// 4. Long content: Strings exceeding character limits
// 5. Special characters: Unicode, emojis, HTML tags in message
const templateParamsStructure = {
    from_name: '',      // string - User's full name (required, max 100 chars)
    from_email: '',     // string - Valid email address (required, max 254 chars)
    subject: '',        // string - Email subject line (required, max 200 chars)
    message: '',        // string - Email message content (required, max 2000 chars)
    reply_to: ''        // string - Reply-to email (auto-set to from_email)
};

/**
 * ============================================================================
 * FORM DATA TO EMAILJS TEMPLATE MAPPING
 * ============================================================================
 * Converts contact form data into the format expected by EmailJS template.
 * This function acts as the bridge between the HTML form and EmailJS service.
 * 
 * INTEGRATION POINT: This is where form data gets transformed for EmailJS
 * 
 * @param {Object} formData - Form data object with name, email, subject, message
 * @param {string} formData.name - User's full name from form input
 * @param {string} formData.email - User's email address from form input  
 * @param {string} formData.subject - Email subject from form input
 * @param {string} formData.message - Message content from form textarea
 * @returns {Object} EmailJS template parameters object ready for sending
 * 
 * ERROR HANDLING TEST SCENARIOS:
 * - Test with undefined/null formData object
 * - Test with missing properties (formData.name = undefined)
 * - Test with empty strings for all properties
 * - Test with very long strings that exceed limits
 * - Verify that reply_to is always set to the user's email for proper replies
 */
function mapFormDataToEmailTemplate(formData) {
    // Defensive programming: Handle cases where formData might be undefined/null
    if (!formData || typeof formData !== 'object') {
        console.warn('mapFormDataToEmailTemplate: Invalid formData provided');
        return {};
    }
    
    // Map form fields to EmailJS template variables with fallback to empty strings
    // This ensures the template always receives the expected variable names
    return {
        [emailTemplateVars.FROM_NAME]: formData.name || '',
        [emailTemplateVars.FROM_EMAIL]: formData.email || '',
        [emailTemplateVars.SUBJECT]: formData.subject || '',
        [emailTemplateVars.MESSAGE]: formData.message || '',
        [emailTemplateVars.REPLY_TO]: formData.email || ''  // Enable direct replies
    };
}

// ============================================================================
// EMAILJS CONFIGURATION VALIDATION
// ============================================================================
// This section provides comprehensive validation of EmailJS setup to ensure
// the service is properly configured before attempting to send emails.
// Early validation prevents user frustration from failed form submissions.

/**
 * Validates EmailJS configuration parameters for completeness and correctness
 * 
 * INTEGRATION POINT: Called before any EmailJS operations to ensure setup is valid
 * 
 * VALIDATION CHECKS PERFORMED:
 * 1. EmailJS library availability (script loaded correctly)
 * 2. Configuration object completeness (no missing IDs/keys)
 * 3. Placeholder value detection (catches incomplete setup)
 * 4. Empty/whitespace-only value detection
 * 
 * ERROR HANDLING TEST SCENARIOS:
 * - EmailJS script not loaded (emailjs undefined)
 * - Missing serviceId, templateId, or publicKey
 * - Placeholder values like 'YOUR_SERVICE_ID' still present
 * - Empty strings or whitespace-only values
 * - Null or undefined configuration values
 * 
 * @returns {Object} Validation result with isValid boolean and error messages array
 * @returns {boolean} result.isValid - True if configuration is valid
 * @returns {string[]} result.errors - Array of specific error messages
 */
function validateEmailJSConfiguration() {
    const validation = {
        isValid: true,
        errors: []
    };
    
    // Check if EmailJS library is loaded
    if (typeof emailjs === 'undefined') {
        validation.isValid = false;
        validation.errors.push('EmailJS library is not loaded');
        return validation;
    }
    
    // Validate configuration parameters
    if (!emailConfig.serviceId || emailConfig.serviceId.trim() === '') {
        validation.isValid = false;
        validation.errors.push('EmailJS Service ID is missing or empty');
    }
    
    if (!emailConfig.templateId || emailConfig.templateId.trim() === '') {
        validation.isValid = false;
        validation.errors.push('EmailJS Template ID is missing or empty');
    }
    
    if (!emailConfig.publicKey || emailConfig.publicKey.trim() === '') {
        validation.isValid = false;
        validation.errors.push('EmailJS Public Key is missing or empty');
    }
    
    // Check for placeholder values that indicate incomplete setup
    const placeholderValues = ['YOUR_SERVICE_ID', 'YOUR_TEMPLATE_ID', 'YOUR_PUBLIC_KEY'];
    
    if (placeholderValues.includes(emailConfig.serviceId)) {
        validation.isValid = false;
        validation.errors.push('EmailJS Service ID contains placeholder value - please configure with actual service ID');
    }
    
    if (placeholderValues.includes(emailConfig.templateId)) {
        validation.isValid = false;
        validation.errors.push('EmailJS Template ID contains placeholder value - please configure with actual template ID');
    }
    
    if (placeholderValues.includes(emailConfig.publicKey)) {
        validation.isValid = false;
        validation.errors.push('EmailJS Public Key contains placeholder value - please configure with actual public key');
    }
    
    return validation;
}

/**
 * Tests EmailJS service availability and initialization capability
 * 
 * INTEGRATION POINT: Verifies EmailJS service can be initialized with current config
 * 
 * This function performs a lightweight check of EmailJS service availability
 * without sending an actual email. It validates that the service can be 
 * initialized with the provided configuration.
 * 
 * ERROR HANDLING TEST SCENARIOS:
 * - EmailJS service initialization failure
 * - Network connectivity issues preventing service access
 * - Invalid configuration causing initialization errors
 * - EmailJS service temporarily unavailable
 * - Browser compatibility issues with EmailJS
 * 
 * @returns {Promise<Object>} Promise that resolves to availability result
 * @returns {boolean} result.isAvailable - True if service is available and ready
 * @returns {string|null} result.error - Error message if service is not available
 */
async function validateEmailJSServiceAvailability() {
    const result = {
        isAvailable: false,
        error: null
    };
    
    try {
        // First check basic configuration
        const configValidation = validateEmailJSConfiguration();
        if (!configValidation.isValid) {
            result.error = 'Configuration validation failed: ' + configValidation.errors.join(', ');
            return result;
        }
        
        // Test EmailJS service by attempting to initialize with current config
        // This is a lightweight check that doesn't send an actual email
        if (typeof emailjs.init === 'function') {
            // EmailJS init doesn't return a promise, but we can check if it throws
            emailjs.init(emailConfig.publicKey);
            result.isAvailable = true;
        } else {
            result.error = 'EmailJS init function is not available';
        }
        
    } catch (error) {
        result.error = 'EmailJS service initialization failed: ' + error.message;
    }
    
    return result;
}

/**
 * Displays graceful fallback message when EmailJS is not properly configured
 * 
 * INTEGRATION POINT: Provides user-friendly error messages when EmailJS fails
 * 
 * This function ensures users always receive helpful feedback when the email
 * service is unavailable, maintaining a good user experience even during failures.
 * It provides alternative contact methods and logs technical details for debugging.
 * 
 * ERROR HANDLING TEST SCENARIOS:
 * - Configuration errors (invalid IDs, missing setup)
 * - Service unavailability (network issues, EmailJS downtime)
 * - Rate limiting or quota exceeded scenarios
 * - Authentication failures with EmailJS service
 * 
 * @param {string} specificError - Specific technical error for logging/debugging
 */
function showEmailJSFallbackMessage(specificError = null) {
    let fallbackMessage = 'Email service is currently unavailable. ';
    
    if (specificError) {
        console.error('EmailJS Configuration Error:', specificError);
        fallbackMessage += 'Please try again later or contact me directly at yukthad98@gmail.com.';
    } else {
        fallbackMessage += 'Please contact me directly at yukthad98@gmail.com.';
    }
    
    showNotification(fallbackMessage, 'error');
}

/**
 * Comprehensive EmailJS readiness check combining configuration and service validation
 * 
 * INTEGRATION POINT: Master validation function called before form submission
 * 
 * This is the main validation function that orchestrates all EmailJS checks.
 * It ensures both configuration validity and service availability before 
 * allowing form submission to proceed. Provides user feedback for any issues.
 * 
 * VALIDATION FLOW:
 * 1. Check configuration completeness and correctness
 * 2. Test EmailJS service initialization capability  
 * 3. Display appropriate error messages for any failures
 * 4. Return boolean indicating overall readiness status
 * 
 * ERROR HANDLING TEST SCENARIOS:
 * - Complete configuration failure (no setup done)
 * - Partial configuration (some values missing/invalid)
 * - Service availability issues (network, EmailJS downtime)
 * - Mixed failures (config valid but service unavailable)
 * - Successful validation (all checks pass)
 * 
 * @returns {Promise<boolean>} Promise that resolves to true if EmailJS is ready to use
 */
async function isEmailJSReady() {
    try {
        // Step 1: Validate configuration
        const configValidation = validateEmailJSConfiguration();
        if (!configValidation.isValid) {
            showEmailJSFallbackMessage('Configuration Error: ' + configValidation.errors.join(', '));
            return false;
        }
        
        // Step 2: Test service availability
        const serviceValidation = await validateEmailJSServiceAvailability();
        if (!serviceValidation.isAvailable) {
            showEmailJSFallbackMessage(serviceValidation.error);
            return false;
        }
        
        return true;
        
    } catch (error) {
        showEmailJSFallbackMessage('Unexpected error during EmailJS validation: ' + error.message);
        return false;
    }
}

// ============================================================================
// EMAILJS INITIALIZATION WITH VALIDATION
// ============================================================================
// This IIFE (Immediately Invoked Function Expression) handles EmailJS 
// initialization when the script loads. It includes validation to ensure
// proper setup and provides console feedback for developers.
//
// INTEGRATION POINT: EmailJS service initialization on page load
//
// INITIALIZATION FLOW:
// 1. Validate configuration before attempting initialization
// 2. Initialize EmailJS service with public key if config is valid
// 3. Log success/failure messages for developer debugging
// 4. Gracefully handle initialization failures without breaking the page
//
// ERROR HANDLING TEST SCENARIOS:
// - EmailJS script not loaded (emailjs undefined)
// - Invalid public key causing initialization failure
// - Network issues preventing EmailJS service connection
// - Configuration validation failures
(async function initializeEmailJS() {
    try {
        // Pre-initialization validation to catch configuration issues early
        const configValidation = validateEmailJSConfiguration();
        if (!configValidation.isValid) {
            console.warn('⚠️ EmailJS Configuration Issues Detected:');
            configValidation.errors.forEach(error => {
                console.warn('  - ' + error);
            });
            console.warn('📧 Contact form will show fallback message when users try to submit.');
            console.warn('🔧 Please update the emailConfig object with valid EmailJS credentials.');
            // Don't initialize if configuration is invalid - prevents further errors
            return;
        }
        
        // Initialize EmailJS service with validated configuration
        emailjs.init(emailConfig.publicKey);
        console.log('✅ EmailJS initialized successfully with service:', emailConfig.serviceId);
        
    } catch (error) {
        // Log initialization errors for debugging but don't break the page
        console.error('❌ Failed to initialize EmailJS:', error);
        console.error('📧 Contact form will fall back to direct email contact method.');
    }
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
    
    // Perform EmailJS configuration validation on page load
    // This provides early warning if there are configuration issues
    performInitialEmailJSValidation();
});

/**
 * Performs comprehensive EmailJS validation on page load for developer feedback
 * 
 * INTEGRATION POINT: Page load validation for early problem detection
 * 
 * This function runs automatically when the page loads to validate the EmailJS
 * setup and provide detailed console feedback for developers. It helps identify
 * configuration issues before users attempt to submit the contact form.
 * 
 * VALIDATION CHECKS:
 * 1. Configuration completeness and correctness
 * 2. EmailJS service availability and initialization
 * 3. Detailed console logging for debugging
 * 4. Early warning system for setup problems
 * 
 * ERROR HANDLING TEST SCENARIOS:
 * - Incomplete EmailJS setup (missing credentials)
 * - Invalid configuration values (wrong IDs/keys)
 * - EmailJS service connectivity issues
 * - Mixed validation results (config valid, service unavailable)
 * - Successful validation (all systems ready)
 * 
 * DEVELOPER TESTING:
 * - Check browser console on page load for validation messages
 * - Look for ✅ success indicators or ⚠️ warning indicators
 * - Follow suggested fixes in console messages
 * - Test form submission after resolving any issues
 */
async function performInitialEmailJSValidation() {
    try {
        // Wait a bit for EmailJS library to fully load
        setTimeout(async () => {
            const configValidation = validateEmailJSConfiguration();
            
            if (!configValidation.isValid) {
                console.warn('⚠️ EmailJS Configuration Issues Detected:');
                configValidation.errors.forEach(error => {
                    console.warn('  - ' + error);
                });
                console.warn('📧 Contact form will show fallback message when users try to submit.');
                console.warn('🔧 Please update the emailConfig object in script.js with valid EmailJS credentials.');
            } else {
                console.log('✅ EmailJS configuration appears valid');
                
                // Test service availability
                const serviceValidation = await validateEmailJSServiceAvailability();
                if (serviceValidation.isAvailable) {
                    console.log('✅ EmailJS service is available and ready');
                } else {
                    console.warn('⚠️ EmailJS service availability issue:', serviceValidation.error);
                }
            }
        }, 1000);
        
    } catch (error) {
        console.error('❌ Error during initial EmailJS validation:', error);
    }
}

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
    
    // Quick configuration check before proceeding with form submission
    // This provides immediate feedback without the loading state
    const configValidation = validateEmailJSConfiguration();
    if (!configValidation.isValid) {
        showEmailJSFallbackMessage('Configuration Error: ' + configValidation.errors.join(', '));
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
 * ============================================================================
 * ENHANCED FORM SUBMISSION HANDLER WITH EMAILJS INTEGRATION
 * ============================================================================
 * Main form submission handler that orchestrates the entire email sending process.
 * This function integrates EmailJS service with comprehensive error handling,
 * loading states, and user feedback.
 * 
 * INTEGRATION POINTS:
 * - Form validation and data processing
 * - EmailJS service interaction and email sending
 * - UI state management (loading, success, error states)
 * - User feedback and notification system
 * 
 * SUBMISSION FLOW:
 * 1. Set loading state and disable form to prevent duplicate submissions
 * 2. Validate EmailJS configuration and service availability
 * 3. Map form data to EmailJS template format
 * 4. Send email via EmailJS service with error handling
 * 5. Handle success (show notification, reset form) or failure (show error, preserve data)
 * 6. Reset UI state regardless of outcome
 * 
 * ERROR HANDLING TEST SCENARIOS:
 * - EmailJS configuration invalid (missing/wrong credentials)
 * - EmailJS service unavailable (network issues, service down)
 * - Template errors (invalid template ID, missing variables)
 * - Rate limiting (too many requests)
 * - Network timeouts and connection failures
 * - Malformed email addresses or template data
 * - Successful submission (verify form reset and success message)
 * 
 * @param {Object} formData - Validated form data object
 * @param {string} formData.name - User's full name (required, validated)
 * @param {string} formData.email - User's email address (required, validated)
 * @param {string} formData.subject - Email subject line (required, validated)
 * @param {string} formData.message - Message content (required, validated)
 * @param {HTMLFormElement} formElement - The form DOM element for UI manipulation
 */
async function handleFormSubmission(formData, formElement) {
    const submitButton = formElement.querySelector('button[type="submit"]');
    const originalButtonText = submitButton.textContent;
    
    try {
        // Implement loading state for the submit button during email sending
        setButtonLoadingState(submitButton, true);
        
        // Validate EmailJS configuration and service availability before attempting to send
        const isReady = await isEmailJSReady();
        if (!isReady) {
            // Error message already shown by isEmailJSReady function
            return;
        }
        
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
 * ============================================================================
 * LOADING STATE MANAGEMENT FOR SUBMIT BUTTON
 * ============================================================================
 * Manages the visual loading state of the submit button during email sending.
 * Provides user feedback and prevents duplicate form submissions.
 * 
 * INTEGRATION POINT: UI state management during EmailJS operations
 * 
 * LOADING STATE FEATURES:
 * - Visual loading spinner with "Sending..." text
 * - Button disabled to prevent duplicate submissions
 * - CSS class for additional styling hooks
 * - Automatic restoration of original button state
 * 
 * UI TEST SCENARIOS:
 * - Button shows loading state immediately when form is submitted
 * - Button is disabled and cannot be clicked during loading
 * - Loading spinner is visible and animating
 * - Button text changes to "Sending..." during operation
 * - Button returns to original state after completion (success or error)
 * - Multiple rapid clicks are prevented by disabled state
 * 
 * @param {HTMLButtonElement} button - The submit button DOM element
 * @param {boolean} isLoading - True to show loading state, false to restore normal state
 * @param {string} originalText - Original button text to restore (default: 'Send Message')
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
 * ============================================================================
 * COMPREHENSIVE EMAILJS ERROR HANDLER
 * ============================================================================
 * Processes EmailJS errors and provides user-friendly error messages based on
 * the specific type of failure. This function translates technical errors into
 * actionable feedback for users while logging details for developers.
 * 
 * INTEGRATION POINT: Error processing and user feedback for EmailJS failures
 * 
 * ERROR CATEGORIES HANDLED:
 * 1. Configuration Errors: Invalid template/service IDs, authentication failures
 * 2. Rate Limiting: Too many requests, quota exceeded
 * 3. Network Errors: Connection failures, timeouts, CORS issues
 * 4. Template Errors: Invalid template parameters, missing variables
 * 5. Service Errors: EmailJS service downtime, server errors
 * 6. Validation Errors: Invalid email formats, malformed data
 * 
 * ERROR HANDLING TEST SCENARIOS:
 * Test each error type by simulating these conditions:
 * 
 * CONFIGURATION ERRORS:
 * - Invalid template ID: Change templateId to 'invalid_template'
 * - Invalid service ID: Change serviceId to 'invalid_service'  
 * - Invalid public key: Change publicKey to 'invalid_key'
 * - Missing credentials: Set any config value to empty string
 * 
 * RATE LIMITING ERRORS:
 * - Submit form rapidly multiple times to trigger rate limits
 * - Test with EmailJS free tier monthly quota exceeded
 * 
 * NETWORK ERRORS:
 * - Disconnect internet and submit form (network failure)
 * - Block EmailJS domain in browser (CORS/blocked request)
 * - Simulate slow network with browser dev tools (timeout)
 * 
 * TEMPLATE ERRORS:
 * - Remove required variables from EmailJS template
 * - Change template variable names to not match code
 * - Set template to inactive/unpublished state
 * 
 * SERVICE ERRORS:
 * - Test during EmailJS service maintenance windows
 * - Simulate 500/502/503 server errors
 * 
 * VALIDATION ERRORS:
 * - Submit form with malformed email address
 * - Send extremely long content that exceeds limits
 * 
 * @param {Error} error - The error object from EmailJS service call
 * @param {string} error.text - EmailJS error message text (if available)
 * @param {string} error.message - JavaScript error message (if available)  
 * @param {number} error.status - HTTP status code (if available)
 */
function handleEmailError(error) {
    console.error('EmailJS Error:', error);
    
    let errorMessage = 'Failed to send message. Please try again or contact directly via email.';
    
    // Handle specific EmailJS error scenarios with detailed error messages
    if (error.text) {
        const errorText = error.text.toLowerCase();
        
        // Configuration-related errors
        if (errorText.includes('invalid template id') || errorText.includes('template not found')) {
            errorMessage = 'Email service configuration error. Please try again later or contact directly at yukthad98@gmail.com.';
        } else if (errorText.includes('invalid service id') || errorText.includes('service not found')) {
            errorMessage = 'Email service is temporarily unavailable. Please contact me directly at yukthad98@gmail.com.';
        } else if (errorText.includes('invalid public key') || errorText.includes('unauthorized')) {
            errorMessage = 'Email service authentication failed. Please contact me directly at yukthad98@gmail.com.';
        }
        // Rate limiting and quota errors
        else if (errorText.includes('rate limit') || errorText.includes('too many requests')) {
            errorMessage = 'Too many requests. Please wait a moment before sending another message.';
        } else if (errorText.includes('quota') || errorText.includes('limit exceeded')) {
            errorMessage = 'Email service quota exceeded. Please contact me directly at yukthad98@gmail.com.';
        }
        // Network and connection errors
        else if (errorText.includes('network') || errorText.includes('connection') || errorText.includes('timeout')) {
            errorMessage = 'Unable to send message. Please check your connection and try again.';
        } else if (errorText.includes('cors') || errorText.includes('blocked')) {
            errorMessage = 'Email service is temporarily blocked. Please contact me directly at yukthad98@gmail.com.';
        }
        // Template and parameter errors
        else if (errorText.includes('template') && errorText.includes('parameter')) {
            errorMessage = 'Email template error. Please contact me directly at yukthad98@gmail.com.';
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
            errorMessage = 'Email service access blocked. Please contact me directly at yukthad98@gmail.com.';
        } else if (errorMessage_lower.includes('configuration') || errorMessage_lower.includes('config')) {
            // Handle configuration errors that might be thrown by our validation
            errorMessage = 'Email service is not properly configured. Please contact me directly at yukthad98@gmail.com.';
        }
    }
    // Handle status code errors
    else if (error.status) {
        switch (error.status) {
            case 400:
                errorMessage = 'Invalid request. Please check your information and try again.';
                break;
            case 401:
                errorMessage = 'Email service authentication failed. Please contact me directly at yukthad98@gmail.com.';
                break;
            case 403:
                errorMessage = 'Email service access denied. Please contact me directly at yukthad98@gmail.com.';
                break;
            case 404:
                errorMessage = 'Email service not found. Please contact me directly at yukthad98@gmail.com.';
                break;
            case 429:
                errorMessage = 'Too many requests. Please wait a moment before sending another message.';
                break;
            case 500:
            case 502:
            case 503:
                errorMessage = 'Email service is temporarily unavailable. Please contact me directly at yukthad98@gmail.com.';
                break;
            default:
                errorMessage = 'Failed to send message. Please contact me directly at yukthad98@gmail.com.';
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

// ============================================================================
// EMAILJS DASHBOARD SETUP REQUIREMENTS
// ============================================================================
// This section documents the complete EmailJS dashboard configuration required
// for the contact form to function properly. Follow these steps exactly.
//
// STEP 1: CREATE EMAILJS ACCOUNT
// 1. Go to https://www.emailjs.com/
// 2. Click "Sign Up" and create a free account
// 3. Verify your email address
// 4. Log in to the EmailJS dashboard
//
// STEP 2: ADD EMAIL SERVICE
// 1. In dashboard, go to "Email Services"
// 2. Click "Add New Service"
// 3. Choose your email provider:
//    - Gmail: Click "Connect Account" and authorize EmailJS
//    - Outlook: Enter credentials and authorize
//    - Other: Configure SMTP settings manually
// 4. Note your Service ID (e.g., service_abc123)
//
// STEP 3: CREATE EMAIL TEMPLATE
// 1. Go to "Email Templates" in dashboard
// 2. Click "Create New Template"
// 3. Configure template with these EXACT settings:
//
//    Template Name: Portfolio Contact Form
//    
//    Subject Line:
//    Portfolio Contact: {{subject}}
//    
//    Template Content:
//    From: {{from_name}}
//    Email: {{from_email}}
//    Subject: {{subject}}
//    
//    Message:
//    {{message}}
//    
//    ---
//    This message was sent from your portfolio contact form.
//    Reply directly to this email to respond to {{from_name}}.
//    
//    Settings:
//    - To Email: your-email@domain.com (where you want to receive messages)
//    - Reply To: {{from_email}} (enables direct replies to sender)
//    
// 4. Save template and note Template ID (e.g., template_xyz789)
//
// STEP 4: GET PUBLIC KEY
// 1. Go to "Account" → "General" in dashboard
// 2. Find your Public Key (e.g., AbCdEf123GhIjK)
// 3. Copy this key for configuration
//
// STEP 5: UPDATE CONFIGURATION
// Replace the values in emailConfig object above with your actual:
// - serviceId: Your Service ID from step 2
// - templateId: Your Template ID from step 3
// - publicKey: Your Public Key from step 4
//
// STEP 6: TEST SETUP
// 1. Open website and submit test contact form
// 2. Check your email for the test message
// 3. Verify reply-to functionality works
// 4. Check browser console for any error messages
//
// TROUBLESHOOTING COMMON ISSUES:
// - "Service not found": Check Service ID is correct and service is active
// - "Template not found": Check Template ID is correct and template is published
// - "Unauthorized": Check Public Key is correct and account is verified
// - "Rate limit exceeded": Wait before testing again (free tier: 200 emails/month)
// - No email received: Check spam folder, verify "To Email" in template
// - Reply-to not working: Ensure "Reply To" field is set to {{from_email}}

// ============================================================================
// ENHANCED NOTIFICATION SYSTEM WITH EMAILJS-SPECIFIC ERROR HANDLING
// ============================================================================
// Provides user-friendly notifications for form submission results with
// enhanced styling and timing for different message types.
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