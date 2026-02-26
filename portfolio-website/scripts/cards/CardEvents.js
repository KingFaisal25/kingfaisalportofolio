export function initCardEvents() {
  ['.services-grid', '.projects-grid'].forEach(sel => {
    const container = document.querySelector(sel);
    if (!container) return;
    container.addEventListener('mouseover', e => {
      const link = e.target.closest('.project-link, .service-cta');
      if (link) link.style.transform = 'translateY(-2px) scale(1.02)';
    });
    container.addEventListener('mouseout', e => {
      const link = e.target.closest('.project-link, .service-cta');
      if (link) link.style.transform = '';
    });
    container.addEventListener('focusin', e => {
      const card = e.target.closest('.service-card, .project-card');
      if (card) card.classList.add('focused');
    });
    container.addEventListener('focusout', e => {
      const card = e.target.closest('.service-card, .project-card');
      if (card) card.classList.remove('focused');
    });
  });
}