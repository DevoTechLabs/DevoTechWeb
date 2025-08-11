// src/utils/smoothScroll.js
export function smoothScrollToId(id, { offset = 80, container = window } = {}) {
  const el = document.getElementById(id);
  if (!el) return;

  // If you're scrolling the window
  if (container === window) {
    const y = el.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top: y, behavior: 'smooth' });
    return;
  }

  // If you’re scrolling a specific container (e.g., a scrolling <main>)
  const y = el.offsetTop - offset;
  container.scrollTo({ top: y, behavior: 'smooth' });
}
