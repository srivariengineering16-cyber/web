// ===================================
// DOM Elements
// ===================================
const navbar = document.getElementById('navbar');
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('navMenu');
const navLinks = document.querySelectorAll('.nav-link');
const backToTop = document.getElementById('backToTop');
const statNumbers = document.querySelectorAll('.stat-number');
const galleryItems = document.querySelectorAll('.gallery-item');
const whatsappForm = document.getElementById('whatsappForm');

// ===================================
// SECURITY: Input Sanitization Functions
// ===================================
function sanitizeInput(input) {
    if (typeof input !== 'string') return input;
    return input
        .replace(/[<>]/g, '')
        .replace(/javascript:/gi, '')
        .replace(/on\w+=/gi, '')
        .replace(/[{}]/g, '')
        .replace(/\\/g, '')
        .trim();
}

function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function validatePhone(phone) {
    const phoneRegex = /^[\d\s\-\+\(\)]{10,}$/;
    return phoneRegex.test(phone);
}

function escapeHtml(text) {
    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };
    return text.replace(/[&<>"']/g, m => map[m]);
}

// ===================================
// SECURITY: Content Protection - Disable Right Click
// ===================================
document.addEventListener('contextmenu', (e) => {
    e.preventDefault();
    showNotification('Right-click is disabled for security reasons', 'info');
    return false;
});

// ===================================
// SECURITY: Disable Text Selection
// ===================================
document.addEventListener('selectstart', (e) => {
    if (e.target.tagName !== 'INPUT' && e.target.tagName !== 'TEXTAREA') {
        e.preventDefault();
    }
});

// ===================================
// SECURITY: Disable Drag and Drop
// ===================================
document.addEventListener('dragstart', (e) => {
    e.preventDefault();
    return false;
});

document.addEventListener('drop', (e) => {
    e.preventDefault();
    return false;
});

// ===================================
// SECURITY: Disable Keyboard Shortcuts
// ===================================
document.addEventListener('keydown', (e) => {
    // Disable F12, Ctrl+Shift+I, Ctrl+Shift+J, Ctrl+U, Ctrl+S, Ctrl+P
    if (
        e.key === 'F12' ||
        (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'J')) ||
        (e.ctrlKey && (e.key === 'U' || e.key === 'S' || e.key === 'P')) ||
        (e.ctrlKey && e.key === 'C') ||
        (e.ctrlKey && e.key === 'K')
    ) {
        e.preventDefault();
        return false;
    }
});

// ===================================
// SECURITY: Developer Tools Detection
// ===================================
let devtoolsDetectionInterval;
const detectDevTools = () => {
    const threshold = 160;
    const widthThreshold = window.outerWidth - window.innerWidth > threshold;
    const heightThreshold = window.outerHeight - window.innerHeight > threshold;
    
    if (widthThreshold || heightThreshold) {
        console.log('%c⚠️ Developer Tools Detected!', 'color: red; font-size: 20px; font-weight: bold;');
        console.log('%cUnauthorized access is prohibited and monitored.', 'color: red; font-size: 14px;');
    }
};

devtoolsDetectionInterval = setInterval(detectDevTools, 1000);

// ===================================
// SECURITY: Disable Console Access
// ===================================
(function() {
    const noop = () => {};
    console.log = noop;
    console.debug = noop;
    console.info = noop;
    console.warn = noop;
    console.error = noop;
    console.clear = noop;
    console.dir = noop;
    console.group = noop;
    console.groupCollapsed = noop;
    console.groupEnd = noop;
    console.table = noop;
    console.time = noop;
    console.timeEnd = noop;
    console.trace = noop;
})();

// ===================================
// SECURITY: Prevent Screenshot (Basic Deterrent)
// ===================================
document.addEventListener('keyup', (e) => {
    if (e.key === 'PrintScreen') {
        navigator.clipboard.writeText('');
        showNotification('Screenshot is disabled for security reasons', 'warning');
    }
});

// ===================================
// SECURITY: Form Data Protection
// ===================================
const protectedFields = ['phone', 'email', 'name', 'company'];
protectedFields.forEach(fieldId => {
    const field = document.getElementById(fieldId);
    if (field) {
        field.setAttribute('autocomplete', 'off');
        field.setAttribute('spellcheck', 'false');
    }
});

// ===================================
// Lightbox Functionality
// ===================================
let currentImageIndex = 0;
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightbox-img');
const lightboxCaption = document.getElementById('lightbox-caption');
const lightboxClose = document.querySelector('.lightbox-close');

// Open lightbox when clicking on gallery images
galleryItems.forEach((item, index) => {
    item.addEventListener('click', () => {
        const img = item.querySelector('img');
        const overlay = item.querySelector('.gallery-overlay');
        const title = overlay ? overlay.querySelector('h4').textContent : '';
        const description = overlay ? overlay.querySelector('p').textContent : '';
        
        currentImageIndex = index;
        openLightbox(img.src, `${title} - ${description}`);
    });
});

function openLightbox(src, caption) {
    lightbox.style.display = 'block';
    lightboxImg.src = src;
    lightboxCaption.innerHTML = caption;
    document.body.style.overflow = 'hidden';
}

function closeLightbox() {
    lightbox.style.display = 'none';
    document.body.style.overflow = 'auto';
}

function changeImage(direction) {
    currentImageIndex += direction;
    
    if (currentImageIndex >= galleryItems.length) {
        currentImageIndex = 0;
    } else if (currentImageIndex < 0) {
        currentImageIndex = galleryItems.length - 1;
    }
    
    const img = galleryItems[currentImageIndex].querySelector('img');
    const overlay = galleryItems[currentImageIndex].querySelector('.gallery-overlay');
    const title = overlay ? overlay.querySelector('h4').textContent : '';
    const description = overlay ? overlay.querySelector('p').textContent : '';
    
    lightboxImg.src = img.src;
    lightboxCaption.innerHTML = `${title} - ${description}`;
}

// Close lightbox events
if (lightboxClose) {
    lightboxClose.addEventListener('click', closeLightbox);
}

lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) {
        closeLightbox();
    }
});

// Keyboard navigation
document.addEventListener('keydown', (e) => {
    if (lightbox.style.display === 'block') {
        if (e.key === 'Escape') closeLightbox();
        if (e.key === 'ArrowLeft') changeImage(-1);
        if (e.key === 'ArrowRight') changeImage(1);
    }
});

// ===================================
// Navigation Scroll Effect
// ===================================
let lastScroll = 0;
window.addEventListener('scroll', () => {
    const currentScroll = window.scrollY;
    
    // Navbar background on scroll
    if (currentScroll > 100) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
    
    // Back to top button visibility
    if (currentScroll > 500) {
        backToTop.classList.add('visible');
    } else {
        backToTop.classList.remove('visible');
    }
    
    // Update active nav link based on scroll position
    updateActiveNavLink();
    
    // Animate elements on scroll
    animateOnScroll();
    
    lastScroll = currentScroll;
});

// ===================================
// Update Active Navigation Link
// ===================================
function updateActiveNavLink() {
    const sections = document.querySelectorAll('section[id]');
    const scrollPosition = window.scrollY + 150;

    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        const sectionId = section.getAttribute('id');

        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${sectionId}`) {
                    link.classList.add('active');
                }
            });
        }
    });
}

// ===================================
// Mobile Menu Toggle
// ===================================
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

// ===================================
// Smooth Scrolling for Navigation Links
// ===================================
navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = link.getAttribute('href');
        const targetSection = document.querySelector(targetId);

        if (targetSection) {
            const offsetTop = targetSection.offsetTop - 80;
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    });
});

// ===================================
// Back to Top Button
// ===================================
backToTop.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

// ===================================
// Counter Animation for Statistics
// ===================================
function animateCounter(element) {
    const target = parseInt(element.getAttribute('data-target'));
    const duration = 2000;
    const increment = target / (duration / 16);
    let current = 0;

    const updateCounter = () => {
        current += increment;
        if (current < target) {
            element.textContent = Math.ceil(current);
            requestAnimationFrame(updateCounter);
        } else {
            element.textContent = target;
        }
    };

    updateCounter();
}

// Trigger counter animation when stats section is visible
let statsAnimated = false;
function checkStatsVisibility() {
    const statsSection = document.querySelector('.about-stats');
    if (statsSection && !statsAnimated) {
        const rect = statsSection.getBoundingClientRect();
        const isVisible = rect.top >= 0 && rect.bottom <= window.innerHeight;

        if (isVisible) {
            statsAnimated = true;
            statNumbers.forEach(stat => {
                animateCounter(stat);
            });
        }
    }
}

window.addEventListener('scroll', checkStatsVisibility);
checkStatsVisibility();

// ===================================
// Scroll Animation for Elements
// ===================================
function animateOnScroll() {
    const elements = document.querySelectorAll('.service-card, .gallery-item, .contact-card, .stat-item');

    elements.forEach(element => {
        const rect = element.getBoundingClientRect();
        const isVisible = rect.top < window.innerHeight - 100;

        if (isVisible) {
            element.classList.add('animated');
        }
    });
}

// ===================================
// Notification System
// ===================================
function showNotification(message, type) {
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }

    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
        <span>${message}</span>
        <button class="notification-close"><i class="fas fa-times"></i></button>
    `;

    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        padding: 20px 25px;
        background: ${type === 'success' ? 'linear-gradient(135deg, #27ae60, #2ecc71)' : 'linear-gradient(135deg, #e74c3c, #c0392b)'};
        color: white;
        border-radius: 10px;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
        display: flex;
        align-items: center;
        gap: 15px;
        z-index: 10000;
        animation: slideIn 0.5s ease;
        max-width: 400px;
    `;

    if (!document.querySelector('#notification-styles')) {
        const style = document.createElement('style');
        style.id = 'notification-styles';
        style.textContent = `
            @keyframes slideIn {
                from {
                    transform: translateX(100%);
                    opacity: 0;
                }
                to {
                    transform: translateX(0);
                    opacity: 1;
                }
            }
            @keyframes slideOut {
                from {
                    transform: translateX(0);
                    opacity: 1;
                }
                to {
                    transform: translateX(100%);
                    opacity: 0;
                }
            }
            .notification i {
                font-size: 1.5rem;
            }
            .notification span {
                flex: 1;
                font-size: 0.95rem;
                line-height: 1.4;
            }
            .notification-close {
                background: none;
                border: none;
                color: white;
                cursor: pointer;
                font-size: 1.2rem;
                padding: 5px;
                opacity: 0.8;
                transition: opacity 0.3s;
            }
            .notification-close:hover {
                opacity: 1;
            }
        `;
        document.head.appendChild(style);
    }

    document.body.appendChild(notification);

    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.addEventListener('click', () => {
        notification.style.animation = 'slideOut 0.5s ease forwards';
        setTimeout(() => notification.remove(), 500);
    });

    setTimeout(() => {
        if (notification.parentNode) {
            notification.style.animation = 'slideOut 0.5s ease forwards';
            setTimeout(() => notification.remove(), 500);
        }
    }, 5000);
}

// ===================================
// Parallax Effect for Hero Section
// ===================================
window.addEventListener('scroll', () => {
    const hero = document.querySelector('.hero');
    const scrolled = window.scrollY;

    if (hero && scrolled < window.innerHeight) {
        hero.style.backgroundPositionY = `${scrolled * 0.5}px`;
    }
});

// ===================================
// Lazy Loading for Images
// ===================================
document.addEventListener('DOMContentLoaded', () => {
    const images = document.querySelectorAll('img');

    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.classList.add('loaded');
                observer.unobserve(img);
            }
        });
    }, {
        rootMargin: '50px 0px'
    });

    images.forEach(img => imageObserver.observe(img));
});

// ===================================
// Add Loading Animation on Page Load
// ===================================
window.addEventListener('load', () => {
    // Scroll to top on page load/refresh
    window.scrollTo(0, 0);
    document.body.classList.add('loaded');
    console.log('Sri Vari Engineering website loaded successfully!');
});

// ===================================
// Handle Resize Events
// ===================================
let resizeTimer;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
        updateActiveNavLink();
    }, 250);
});

// ===================================
// WhatsApp Form Handler
// ===================================
if (whatsappForm) {
    whatsappForm.addEventListener('submit', function(e) {
        e.preventDefault();

        // Get form values and sanitize them
        const name = sanitizeInput(document.getElementById('name').value.trim());
        const phone = sanitizeInput(document.getElementById('phone').value.trim());
        const email = sanitizeInput(document.getElementById('email').value.trim());
        const company = sanitizeInput(document.getElementById('company').value.trim());
        const service = sanitizeInput(document.getElementById('service').value);
        const message = sanitizeInput(document.getElementById('message').value.trim());

        // Validate inputs
        if (!validateEmail(email)) {
            showNotification('Please enter a valid email address', 'warning');
            return;
        }

        if (!validatePhone(phone)) {
            showNotification('Please enter a valid phone number', 'warning');
            return;
        }

        if (name.length < 2) {
            showNotification('Please enter your full name', 'warning');
            return;
        }

        // Business WhatsApp number
        const businessNumber = '919840270661';

        // Format the message with escaped HTML
        const whatsappMessage = `*New Inquiry from Website*%0A%0A` +
            `*Name:* ${escapeHtml(name)}%0A` +
            `*Phone:* ${escapeHtml(phone)}%0A` +
            `*Email:* ${escapeHtml(email)}%0A` +
            `*Company:* ${escapeHtml(company) || 'N/A'}%0A` +
            `*Service Required:* ${escapeHtml(service)}%0A` +
            `*Message:* ${escapeHtml(message)}%0A%0A` +
            `_Sent from Sri Vari Engineering Website_`;

        // Create WhatsApp URL
        const whatsappUrl = `https://wa.me/${businessNumber}?text=${whatsappMessage}`;

        // Show success notification
        showNotification('Opening WhatsApp to send your message...', 'success');

        // Add success animation to form
        whatsappForm.classList.add('form-success');
        setTimeout(() => whatsappForm.classList.remove('form-success'), 500);

        // Open WhatsApp in new tab
        setTimeout(() => {
            window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
        }, 800);

        // Clear the form
        setTimeout(() => {
            whatsappForm.reset();
        }, 1000);
    });
}

// ===================================
// Easter Egg - Console Message
// ===================================
console.log(`
╔═══════════════════════════════════════════════════════════╗
║                                                           ║
║   🏭  SRI VARI ENGINEERING  🏭                           ║
║                                                           ║
║   Manufacturers of Press Tools, Gauges &                  ║
║   Jig Boring Job Works                                    ║
║                                                           ║
║   Proprietor: N. Shanmugam                                ║
║   Phone: +91 98402 70661                                  ║
║                                                           ║
║   May Goddess Angala Parameswari bless us                 ║
║                                                           ║
╚═══════════════════════════════════════════════════════════╝
`);
