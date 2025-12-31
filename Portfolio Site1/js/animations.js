document.addEventListener('DOMContentLoaded', () => {
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

    // Staggered Animation for Elements
    const staggeredElements = document.querySelectorAll('.staggered');
    
    function animateStaggered() {
        staggeredElements.forEach((element, index) => {
            setTimeout(() => {
                element.classList.add('active');
            }, 150 * index);
        });
    }

    // Trigger staggered animations
    setTimeout(animateStaggered, 500);

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

    // Glitch Effect
    const glitchElements = document.querySelectorAll('.glitch');
    
    if (glitchElements.length) {
        glitchElements.forEach(element => {
            // Create glitch effect by adding data-text attribute
            if (!element.hasAttribute('data-text')) {
                element.setAttribute('data-text', element.textContent);
            }
            
            // Add random glitch animation
            setInterval(() => {
                element.classList.add('active');
                setTimeout(() => {
                    element.classList.remove('active');
                }, 200);
            }, 3000);
        });
    }

    // Spotlight Effect
    const spotlightElements = document.querySelectorAll('.spotlight');
    
    if (spotlightElements.length) {
        spotlightElements.forEach(element => {
            element.addEventListener('mousemove', (e) => {
                const rect = element.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                
                element.style.setProperty('--spotlight-x', `${x}px`);
                element.style.setProperty('--spotlight-y', `${y}px`);
            });
        });
    }

    // Floating Animation
    const floatingElements = document.querySelectorAll('.floating');
    
    if (floatingElements.length) {
        floatingElements.forEach((element, index) => {
            // Add random delay to create natural effect
            const delay = Math.random() * 2;
            element.style.animationDelay = `${delay}s`;
        });
    }

    // Add scroll-triggered class to elements
    const scrollTriggerElements = document.querySelectorAll('.scroll-trigger');
    
    function checkScrollTrigger() {
        const triggerOffset = window.innerHeight * 0.8;
        
        scrollTriggerElements.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;
            
            if (elementTop < triggerOffset) {
                const animationClass = element.getAttribute('data-animation') || 'fadeIn';
                element.classList.add(animationClass);
            }
        });
    }
    
    window.addEventListener('scroll', checkScrollTrigger);
    // Initial check
    setTimeout(checkScrollTrigger, 100);
});