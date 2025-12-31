/*==================== MAIN JAVASCRIPT ====================*/

document.addEventListener('DOMContentLoaded', () => {
    // Preloader
    const preloader = document.querySelector('.preloader');
    window.addEventListener('load', () => {
        setTimeout(() => {
            preloader.style.opacity = '0';
            setTimeout(() => {
                preloader.style.display = 'none';
            }, 500);
        }, 1500);
    });

    // Custom Cursor
    const cursorDot = document.querySelector('.cursor-dot');
    const cursorDotOutline = document.querySelector('.cursor-dot-outline');

    if (cursorDot && cursorDotOutline) {
        window.addEventListener('mousemove', (e) => {
            const posX = e.clientX;
            const posY = e.clientY;

            cursorDot.style.left = `${posX}px`;
            cursorDot.style.top = `${posY}px`;
            cursorDotOutline.style.left = `${posX}px`;
            cursorDotOutline.style.top = `${posY}px`;

            cursorDot.style.opacity = '1';
            cursorDotOutline.style.opacity = '1';
        });

        document.addEventListener('mouseout', () => {
            cursorDot.style.opacity = '0';
            cursorDotOutline.style.opacity = '0';
        });

        // Add cursor effects on hover
        const hoverElements = document.querySelectorAll('a, button, .hover-effect');
        hoverElements.forEach(element => {
            element.addEventListener('mouseover', () => {
                cursorDot.style.transform = 'translate(-50%, -50%) scale(1.5)';
                cursorDotOutline.style.transform = 'translate(-50%, -50%) scale(1.5)';
                cursorDotOutline.style.borderColor = 'var(--secondary-color)';
            });
            element.addEventListener('mouseout', () => {
                cursorDot.style.transform = 'translate(-50%, -50%) scale(1)';
                cursorDotOutline.style.transform = 'translate(-50%, -50%) scale(1)';
                cursorDotOutline.style.borderColor = 'var(--primary-color)';
            });
        });
    }

    // Mobile Menu Toggle
    const menuBtn = document.querySelector('.menu-btn');
    const mobileMenu = document.querySelector('.mobile-menu');

    if (menuBtn && mobileMenu) {
        menuBtn.addEventListener('click', () => {
            menuBtn.classList.toggle('open');
            mobileMenu.classList.toggle('active');
            document.body.classList.toggle('no-scroll');
        });

        // Close mobile menu when clicking on a link
        const mobileLinks = document.querySelectorAll('.mobile-nav-links a');
        mobileLinks.forEach(link => {
            link.addEventListener('click', () => {
                menuBtn.classList.remove('open');
                mobileMenu.classList.remove('active');
                document.body.classList.remove('no-scroll');
            });
        });
    }

    // Sticky Header
    const header = document.querySelector('header');
    if (header) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        });
    }

    // Active Navigation Link
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-links a, .mobile-nav-links a');

    function activeNavLink() {
        const scrollY = window.scrollY;

        sections.forEach(section => {
            const sectionHeight = section.offsetHeight;
            const sectionTop = section.offsetTop - 100;
            const sectionId = section.getAttribute('id');

            if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }

    window.addEventListener('scroll', activeNavLink);

    // Scroll Reveal Animation
    const revealElements = document.querySelectorAll('.reveal');

    function revealOnScroll() {
        const windowHeight = window.innerHeight;
        const revealPoint = 150;

        revealElements.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;

            if (elementTop < windowHeight - revealPoint) {
                element.classList.add('active');
            }
        });
    }

    window.addEventListener('scroll', revealOnScroll);
    // Trigger once on load
    setTimeout(revealOnScroll, 100);

    // Back to Top Button
    const backToTopBtn = document.querySelector('.back-to-top');

    if (backToTopBtn) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 300) {
                backToTopBtn.classList.add('active');
            } else {
                backToTopBtn.classList.remove('active');
            }
        });

        backToTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // Typed.js for Hero Section
    const typedElement = document.querySelector('.typing');
    if (typedElement && typeof Typed !== 'undefined') {
        new Typed('.typing', {
            strings: ['Frontend Developer', 'Data Analyst', 'UI/UX Designer', 'Tech Enthusiast'],
            typeSpeed: 100,
            backSpeed: 60,
            loop: true
        });
    }

    // Skill Progress Bars Animation
    const skillBars = document.querySelectorAll('.skill-progress-bar');
    const skillSection = document.querySelector('#skills');
    let skillBarsAnimated = false;

    function animateSkillBars() {
        if (!skillSection || !skillBars.length) return;

        const sectionTop = skillSection.offsetTop;
        const sectionHeight = skillSection.offsetHeight;
        const windowHeight = window.innerHeight;
        const scrollY = window.scrollY;

        if (!skillBarsAnimated && scrollY > sectionTop - windowHeight + 200 && scrollY < sectionTop + sectionHeight) {
            skillBars.forEach(bar => {
                const percentage = bar.getAttribute('data-percent');
                if (percentage) {
                    bar.style.width = percentage + '%';
                }
            });
            skillBarsAnimated = true;
        } else if (scrollY < sectionTop - windowHeight) {
            // Reset animation when scrolling back up
            skillBarsAnimated = false;
            skillBars.forEach(bar => {
                bar.style.width = '0';
            });
        }
    }

    window.addEventListener('scroll', animateSkillBars);
    // Trigger once on load
    setTimeout(animateSkillBars, 500);

    // Counter Animation for Stats
    const statNumbers = document.querySelectorAll('.stat-number');
    const aboutSection = document.querySelector('#about');
    let counted = false;

    function animateCounters() {
        if (!aboutSection || !statNumbers.length || counted) return;

        const sectionTop = aboutSection.offsetTop;
        const sectionHeight = aboutSection.offsetHeight;
        const windowHeight = window.innerHeight;
        const scrollY = window.scrollY;

        if (scrollY > sectionTop - windowHeight + 200 && scrollY < sectionTop + sectionHeight) {
            statNumbers.forEach(stat => {
                const target = parseInt(stat.getAttribute('data-count'));
                const duration = 2000; // 2 seconds
                const increment = target / (duration / 16); // 60fps
                let current = 0;

                const counter = setInterval(() => {
                    current += increment;
                    if (current >= target) {
                        stat.textContent = target;
                        clearInterval(counter);
                    } else {
                        stat.textContent = Math.floor(current);
                    }
                }, 16);
            });
            counted = true;
        }
    }

    window.addEventListener('scroll', animateCounters);
    // Trigger once on load
    setTimeout(animateCounters, 500);

    // Projects Filter
    const filterBtns = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');

    if (filterBtns.length && projectCards.length) {
        filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                // Remove active class from all buttons
                filterBtns.forEach(btn => btn.classList.remove('active'));
                // Add active class to clicked button
                btn.classList.add('active');

                const filterValue = btn.getAttribute('data-filter');

                projectCards.forEach(card => {
                    if (filterValue === 'all') {
                        card.style.display = 'block';
                        setTimeout(() => {
                            card.style.opacity = '1';
                            card.style.transform = 'translateY(0)';
                        }, 100);
                    } else if (card.classList.contains(filterValue)) {
                        card.style.display = 'block';
                        setTimeout(() => {
                            card.style.opacity = '1';
                            card.style.transform = 'translateY(0)';
                        }, 100);
                    } else {
                        card.style.opacity = '0';
                        card.style.transform = 'translateY(20px)';
                        setTimeout(() => {
                            card.style.display = 'none';
                        }, 300);
                    }
                });
            });
        });
    }

    // Project Modal
    const projectLinks = document.querySelectorAll('.project-details-link');
    const projectModals = document.querySelectorAll('.project-modal');
    const closeModalBtns = document.querySelectorAll('.close-modal');

    if (projectLinks.length && projectModals.length) {
        projectLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const modalId = link.getAttribute('data-modal');
                const modal = document.getElementById(modalId);
                if (modal) {
                    modal.classList.add('active');
                    document.body.classList.add('no-scroll');
                }
            });
        });

        closeModalBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const modal = btn.closest('.project-modal');
                if (modal) {
                    modal.classList.remove('active');
                    document.body.classList.remove('no-scroll');
                }
            });
        });

        // Close modal when clicking outside content
        projectModals.forEach(modal => {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    modal.classList.remove('active');
                    document.body.classList.remove('no-scroll');
                }
            });
        });

        // Close modal with Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                projectModals.forEach(modal => {
                    modal.classList.remove('active');
                });
                document.body.classList.remove('no-scroll');
            }
        });
    }

    // Testimonials slider initialization
    (function initTestimonials() {
        const testimonialSlider = document.querySelector(".testimonials-slider");
        const testimonialCards = document.querySelectorAll(".testimonial-card");
        const dotsContainer = document.querySelector('.testimonial-dots');
        let testimonialDots;
        const prevBtn = document.querySelector(".testimonial-prev");
        const nextBtn = document.querySelector(".testimonial-next");

        // If there are no dot elements in markup, create them dynamically
        if (dotsContainer && testimonialCards.length && dotsContainer.children.length === 0) {
            for (let i = 0; i < testimonialCards.length; i++) {
                const dot = document.createElement('button');
                dot.className = 'testimonial-dot';
                dotsContainer.appendChild(dot);
            }
        }

        testimonialDots = document.querySelectorAll('.testimonial-dot');

        if (!testimonialSlider || testimonialCards.length === 0) return;

        let currentIndex = 0;
        let autoSlideInterval;

        function showTestimonial(index) {
            testimonialCards.forEach((card, i) => {
                card.classList.toggle("active", i === index);
            });
            testimonialDots.forEach((dot, i) => {
                dot.classList.toggle("active", i === index);
            });
            currentIndex = index;
        }

        function nextTestimonial() {
            const nextIndex = (currentIndex + 1) % testimonialCards.length;
            showTestimonial(nextIndex);
        }

        function prevTestimonial() {
            const prevIndex = (currentIndex - 1 + testimonialCards.length) % testimonialCards.length;
            showTestimonial(prevIndex);
        }

        // Event listeners
        if (nextBtn) nextBtn.addEventListener("click", nextTestimonial);
        if (prevBtn) prevBtn.addEventListener("click", prevTestimonial);

        testimonialDots.forEach((dot, i) => {
            dot.addEventListener("click", () => showTestimonial(i));
        });

        // Auto slide
        function startAutoSlide() {
            autoSlideInterval = setInterval(nextTestimonial, 5000);
        }

        function stopAutoSlide() {
            clearInterval(autoSlideInterval);
        }

        testimonialSlider.addEventListener("mouseenter", stopAutoSlide);
        testimonialSlider.addEventListener("mouseleave", startAutoSlide);

        // Initialize first testimonial
        showTestimonial(0);
        startAutoSlide();
    })();


      // Contact Form Validation
    const contactForm = document.querySelector('.contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Get form inputs
            const nameInput = contactForm.querySelector('input[name="name"]');
            const emailInput = contactForm.querySelector('input[name="email"]');
            const subjectInput = contactForm.querySelector('input[name="subject"]');
            const messageInput = contactForm.querySelector('textarea[name="message"]');
            
            // Simple validation
            let isValid = true;
            
            if (!nameInput.value.trim()) {
                showError(nameInput, 'Name is required');
                isValid = false;
            } else {
                removeError(nameInput);
            }
            
            if (!emailInput.value.trim()) {
                showError(emailInput, 'Email is required');
                isValid = false;
            } else if (!isValidEmail(emailInput.value)) {
                showError(emailInput, 'Please enter a valid email');
                isValid = false;
            } else {
                removeError(emailInput);
            }
            
            if (!subjectInput.value.trim()) {
                showError(subjectInput, 'Subject is required');
                isValid = false;
            } else {
                removeError(subjectInput);
            }
            
            if (!messageInput.value.trim()) {
                showError(messageInput, 'Message is required');
                isValid = false;
            } else {
                removeError(messageInput);
            }
            
            if (isValid) {
                // Submit to backend endpoint which will forward to WhatsApp
                const submitBtn = contactForm.querySelector('button[type="submit"]');
                const originalText = submitBtn.textContent;
                submitBtn.textContent = 'Sending...';
                submitBtn.disabled = true;

                const payload = {
                    name: nameInput.value.trim(),
                    email: emailInput.value.trim(),
                    subject: subjectInput.value.trim(),
                    message: messageInput.value.trim(),
                    hp: (contactForm.querySelector('input[name="hp"]') && contactForm.querySelector('input[name="hp"]').value) || ''
                };

                // Netlify Function endpoint
                fetch('/.netlify/functions/send-whatsapp', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                }).then(async (res) => {
                    if (res.ok) {
                        contactForm.reset();
                        showSuccessMessage(contactForm, 'Your message has been sent — I will get back to you on WhatsApp shortly.');
                    } else {
                        const text = await res.text();
                        showError(submitBtn, 'Failed to send message. ' + (text || 'Please try again later.'));
                    }
                }).catch((err) => {
                    console.error('Error sending contact form:', err);
                    showError(submitBtn, 'Network error. Please try again later.');
                }).finally(() => {
                    submitBtn.textContent = originalText;
                    submitBtn.disabled = false;
                    setTimeout(() => {
                        const successMessage = contactForm.querySelector('.success-message');
                        if (successMessage) successMessage.remove();
                    }, 7000);
                });
            }
        });
        
        // Email validation function
        function isValidEmail(email) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            return emailRegex.test(email);
        }
        
        // Show error message
        function showError(input, message) {
            const formGroup = input.parentElement;
            let errorMessage = formGroup.querySelector('.error-message');
            
            if (!errorMessage) {
                errorMessage = document.createElement('div');
                errorMessage.className = 'error-message';
                formGroup.appendChild(errorMessage);
            }
            
            errorMessage.textContent = message;
            formGroup.classList.add('error');
        }
        
        // Remove error message
        function removeError(input) {
            const formGroup = input.parentElement;
            const errorMessage = formGroup.querySelector('.error-message');
            
            if (errorMessage) {
                errorMessage.remove();
            }
            
            formGroup.classList.remove('error');
        }
        
        // Show success message
        function showSuccessMessage(form, message) {
            let successMessage = form.querySelector('.success-message');
            
            if (!successMessage) {
                successMessage = document.createElement('div');
                successMessage.className = 'success-message';
                form.prepend(successMessage);
            }
            
            successMessage.textContent = message;
        }
    }

    // Parallax Effect
    const parallaxElements = document.querySelectorAll('.parallax');

    if (parallaxElements.length) {
        document.addEventListener('mousemove', (e) => {
            const x = e.clientX / window.innerWidth;
            const y = e.clientY / window.innerHeight;

            parallaxElements.forEach(element => {
                const speed = element.getAttribute('data-speed') || 0.1;
                const offsetX = (0.5 - x) * speed * 100;
                const offsetY = (0.5 - y) * speed * 100;

                element.style.transform = `translate(${offsetX}px, ${offsetY}px)`;
            });
        });
    }

    // Tilt Effect
    const tiltElements = document.querySelectorAll('.tilt');

    if (tiltElements.length) {
        tiltElements.forEach(element => {
            element.addEventListener('mousemove', (e) => {
                const rect = element.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                const tiltX = (centerX - x) / 20;
                const tiltY = (y - centerY) / 20;

                element.style.transform = `perspective(1000px) rotateX(${tiltY}deg) rotateY(${-tiltX}deg)`;
            });

            element.addEventListener('mouseleave', () => {
                element.style.transform = 'perspective(1000px) rotateX(0) rotateY(0)';
            });
        });
    }

    // Magnetic Effect
    const magneticElements = document.querySelectorAll('.magnetic');

    if (magneticElements.length) {
        magneticElements.forEach(element => {
            element.addEventListener('mousemove', (e) => {
                const rect = element.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                const deltaX = (x - centerX) / 8;
                const deltaY = (y - centerY) / 8;

                element.style.transform = `translate(${deltaX}px, ${deltaY}px)`;
            });

            element.addEventListener('mouseleave', () => {
                element.style.transform = 'translate(0, 0)';
            });
        });
    }

    // Smooth Scrolling for Anchor Links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            e.preventDefault();
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                const headerHeight = document.querySelector('header').offsetHeight;
                const targetPosition = targetElement.offsetTop - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Avatar 3D placeholder (simple Three.js object) — keeps hero area from being empty
    (function initAvatar3D() {
        const avatarEl = document.querySelector('.avatar-3d');
        if (!avatarEl) return;
        if (typeof THREE === 'undefined') {
            // If Three.js isn't available, show a static SVG placeholder
            const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
            svg.setAttribute('viewBox', '0 0 200 200');
            svg.setAttribute('width', '100%');
            svg.setAttribute('height', '100%');
            svg.innerHTML = '<circle cx="100" cy="100" r="60" fill="rgba(110,87,224,0.15)" stroke="rgba(110,87,224,0.25)" stroke-width="4" />';
            avatarEl.appendChild(svg);
            return;
        }

    // Create renderer
    // Remove placeholder image if present (we'll replace it with renderer)
    const placeholder = avatarEl.querySelector('.avatar-placeholder');
    const rect = avatarEl.getBoundingClientRect();
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, rect.width / rect.height, 0.1, 100);
    camera.position.z = 3;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setPixelRatio(window.devicePixelRatio || 1);
    renderer.setSize(rect.width, rect.height);
    if (placeholder) placeholder.remove();
    avatarEl.appendChild(renderer.domElement);

        // Simple geometry (icosahedron) as a placeholder avatar
        const geometry = new THREE.IcosahedronGeometry(1, 2);
        const material = new THREE.MeshStandardMaterial({ color: 0x6e57e0, metalness: 0.3, roughness: 0.4 });
        const mesh = new THREE.Mesh(geometry, material);
        scene.add(mesh);

        // Lights
        const hemi = new THREE.HemisphereLight(0xffffff, 0x444444, 0.6);
        scene.add(hemi);
        const dir = new THREE.DirectionalLight(0xffffff, 0.8);
        dir.position.set(5, 5, 5);
        scene.add(dir);

        // Animation loop
        let frameId;
        function animate() {
            frameId = requestAnimationFrame(animate);
            mesh.rotation.y += 0.01;
            mesh.rotation.x += 0.005;
            renderer.render(scene, camera);
        }
        animate();

        // Handle resize
        function onResize() {
            const r = avatarEl.getBoundingClientRect();
            camera.aspect = r.width / r.height;
            camera.updateProjectionMatrix();
            renderer.setSize(r.width, r.height);
        }

        window.addEventListener('resize', onResize);

        // Clean up if the element is removed
        const observer = new MutationObserver(() => {
            if (!document.body.contains(avatarEl)) {
                cancelAnimationFrame(frameId);
                renderer.dispose();
                observer.disconnect();
            }
        });
        observer.observe(document.body, { childList: true, subtree: true });
    })();
});