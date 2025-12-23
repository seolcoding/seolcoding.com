// ========================================
// SEOLCODING.COM - Animation Package
// ScrollTrigger + Magnetic Buttons + Effects
// ========================================

// Register ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

// ========================================
// 1. INIT ALL ANIMATIONS (No Preloader)
// ========================================
function initAllAnimations() {
    document.body.style.visibility = 'visible';
    initMagneticButtons();
    initScrollReveal();
    initScrollProgress();
    initHeroTilt();
    initParticles();
    initHeroAnimations();
}

// ========================================
// 2. CUSTOM CURSOR
// ========================================
function initCustomCursor() {
    // Skip on mobile
    if (window.innerWidth <= 768) return;

    const cursor = document.getElementById('custom-cursor');
    const follower = document.getElementById('cursor-follower');

    if (!cursor || !follower) return;

    let mouseX = 0, mouseY = 0;
    let cursorX = 0, cursorY = 0;
    let followerX = 0, followerY = 0;

    // Track mouse position
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });

    // Animate cursor positions
    function animateCursor() {
        // Cursor follows immediately
        cursorX += (mouseX - cursorX) * 0.2;
        cursorY += (mouseY - cursorY) * 0.2;
        cursor.style.left = cursorX + 'px';
        cursor.style.top = cursorY + 'px';

        // Follower has more lag
        followerX += (mouseX - followerX) * 0.1;
        followerY += (mouseY - followerY) * 0.1;
        follower.style.left = followerX + 'px';
        follower.style.top = followerY + 'px';

        requestAnimationFrame(animateCursor);
    }
    animateCursor();

    // Hover effects on interactive elements
    const interactiveElements = document.querySelectorAll('a, button, [role="button"], .magnetic-btn, input, textarea, .service-card, .project-card');

    interactiveElements.forEach(el => {
        el.addEventListener('mouseenter', () => {
            cursor.classList.add('hovering');
            follower.classList.add('hovering');
        });

        el.addEventListener('mouseleave', () => {
            cursor.classList.remove('hovering');
            follower.classList.remove('hovering');
        });
    });

    // Click effects
    document.addEventListener('mousedown', () => {
        cursor.classList.add('clicking');
        follower.classList.add('clicking');
    });

    document.addEventListener('mouseup', () => {
        cursor.classList.remove('clicking');
        follower.classList.remove('clicking');
    });
}

// ========================================
// 3. MAGNETIC BUTTONS
// ========================================
function initMagneticButtons() {
    // Skip on mobile
    if (window.innerWidth <= 768) return;

    const magneticElements = document.querySelectorAll('.hero-button, .magnetic-btn, a.group');

    magneticElements.forEach(el => {
        el.classList.add('magnetic-btn');

        el.addEventListener('mousemove', (e) => {
            const rect = el.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;

            gsap.to(el, {
                x: x * 0.3,
                y: y * 0.3,
                duration: 0.3,
                ease: 'power2.out'
            });
        });

        el.addEventListener('mouseleave', () => {
            gsap.to(el, {
                x: 0,
                y: 0,
                duration: 0.5,
                ease: 'elastic.out(1, 0.3)'
            });
        });
    });
}

// ========================================
// 4. SCROLL REVEAL (ScrollTrigger) - 3x FASTER
// ========================================
function initScrollReveal() {
    // Reveal sections on scroll - FAST
    const sections = document.querySelectorAll('section:not(.hero-section)');

    sections.forEach((section, index) => {
        const children = section.querySelectorAll('h2, h3, p, .grid > *, .flex > *');

        // 3x faster: duration 0.8 -> 0.25, stagger 0.1 -> 0.03
        gsap.fromTo(children,
            {
                opacity: 0,
                y: 30,
                scale: 0.98
            },
            {
                opacity: 1,
                y: 0,
                scale: 1,
                duration: 0.25,
                stagger: 0.03,
                ease: 'power2.out',
                scrollTrigger: {
                    trigger: section,
                    start: 'top 85%',
                    end: 'bottom 20%',
                    toggleActions: 'play none none reverse'
                }
            }
        );

        // Section line animation
        ScrollTrigger.create({
            trigger: section,
            start: 'top 60%',
            end: 'bottom 40%',
            onEnter: () => section.classList.add('in-view'),
            onLeave: () => section.classList.remove('in-view'),
            onEnterBack: () => section.classList.add('in-view'),
            onLeaveBack: () => section.classList.remove('in-view')
        });
    });

    // Cards - appear almost instantly with slight random delay
    const cards = document.querySelectorAll('.bg-white\\/10, [class*="backdrop-blur"]');

    cards.forEach((card, index) => {
        const randomDelay = Math.random() * 0.1; // Random 0-100ms delay

        gsap.fromTo(card,
            {
                opacity: 0,
                y: 20
            },
            {
                opacity: 1,
                y: 0,
                duration: 0.2,
                delay: randomDelay,
                ease: 'power2.out',
                scrollTrigger: {
                    trigger: card,
                    start: 'top 90%',
                    toggleActions: 'play none none reverse'
                }
            }
        );
    });
}

// ========================================
// 5. SCROLL PROGRESS BAR
// ========================================
function initScrollProgress() {
    // Create progress bar if not exists
    let progressBar = document.querySelector('.scroll-progress');
    if (!progressBar) {
        progressBar = document.createElement('div');
        progressBar.className = 'scroll-progress';
        document.body.appendChild(progressBar);
    }

    // Update on scroll
    gsap.to(progressBar, {
        width: '100%',
        ease: 'none',
        scrollTrigger: {
            trigger: document.body,
            start: 'top top',
            end: 'bottom bottom',
            scrub: 0.3
        }
    });
}

// ========================================
// 6. HERO TILT EFFECT
// ========================================
function initHeroTilt() {
    const heroSection = document.querySelector('.hero-section');
    if (!heroSection) return;

    const profileImage = heroSection.querySelector('[data-animation="profile-image"]');
    if (!profileImage) return;

    // Add tilt classes
    profileImage.classList.add('hero-tilt');

    const tiltInner = profileImage.querySelector('.relative');
    if (tiltInner) {
        tiltInner.classList.add('hero-tilt-inner');
    }

    heroSection.addEventListener('mousemove', (e) => {
        if (window.innerWidth <= 768) return;

        const rect = heroSection.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;

        if (tiltInner) {
            gsap.to(tiltInner, {
                rotateY: x * 20,
                rotateX: -y * 20,
                duration: 0.5,
                ease: 'power2.out'
            });
        }
    });

    heroSection.addEventListener('mouseleave', () => {
        if (tiltInner) {
            gsap.to(tiltInner, {
                rotateY: 0,
                rotateX: 0,
                duration: 0.8,
                ease: 'elastic.out(1, 0.5)'
            });
        }
    });
}

// ========================================
// 7. FLOATING PARTICLES
// ========================================
function initParticles() {
    let container = document.getElementById('particles-container');
    if (!container) {
        container = document.createElement('div');
        container.id = 'particles-container';
        document.body.insertBefore(container, document.body.firstChild);
    }

    // Create particles
    const particleCount = 20;
    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.animationDelay = Math.random() * 15 + 's';
        particle.style.animationDuration = (10 + Math.random() * 10) + 's';
        container.appendChild(particle);
    }
}

// ========================================
// 8. ORIGINAL HERO ANIMATIONS (Enhanced)
// ========================================
const ANIMATION_CONFIG = {
    hero: {
        diagonalLines: { count: 4, opacity: 0.4, scaleX: 4.0 }
    }
};

const Utils = {
    createContainer: (parent, className, fallback) => {
        return parent.querySelector(className) || (() => {
            const container = document.createElement('div');
            container.className = fallback;
            parent.appendChild(container);
            return container;
        })();
    },
    randomPosition: (min = 10, max = 90) => ({
        x: Math.random() * (max - min) + min,
        y: Math.random() * (max - min) + min
    })
};

function initHeroAnimations() {
    const heroSection = document.querySelector('.hero-section');
    if (!heroSection) return;

    // Set initial states
    const animatedElements = heroSection.querySelectorAll('[data-animation]');
    const bgDecorations = heroSection.querySelectorAll('.absolute.opacity-10 > div');

    gsap.set(animatedElements, { opacity: 0, y: 50, rotationX: -15 });
    gsap.set(bgDecorations, { opacity: 0, scale: 0.5, rotation: -180 });

    // Floating background animations
    bgDecorations.forEach((circle, index) => {
        const delay = index * 0.5;
        const floatX = (Math.random() - 0.5) * 40;
        const floatY = (Math.random() - 0.5) * 30;
        const floatDuration = 3 + Math.random() * 2;

        gsap.timeline({ repeat: -1, yoyo: true, delay })
            .to(circle, { x: floatX, y: floatY, duration: floatDuration, ease: "power1.inOut" });

        gsap.to(circle, { rotation: 360, duration: 8 + Math.random() * 4, ease: "none", repeat: -1, delay });
        circle.setAttribute('data-natural-animation', 'true');
    });

    // Initialize background shapes
    initSectionBackgroundAnimations('.hero-section', ANIMATION_CONFIG.hero);

    // Initialize typewriter
    initTypingEffect();

    // Initialize quick fact lighting
    initQuickFactLighting();

    // Hero entrance animation
    const tl = gsap.timeline();

    tl.to(animatedElements, {
        opacity: 1,
        y: 0,
        rotationX: 0,
        scale: 1,
        duration: 0.8,
        stagger: 0.1,
        ease: "back.out(1.7)"
    })
    .to(bgDecorations, {
        opacity: 0.1,
        scale: 1,
        rotation: 0,
        duration: 1,
        stagger: 0.1
    }, "-=0.6");
}

// Typewriter effect
let typingEffectInitialized = false;

function initTypingEffect() {
    if (typingEffectInitialized) return;

    const typewriterElement = document.querySelector('.typewriter');
    if (!typewriterElement) return;

    const text = typewriterElement.textContent;
    typewriterElement.textContent = '';
    typewriterElement.style.color = 'transparent';

    const cursor = document.createElement('span');
    cursor.className = 'typing-cursor';
    Object.assign(cursor.style, {
        display: 'inline-block',
        width: '2px',
        height: '1.2em',
        backgroundColor: 'var(--color-primary-light)',
        marginLeft: '2px',
        verticalAlign: 'text-bottom'
    });

    typewriterElement.appendChild(cursor);

    gsap.to(cursor, {
        opacity: 0,
        duration: 0.7,
        ease: "power2.inOut",
        yoyo: true,
        repeat: -1
    });

    const chars = text.split('');
    const timeline = gsap.timeline({
        delay: 0.5,
        repeat: -1,
        onRepeat: () => {
            typewriterElement.textContent = '';
            typewriterElement.appendChild(cursor);
            typewriterElement.style.color = 'transparent';
        }
    });

    chars.forEach((char, index) => {
        timeline.to(typewriterElement, {
            duration: 0.05,
            onUpdate: function() {
                const textContent = chars.slice(0, index + 1).join('');
                typewriterElement.textContent = textContent;
                typewriterElement.appendChild(cursor);
                typewriterElement.style.color = 'inherit';
            }
        });
    });

    timeline.to(typewriterElement, { duration: 2 });

    const reversedChars = [...chars].reverse();
    reversedChars.forEach((char, index) => {
        timeline.to(typewriterElement, {
            duration: 0.03,
            onUpdate: function() {
                const textContent = reversedChars.slice(index + 1).reverse().join('');
                typewriterElement.textContent = textContent;
                typewriterElement.appendChild(cursor);
            }
        });
    });

    timeline.to(typewriterElement, { duration: 1 });
    typingEffectInitialized = true;
}

// Quick fact lighting
function initQuickFactLighting() {
    const quickFactCards = document.querySelectorAll('.quick-fact-card');

    quickFactCards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = ((e.clientX - rect.left) / rect.width) * 100;
            const y = ((e.clientY - rect.top) / rect.height) * 100;

            card.style.setProperty('--mouse-x', `${x}%`);
            card.style.setProperty('--mouse-y', `${y}%`);
        });

        card.addEventListener('mouseleave', () => {
            card.style.setProperty('--mouse-x', '50%');
            card.style.setProperty('--mouse-y', '50%');
        });
    });
}

// Background shapes
function createAndAnimateDiagonalLines(container, options = {}) {
    const config = {
        count: 4,
        background: 'linear-gradient(45deg, transparent, var(--color-primary-light), transparent)',
        height: 3,
        width: 1200,
        opacity: 0.4,
        scaleX: 4.0,
        duration: 4,
        rotationDuration: 8,
        ...options
    };

    const lines = Array.from({ length: config.count }, (_, i) => {
        const line = document.createElement('div');
        const pos = Utils.randomPosition();
        Object.assign(line.style, {
            position: 'absolute',
            background: config.background,
            height: config.height + 'px',
            width: config.width + 'px',
            opacity: '0',
            zIndex: '1',
            left: pos.x + '%',
            top: pos.y + '%',
            transform: `rotate(${Math.random() * 360}deg)`,
            transformOrigin: 'center center'
        });
        line.className = 'diagonal-line';
        container.appendChild(line);
        return line;
    });

    lines.forEach((line, index) => {
        gsap.timeline({ repeat: -1, yoyo: true })
            .to(line, {
                opacity: config.opacity,
                scaleX: config.scaleX,
                duration: config.duration,
                delay: index * 0.8,
                ease: "power2.inOut"
            })
            .to(line, { rotation: '+=180', duration: config.rotationDuration, ease: "none" }, 0);
    });

    return lines;
}

function createAndAnimateSplineCurves(container, options = {}) {
    const config = {
        count: 3,
        size: 180,
        border: '3px solid var(--color-primary)',
        opacity: 0.6,
        scale: 1.2,
        duration: 6,
        rotationDuration: 10,
        ...options
    };

    const curves = Array.from({ length: config.count }, (_, i) => {
        const curve = document.createElement('div');
        const pos = Utils.randomPosition();
        Object.assign(curve.style, {
            position: 'absolute',
            width: config.size + 'px',
            height: config.size + 'px',
            border: config.border,
            borderRadius: '50%',
            opacity: '0',
            zIndex: '1',
            left: pos.x + '%',
            top: pos.y + '%'
        });
        curve.className = 'spline-curve';
        container.appendChild(curve);
        return curve;
    });

    curves.forEach((curve, index) => {
        gsap.timeline({ repeat: -1, yoyo: true })
            .to(curve, {
                opacity: config.opacity,
                scale: config.scale,
                borderRadius: '0%',
                duration: config.duration,
                delay: index * 1.2,
                ease: "power2.inOut"
            })
            .to(curve, { rotation: 360, duration: config.rotationDuration, ease: "none" }, 0);
    });

    return curves;
}

function initSectionBackgroundAnimations(sectionSelector, options = {}) {
    const section = document.querySelector(sectionSelector);
    if (!section) return;

    const shapesContainer = Utils.createContainer(
        section,
        '.morphing-shapes',
        'morphing-shapes absolute inset-0 pointer-events-none overflow-hidden'
    );

    shapesContainer.innerHTML = '';
    createAndAnimateDiagonalLines(shapesContainer, options.diagonalLines);
    createAndAnimateSplineCurves(shapesContainer, options.splineCurves);
}

// ========================================
// 9. PERFORMANCE OPTIMIZATIONS
// ========================================
document.addEventListener('visibilitychange', function() {
    if (document.hidden) {
        gsap.globalTimeline.pause();
    } else {
        gsap.globalTimeline.resume();
    }
});

window.addEventListener('resize', function() {
    ScrollTrigger.refresh();
});

// ========================================
// INITIALIZATION
// ========================================
document.addEventListener('DOMContentLoaded', function() {
    initAllAnimations();
});

// Fallback if DOM already loaded
if (document.readyState === 'complete' || document.readyState === 'interactive') {
    initAllAnimations();
}
