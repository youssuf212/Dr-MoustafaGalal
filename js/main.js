// ===================================
// Initialize AOS Animation
// ===================================
document.addEventListener('DOMContentLoaded', function() {
    AOS.init({
        duration: 1000,
        once: true,
        offset: 100,
        easing: 'ease-in-out'
    });
});

// ===================================
// Mobile Menu Toggle
// ===================================
const mobileMenuToggle = document.getElementById('mobileMenuToggle');
const nav = document.querySelector('.nav');

if (mobileMenuToggle) {
    mobileMenuToggle.addEventListener('click', function() {
        nav.classList.toggle('active');
        
        // Toggle icon
        const icon = this.querySelector('i');
        if (nav.classList.contains('active')) {
            icon.classList.remove('fa-bars');
            icon.classList.add('fa-times');
        } else {
            icon.classList.remove('fa-times');
            icon.classList.add('fa-bars');
        }
    });
}

// Close mobile menu when clicking on a link
document.querySelectorAll('.nav a').forEach(link => {
    link.addEventListener('click', function() {
        if (window.innerWidth <= 968) {
            nav.classList.remove('active');
            const icon = mobileMenuToggle.querySelector('i');
            icon.classList.remove('fa-times');
            icon.classList.add('fa-bars');
        }
    });
});

// ===================================
// Smooth Scroll for Navigation Links
// ===================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const offset = 80; // Header height
            const targetPosition = target.offsetTop - offset;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// ===================================
// Form Submission Handlers
// ===================================

// Webhook URL - Replace with your n8n webhook URL
const WEBHOOK_URL = 'https://your-n8n-webhook-url.com/webhook/dental-clinic';

// Hero Form Handler
const heroForm = document.getElementById('heroForm');
if (heroForm) {
    heroForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        await handleFormSubmission(this, 'hero');
    });
}

// Contact Form Handler
const contactForm = document.getElementById('contactForm');
if (contactForm) {
    contactForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        await handleFormSubmission(this, 'contact');
    });
}

// ===================================
// Form Submission Function
// ===================================
async function handleFormSubmission(form, formType) {
    const submitButton = form.querySelector('button[type="submit"]');
    const originalButtonText = submitButton.innerHTML;
    
    // Disable button and show loading
    submitButton.disabled = true;
    submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> جاري الإرسال...';
    
    // Get form data
    const formData = new FormData(form);
    const data = {
        formType: formType,
        timestamp: new Date().toISOString(),
        name: formData.get('name'),
        dob: formData.get('dob'),
        phone: formData.get('phone')
    };
    
    // Add additional fields if they exist (from contact form)
    if (formData.get('service')) {
        data.service = formData.get('service');
    }
    if (formData.get('message')) {
        data.message = formData.get('message');
    }
    
    try {
        // Send data to webhook
        const response = await fetch(WEBHOOK_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        });
        
        if (response.ok) {
            // Show success modal
            showSuccessModal();
            
            // Reset form
            form.reset();
            
            // Send WhatsApp message (optional)
            sendWhatsAppNotification(data);
        } else {
            throw new Error('فشل في إرسال البيانات');
        }
    } catch (error) {
        console.error('Error:', error);
        
        // Show error message
        alert('عذراً، حدث خطأ أثناء إرسال البيانات. يرجى المحاولة مرة أخرى أو الاتصال بنا مباشرة.');
    } finally {
        // Re-enable button
        submitButton.disabled = false;
        submitButton.innerHTML = originalButtonText;
    }
}

// ===================================
// Success Modal
// ===================================
function showSuccessModal() {
    const modal = document.getElementById('successModal');
    if (modal) {
        modal.classList.add('active');
        
        // Auto-close after 5 seconds
        setTimeout(() => {
            closeModal();
        }, 5000);
    }
}

function closeModal() {
    const modal = document.getElementById('successModal');
    if (modal) {
        modal.classList.remove('active');
    }
}

// Close modal when clicking outside
document.getElementById('successModal')?.addEventListener('click', function(e) {
    if (e.target === this) {
        closeModal();
    }
});

// ===================================
// WhatsApp Notification (Optional)
// ===================================
function sendWhatsAppNotification(data) {
    // This creates a WhatsApp message with the form data
    // The clinic can use this to quickly contact the client
    const message = `
استفسار جديد من الموقع الإلكتروني:
الاسم: ${data.name}
تاريخ الميلاد: ${data.dob}
رقم الهاتف: ${data.phone}
${data.service ? `الخدمة المطلوبة: ${data.service}` : ''}
${data.message ? `ملاحظات: ${data.message}` : ''}
    `.trim();
    
    // Encode message for WhatsApp
    const encodedMessage = encodeURIComponent(message);
    
    // You can log this or use it for internal tracking
    console.log('WhatsApp notification data:', message);
}

// ===================================
// Countdown Timer for Offer
// ===================================
function initCountdown() {
    const countdownDate = new Date('November 15, 2025 23:59:59').getTime();
    
    const countdownElements = document.querySelectorAll('.offer-deadline');
    
    const updateCountdown = () => {
        const now = new Date().getTime();
        const distance = countdownDate - now;
        
        if (distance > 0) {
            const days = Math.floor(distance / (1000 * 60 * 60 * 24));
            const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((distance % (1000 * 60)) / 1000);
            
            countdownElements.forEach(element => {
                if (element.dataset.countdown === 'true') {
                    element.innerHTML = `
                        <i class="fas fa-clock"></i>
                        باقي على انتهاء العرض: ${days} يوم ${hours} ساعة ${minutes} دقيقة
                    `;
                }
            });
        } else {
            countdownElements.forEach(element => {
                if (element.dataset.countdown === 'true') {
                    element.innerHTML = '<i class="fas fa-exclamation-circle"></i> انتهى العرض';
                }
            });
        }
    };
    
    // Update countdown every second
    updateCountdown();
    setInterval(updateCountdown, 1000);
}

// Initialize countdown
initCountdown();

// ===================================
// Scroll Progress Indicator
// ===================================
function createScrollProgress() {
    const progressBar = document.createElement('div');
    progressBar.className = 'scroll-progress';
    progressBar.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        height: 4px;
        background: linear-gradient(135deg, #48C5CC 0%, #2B9BA3 100%);
        z-index: 9999;
        transition: width 0.1s ease;
    `;
    document.body.appendChild(progressBar);
    
    window.addEventListener('scroll', () => {
        const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (window.scrollY / windowHeight) * 100;
        progressBar.style.width = scrolled + '%';
    });
}

createScrollProgress();

// ===================================
// Scroll to Top Button
// ===================================
function createScrollToTop() {
    const scrollButton = document.createElement('button');
    scrollButton.innerHTML = '<i class="fas fa-arrow-up"></i>';
    scrollButton.className = 'scroll-to-top';
    scrollButton.style.cssText = `
        position: fixed;
        bottom: 100px;
        left: 30px;
        width: 50px;
        height: 50px;
        background: linear-gradient(135deg, #48C5CC 0%, #2B9BA3 100%);
        color: white;
        border: none;
        border-radius: 50%;
        font-size: 1.2rem;
        cursor: pointer;
        opacity: 0;
        visibility: hidden;
        transition: all 0.3s ease;
        z-index: 999;
        box-shadow: 0 5px 20px rgba(72, 197, 204, 0.3);
    `;
    
    document.body.appendChild(scrollButton);
    
    // Show/hide button based on scroll position
    window.addEventListener('scroll', () => {
        if (window.scrollY > 500) {
            scrollButton.style.opacity = '1';
            scrollButton.style.visibility = 'visible';
        } else {
            scrollButton.style.opacity = '0';
            scrollButton.style.visibility = 'hidden';
        }
    });
    
    // Scroll to top on click
    scrollButton.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

createScrollToTop();

// ===================================
// Add active class to nav on scroll
// ===================================
window.addEventListener('scroll', () => {
    const sections = document.querySelectorAll('section[id]');
    const scrollY = window.pageYOffset;
    
    sections.forEach(section => {
        const sectionHeight = section.offsetHeight;
        const sectionTop = section.offsetTop - 100;
        const sectionId = section.getAttribute('id');
        const navLink = document.querySelector(`.nav a[href="#${sectionId}"]`);
        
        if (navLink && scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
            document.querySelectorAll('.nav a').forEach(link => link.classList.remove('active'));
            navLink.classList.add('active');
        }
    });
});

// ===================================
// Input Animation on Focus
// ===================================
document.querySelectorAll('input, textarea, select').forEach(input => {
    input.addEventListener('focus', function() {
        this.parentElement.style.transform = 'scale(1.02)';
        this.parentElement.style.transition = 'transform 0.2s ease';
    });
    
    input.addEventListener('blur', function() {
        this.parentElement.style.transform = 'scale(1)';
    });
});

// ===================================
// Lazy Loading for Images
// ===================================
if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                if (img.dataset.src) {
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                }
                observer.unobserve(img);
            }
        });
    });
    
    document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
    });
}

// ===================================
// Phone Number Validation (Egyptian Format)
// ===================================
document.querySelectorAll('input[type="tel"]').forEach(input => {
    input.addEventListener('input', function(e) {
        // Remove non-numeric characters
        let value = e.target.value.replace(/\D/g, '');
        
        // Format Egyptian phone number
        if (value.length > 0) {
            if (!value.startsWith('0') && !value.startsWith('2')) {
                value = '0' + value;
            }
        }
        
        // Limit to 11 digits for Egyptian numbers
        if (value.length > 11) {
            value = value.slice(0, 11);
        }
        
        e.target.value = value;
    });
    
    input.addEventListener('blur', function(e) {
        const value = e.target.value;
        
        // Validate Egyptian phone number format
        const egyptianPhoneRegex = /^(01)[0-9]{9}$/;
        
        if (value && !egyptianPhoneRegex.test(value)) {
            e.target.setCustomValidity('يرجى إدخال رقم هاتف صحيح يبدأ بـ 01');
        } else {
            e.target.setCustomValidity('');
        }
    });
});

// ===================================
// Add CSS for active nav link
// ===================================
const style = document.createElement('style');
style.textContent = `
    .nav a.active {
        color: var(--primary-color);
    }
    
    .nav a.active::after {
        width: 100%;
    }
    
    @media (max-width: 968px) {
        .nav.active {
            display: flex;
            flex-direction: column;
            position: absolute;
            top: 100%;
            right: 0;
            background: white;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
            padding: 20px;
            border-radius: 0 0 15px 15px;
            width: 100%;
            animation: slideDown 0.3s ease;
        }
        
        @keyframes slideDown {
            from {
                opacity: 0;
                transform: translateY(-20px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
    }
`;
document.head.appendChild(style);

// ===================================
// Analytics & Tracking (Optional)
// ===================================
function trackEvent(eventName, eventData) {
    console.log('Event tracked:', eventName, eventData);
    
    // You can integrate with Google Analytics, Facebook Pixel, etc.
    // Example for Google Analytics:
    // if (typeof gtag !== 'undefined') {
    //     gtag('event', eventName, eventData);
    // }
}

// Track form submissions
document.querySelectorAll('form').forEach(form => {
    form.addEventListener('submit', function() {
        trackEvent('form_submission', {
            form_id: this.id,
            form_type: this.dataset.formType || 'unknown'
        });
    });
});

// Track CTA button clicks
document.querySelectorAll('.cta-button, .offer-button, .offer-cta').forEach(button => {
    button.addEventListener('click', function() {
        trackEvent('cta_click', {
            button_text: this.textContent.trim(),
            button_location: this.closest('section')?.id || 'unknown'
        });
    });
});

// Track WhatsApp button clicks
document.querySelector('.whatsapp-float')?.addEventListener('click', function() {
    trackEvent('whatsapp_click', {
        source: 'floating_button'
    });
});

console.log('%c🦷 موقع عيادة د. مصطفى جلال ', 'background: #48C5CC; color: white; font-size: 20px; padding: 10px;');
console.log('%cتم التطوير بواسطة فريق محترف', 'color: #2B9BA3; font-size: 14px;');

// Initialize AOS
document.addEventListener('DOMContentLoaded', function() {
    AOS.init({
        duration: 1000,
        once: true,
        offset: 100,
        easing: 'ease-in-out'
    });
});

// Mobile Menu
const mobileMenuToggle = document.getElementById('mobileMenuToggle');
const nav = document.querySelector('.nav');

if (mobileMenuToggle) {
    mobileMenuToggle.addEventListener('click', function() {
        nav.classList.toggle('active');
        const icon = this.querySelector('i');
        if (nav.classList.contains('active')) {
            icon.classList.remove('fa-bars');
            icon.classList.add('fa-times');
        } else {
            icon.classList.remove('fa-times');
            icon.classList.add('fa-bars');
        }
    });
}

// Close mobile menu on link click
document.querySelectorAll('.nav a').forEach(link => {
    link.addEventListener('click', function() {
        if (window.innerWidth <= 968) {
            nav.classList.remove('active');
            const icon = mobileMenuToggle.querySelector('i');
            icon.classList.remove('fa-times');
            icon.classList.add('fa-bars');
        }
    });
});

// Smooth Scroll
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const offset = 80;
            const targetPosition = target.offsetTop - offset;
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// Active Nav on Scroll
window.addEventListener('scroll', () => {
    const sections = document.querySelectorAll('section[id]');
    const scrollY = window.pageYOffset;
    
    sections.forEach(section => {
        const sectionHeight = section.offsetHeight;
        const sectionTop = section.offsetTop - 100;
        const sectionId = section.getAttribute('id');
        const navLink = document.querySelector(`.nav a[href="#${sectionId}"]`);
        
        if (navLink && scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
            document.querySelectorAll('.nav a').forEach(link => link.classList.remove('active'));
            navLink.classList.add('active');
        }
    });
});
