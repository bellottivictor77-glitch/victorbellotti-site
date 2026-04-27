/* =========================================================
   main.js — Victor Bellotti Advocacia
   ========================================================= */

document.addEventListener('DOMContentLoaded', () => {

  // ── 1. Header scroll behavior ────────────────────────────
  const header = document.querySelector('.header');
  const isHomePage = document.body.classList.contains('page-home');

  const onScroll = () => {
    if (header) header.classList.toggle('scrolled', window.scrollY > 60);
  };

  if (isHomePage) {
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }
  // Non-home: header is always navy via CSS default — no scrolled class needed

  // ── 2. Mobile menu ───────────────────────────────────────
  const hamburger = document.querySelector('.header__hamburger');
  const mobileMenu = document.querySelector('.mobile-menu');
  const mobileOverlay = document.querySelector('.mobile-menu__overlay');
  const mobileLinks = document.querySelectorAll('.mobile-menu__drawer a');

  const openMenu = () => {
    mobileMenu.classList.add('open');
    hamburger.classList.add('open');
    document.body.style.overflow = 'hidden';
    hamburger.setAttribute('aria-expanded', 'true');
  };

  const closeMenu = () => {
    mobileMenu.classList.remove('open');
    hamburger.classList.remove('open');
    document.body.style.overflow = '';
    hamburger.setAttribute('aria-expanded', 'false');
  };

  hamburger?.addEventListener('click', () => {
    mobileMenu.classList.contains('open') ? closeMenu() : openMenu();
  });

  mobileOverlay?.addEventListener('click', closeMenu);
  mobileLinks.forEach(link => link.addEventListener('click', closeMenu));

  // ── 3. Smooth scroll for anchor links ────────────────────
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', e => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      const headerH = header ? header.offsetHeight : 0;
      const top = target.getBoundingClientRect().top + window.scrollY - headerH;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });

  // ── 4. Scroll spy nav ────────────────────────────────────
  const navLinks = document.querySelectorAll('.header__nav a[href^="#"]');
  const sections = document.querySelectorAll('section[id]');

  const spyObserver = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute('id');
          navLinks.forEach(link => {
            link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
            link.setAttribute('aria-current', link.getAttribute('href') === `#${id}` ? 'page' : '');
          });
        }
      });
    },
    { rootMargin: '-40% 0px -55% 0px' }
  );

  sections.forEach(sec => spyObserver.observe(sec));

  // ── 5. FAQ Accordion ─────────────────────────────────────
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(item => {
    const trigger = item.querySelector('.faq-item__trigger');
    const body = item.querySelector('.faq-item__body');

    trigger?.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');

      faqItems.forEach(i => {
        i.classList.remove('open');
        i.querySelector('.faq-item__body').style.maxHeight = null;
        i.querySelector('.faq-item__trigger').setAttribute('aria-expanded', 'false');
      });

      if (!isOpen) {
        item.classList.add('open');
        body.style.maxHeight = body.scrollHeight + 'px';
        trigger.setAttribute('aria-expanded', 'true');
      }
    });
  });

  // ── 6. Fade-in on scroll ─────────────────────────────────
  const animateEls = document.querySelectorAll('[data-animate]');

  const fadeObserver = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          fadeObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 }
  );

  animateEls.forEach(el => fadeObserver.observe(el));

  // ── 7. Formulário → WhatsApp ─────────────────────────────
  const form = document.querySelector('#contact-form');

  form?.addEventListener('submit', e => {
    e.preventDefault();

    const name  = form.querySelector('[name="nome"]')?.value.trim() || '';
    const email = form.querySelector('[name="email"]')?.value.trim() || '';
    const phone = form.querySelector('[name="telefone"]')?.value.trim() || '';
    const msg   = form.querySelector('[name="mensagem"]')?.value.trim() || '';

    const text = [
      `Olá, Victor! Vim pelo site e gostaria de uma avaliação do meu caso.`,
      ``,
      `*Nome:* ${name}`,
      email ? `*E-mail:* ${email}` : '',
      phone ? `*Telefone:* ${phone}` : '',
      ``,
      `*Descrição do caso:*`,
      msg,
    ].filter(l => l !== null).join('\n');

    const waUrl = `https://wa.me/message/XHEBHNEV7BLTL1?text=${encodeURIComponent(text)}`;
    window.open(waUrl, '_blank', 'noopener,noreferrer');
  });

  // ── 8. Hero Slider — navegação por dots (sem auto-advance) ──
  const heroSlides = document.querySelectorAll('.hero-slide');
  const heroDots   = document.querySelectorAll('.hero-dot');

  if (heroSlides.length > 0) {
    let currentSlide = 0;

    function goToSlide(index) {
      heroSlides[currentSlide].classList.remove('active');
      if (heroDots[currentSlide]) heroDots[currentSlide].classList.remove('active');
      currentSlide = (index + heroSlides.length) % heroSlides.length;
      heroSlides[currentSlide].classList.add('active');
      if (heroDots[currentSlide]) heroDots[currentSlide].classList.add('active');
    }

    heroDots.forEach((dot, i) => {
      dot.addEventListener('click', () => goToSlide(i));
    });
  }

  // ── 9. Tab panels — click (sempre) + hover cleanup (desktop) ─
  const tabWraps = document.querySelectorAll('.qs-tab-wrap');
  const hasHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

  // Click funciona em todos os dispositivos
  tabWraps.forEach(wrap => {
    wrap.querySelector('.qs-tab')?.addEventListener('click', () => {
      const isOpen = wrap.classList.contains('is-open');
      tabWraps.forEach(w => w.classList.remove('is-open'));
      if (!isOpen) {
        wrap.classList.add('is-open');
        // Mobile: rola para mostrar o painel abaixo das tabs
        if (!hasHover) {
          const panel = wrap.querySelector('.qs-tab-panel');
          requestAnimationFrame(() => {
            panel?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
          });
        }
      }
    });
  });

  // Desktop: mouseenter limpa .is-open para não sobrepor com hover
  if (hasHover) {
    tabWraps.forEach(wrap => {
      wrap.addEventListener('mouseenter', () => {
        tabWraps.forEach(w => w.classList.remove('is-open'));
      });
    });
  }

  // Fecha ao clicar fora das tabs
  document.addEventListener('click', e => {
    if (!e.target.closest('.qs-tabs')) {
      tabWraps.forEach(w => w.classList.remove('is-open'));
    }
  });

  // ── Lucide icons init ────────────────────────────────────
  if (window.lucide) {
    lucide.createIcons();
  }
});
