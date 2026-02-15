// Safety fallback: always show the page after 2 seconds even if JS fails
setTimeout(function () {
  document.body.classList.remove('loading');
}, 2000);

document.addEventListener('DOMContentLoaded', function () {
  try {
    // Initialize shared components
    initNav();
    if (typeof initSparkles === 'function') initSparkles();

    // Only run GSAP-dependent code if GSAP loaded
    if (typeof gsap !== 'undefined') {
      initPageTransitions();
      initScrollAnimations();
    } else {
      // No GSAP — just show the page immediately
      document.body.classList.remove('loading');
    }

    // Detect current page and initialize page-specific JS
    var path = window.location.pathname.split('/').pop() || 'index.html';
    var page = path.replace('.html', '');

    switch (page) {
      case 'index':
      case '':
        if (typeof initHome === 'function') initHome();
        break;
      case 'about':
        if (typeof initAbout === 'function') initAbout();
        break;
      case 'projects':
        if (typeof initGallery === 'function') initGallery();
        break;
      case 'contact':
        if (typeof initContact === 'function') initContact();
        break;
    }
  } catch (e) {
    console.error('Init error:', e);
    document.body.classList.remove('loading');
  }
});
