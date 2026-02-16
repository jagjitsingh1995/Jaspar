function initNav() {
  const navbar = document.querySelector('.navbar');
  const hamburger = document.querySelector('.hamburger');
  const mobileNav = document.querySelector('.mobile-nav');

  if (!navbar) return;

  // Back to top button
  const backToTop = document.querySelector('.back-to-top');

  // Sticky header + back-to-top visibility
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
    if (backToTop) {
      backToTop.classList.toggle('visible', window.scrollY > 400);
    }
  });

  // Check on load
  if (window.scrollY > 50) {
    navbar.classList.add('scrolled');
  }

  if (backToTop) {
    backToTop.classList.toggle('visible', window.scrollY > 400);
    backToTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // Hamburger toggle
  if (hamburger && mobileNav) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('active');
      mobileNav.classList.toggle('open');
      document.body.style.overflow = mobileNav.classList.contains('open') ? 'hidden' : '';
    });

    // Close mobile nav on link click
    mobileNav.querySelectorAll('.mobile-nav__link').forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        mobileNav.classList.remove('open');
        document.body.style.overflow = '';
      });
    });
  }

  // Set active link based on current page
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.navbar__link, .mobile-nav__link').forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });
}
