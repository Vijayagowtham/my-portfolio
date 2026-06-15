/**
 * Vijaya Gowtham Portfolio - Main JavaScript
 * Optimized for performance
 */

(function() {
  "use strict";


  /**
   * Apply .scrolled class to the body as the page is scrolled down
   */
  function toggleScrolled() {
    const selectBody = document.querySelector('body');
    const selectHeader = document.querySelector('#header');
    if (!selectHeader.classList.contains('scroll-up-sticky') && !selectHeader.classList.contains('sticky-top') && !selectHeader.classList.contains('fixed-top')) return;
    window.scrollY > 100 ? selectBody.classList.add('scrolled') : selectBody.classList.remove('scrolled');
  }

  document.addEventListener('scroll', toggleScrolled);
  window.addEventListener('load', toggleScrolled);

  /**
   * Mobile nav toggle
   */
  const mobileNavToggleBtn = document.querySelector('.mobile-nav-toggle');

  function mobileNavToggle() {
    const body = document.querySelector('body');
    body.classList.toggle('mobile-nav-active');
    mobileNavToggleBtn.classList.toggle('bi-list');
    mobileNavToggleBtn.classList.toggle('bi-x');
    
    // Prevent body scroll when mobile menu is open
    if (body.classList.contains('mobile-nav-active')) {
      body.style.overflow = 'hidden';
    } else {
      body.style.overflow = '';
    }
  }
  if (mobileNavToggleBtn) {
    mobileNavToggleBtn.addEventListener('click', mobileNavToggle);
  }

  /**
   * Hide mobile nav on click outside or on overlay
   */
  document.addEventListener('click', function(e) {
    if (document.querySelector('body').classList.contains('mobile-nav-active')) {
      if (!e.target.closest('.navmenu') && !e.target.closest('.mobile-nav-toggle') || e.target.classList.contains('mobile-nav-overlay')) {
        mobileNavToggle();
      }
    }
  });

  /**
   * Hide mobile nav on same-page/hash links
   */
  document.querySelectorAll('#navmenu a').forEach(navmenu => {
    navmenu.addEventListener('click', () => {
      if (document.querySelector('body').classList.contains('mobile-nav-active')) {
        mobileNavToggle();
      }
    });
  });

  /**
   * Toggle mobile nav dropdowns
   */
  document.querySelectorAll('.navmenu .toggle-dropdown').forEach(navmenu => {
    navmenu.addEventListener('click', function(e) {
      e.preventDefault();
      this.parentNode.classList.toggle('active');
      this.parentNode.nextElementSibling.classList.toggle('dropdown-active');
      e.stopImmediatePropagation();
    });
  });

  /**
   * Scroll top button
   */
  let scrollTop = document.querySelector('.scroll-top');

  function toggleScrollTop() {
    if (scrollTop) {
      window.scrollY > 100 ? scrollTop.classList.add('active') : scrollTop.classList.remove('active');
    }
  }
  if (scrollTop) {
    scrollTop.addEventListener('click', (e) => {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  window.addEventListener('load', toggleScrollTop);
  document.addEventListener('scroll', toggleScrollTop);

  /**
   * Animation on scroll function and init
   */
  function aosInit() {
    if (typeof AOS !== 'undefined') {
      AOS.init({
        duration: 600,
        easing: 'ease-in-out',
        once: true,
        mirror: false
      });
    }
  }
  window.addEventListener('load', aosInit);

  /**
   * Initiate Pure Counter
   */
  window.addEventListener('load', function() {
    if (typeof PureCounter !== 'undefined') {
      new PureCounter();
    }
  });

  /**
   * Init typed.js
   */
  window.addEventListener('load', function() {
    const selectTyped = document.querySelector('.typed');
    if (selectTyped && typeof Typed !== 'undefined') {
      let typed_strings = selectTyped.getAttribute('data-typed-items');
      typed_strings = typed_strings.split(',');
      new Typed('.typed', {
        strings: typed_strings,
        loop: true,
        typeSpeed: 100,
        backSpeed: 50,
        backDelay: 2000
      });
    }
  });

  /**
   * Initiate glightbox
   */
  window.addEventListener('load', function() {
    if (typeof GLightbox !== 'undefined') {
      GLightbox({ selector: '.glightbox' });
    }
  });

  /**
   * Init isotope layout and filters
   */
  window.addEventListener('load', function() {
    document.querySelectorAll('.isotope-layout').forEach(function(isotopeItem) {
      if (typeof Isotope === 'undefined' || typeof imagesLoaded === 'undefined') return;

      let layout = isotopeItem.getAttribute('data-layout') ?? 'masonry';
      let filter = isotopeItem.getAttribute('data-default-filter') ?? '*';
      let sort = isotopeItem.getAttribute('data-sort') ?? 'original-order';

      let initIsotope;
      imagesLoaded(isotopeItem.querySelector('.isotope-container'), function() {
        initIsotope = new Isotope(isotopeItem.querySelector('.isotope-container'), {
          itemSelector: '.isotope-item',
          layoutMode: layout,
          filter: filter,
          sortBy: sort
        });
      });

      isotopeItem.querySelectorAll('.isotope-filters li').forEach(function(filters) {
        filters.addEventListener('click', function() {
          isotopeItem.querySelector('.isotope-filters .filter-active').classList.remove('filter-active');
          this.classList.add('filter-active');
          initIsotope.arrange({ filter: this.getAttribute('data-filter') });
          if (typeof aosInit === 'function') aosInit();
        }, false);
      });
    });
  });

  /**
   * Correct scrolling position upon page load for URLs containing hash links.
   */
  window.addEventListener('load', function(e) {
    if (window.location.hash) {
      if (document.querySelector(window.location.hash)) {
        setTimeout(() => {
          let section = document.querySelector(window.location.hash);
          let scrollMarginTop = getComputedStyle(section).scrollMarginTop;
          window.scrollTo({
            top: section.offsetTop - parseInt(scrollMarginTop),
            behavior: 'smooth'
          });
        }, 100);
      }
    }
  });

  /**
   * Navmenu Scrollspy
   */
  let navmenulinks = document.querySelectorAll('.navmenu a');

  function navmenuScrollspy() {
    navmenulinks.forEach(navmenulink => {
      if (!navmenulink.hash) return;
      let section = document.querySelector(navmenulink.hash);
      if (!section) return;
      let position = window.scrollY + 200;
      if (position >= section.offsetTop && position <= (section.offsetTop + section.offsetHeight)) {
        document.querySelectorAll('.navmenu a.active').forEach(link => link.classList.remove('active'));
        navmenulink.classList.add('active');
      } else {
        navmenulink.classList.remove('active');
      }
    });
  }
  window.addEventListener('load', navmenuScrollspy);
  document.addEventListener('scroll', navmenuScrollspy);

  // ============================================================
  //  PAGE LOAD ANIMATION SYSTEM
  // ============================================================

  /**
   * Disable AOS on hero section elements to avoid conflicts
   */
  function disableHeroAOS() {
    const heroSection = document.querySelector('.hero-entrance');
    if (!heroSection) return;
    heroSection.querySelectorAll('[data-aos]').forEach(el => {
      el.removeAttribute('data-aos');
      el.removeAttribute('data-aos-delay');
    });
  }
  disableHeroAOS();

  /**
   * Trigger entrance animations immediately on load
   */
  window.addEventListener('load', function() {
    triggerEntranceAnimations();
  });

  /**
   * Orchestrate entrance animations
   */
  function triggerEntranceAnimations() {
    const header = document.querySelector('.header-entrance');
    if (header) header.classList.add('animate-in');

    const heroSection = document.querySelector('.hero-entrance');
    if (heroSection) heroSection.classList.add('animate-in');

    setTimeout(() => {
      document.querySelectorAll('.glow-orb').forEach(orb => orb.classList.add('active'));
    }, 800);
  }

  /**
   * Section Scroll Reveal using IntersectionObserver
   */
  function initSectionReveals() {
    const sections = document.querySelectorAll('.section-reveal');
    if (!sections.length) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          const titleEl = entry.target.querySelector('.section-title');
          if (titleEl) titleEl.classList.add('animate-line');
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.15,
      rootMargin: '0px 0px -50px 0px'
    });

    sections.forEach(section => observer.observe(section));
  }
  window.addEventListener('load', initSectionReveals);

  /**
   * Scroll Progress Indicator
   */
  function initScrollProgress() {
    const progressBar = document.getElementById('scroll-progress');
    if (!progressBar) return;

    function updateProgress() {
      const scrollTopPos = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = (scrollTopPos / docHeight) * 100;
      progressBar.style.width = progress + '%';
    }

    document.addEventListener('scroll', updateProgress);
    window.addEventListener('load', updateProgress);
  }
  initScrollProgress();

  /**
   * Smooth mouse parallax on hero image
   */
  function initHeroParallax() {
    const heroImage = document.querySelector('.hero .image-container');
    const heroSection = document.querySelector('.hero');
    if (!heroImage || !heroSection) return;

    heroSection.addEventListener('mousemove', (e) => {
      const rect = heroSection.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      heroImage.style.transform = `perspective(1000px) rotateY(${x * 5}deg) rotateX(${-y * 5}deg)`;
    });

    heroSection.addEventListener('mouseleave', () => {
      heroImage.style.transform = 'perspective(1000px) rotateY(0deg) rotateX(0deg)';
      heroImage.style.transition = 'transform 0.5s ease';
      setTimeout(() => { heroImage.style.transition = ''; }, 500);
    });
  }
  window.addEventListener('load', initHeroParallax);

  // ============================================================
  //  GLOBAL PARTICLE BACKGROUND SYSTEM
  // ============================================================

  (function() {
    const canvas = document.getElementById('global-particles-bg');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    let W, H, particles = [], sparks = [], raf;
    const isMobile = window.innerWidth < 600;
    const COUNT = isMobile ? 40 : 80;
    const MAX_DIST = isMobile ? 100 : 150;
    const MOUSE_DIST = 180;

    const mouse = { x: -1000, y: -1000 };

    function resize() {
      W = canvas.width = window.innerWidth;
      H = canvas.height = document.documentElement.scrollHeight;
    }

    function rand(a, b) { return Math.random() * (b - a) + a; }

    class Particle {
      constructor() {
        this.x = rand(0, W);
        this.y = rand(0, H);
        this.r = rand(1, 2.5);
        this.vx = rand(-0.2, 0.2);
        this.vy = rand(-0.2, 0.2);
        this.baseAlpha = rand(0.3, 0.7);
      }
      update() {
        const scrollY = window.scrollY;
        const mouseY = mouse.y + scrollY;
        const dx = mouse.x - this.x;
        const dy = mouseY - this.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < MOUSE_DIST && dist > 0) {
          const force = (MOUSE_DIST - dist) / MOUSE_DIST;
          this.x -= (dx / dist) * force * 0.5;
          this.y -= (dy / dist) * force * 0.5;
        }

        this.x += this.vx;
        this.y += this.vy;

        if (this.x < -10) this.x = W + 10;
        if (this.x > W + 10) this.x = -10;
        if (this.y < -10) this.y = H + 10;
        if (this.y > H + 10) this.y = -10;
      }
      draw() {
        const screenY = this.y - window.scrollY;
        if (screenY < -50 || screenY > window.innerHeight + 50) return;

        ctx.beginPath();
        ctx.arc(this.x, screenY, this.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(56, 189, 248, ${this.baseAlpha})`;
        ctx.fill();
      }
    }

    class Spark {
      constructor(p1, p2) {
        this.p1 = p1; this.p2 = p2;
        this.progress = 0;
        this.speed = rand(0.015, 0.035);
      }
      update() { this.progress += this.speed; return this.progress >= 1; }
      draw() {
        const x = this.p1.x + (this.p2.x - this.p1.x) * this.progress;
        const y = this.p1.y + (this.p2.y - this.p1.y) * this.progress;
        const screenY = y - window.scrollY;
        if (screenY < -50 || screenY > window.innerHeight + 50) return;

        ctx.beginPath();
        ctx.arc(x, screenY, 2, 0, Math.PI * 2);
        ctx.fillStyle = '#ffffff';
        ctx.shadowBlur = 10;
        ctx.shadowColor = '#0ea5e9';
        ctx.fill();
        ctx.shadowBlur = 0;
      }
    }

    function init() {
      resize();
      particles = [];
      sparks = [];
      for (let i = 0; i < COUNT; i++) particles.push(new Particle());
    }

    let frameCount = 0;
    function draw() {
      frameCount++;
      // Throttle to ~30fps for performance
      if (frameCount % 2 !== 0) {
        raf = requestAnimationFrame(draw);
        return;
      }

      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw connections
      ctx.lineWidth = 0.6;
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const screenYi = particles[i].y - window.scrollY;
          const screenYj = particles[j].y - window.scrollY;
          if (screenYi < -50 || screenYi > window.innerHeight + 50) continue;
          if (screenYj < -50 || screenYj > window.innerHeight + 50) continue;

          const dx = particles[i].x - particles[j].x;
          const dy = screenYi - screenYj;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < MAX_DIST) {
            const alpha = (1 - dist / MAX_DIST) * 0.15;
            ctx.beginPath();
            ctx.strokeStyle = `rgba(56, 189, 248, ${alpha})`;
            ctx.moveTo(particles[i].x, screenYi);
            ctx.lineTo(particles[j].x, screenYj);
            ctx.stroke();

            if (Math.random() < 0.0005) {
              sparks.push(new Spark(particles[i], particles[j]));
            }
          }
        }
      }

      // Draw mouse connections
      if (mouse.x > 0) {
        for (let i = 0; i < particles.length; i++) {
          const screenY = particles[i].y - window.scrollY;
          const dx = particles[i].x - mouse.x;
          const dy = screenY - mouse.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < MOUSE_DIST) {
            const alpha = (1 - dist / MOUSE_DIST) * 0.25;
            ctx.beginPath();
            ctx.strokeStyle = `rgba(167, 139, 250, ${alpha})`;
            ctx.moveTo(particles[i].x, screenY);
            ctx.lineTo(mouse.x, mouse.y);
            ctx.stroke();
          }
        }
      }

      particles.forEach(p => { p.update(); p.draw(); });

      sparks = sparks.filter(s => {
        const done = s.update();
        if (!done) s.draw();
        return !done;
      });

      raf = requestAnimationFrame(draw);
    }

    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        cancelAnimationFrame(raf);
      } else {
        raf = requestAnimationFrame(draw);
      }
    });

    window.addEventListener('resize', () => { resize(); });
    window.addEventListener('mousemove', (e) => { mouse.x = e.clientX; mouse.y = e.clientY; });
    window.addEventListener('mouseleave', () => { mouse.x = -1000; mouse.y = -1000; });

    init();
    draw();
  })();

})();