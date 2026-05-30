(() => {
  const header = document.querySelector('.site-header');
  const toggle = document.querySelector('[data-menu-toggle]');
  const form = document.getElementById('contactForm');
  const submit = form?.querySelector('button[type="submit"]');
  const lang = document.documentElement.lang || 'en';

  const messages = {
    en: { sending: 'Sending your request…' },
    fr: { sending: 'Envoi en cours…' }
  };

  const t = messages[lang.startsWith('fr') ? 'fr' : 'en'];

  toggle?.addEventListener('click', () => {
    const isOpen = header?.classList.toggle('menu-open');
    toggle.setAttribute('aria-expanded', String(Boolean(isOpen)));
  });

  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', event => {
      const href = link.getAttribute('href');
      if (!href || href === '#') return;
      const target = document.querySelector(href);
      if (!target) return;
      event.preventDefault();
      header?.classList.remove('menu-open');
      toggle?.setAttribute('aria-expanded', 'false');
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });

  document.addEventListener('DOMContentLoaded', () => {
    const currentForm = document.getElementById('contactForm');
    if (currentForm) {
      ['utm_source','utm_medium','utm_campaign'].forEach(p => {
        const val = sessionStorage.getItem(p);
        if (val) {
          const existing = currentForm.querySelector(`input[name="${p}"]`);
          if (!existing) {
            const inp = document.createElement('input');
            inp.type = 'hidden';
            inp.name = p;
            inp.value = val;
            currentForm.appendChild(inp);
          }
        }
      });
    }
  });

  form?.addEventListener('submit', () => {
    if (submit) {
      submit.disabled = true;
      submit.textContent = t.sending;
    }
  });
})();
