/**
 * Lightweight, High-Performance Canvas Particle System
 * Designed for a premium, cinematic background effect.
 */
(function() {
  const canvas = document.getElementById('global-particles-bg');
  if (!canvas) return;

  const ctx = canvas.getContext('2d', { alpha: true });
  
  let width, height;
  let particles = [];
  
  // Mouse tracking
  let mouse = { x: null, y: null, radius: 150 };
  
  // Configuration
  const config = {
    particleCount: window.innerWidth < 768 ? 40 : 80,
    baseColor: 'rgba(167, 139, 250, 0.6)', // matches the purple theme #a78bfa
    lineColor: 'rgba(167, 139, 250, 0.15)',
    maxDistance: 120, // Max distance to draw lines
    minSize: 1,
    maxSize: 3,
    baseSpeed: 0.5
  };

  function resize() {
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;
  }

  window.addEventListener('resize', () => {
    resize();
    initParticles();
  });

  window.addEventListener('mousemove', (e) => {
    mouse.x = e.x;
    mouse.y = e.y;
  });
  
  // Optional: clear mouse when leaving window
  window.addEventListener('mouseout', () => {
    mouse.x = null;
    mouse.y = null;
  });

  class Particle {
    constructor() {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.size = Math.random() * (config.maxSize - config.minSize) + config.minSize;
      
      // Random velocity
      const angle = Math.random() * Math.PI * 2;
      this.vx = Math.cos(angle) * config.baseSpeed;
      this.vy = Math.sin(angle) * config.baseSpeed;
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;

      // Bounce off edges smoothly
      if (this.x < 0 || this.x > width) this.vx *= -1;
      if (this.y < 0 || this.y > height) this.vy *= -1;

      // Mouse interaction (dodge the mouse)
      if (mouse.x != null && mouse.y != null) {
        let dx = mouse.x - this.x;
        let dy = mouse.y - this.y;
        let distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < mouse.radius) {
          const forceDirectionX = dx / distance;
          const forceDirectionY = dy / distance;
          
          // Subtle push away from cursor
          const force = (mouse.radius - distance) / mouse.radius;
          this.x -= forceDirectionX * force * 2;
          this.y -= forceDirectionY * force * 2;
        }
      }
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = config.baseColor;
      
      // Subtle glow
      ctx.shadowBlur = 10;
      ctx.shadowColor = config.baseColor;
      ctx.fill();
      ctx.shadowBlur = 0; // Reset
    }
  }

  function initParticles() {
    particles = [];
    config.particleCount = window.innerWidth < 768 ? 40 : 80;
    for (let i = 0; i < config.particleCount; i++) {
      particles.push(new Particle());
    }
  }

  function connectParticles() {
    for (let a = 0; a < particles.length; a++) {
      for (let b = a; b < particles.length; b++) {
        let dx = particles[a].x - particles[b].x;
        let dy = particles[a].y - particles[b].y;
        let distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < config.maxDistance) {
          // Dynamic opacity based on distance
          const opacity = 1 - (distance / config.maxDistance);
          ctx.beginPath();
          ctx.strokeStyle = `rgba(167, 139, 250, ${opacity * 0.3})`; // Using theme color with dynamic alpha
          ctx.lineWidth = 1;
          ctx.moveTo(particles[a].x, particles[a].y);
          ctx.lineTo(particles[b].x, particles[b].y);
          ctx.stroke();
        }
      }
    }
  }

  function animate() {
    ctx.clearRect(0, 0, width, height);
    
    for (let i = 0; i < particles.length; i++) {
      particles[i].update();
      particles[i].draw();
    }
    connectParticles();
    
    requestAnimationFrame(animate);
  }

  // Initialization
  resize();
  initParticles();
  animate();

})();
