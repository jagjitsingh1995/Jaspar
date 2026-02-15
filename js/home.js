function initHome() {
  initHeroTimeline();
  initCounters();
  initTestimonials();
}

function initHeroTimeline() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const tl = gsap.timeline({ delay: 0.6 });

  tl.from('.hero__bg-pattern', {
    scale: 1.1,
    opacity: 0,
    duration: 1.2,
    ease: CONFIG.easing.smooth,
  })
    .from('.hero__label', {
      opacity: 0,
      y: 20,
      duration: 0.6,
      ease: CONFIG.easing.smooth,
    }, '-=0.6')
    .from('.hero__title span', {
      opacity: 0,
      y: 40,
      duration: 0.6,
      ease: CONFIG.easing.smooth,
      stagger: 0.15,
    }, '-=0.3')
    .from('.hero__subtitle', {
      opacity: 0,
      y: 20,
      duration: 0.5,
      ease: CONFIG.easing.smooth,
    }, '-=0.2')
    .from('.hero__buttons .btn', {
      opacity: 0,
      y: 20,
      duration: 0.5,
      ease: CONFIG.easing.smooth,
      stagger: 0.1,
    }, '-=0.2')
    .from('.hero__scroll-indicator', {
      opacity: 0,
      duration: 0.5,
      ease: CONFIG.easing.smooth,
    }, '-=0.1');
}

function initCounters() {
  const counters = document.querySelectorAll('[data-count]');
  if (!counters.length) return;

  counters.forEach(counter => {
    const target = parseInt(counter.getAttribute('data-count'), 10);
    const suffix = counter.getAttribute('data-suffix') || '';

    ScrollTrigger.create({
      trigger: counter,
      start: 'top 85%',
      once: true,
      onEnter: () => {
        gsap.to({ val: 0 }, {
          val: target,
          duration: 2,
          ease: CONFIG.easing.smooth,
          onUpdate: function () {
            counter.textContent = Math.round(this.targets()[0].val) + suffix;
          },
        });
      },
    });
  });
}

function initTestimonials() {
  const track = document.querySelector('.testimonial-track');
  const dots = document.querySelectorAll('.testimonial-dot');
  if (!track || !dots.length) return;

  let current = 0;
  const slides = track.querySelectorAll('.testimonial-slide');
  const total = slides.length;

  function goTo(index) {
    current = ((index % total) + total) % total;
    track.style.transform = `translateX(-${current * 100}%)`;
    dots.forEach((d, i) => d.classList.toggle('active', i === current));
  }

  dots.forEach((dot, i) => {
    dot.addEventListener('click', () => goTo(i));
  });

  // Auto-advance every 5 seconds
  let autoPlay = setInterval(() => goTo(current + 1), 5000);

  // Pause on hover
  const container = track.closest('.testimonials');
  if (container) {
    container.addEventListener('mouseenter', () => clearInterval(autoPlay));
    container.addEventListener('mouseleave', () => {
      autoPlay = setInterval(() => goTo(current + 1), 5000);
    });
  }
}
