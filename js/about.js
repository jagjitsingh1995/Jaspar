function initAbout() {
  initAboutHero();
  initTimeline();
  initCounters(); // Reuse from home.js
}

function initAboutHero() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const tl = gsap.timeline({ delay: 0.6 });
  tl.from('.page-hero__title', {
    opacity: 0,
    y: 30,
    duration: 0.6,
    ease: CONFIG.easing.smooth,
  })
    .from('.page-hero .gold-line', {
      scaleX: 0,
      transformOrigin: 'left',
      duration: 0.5,
      ease: CONFIG.easing.sharp,
    }, '-=0.3')
    .from('.page-hero__subtitle', {
      opacity: 0,
      y: 20,
      duration: 0.5,
      ease: CONFIG.easing.smooth,
    }, '-=0.2')
    .from('.breadcrumb', {
      opacity: 0,
      duration: 0.4,
      ease: CONFIG.easing.smooth,
    }, '-=0.2');
}

function initTimeline() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const timelineLine = document.querySelector('.timeline__line');
  if (!timelineLine) return;

  // Animate the vertical line drawing down
  gsap.from(timelineLine, {
    scaleY: 0,
    transformOrigin: 'top',
    duration: 1.5,
    ease: CONFIG.easing.smooth,
    scrollTrigger: {
      trigger: '.timeline',
      start: 'top 70%',
      once: true,
    },
  });

  // Animate timeline items alternating left/right
  document.querySelectorAll('.timeline__item').forEach((item, i) => {
    const direction = i % 2 === 0 ? -40 : 40;
    gsap.from(item, {
      opacity: 0,
      x: direction,
      duration: 0.6,
      ease: CONFIG.easing.smooth,
      scrollTrigger: {
        trigger: item,
        start: 'top 80%',
        once: true,
      },
    });
  });
}
