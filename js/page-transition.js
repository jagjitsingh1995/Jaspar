function initPageTransitions() {
  var overlay = document.querySelector('.page-transition-overlay');
  if (!overlay || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    document.body.classList.remove('loading');
    return;
  }

  var SLICE_COUNT = 5;
  var directions = ['horizontal', 'vertical'];

  // Pick a random direction for each transition
  function setupSlices(direction) {
    overlay.innerHTML = '';
    overlay.className = 'page-transition-overlay ' + direction;
    for (var i = 0; i < SLICE_COUNT; i++) {
      var slice = document.createElement('div');
      slice.className = 'slice';
      overlay.appendChild(slice);
    }
    return overlay.querySelectorAll('.slice');
  }

  // Entry animation: reveal the page by collapsing slices
  var entryDir = directions[Math.floor(Math.random() * directions.length)];
  var slices = setupSlices(entryDir);
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

  // Animate slices out with stagger
  gsap.to(slices, {
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
  });

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
      var exitSlices = setupSlices(exitDir);
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

      overlay.style.pointerEvents = 'all';

      // Animate slices in to cover page
      gsap.to(exitSlices, {
        scaleY: exitHorizontal ? 1 : undefined,
        scaleX: exitHorizontal ? undefined : 1,
        duration: 0.5,
        ease: 'power3.inOut',
        stagger: {
          each: 0.06,
          from: 'random',
        },
        onComplete: function () {
          window.location.href = href;
        },
      });
    });
  });
}
