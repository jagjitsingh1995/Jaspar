function initPageTransitions() {
  var overlay = document.querySelector('.page-transition-overlay');
  if (!overlay || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    document.body.classList.remove('loading');
    return;
  }

  var SLICE_COUNT = 5;
  var directions = ['horizontal', 'vertical'];

  function createLogo() {
    var logo = document.createElement('div');
    logo.className = 'transition-logo';
    logo.innerHTML = '<img src="assets/images/logos/logo.svg" alt="Jaspar Fabrication LTD"><div class="transition-logo__text">JASPAR<span>FABRICATION LTD</span></div>';
    return logo;
  }

  // Pick a random direction for each transition
  function setupSlices(direction) {
    overlay.innerHTML = '';
    overlay.className = 'page-transition-overlay ' + direction;
    for (var i = 0; i < SLICE_COUNT; i++) {
      var slice = document.createElement('div');
      slice.className = 'slice';
      overlay.appendChild(slice);
    }
    var logo = createLogo();
    overlay.appendChild(logo);
    return { slices: overlay.querySelectorAll('.slice'), logo: logo };
  }

  // Entry animation: reveal the page by collapsing slices
  var entryDir = directions[Math.floor(Math.random() * directions.length)];
  var setup = setupSlices(entryDir);
  var slices = setup.slices;
  var logo = setup.logo;
  var isHorizontal = entryDir === 'horizontal';

  // Set slices to fully cover the page
  gsap.set(slices, {
    scaleY: isHorizontal ? 1 : undefined,
    scaleX: isHorizontal ? undefined : 1,
    transformOrigin: function (i) {
      if (isHorizontal) {
        return i % 2 === 0 ? 'top' : 'bottom';
      } else {
        return i % 2 === 0 ? 'left' : 'right';
      }
    },
  });

  // Show logo first, then collapse slices
  gsap.set(logo, { opacity: 1, scale: 1 });

  var entryTl = gsap.timeline();

  // Logo shrinks and fades out
  entryTl.to(logo, {
    scale: 0.5,
    opacity: 0,
    duration: 0.4,
    ease: 'power2.in',
  });

  // Slices collapse to reveal page
  entryTl.to(slices, {
    scaleY: isHorizontal ? 0 : undefined,
    scaleX: isHorizontal ? undefined : 0,
    duration: 0.6,
    ease: 'power3.inOut',
    stagger: {
      each: 0.08,
      from: 'random',
    },
    onComplete: function () {
      document.body.classList.remove('loading');
    },
  }, '-=0.2');

  // Intercept internal links for exit animation
  document.querySelectorAll('a[href]').forEach(function (link) {
    var href = link.getAttribute('href');

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

    link.addEventListener('click', function (e) {
      e.preventDefault();

      // Pick random direction for exit
      var exitDir = directions[Math.floor(Math.random() * directions.length)];
      var exitSetup = setupSlices(exitDir);
      var exitSlices = exitSetup.slices;
      var exitLogo = exitSetup.logo;
      var exitHorizontal = exitDir === 'horizontal';

      // Start slices collapsed
      gsap.set(exitSlices, {
        scaleY: exitHorizontal ? 0 : undefined,
        scaleX: exitHorizontal ? undefined : 0,
        transformOrigin: function (i) {
          if (exitHorizontal) {
            return i % 2 === 0 ? 'bottom' : 'top';
          } else {
            return i % 2 === 0 ? 'right' : 'left';
          }
        },
      });

      gsap.set(exitLogo, { opacity: 0, scale: 0.5 });

      overlay.style.pointerEvents = 'all';

      var exitTl = gsap.timeline();

      // Slices cover the page
      exitTl.to(exitSlices, {
        scaleY: exitHorizontal ? 1 : undefined,
        scaleX: exitHorizontal ? undefined : 1,
        duration: 0.5,
        ease: 'power3.inOut',
        stagger: {
          each: 0.06,
          from: 'random',
        },
      });

      // Logo scales up and appears
      exitTl.to(exitLogo, {
        opacity: 1,
        scale: 1,
        duration: 0.4,
        ease: 'power2.out',
        onComplete: function () {
          window.location.href = href;
        },
      }, '-=0.15');
    });
  });
}
