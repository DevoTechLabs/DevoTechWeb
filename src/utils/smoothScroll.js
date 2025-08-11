// src/utils/smoothScroll.js
export function smoothScrollToId(id, { offset = 90, container = window } = {}) {
  const el = document.getElementById(id);
  if (!el) return;

  if (container === window) {
    const y = el.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top: y, behavior: 'smooth' });
    return;
  }
  const y = el.offsetTop - offset;
  container.scrollTo({ top: y, behavior: 'smooth' });
}

// Drop-in click handler for <a href="#...">
export function onAnchorClick(e, options = {}) {
  const href = e.currentTarget.getAttribute('href');
  if (!href || !href.startsWith('#')) return; // external link: let it pass
  e.preventDefault();
  const id = href.slice(1);
  smoothScrollToId(id, options);
  history.replaceState(null, '', href); // keep hash in URL (optional)
}
