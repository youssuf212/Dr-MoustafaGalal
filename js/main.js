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
// Success Modal
// ===================================
function showSuccessModal() {
    const modal = document.getElementById('successModal');
    if (modal) {
        modal.classList.add('active');
        
        // Auto-close after 5 seconds
        setTimeout(() => {
            closeSuccessModal();
        }, 5000);
    }
}

function closeSuccessModal() {
    const modal = document.getElementById('successModal');
    if (modal) {
        modal.classList.remove('active');
    }
}

// Add close button event listener
const modalCloseBtn = document.querySelector('.modal-close');
if (modalCloseBtn) {
    modalCloseBtn.addEventListener('click', closeSuccessModal);
}

// Close modal when clicking outside
window.addEventListener('click', function(e) {
    const modal = document.getElementById('successModal');
    if (e.target === modal) {
        closeSuccessModal();
    }
});

// ===================================
// Dynamic Styling for Mobile Menu
// ===================================
const style = document.createElement('style');
style.textContent = `
    @media (max-width: 968px) {
        .nav.active {
            display: flex;
            flex-direction: column;
            position: absolute;
            top: 70px;
            left: 0;
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

console.log('%c🦷 موقع عيادة د. مصطفى جلال ', 'background: #48C5CC; color: white; font-size: 20px; padding: 10px;');
console.log('%cتم التطوير بواسطة فريق محترف', 'color: #2B9BA3; font-size: 14px;');
