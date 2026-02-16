function initPageTransitions() {
  var overlay = document.querySelector('.page-transition-overlay');
  if (!overlay || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    document.body.classList.remove('loading');
    return;
  }

  var directions = ['horizontal', 'vertical'];
  var staggerFromOptions = ['start', 'end', 'center', 'edges', 'random'];
  var easeOptions = ['power3.inOut', 'power4.inOut', 'expo.inOut', 'circ.inOut', 'back.inOut(1)'];
  var logoEaseIn = ['power2.out', 'back.out(1.4)', 'elastic.out(1, 0.5)'];
  var logoEaseOut = ['power2.in', 'power3.in', 'back.in(1.2)'];

  function pick(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
  }

  function randRange(min, max) {
    return min + Math.random() * (max - min);
  }

  function createLogo() {
    var logo = document.createElement('div');
    logo.className = 'transition-logo';
    logo.innerHTML = '<img src="assets/images/logos/logo.svg" alt="Jaspar Fabrication LTD"><div class="transition-logo__text">JASPAR<span>FABRICATION LTD</span></div>';
    return logo;
  }

  function setupSlices(direction, count) {
    overlay.innerHTML = '';
    overlay.className = 'page-transition-overlay ' + direction;
    for (var i = 0; i < count; i++) {
      var slice = document.createElement('div');
      slice.className = 'slice';
      overlay.appendChild(slice);
    }
    var logo = createLogo();
    overlay.appendChild(logo);
    return { slices: overlay.querySelectorAll('.slice'), logo: logo };
  }

  // ---- ENTRY ANIMATION ----
  var entryDir = pick(directions);
  var entrySliceCount = Math.floor(randRange(3, 8));
  var setup = setupSlices(entryDir, entrySliceCount);
  var slices = setup.slices;
  var logo = setup.logo;
  var isHorizontal = entryDir === 'horizontal';

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

  gsap.set(logo, { opacity: 1, scale: 1 });

  var entryTl = gsap.timeline();

  entryTl.to(logo, {
    scale: randRange(0.3, 0.7),
    opacity: 0,
    duration: randRange(0.3, 0.5),
    ease: pick(logoEaseOut),
  });

  entryTl.to(slices, {
    scaleY: isHorizontal ? 0 : undefined,
    scaleX: isHorizontal ? undefined : 0,
    duration: randRange(0.5, 0.8),
    ease: pick(easeOptions),
    stagger: {
      each: randRange(0.04, 0.12),
      from: pick(staggerFromOptions),
    },
    onComplete: function () {
      document.body.classList.remove('loading');
    },
  }, '-=0.2');

  // ---- EXIT ANIMATION (link clicks) ----
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

      var exitDir = pick(directions);
      var exitSliceCount = Math.floor(randRange(3, 8));
      var exitSetup = setupSlices(exitDir, exitSliceCount);
      var exitSlices = exitSetup.slices;
      var exitLogo = exitSetup.logo;
      var exitHorizontal = exitDir === 'horizontal';

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

      gsap.set(exitLogo, { opacity: 0, scale: randRange(0.3, 0.6) });

      overlay.style.pointerEvents = 'all';

      var exitTl = gsap.timeline();

      exitTl.to(exitSlices, {
        scaleY: exitHorizontal ? 1 : undefined,
        scaleX: exitHorizontal ? undefined : 1,
        duration: randRange(0.4, 0.7),
        ease: pick(easeOptions),
        stagger: {
          each: randRange(0.04, 0.1),
          from: pick(staggerFromOptions),
        },
      });

      exitTl.to(exitLogo, {
        opacity: 1,
        scale: 1,
        duration: randRange(0.3, 0.5),
        ease: pick(logoEaseIn),
        onComplete: function () {
          window.location.href = href;
        },
      }, '-=0.15');
    });
  });
}
