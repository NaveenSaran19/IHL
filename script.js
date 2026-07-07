document.addEventListener('DOMContentLoaded', () => {

    // Hero Slider
    const slides = document.querySelectorAll('.hero-bg .slide');
    let currentSlide = 0;
    if (slides.length > 0) {
        setInterval(() => {
            slides[currentSlide].classList.remove('active');
            currentSlide = (currentSlide + 1) % slides.length;
            slides[currentSlide].classList.add('active');
        }, 5000);
    }

    // Navbar Scroll Effect
    const navbar = document.getElementById('navbar');
    const stickyBar = document.getElementById('stickyBar');
    const heroSection = document.getElementById('home');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        // Show sticky bar after scrolling past hero section
        if (window.scrollY > heroSection.offsetHeight) {
            stickyBar.classList.add('show');
        } else {
            stickyBar.classList.remove('show');
        }
    });

    // FAQ Accordion
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        question.addEventListener('click', () => {
            // Close other open items
            faqItems.forEach(otherItem => {
                if (otherItem !== item && otherItem.classList.contains('active')) {
                    otherItem.classList.remove('active');
                }
            });
            // Toggle current item
            item.classList.toggle('active');
        });
    });

    // Registration Modal Flow
    const modalOverlay = document.getElementById('registrationModal');
    const registerTriggers = document.querySelectorAll('.register-trigger');
    const closeModalBtn = document.getElementById('closeModal');
    const stepCards = document.querySelectorAll('.step-card');
    
    // Open Modal
    registerTriggers.forEach(btn => {
        btn.addEventListener('click', () => {
            modalOverlay.classList.add('active');
            document.body.style.overflow = 'hidden'; // Prevent background scrolling
            showStep('step1'); // Always start at step 1
        });
    });

    // Close Modal
    function closeModal() {
        modalOverlay.classList.remove('active');
        document.body.style.overflow = 'auto';
        
        // Reset forms and state after brief delay to allow animation
        setTimeout(() => {
            document.getElementById('detailsForm').reset();
            const checks = document.querySelectorAll('.consent-check');
            checks.forEach(check => check.checked = false);
            updateConsentButton();
        }, 400);
    }

    closeModalBtn.addEventListener('click', closeModal);
    
    // Also expose to window for inline onclick use in success screen
    window.closeModal = closeModal;

    // Step Navigation logic
    function showStep(stepId) {
        stepCards.forEach(card => card.classList.remove('active'));
        document.getElementById(stepId).classList.add('active');
    }

    // Next Step buttons
    const nextBtns = document.querySelectorAll('.next-step');
    nextBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            // If it's the submit button in a form, prevent default form submission
            if (btn.type === 'submit' && btn.closest('form')) {
                e.preventDefault();
                const form = btn.closest('form');
                if (!form.checkValidity()) {
                    form.reportValidity();
                    return;
                }
            }
            
            const nextStepId = btn.getAttribute('data-next');
            if (nextStepId) {
                showStep(nextStepId);
            }
        });
    });

    // Previous Step buttons
    const prevBtns = document.querySelectorAll('.prev-step');
    prevBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const prevStepId = btn.getAttribute('data-prev');
            if (prevStepId) {
                showStep(prevStepId);
            }
        });
    });

    // Consent Checkboxes Logic (Step 2)
    const consentChecks = document.querySelectorAll('.consent-check');
    const consentBtn = document.getElementById('consentBtn');

    function updateConsentButton() {
        const allChecked = Array.from(consentChecks).every(cb => cb.checked);
        consentBtn.disabled = !allChecked;
    }

    consentChecks.forEach(cb => {
        cb.addEventListener('change', updateConsentButton);
    });

    // Optional: Payment method selection UX (Step 4)
    const payMethods = document.querySelectorAll('.pay-method');
    payMethods.forEach(method => {
        method.addEventListener('click', () => {
            payMethods.forEach(m => {
                m.style.borderColor = 'rgba(0,0,0,0.1)';
                m.style.background = 'var(--white)';
            });
            method.style.borderColor = 'var(--accent)';
            method.style.background = 'rgba(194, 163, 92, 0.05)';
        });
    });

    // Razorpay Integration
    const razorpayBtn = document.getElementById('razorpayBtn');
    if (razorpayBtn) {
        razorpayBtn.addEventListener('click', function(e) {
            e.preventDefault();
            var options = {
                "key": "rzp_test_T93qBIrsJeBWvV", // Test API Key
                "secret": "13a7F7mACBIxfN9Nt3eZbCg8", // Test Key Secret (Note: usually used on the backend)
                "amount": "499999", // Amount in subunits (Minimum is 100 for 1 INR)
                "currency": "INR",
                "name": "Institute of Health & Longevity",
                "description": "Health & Longevity Workshop",
                "handler": function (response){
                    // Move to success step on success
                    showStep('successStep');
                },
                "theme": {
                    "color": "#21493D"
                }
            };
            if(window.Razorpay) {
                var rzp1 = new window.Razorpay(options);
                rzp1.open();
            } else {
                // Fallback if Razorpay fails to load
                showStep('successStep');
            }
        });
    }

    // Expert Popups
    const expertCards = document.querySelectorAll('.expert-card');
    
    expertCards.forEach(card => {
        const popup = card.querySelector('.expert-popup');
        const overlay = card.querySelector('.expert-popup-overlay');
        
        // Move popup and overlay to the body to fix CSS transform context bugs
        if (popup && overlay) {
            document.body.appendChild(overlay);
            document.body.appendChild(popup);
        }

        card.addEventListener('click', (e) => {
            if (e.target.closest('.close-popup')) return;
            
            if (popup && overlay) {
                popup.classList.add('active');
                overlay.classList.add('active');
                document.body.style.overflow = 'hidden';
            }
        });
        
        if (popup && overlay) {
            const closeBtn = popup.querySelector('.close-popup');
            
            if (closeBtn) {
                closeBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    popup.classList.remove('active');
                    overlay.classList.remove('active');
                    document.body.style.overflow = 'auto';
                });
            }
            
            overlay.addEventListener('click', (e) => {
                e.stopPropagation();
                popup.classList.remove('active');
                overlay.classList.remove('active');
                document.body.style.overflow = 'auto';
            });
            
            // Prevent clicks inside popup from bubbling up or closing it
            popup.addEventListener('click', (e) => {
                e.stopPropagation();
            });
        }
    });

    // Countdown Timer
    const countdownTimer = document.getElementById('countdownTimer');
    if (countdownTimer) {
        // Set target date to July 26, 2026
        const targetDate = new Date('July 26, 2026 23:59:59').getTime();
        
        const updateCountdown = () => {
            const now = new Date().getTime();
            const distance = targetDate - now;
            
            if (distance < 0) {
                countdownTimer.innerHTML = "Offer Expired";
                return;
            }
            
            const days = Math.floor(distance / (1000 * 60 * 60 * 24));
            const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((distance % (1000 * 60)) / 1000);
            
            countdownTimer.innerHTML = `
                <div class="countdown-box"><span class="val">${days}</span><span class="label">Days</span></div>
                <div class="countdown-box"><span class="val">${hours.toString().padStart(2, '0')}</span><span class="label">Hrs</span></div>
                <div class="countdown-box"><span class="val">${minutes.toString().padStart(2, '0')}</span><span class="label">Mins</span></div>
                <div class="countdown-box"><span class="val">${seconds.toString().padStart(2, '0')}</span><span class="label">Secs</span></div>
            `;
        };
        
        updateCountdown();
        setInterval(updateCountdown, 1000);
    }

    // Hamburger Menu
    const hamburger = document.getElementById('hamburger');
    const navLinks = document.getElementById('navLinks');
    
    if (hamburger && navLinks) {
        hamburger.addEventListener('click', () => {
            navLinks.classList.toggle('active');
        });
        
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('active');
            });
        });
    }

    // Scroll to Top logic
    const scrollTopBtn = document.getElementById('scrollTopBtn');
    if (scrollTopBtn) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 300) {
                scrollTopBtn.classList.add('show');
            } else {
                scrollTopBtn.classList.remove('show');
            }
        });
        
        scrollTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

});
