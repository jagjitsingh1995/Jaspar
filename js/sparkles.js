function initSparkles() {
  const canvas = document.getElementById('sparkles-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let particles = [];
  let mouseX = -100;
  let mouseY = -100;
  let isMoving = false;
  let moveTimeout;

  // Resize canvas to window
  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  // Track mouse
  document.addEventListener('mousemove', function (e) {
    mouseX = e.clientX;
    mouseY = e.clientY;
    isMoving = true;
    clearTimeout(moveTimeout);
    moveTimeout = setTimeout(function () { isMoving = false; }, 100);

    // Spawn particles on move
    for (var i = 0; i < 3; i++) {
      spawnParticle(mouseX, mouseY);
    }
  });

  function spawnParticle(x, y) {
    var angle = Math.random() * Math.PI * 2;
    var speed = Math.random() * 3 + 1;
    var size = Math.random() * 3 + 1;
    var life = Math.random() * 30 + 20;

    // Gold-ish colors to match welding sparks
    var colors = [
      '#d4af37', // gold-400
      '#e8c547', // gold-300
      '#c8a84e', // gold-500
      '#ff8c00', // orange spark
      '#ffaa33', // warm amber
      '#ffffff', // white-hot
    ];
    var color = colors[Math.floor(Math.random() * colors.length)];

    particles.push({
      x: x + (Math.random() - 0.5) * 8,
      y: y + (Math.random() - 0.5) * 8,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed + Math.random() * 1.5, // slight gravity bias
      size: size,
      life: life,
      maxLife: life,
      color: color,
      gravity: 0.08 + Math.random() * 0.04,
    });
  }

  function update() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (var i = particles.length - 1; i >= 0; i--) {
      var p = particles[i];

      p.x += p.vx;
      p.y += p.vy;
      p.vy += p.gravity; // gravity pulls sparks down
      p.vx *= 0.98; // air resistance
      p.life--;

      var alpha = p.life / p.maxLife;
      var currentSize = p.size * alpha;

      if (p.life <= 0 || currentSize < 0.1) {
        particles.splice(i, 1);
        continue;
      }

      // Draw glow
      ctx.save();
      ctx.globalAlpha = alpha * 0.4;
      ctx.fillStyle = p.color;
      ctx.shadowColor = p.color;
      ctx.shadowBlur = 8;
      ctx.beginPath();
      ctx.arc(p.x, p.y, currentSize * 2, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      // Draw core
      ctx.save();
      ctx.globalAlpha = alpha;
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.arc(p.x, p.y, currentSize, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }

    // Cap particles for performance
    if (particles.length > 200) {
      particles = particles.slice(-200);
    }

    requestAnimationFrame(update);
  }

  // Respect reduced motion
  if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    update();
  }
}
