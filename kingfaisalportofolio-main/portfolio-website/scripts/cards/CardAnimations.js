export function initCardAnimations() {
  const cards = document.querySelectorAll('.service-card, .project-card, .stat-card, .expertise-item');
  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2, rootMargin: '0px 0px -10% 0px' });
  cards.forEach(c => io.observe(c));
}