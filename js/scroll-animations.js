function initScrollAnimations() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;

  gsap.registerPlugin(ScrollTrigger);

  // Fade up
  document.querySelectorAll('.anim-fade-up').forEach(el => {
    gsap.from(el, {
      opacity: 0,
      y: 40,
      duration: CONFIG.duration.slow,
      ease: CONFIG.easing.smooth,
      scrollTrigger: {
        trigger: el,
        start: CONFIG.scroll.triggerStart,
        once: true,
      },
    });
  });

  // Fade left
  document.querySelectorAll('.anim-fade-left').forEach(el => {
    gsap.from(el, {
      opacity: 0,
      x: -40,
      duration: CONFIG.duration.slow,
      ease: CONFIG.easing.smooth,
      scrollTrigger: {
        trigger: el,
        start: CONFIG.scroll.triggerStart,
        once: true,
      },
    });
  });

  // Fade right
  document.querySelectorAll('.anim-fade-right').forEach(el => {
    gsap.from(el, {
      opacity: 0,
      x: 40,
      duration: CONFIG.duration.slow,
      ease: CONFIG.easing.smooth,
      scrollTrigger: {
        trigger: el,
        start: CONFIG.scroll.triggerStart,
        once: true,
      },
    });
  });

  // Scale
  document.querySelectorAll('.anim-scale').forEach(el => {
    gsap.from(el, {
      opacity: 0,
      scale: 0.9,
      duration: CONFIG.duration.slow,
      ease: CONFIG.easing.bounce,
      scrollTrigger: {
        trigger: el,
        start: CONFIG.scroll.triggerStart,
        once: true,
      },
    });
  });

  // Clip-path reveal
  document.querySelectorAll('.anim-reveal').forEach(el => {
    gsap.fromTo(el,
      { clipPath: 'inset(0 100% 0 0)' },
      {
        clipPath: 'inset(0 0% 0 0)',
        duration: CONFIG.duration.slow,
        ease: CONFIG.easing.sharp,
        scrollTrigger: {
          trigger: el,
          start: CONFIG.scroll.triggerStart,
          once: true,
        },
      }
    );
  });

  // Stagger children
  document.querySelectorAll('.anim-stagger').forEach(container => {
    gsap.from(container.children, {
      opacity: 0,
      y: 30,
      duration: CONFIG.duration.base,
      ease: CONFIG.easing.smooth,
      stagger: CONFIG.scroll.staggerDelay,
      scrollTrigger: {
        trigger: container,
        start: CONFIG.scroll.triggerStart,
        once: true,
      },
    });
  });

  // Parallax backgrounds
  document.querySelectorAll('.parallax-bg').forEach(el => {
    gsap.to(el, {
      yPercent: -20,
      ease: 'none',
      scrollTrigger: {
        trigger: el.parentElement,
        start: 'top bottom',
        end: 'bottom top',
        scrub: true,
      },
    });
  });
}
