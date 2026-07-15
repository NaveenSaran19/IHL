document.addEventListener('DOMContentLoaded', () => {

    // Restore form data from localStorage if exists
    const savedData = localStorage.getItem('workshopFormData');
    if (savedData) {
        try {
            const formData = JSON.parse(savedData);
            if (formData.fullName) document.getElementById('fullName').value = formData.fullName;
            if (formData.age) document.getElementById('age').value = formData.age;
            if (formData.gender) document.getElementById('gender').value = formData.gender;
            if (formData.mobile) document.getElementById('mobile').value = formData.mobile;
            if (formData.email) document.getElementById('email').value = formData.email;
        } catch(e) {
            console.error('Error parsing saved form data', e);
        }
    }

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
    function showStep(stepId, paymentId = 'UPI / Fallback') {
        stepCards.forEach(card => card.classList.remove('active'));
        document.getElementById(stepId).classList.add('active');
        
        if (stepId === 'successStep') {
            const savedData = localStorage.getItem('workshopFormData');
            if (savedData) {
                try {
                    const formData = JSON.parse(savedData);
                    setTimeout(() => {
                        const message = `*New Workshop Registration!*\n\n*Name:* ${formData.fullName}\n*Age:* ${formData.age}\n*Gender:* ${formData.gender}\n*Mobile:* ${formData.mobile}\n*Email:* ${formData.email}\n*Payment ID:* ${paymentId}\n\nI have completed the payment and registered for the Health & Longevity Workshop.`;
                        const whatsappUrl = `https://wa.me/919087590967?text=${encodeURIComponent(message)}`;
                        window.location.href = whatsappUrl; // Replaces window.open to bypass popup blockers
                    }, 1500); // 1.5s delay to let them see the success screen
                } catch(e) {
                    console.error('Error with form data for WhatsApp', e);
                }
            }
        }
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
                
                // Save form data to localStorage
                if (form.id === 'detailsForm') {
                    const formData = {
                        fullName: document.getElementById('fullName').value,
                        age: document.getElementById('age').value,
                        gender: document.getElementById('gender').value,
                        mobile: document.getElementById('mobile').value,
                        email: document.getElementById('email').value
                    };
                    localStorage.setItem('workshopFormData', JSON.stringify(formData));
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
                    showStep('successStep', response.razorpay_payment_id);
                },
                "theme": {
                    "color": "#1E2A3D"
                }
            };
            if(window.Razorpay) {
                try {
                    var rzp1 = new window.Razorpay(options);
                    rzp1.on('payment.failed', function (response){
                        console.error("Payment Failed", response.error);
                        // Fallback to QR Step
                        showStep('qrStep');
                    });

                    // Razorpay uses native alert() for initialization errors (e.g. invalid test keys).
                    // We temporarily intercept alert() to catch this and fallback gracefully.
                    const originalAlert = window.alert;
                    let rzpInitFailed = false;
                    window.alert = function(msg) {
                        if (msg && msg.toLowerCase().includes('payment failed')) {
                            rzpInitFailed = true;
                            console.warn('Intercepted Razorpay initialization failure.');
                        } else {
                            originalAlert(msg);
                        }
                    };

                    rzp1.open();

                    if (rzpInitFailed) {
                        window.alert = originalAlert;
                        showStep('qrStep');
                    } else {
                        setTimeout(() => {
                            window.alert = originalAlert;
                            if (rzpInitFailed) showStep('qrStep');
                        }, 500);
                    }
                } catch(e) {
                    console.error("Razorpay Init Error", e);
                    showStep('qrStep');
                }
            } else {
                // Fallback if Razorpay fails to load
                showStep('qrStep');
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

    // Countdown Timers
    const countdownContainers = document.querySelectorAll('.countdown-timer');
    if (countdownContainers.length > 0) {
        countdownContainers.forEach(container => {
            container.innerHTML = `
                <div class="countdown-box"><span class="val cd-days">00</span><span class="label">Days</span></div>
                <div class="countdown-box"><span class="val cd-hours">00</span><span class="label">Hrs</span></div>
                <div class="countdown-box"><span class="val cd-mins">00</span><span class="label">Mins</span></div>
                <div class="countdown-box"><span class="val cd-secs">00</span><span class="label">Secs</span></div>
            `;
        });
        
        const targetDate = new Date('July 26, 2026 23:59:59').getTime();
        
        const animateUpdate = (className, newValue) => {
            document.querySelectorAll(className).forEach(el => {
                if (el.innerText !== newValue) {
                    el.style.transform = 'translateY(-10px)';
                    el.style.opacity = '0';
                    setTimeout(() => {
                        el.innerText = newValue;
                        el.style.transform = 'translateY(10px)';
                        setTimeout(() => {
                            el.style.transform = 'translateY(0)';
                            el.style.opacity = '1';
                        }, 50);
                    }, 200);
                }
            });
        };

        const updateCountdown = () => {
            const now = new Date().getTime();
            const distance = targetDate - now;
            
            if (distance < 0) {
                countdownContainers.forEach(c => c.innerHTML = "Offer Expired");
                return;
            }
            
            const days = Math.floor(distance / (1000 * 60 * 60 * 24)).toString();
            const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)).toString().padStart(2, '0');
            const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)).toString().padStart(2, '0');
            const seconds = Math.floor((distance % (1000 * 60)) / 1000).toString().padStart(2, '0');
            
            animateUpdate('.cd-days', days);
            animateUpdate('.cd-hours', hours);
            animateUpdate('.cd-mins', minutes);
            animateUpdate('.cd-secs', seconds);
        };
        
        const now = new Date().getTime();
        const distance = targetDate - now;
        if(distance > 0) {
            document.querySelectorAll('.cd-days').forEach(el => el.innerText = Math.floor(distance / (1000 * 60 * 60 * 24)).toString());
            document.querySelectorAll('.cd-hours').forEach(el => el.innerText = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)).toString().padStart(2, '0'));
            document.querySelectorAll('.cd-mins').forEach(el => el.innerText = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)).toString().padStart(2, '0'));
            document.querySelectorAll('.cd-secs').forEach(el => el.innerText = Math.floor((distance % (1000 * 60)) / 1000).toString().padStart(2, '0'));
        }
        
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

    // Disable Lenis Smooth Scrolling as requested
    /*
    if (typeof Lenis !== 'undefined') {
        const lenis = new Lenis({
            duration: 1.2,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            smooth: true
        });
        function raf(time) {
            lenis.raf(time);
            requestAnimationFrame(raf);
        }
        requestAnimationFrame(raf);
    }
    */

    // Initialize AOS
    if (typeof AOS !== 'undefined') {
        document.querySelectorAll('.section').forEach(sec => {
            if(!sec.hasAttribute('data-aos')) sec.setAttribute('data-aos', 'fade-in');
        });
        document.querySelectorAll('.approach-card, .expert-card, .faq-item').forEach((card, i) => {
            if(!card.hasAttribute('data-aos')) {
                card.setAttribute('data-aos', 'fade-in');
                card.setAttribute('data-aos-delay', (i % 3) * 100);
            }
        });
        AOS.init({ duration: 800, once: false, offset: 100 });
    }

    // Vanilla Tilt
    if (typeof VanillaTilt !== 'undefined') {
        VanillaTilt.init(document.querySelectorAll(".approach-card, .expert-card, .hero-new-card"), {
            max: 10,
            speed: 400,
            glare: true,
            "max-glare": 0.2
        });
    }

    // Typed.js
    if (typeof Typed !== 'undefined' && document.getElementById('typed-subtitle')) {
        new Typed('#typed-subtitle', {
            strings: [
                'Take control of your health while you still have the opportunity to shape it.',
                'Discover how informed choices today can shape a healthier tomorrow.'
            ],
            typeSpeed: 40,
            backSpeed: 20,
            backDelay: 3000,
            loop: true
        });
    }

    // Dynamically create a circular favicon from logo.png
    const canvas = document.createElement('canvas');
    canvas.width = 64;
    canvas.height = 64;
    const ctx = canvas.getContext('2d');
    
    const img = new Image();
    img.src = 'image/logo.png';
    img.onload = () => {
        // Draw a circle and clip
        ctx.beginPath();
        ctx.arc(32, 32, 32, 0, Math.PI * 2);
        ctx.clip();
        
        // Draw the image inside the clipped circle
        ctx.drawImage(img, 0, 0, 64, 64);
        
        // Update the favicon
        const link = document.querySelector("link[rel*='icon']") || document.createElement('link');
        link.type = 'image/png';
        link.rel = 'icon';
        link.href = canvas.toDataURL();
        document.getElementsByTagName('head')[0].appendChild(link);
    };

});
