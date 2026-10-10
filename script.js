const header = document.querySelector('[data-header]');
const menuToggle = document.querySelector('[data-menu-toggle]');
const nav = document.querySelector('[data-nav]');

const updateHeader = () => header.classList.toggle('scrolled', window.scrollY > 24);
updateHeader();
window.addEventListener('scroll', updateHeader, { passive: true });

menuToggle.addEventListener('click', () => {
  const open = menuToggle.getAttribute('aria-expanded') === 'true';
  menuToggle.setAttribute('aria-expanded', String(!open));
  nav.classList.toggle('is-open', !open);
});

nav.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', () => {
    menuToggle.setAttribute('aria-expanded', 'false');
    nav.classList.remove('is-open');
  });
});

const slides = [...document.querySelectorAll('[data-slide]')];
const previousSlide = document.querySelector('[data-carousel-prev]');
const nextSlide = document.querySelector('[data-carousel-next]');
const carouselStatus = document.querySelector('[data-carousel-status] span');
let activeSlide = 0;

const showSlide = (index) => {
  if (!slides.length) return;
  activeSlide = (index + slides.length) % slides.length;
  slides.forEach((slide, slideIndex) => {
    slide.classList.toggle('is-active', slideIndex === activeSlide);
    slide.setAttribute('aria-hidden', String(slideIndex !== activeSlide));
  });
  carouselStatus.textContent = String(activeSlide + 1).padStart(2, '0');
};

if (slides.length) {
  previousSlide.addEventListener('click', () => showSlide(activeSlide - 1));
  nextSlide.addEventListener('click', () => showSlide(activeSlide + 1));

  document.querySelector('.hero').addEventListener('keydown', (event) => {
    if (event.key === 'ArrowLeft') showSlide(activeSlide - 1);
    if (event.key === 'ArrowRight') showSlide(activeSlide + 1);
  });

  showSlide(0);
}

const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const revealItems = document.querySelectorAll('.reveal');

if (reducedMotion || !('IntersectionObserver' in window)) {
  revealItems.forEach((item) => item.classList.add('is-visible'));
} else {
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
  revealItems.forEach((item) => revealObserver.observe(item));
}

const dialog = document.querySelector('[data-lightbox-dialog]');
const dialogImage = document.querySelector('[data-lightbox-image]');
const dialogCaption = document.querySelector('[data-lightbox-caption]');
const closeButton = document.querySelector('[data-lightbox-close]');
let activeTrigger = null;

const openLightbox = (trigger) => {
  if (!dialog || dialog.open) return;
  activeTrigger = trigger;
  dialogImage.src = trigger.dataset.lightbox;
  dialogImage.alt = trigger.dataset.caption || 'Expanded project image';
  dialogCaption.textContent = trigger.dataset.caption || '';
  document.body.classList.add('lightbox-open');
  dialog.showModal();
};

const closeLightbox = () => {
  if (!dialog || !dialog.open || dialog.classList.contains('is-closing')) return;
  if (reducedMotion) {
    dialog.close();
    return;
  }
  dialog.classList.add('is-closing');
  window.setTimeout(() => dialog.close(), 200);
};

document.querySelectorAll('[data-lightbox]').forEach((trigger) => {
  trigger.addEventListener('click', () => openLightbox(trigger));
  if (trigger.getAttribute('role') === 'button') {
    trigger.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        openLightbox(trigger);
      }
    });
  }
});

if (dialog) {
  closeButton.addEventListener('click', closeLightbox);
  dialog.addEventListener('click', (event) => {
    if (event.target === dialog) closeLightbox();
  });
  dialog.addEventListener('cancel', (event) => {
    event.preventDefault();
    closeLightbox();
  });
  dialog.addEventListener('close', () => {
    dialog.classList.remove('is-closing');
    document.body.classList.remove('lightbox-open');
    dialogImage.removeAttribute('src');
    if (activeTrigger) activeTrigger.focus({ preventScroll: true });
    activeTrigger = null;
  });
}
