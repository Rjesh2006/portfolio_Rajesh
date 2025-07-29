// Initialize EmailJS with your public key
(function() {
    emailjs.init("M6NV6DLKpRKb9yWHS");
})();

document.addEventListener('DOMContentLoaded', function() {
    // 1. Set current year in footer
    const yearElement = document.getElementById('year');
    if (yearElement) {
        yearElement.textContent = new Date().getFullYear();
    }

    // 2. Smooth scrolling for navigation links (excluding resume button)
    document.querySelectorAll('nav a').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            
            // Skip if it's the resume button or external link
            if (targetId === '#' || 
                this.classList.contains('resume-btn') || 
                targetId.startsWith('http')) {
                return;
            }
            
            e.preventDefault();
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });

    // 3. Highlight active section in navigation
    const sections = document.querySelectorAll('.section');
    const navItems = document.querySelectorAll('nav ul li a');
    
    function updateActiveNav() {
        let currentSection = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            
            if (window.pageYOffset >= sectionTop - 100) {
                currentSection = section.getAttribute('id');
            }
        });
        
        navItems.forEach(item => {
            if (item.classList.contains('resume-btn')) return;
            
            item.classList.remove('active');
            if (item.getAttribute('href') === `#${currentSection}`) {
                item.classList.add('active');
            }
        });
    }
    
    window.addEventListener('scroll', updateActiveNav);
    updateActiveNav(); // Initial call

    // 4. Form submission handling
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();

            // Show loading state
            const submitBtn = contactForm.querySelector('button[type="submit"]');
            const originalBtnText = submitBtn.innerHTML;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
            submitBtn.disabled = true;

            emailjs.sendForm("service_x9mk6ob", "template_glnlybi", contactForm)
                .then(() => {
                    submitBtn.innerHTML = '<i class="fas fa-check"></i> Sent!';
                    setTimeout(() => {
                        submitBtn.innerHTML = originalBtnText;
                        submitBtn.disabled = false;
                    }, 2000);
                    contactForm.reset();
                    
                    // Show success message
                    const successAlert = document.createElement('div');
                    successAlert.className = 'alert success';
                    successAlert.innerHTML = '✅ Message sent successfully!';
                    contactForm.parentNode.insertBefore(successAlert, contactForm);
                    setTimeout(() => successAlert.remove(), 5000);
                })
                .catch((error) => {
                    console.error("EmailJS Error:", error);
                    submitBtn.innerHTML = originalBtnText;
                    submitBtn.disabled = false;
                    
                    // Show error message
                    const errorAlert = document.createElement('div');
                    errorAlert.className = 'alert error';
                    errorAlert.innerHTML = '❌ Failed to send message. Please try again.';
                    contactForm.parentNode.insertBefore(errorAlert, contactForm);
                    setTimeout(() => errorAlert.remove(), 5000);
                });
        });
    }

    // 5. Animation on scroll
    function animateElementsOnScroll() {
        const elements = document.querySelectorAll('.skill-category, .project-card, .education-item, .timeline-item');
        
        elements.forEach(element => {
            const elementPosition = element.getBoundingClientRect().top;
            const screenPosition = window.innerHeight / 1.3;
            
            if (elementPosition < screenPosition) {
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
            }
        });
    }
    
    // Initialize animation state
    document.querySelectorAll('.skill-category, .project-card, .education-item, .timeline-item').forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(20px)';
        element.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    });
    
    window.addEventListener('scroll', animateElementsOnScroll);
    animateElementsOnScroll(); // Initial trigger
});