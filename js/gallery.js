function initGallery() {
  initGalleryHero();
  initFilters();
  initBeforeAfter();
  initLightbox();
}

function initGalleryHero() {
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

/* ===== FILTERING ===== */
function initFilters() {
  const buttons = document.querySelectorAll('.filter-btn');
  const items = document.querySelectorAll('.gallery-item');

  if (!buttons.length || !items.length) return;

  // Entrance animation for gallery items
  // Uses onEnter callback so items stay visible by default — no blank page if ScrollTrigger misfires
  if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined' && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    ScrollTrigger.create({
      trigger: '.gallery-grid',
      start: 'top 85%',
      once: true,
      onEnter: function () {
        gsap.from(items, {
          opacity: 0,
          y: 30,
          duration: 0.5,
          ease: CONFIG.easing.smooth,
          stagger: 0.05,
          clearProps: 'opacity,transform',
        });
      },
    });
  }

  buttons.forEach(btn => {
    btn.addEventListener('click', () => {
      const filter = btn.getAttribute('data-filter');

      // Update active button
      buttons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      // Kill any pending animations on all items to prevent race conditions
      items.forEach(item => gsap.killTweensOf(item));

      // Filter items
      items.forEach(item => {
        const category = item.getAttribute('data-category');
        const match = filter === 'all' || category === filter;

        if (!match) {
          // Animate out
          gsap.to(item, {
            opacity: 0,
            scale: 0.8,
            duration: 0.3,
            ease: CONFIG.easing.smooth,
            onComplete: () => {
              item.classList.add('hidden');
            },
          });
        } else {
          item.classList.remove('hidden');
          gsap.to(item, {
            opacity: 1,
            scale: 1,
            duration: 0.4,
            ease: CONFIG.easing.smooth,
            delay: 0.05,
          });
        }
      });
    });
  });
}

/* ===== BEFORE/AFTER SLIDER ===== */
function initBeforeAfter() {
  document.querySelectorAll('.before-after').forEach(slider => {
    const afterEl = slider.querySelector('.before-after__after');
    const divider = slider.querySelector('.before-after__divider');
    const handle = slider.querySelector('.before-after__handle');
    if (!afterEl || !divider || !handle) return;

    let isDragging = false;

    function updatePosition(clientX) {
      const rect = slider.getBoundingClientRect();
      let percent = ((clientX - rect.left) / rect.width) * 100;
      percent = Math.max(2, Math.min(98, percent));

      afterEl.style.clipPath = `inset(0 0 0 ${percent}%)`;
      divider.style.left = `${percent}%`;
      handle.style.left = `${percent}%`;
    }

    // Mouse events
    slider.addEventListener('mousedown', e => {
      isDragging = true;
      updatePosition(e.clientX);
    });

    document.addEventListener('mousemove', e => {
      if (!isDragging) return;
      e.preventDefault();
      updatePosition(e.clientX);
    });

    document.addEventListener('mouseup', () => {
      isDragging = false;
    });

    // Touch events
    slider.addEventListener('touchstart', e => {
      isDragging = true;
      updatePosition(e.touches[0].clientX);
    }, { passive: true });

    slider.addEventListener('touchmove', e => {
      if (!isDragging) return;
      e.preventDefault();
      updatePosition(e.touches[0].clientX);
    }, { passive: false });

    slider.addEventListener('touchend', () => {
      isDragging = false;
    });

    // Auto-demo animation on scroll
    if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      ScrollTrigger.create({
        trigger: slider,
        start: 'top 75%',
        once: true,
        onEnter: () => {
          gsap.fromTo(
            { val: 50 },
            { val: 50 },
            {
              val: 30,
              duration: 0.8,
              ease: CONFIG.easing.smooth,
              yoyo: true,
              repeat: 1,
              onUpdate: function () {
                const v = this.targets()[0].val;
                afterEl.style.clipPath = `inset(0 0 0 ${v}%)`;
                divider.style.left = `${v}%`;
                handle.style.left = `${v}%`;
              },
            }
          );
        },
      });
    }
  });
}

/* ===== LIGHTBOX ===== */
function initLightbox() {
  const lightbox = document.querySelector('.lightbox');
  if (!lightbox) return;

  const closeBtn = lightbox.querySelector('.lightbox__close');
  const prevBtn = lightbox.querySelector('.lightbox__nav--prev');
  const nextBtn = lightbox.querySelector('.lightbox__nav--next');
  const titleEl = lightbox.querySelector('.lightbox__title');
  const categoryEl = lightbox.querySelector('.lightbox__category');
  const lightboxImg = lightbox.querySelector('.lightbox__image');

  const items = Array.from(document.querySelectorAll('.gallery-item'));
  let currentIndex = 0;
  let focusedBefore = null;

  function getVisibleItems() {
    return items.filter(item => !item.classList.contains('hidden'));
  }

  function open(index) {
    const visible = getVisibleItems();
    currentIndex = index;
    focusedBefore = document.activeElement;

    const item = visible[currentIndex];
    if (titleEl) titleEl.textContent = item.querySelector('.project-card__title')?.textContent || '';
    if (categoryEl) categoryEl.textContent = item.querySelector('.project-card__category')?.textContent || '';

    // Set lightbox image from the project card's img
    const cardImg = item.querySelector('.project-card__image');
    if (lightboxImg && cardImg) {
      lightboxImg.src = cardImg.src;
      lightboxImg.alt = cardImg.alt;
    }

    lightbox.classList.add('open');
    document.body.style.overflow = 'hidden';
    closeBtn?.focus();
  }

  function close() {
    lightbox.classList.remove('open');
    document.body.style.overflow = '';
    focusedBefore?.focus();
  }

  function navigate(direction) {
    const visible = getVisibleItems();
    currentIndex = ((currentIndex + direction) % visible.length + visible.length) % visible.length;
    open(currentIndex);
  }

  // Open on card click
  items.forEach(item => {
    item.addEventListener('click', () => {
      const visible = getVisibleItems();
      const idx = visible.indexOf(item);
      if (idx !== -1) open(idx);
    });
  });

  // Close
  closeBtn?.addEventListener('click', close);
  lightbox.addEventListener('click', e => {
    if (e.target === lightbox) close();
  });

  // Navigation
  prevBtn?.addEventListener('click', e => { e.stopPropagation(); navigate(-1); });
  nextBtn?.addEventListener('click', e => { e.stopPropagation(); navigate(1); });

  // Keyboard
  document.addEventListener('keydown', e => {
    if (!lightbox.classList.contains('open')) return;
    if (e.key === 'Escape') close();
    if (e.key === 'ArrowLeft') navigate(-1);
    if (e.key === 'ArrowRight') navigate(1);
  });

  // Focus trapping
  lightbox.addEventListener('keydown', e => {
    if (e.key !== 'Tab') return;
    const focusable = lightbox.querySelectorAll('button, [tabindex]');
    const first = focusable[0];
    const last = focusable[focusable.length - 1];

    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  });
}
