function initContact() {
  initContactHero();
  initFormValidation();
}

function initContactHero() {
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

function initFormValidation() {
  const form = document.querySelector('.contact-form');
  if (!form) return;

  const fields = form.querySelectorAll('[required]');
  const submitBtn = form.querySelector('.btn--primary');
  const successMsg = form.querySelector('.form-success');

  // Inline validation on blur
  fields.forEach(field => {
    field.addEventListener('blur', () => validateField(field));
    field.addEventListener('input', () => {
      if (field.classList.contains('invalid')) {
        validateField(field);
      }
    });
  });

  function validateField(field) {
    const value = field.value.trim();
    let valid = true;
    let message = '';

    if (!value) {
      valid = false;
      message = 'This field is required';
    } else if (field.type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      valid = false;
      message = 'Please enter a valid email address';
    } else if (field.type === 'tel' && value && !/^[\d\s\-+()]{7,}$/.test(value)) {
      valid = false;
      message = 'Please enter a valid phone number';
    }

    const errorEl = field.parentElement.querySelector('.field-error');

    if (!valid) {
      field.classList.add('invalid');
      field.classList.remove('valid');
      if (errorEl) errorEl.textContent = message;
    } else {
      field.classList.remove('invalid');
      field.classList.add('valid');
      if (errorEl) errorEl.textContent = '';
    }

    return valid;
  }

  // Form submission
  form.addEventListener('submit', async e => {
    e.preventDefault();

    // Validate all fields
    let allValid = true;
    fields.forEach(field => {
      if (!validateField(field)) allValid = false;
    });

    if (!allValid) return;

    // Show loading state
    submitBtn.disabled = true;
    submitBtn.textContent = 'Sending...';

    try {
      const response = await fetch(form.action, {
        method: 'POST',
        body: new FormData(form),
        headers: { Accept: 'application/json' },
      });

      if (response.ok) {
        form.reset();
        fields.forEach(f => f.classList.remove('valid'));
        if (successMsg) {
          successMsg.classList.add('visible');
          // Animate checkmark
          if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            gsap.from(successMsg, {
              opacity: 0,
              y: 20,
              duration: 0.5,
              ease: CONFIG.easing.smooth,
            });
          }
        }
      } else {
        alert('Something went wrong. Please try again.');
      }
    } catch {
      alert('Network error. Please check your connection and try again.');
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = 'Send Message';
    }
  });
}
