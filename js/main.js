/* ============================================================
   BHARAT DARSANAM — Main JavaScript
   Owner  : Gajendra Singh
   Mobile : +91 95113 33174
   ============================================================ */

// ── 1. NAVBAR: Scroll shadow + active link highlight ──────────
const navbar = document.getElementById('navbar');

window.addEventListener('scroll', () => {
  if (window.scrollY > 50) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
  highlightActiveLink();
  toggleScrollTopBtn();
});

function highlightActiveLink() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-links a[href^="#"]');
  let current = '';

  sections.forEach(section => {
    if (window.scrollY >= section.offsetTop - 100) {
      current = section.getAttribute('id');
    }
  });

  navLinks.forEach(link => {
    link.style.color = link.getAttribute('href') === `#${current}` ? 'var(--saffron)' : '';
  });
}

// ── 2. HAMBURGER MENU ─────────────────────────────────────────
const hamburger = document.getElementById('hamburger');
const navLinks  = document.getElementById('navLinks');

hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('open');
  navLinks.classList.toggle('open');
});

// Close menu on link click
navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('open');
    navLinks.classList.remove('open');
  });
});

// ── 3. SCROLL REVEAL ANIMATION ───────────────────────────────
const revealElements = document.querySelectorAll('.reveal');

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      // Stagger delay based on index within parent
      const siblings = Array.from(entry.target.parentElement.children);
      const index = siblings.indexOf(entry.target);
      entry.target.style.transitionDelay = `${index * 0.1}s`;
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });

revealElements.forEach(el => revealObserver.observe(el));

// ── 4. SCROLL TO TOP BUTTON ───────────────────────────────────
const scrollTopBtn = document.getElementById('scrollTop');

function toggleScrollTopBtn() {
  if (window.scrollY > 400) {
    scrollTopBtn.classList.add('visible');
  } else {
    scrollTopBtn.classList.remove('visible');
  }
}

scrollTopBtn.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

// ── 5. CONTACT FORM ───────────────────────────────────────────
const contactForm = document.getElementById('contactForm');

contactForm.addEventListener('submit', (e) => {
  e.preventDefault();

  const name    = document.getElementById('fname').value.trim();
  const phone   = document.getElementById('fphone').value.trim();
  const email   = document.getElementById('femail').value.trim();
  const pkg     = document.getElementById('fpkg').value;
  const message = document.getElementById('fmessage').value.trim();

  // Basic validation
  if (!name || !phone || !email || !pkg) {
    showFormMessage('❗ Please fill in all required fields.', 'error');
    return;
  }
  if (phone.length < 10 || phone.length > 15 || !/^\d+$/.test(phone)) {
    showFormMessage('❗ Please enter a valid 10-15 digit phone number.', 'error');
    return;
  }

  // Build WhatsApp message and redirect
  const waText = `Hello Gajendra Singh! 🙏\n\nI'm interested in a tour package.\n\n*Name:* ${name}\n*Phone:* ${phone}\n*Email:* ${email}\n*Package:* ${pkg}\n*Message:* ${message || 'No additional message.'}`;
  const waURL  = `https://wa.me/919511333174?text=${encodeURIComponent(waText)}`;

  showFormMessage('✅ Redirecting you to WhatsApp...', 'success');
  setTimeout(() => { window.open(waURL, '_blank'); }, 1000);
  contactForm.reset();
});

function showFormMessage(text, type) {
  let msg = document.getElementById('formMsg');
  if (!msg) {
    msg = document.createElement('p');
    msg.id = 'formMsg';
    msg.style.cssText = 'margin-top:12px; font-size:0.9rem; font-weight:600; padding:10px 14px; border-radius:8px;';
    contactForm.appendChild(msg);
  }
  msg.textContent = text;
  msg.style.background = type === 'success' ? '#d4edda' : '#f8d7da';
  msg.style.color       = type === 'success' ? '#155724' : '#721c24';
  setTimeout(() => { if (msg) msg.remove(); }, 4000);
}

// ── 6. PACKAGE BOOK BUTTON — WhatsApp pre-fill ───────────────
document.querySelectorAll('.pkg-book-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const pkgName = btn.getAttribute('data-pkg');
    const waText  = `Hello Gajendra Singh! 🙏\n\nI'm interested in booking the *${pkgName}* package.\n\nPlease share more details and availability.`;
    window.open(`https://wa.me/919511333174?text=${encodeURIComponent(waText)}`, '_blank');
  });
});

// ── 7. SMOOTH SCROLL for all internal links ──────────────────
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

// ── 8. STATS COUNTER ANIMATION ───────────────────────────────
const statsObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      animateCounters();
      statsObserver.disconnect();
    }
  });
}, { threshold: 0.5 });

const statsSection = document.querySelector('.hero-stats');
if (statsSection) statsObserver.observe(statsSection);

function animateCounters() {
  document.querySelectorAll('.stat-num[data-target]').forEach(el => {
    const target = parseInt(el.getAttribute('data-target'));
    const suffix = el.getAttribute('data-suffix') || '';
    let current = 0;
    const increment = Math.ceil(target / 60);
    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        el.textContent = target + suffix;
        clearInterval(timer);
      } else {
        el.textContent = current + suffix;
      }
    }, 25);
  });
}

// ── 9. HERO SLIDER ────────────────────────────────────────────
const slides     = document.querySelectorAll('.slide');
const dots       = document.querySelectorAll('.dot');
const prevBtn    = document.getElementById('sliderPrev');
const nextBtn    = document.getElementById('sliderNext');
let currentSlide = 0;
let sliderTimer;

function goToSlide(index) {
  slides[currentSlide].classList.remove('active');
  dots[currentSlide].classList.remove('active');
  currentSlide = (index + slides.length) % slides.length;
  slides[currentSlide].classList.add('active');
  dots[currentSlide].classList.add('active');
}

function startSlider() {
  sliderTimer = setInterval(() => goToSlide(currentSlide + 1), 5000);
}

function resetSlider() {
  clearInterval(sliderTimer);
  startSlider();
}

if (slides.length > 0) {
  if (prevBtn) prevBtn.addEventListener('click', () => { goToSlide(currentSlide - 1); resetSlider(); });
  if (nextBtn) nextBtn.addEventListener('click', () => { goToSlide(currentSlide + 1); resetSlider(); });
  dots.forEach(dot => {
    dot.addEventListener('click', () => {
      goToSlide(parseInt(dot.getAttribute('data-index')));
      resetSlider();
    });
  });
  startSlider();
}

// ── 10. GALLERY FILTER ───────────────────────────────────────
const filterBtns   = document.querySelectorAll('.gfilter');
const galleryItems = document.querySelectorAll('.gallery-item');

filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    const filter = btn.getAttribute('data-filter');
    galleryItems.forEach(item => {
      if (filter === 'all' || item.getAttribute('data-category') === filter) {
        item.classList.remove('hidden');
      } else {
        item.classList.add('hidden');
      }
    });
  });
});

// ── 11. GALLERY LIGHTBOX ─────────────────────────────────────
const lightbox        = document.getElementById('lightbox');
const lightboxImg     = document.getElementById('lightboxImg');
const lightboxCaption = document.getElementById('lightboxCaption');
const lightboxClose   = document.getElementById('lightboxClose');
const lightboxPrev    = document.getElementById('lightboxPrev');
const lightboxNext    = document.getElementById('lightboxNext');

let lightboxIndex = 0;
let visibleItems  = [];

function openLightbox(index) {
  visibleItems = Array.from(galleryItems).filter(i => !i.classList.contains('hidden'));
  lightboxIndex = index;
  showLightboxItem(lightboxIndex);
  lightbox.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function showLightboxItem(index) {
  const item      = visibleItems[index];
  const imgDiv    = item.querySelector('.gallery-img');
  const bg        = imgDiv.style.backgroundImage;
  const caption   = item.querySelector('.gallery-caption').textContent;
  lightboxImg.style.backgroundImage = bg || getComputedStyle(imgDiv).backgroundImage;
  lightboxCaption.textContent = caption;
}

function closeLightbox() {
  lightbox.classList.remove('open');
  document.body.style.overflow = '';
}

galleryItems.forEach((item, i) => {
  item.addEventListener('click', () => openLightbox(
    Array.from(galleryItems).filter(el => !el.classList.contains('hidden')).indexOf(item)
  ));
});

if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
lightbox && lightbox.addEventListener('click', (e) => { if (e.target === lightbox) closeLightbox(); });

if (lightboxPrev) lightboxPrev.addEventListener('click', (e) => {
  e.stopPropagation();
  lightboxIndex = (lightboxIndex - 1 + visibleItems.length) % visibleItems.length;
  showLightboxItem(lightboxIndex);
});
if (lightboxNext) lightboxNext.addEventListener('click', (e) => {
  e.stopPropagation();
  lightboxIndex = (lightboxIndex + 1) % visibleItems.length;
  showLightboxItem(lightboxIndex);
});

// Keyboard navigation
document.addEventListener('keydown', (e) => {
  if (!lightbox || !lightbox.classList.contains('open')) return;
  if (e.key === 'Escape')      closeLightbox();
  if (e.key === 'ArrowLeft')   { lightboxIndex = (lightboxIndex - 1 + visibleItems.length) % visibleItems.length; showLightboxItem(lightboxIndex); }
  if (e.key === 'ArrowRight')  { lightboxIndex = (lightboxIndex + 1) % visibleItems.length; showLightboxItem(lightboxIndex); }
});

// ── 12. SPLASH SCREEN ────────────────────────────────────────
// Sequence:
// 0.3s  → "Welcome to Bharat Darsanam" fades in
// 1.2s  → Logo bounces in
// 2.0s  → Typing starts: "Journeys to India's Soul" letter by letter
// ~4.4s → Typing complete + loader fills
// 5.2s  → Splash hides
const splash       = document.getElementById('splash');
const taglineEl    = document.getElementById('splashTagline');
const taglineText  = "Journeys to India's Soul";

function typeSplashTagline() {
  if (!taglineEl) return;
  taglineEl.classList.add('typing');
  let i = 0;
  const speed = 60; // ms per letter
  function typeNext() {
    if (i < taglineText.length) {
      taglineEl.textContent = taglineText.slice(0, i + 1);
      i++;
      setTimeout(typeNext, speed);
    }
    // typing done — cursor keeps blinking via CSS
  }
  typeNext();
}

if (splash) {
  document.body.style.overflow = 'hidden';

  // Start typing after logo has appeared (1.2s logo + 0.8s settle = 2.0s)
  setTimeout(typeSplashTagline, 2000);

  // Hide splash after full sequence completes
  setTimeout(() => {
    splash.classList.add('hidden');
    document.body.style.overflow = '';
  }, 5500);

  // Click anywhere to skip instantly
  splash.addEventListener('click', () => {
    splash.classList.add('hidden');
    document.body.style.overflow = '';
  });
}
