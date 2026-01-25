export function initCards() {
  const cards = document.querySelectorAll('.service-card, .project-card, .stat-card, .expertise-item');
  cards.forEach(c => {
    if (!c.hasAttribute('tabindex')) c.setAttribute('tabindex', '0');
  });
}