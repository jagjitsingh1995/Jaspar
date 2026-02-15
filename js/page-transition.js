function initPageTransitions() {
  const overlay = document.querySelector('.page-transition-overlay');
  if (!overlay || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    document.body.classList.remove('loading');
    return;
  }

  // Entry animation: reveal the page
  gsap.set(overlay, { scaleY: 1, transformOrigin: 'top' });
  gsap.to(overlay, {
    scaleY: 0,
    duration: CONFIG.duration.pageTransition,
    ease: CONFIG.easing.sharp,
    onComplete: () => {
      document.body.classList.remove('loading');
    },
  });

  // Intercept internal links for exit animation
  document.querySelectorAll('a[href]').forEach(link => {
    const href = link.getAttribute('href');

    // Only intercept local page links
    if (
      !href ||
      href.startsWith('#') ||
      href.startsWith('http') ||
      href.startsWith('mailto:') ||
      href.startsWith('tel:') ||
      link.hasAttribute('target')
    ) {
      return;
    }

    link.addEventListener('click', e => {
      e.preventDefault();

      // Exit wipe animation
      gsap.set(overlay, { scaleY: 0, transformOrigin: 'bottom' });
      gsap.to(overlay, {
        scaleY: 1,
        duration: CONFIG.duration.pageTransition,
        ease: CONFIG.easing.sharp,
        onComplete: () => {
          window.location.href = href;
        },
      });
    });
  });
}
