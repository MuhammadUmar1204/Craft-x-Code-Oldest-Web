// ================== ANIMATIONS ===================

// Check for reduced motion preference
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// GSAP page load animations (respects prefers-reduced-motion)
window.addEventListener('load', () => {
  if (window.gsap && !prefersReducedMotion) {
    gsap.from('.logo img', { x: -40, opacity: 0, duration: 1, ease: 'power2.out' });
    gsap.from('.logo h1', { x: -20, opacity: 0, duration: 1, delay: 0.1 });
    gsap.from('.hero h2', { y: 30, opacity: 0, duration: 0.9, delay: 0.2 });
    gsap.from('.hero p', { y: 30, opacity: 0, duration: 1, delay: 0.3 });
    gsap.from('.cta-row', { scale: 0.9, opacity: 0, duration: 0.8, delay: 0.5 });
  }
}); 

// Scroll-based animations
if (window.gsap && window.ScrollTrigger && !prefersReducedMotion) {
  gsap.utils.toArray('section').forEach(section => {
    gsap.from(section, {
      scrollTrigger: {
        trigger: section,
        start: 'top 85%',
        toggleClass: { targets: section, className: 'visible' }
      }
    });
  });

  // Course cards subtle entry animation
  gsap.from('.course-card', {
    scrollTrigger: {
      trigger: '.course-card',
      start: 'top 90%',
    },
    y: 40,
    opacity: 0,
    duration: 0.6,
    stagger: 0.15,
    ease: 'power2.out'
  });

  // Instructor image zoom-in on scroll
  gsap.from('.instructor img', {
    scrollTrigger: {
      trigger: '.instructor img',
      start: 'top 85%',
    },
    scale: 0.8,
    opacity: 0,
    duration: 0.8,
    ease: 'back.out(1.7)'
  });
}

// Neon border animations with scroll triggers
if (window.gsap && window.ScrollTrigger && !prefersReducedMotion) {
  // Top border: show only when at the very top
  ScrollTrigger.create({
    start: 0,
    end: 1, // only first pixel counts
    onUpdate: self => {
      if (self.scroll() === 0) {
        document.body.classList.remove('hide-top-border');
      } else {
        document.body.classList.add('hide-top-border');
      }
    }
  });

  ScrollTrigger.create({
    trigger: document.body,
    start: "bottom bottom",
    end: "bottom bottom",
    onEnter: () => document.body.classList.add('show-bottom-border'),
    onLeaveBack: () => document.body.classList.remove('show-bottom-border'),
    toggleActions: "play reverse play reverse"
  });
}

// FAQ Accordion with smooth animations
document.querySelectorAll('.faq-question').forEach(button => {
  button.addEventListener('click', () => {
    const expanded = button.getAttribute('aria-expanded') === 'true';
    button.setAttribute('aria-expanded', String(!expanded));

    const answer = button.nextElementSibling;
    if (!answer) return; // defensive: nothing to toggle

    if (!expanded) {
      // open answer with smooth height animation
      answer.style.maxHeight = answer.scrollHeight + "px";
      answer.style.paddingTop = "12px";
      answer.style.paddingBottom = "12px";
    } else {
      // close answer
      answer.style.maxHeight = 0;
      answer.style.paddingTop = "0";
      answer.style.paddingBottom = "0";
    }

    // Optional: smooth fade with GSAP if available and no reduced motion preference
    if (window.gsap && !prefersReducedMotion) {
      try {
        gsap.fromTo(answer, 
          { opacity: expanded ? 1 : 0 }, 
          { opacity: expanded ? 0 : 1, duration: 0.4 }
        );
      } catch(e) {
        // fail silently if GSAP can't animate the provided target
        console.warn('GSAP animation skipped for FAQ toggle', e);
      }
    }
  });
});

// Monitor for prefers-reduced-motion changes
window.matchMedia('(prefers-reduced-motion: reduce)').addEventListener('change', e => {
  if (e.matches) {
    // Disable all animations
    if (window.gsap && window.gsap.globalTimeline) {
      gsap.globalTimeline.pause();
    }
  } else {
    // Re-enable animations
    if (window.gsap && window.gsap.globalTimeline) {
      gsap.globalTimeline.resume();
    }
  }
});



