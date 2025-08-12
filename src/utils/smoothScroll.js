// src/utils/smoothScroll.js
function getHeaderOffset() {
  const v = getComputedStyle(document.documentElement).getPropertyValue('--header-h');
  const n = parseFloat(v);
  return Number.isFinite(n) ? n + 12 : 90; // matches your scroll-margin extra
}

export function smoothScrollToId(id, { offset = getHeaderOffset() } = {}) {
  const el = document.getElementById(id);
  if (!el) return;

  const prefersReduce = window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches;
  const start = window.scrollY;
  const end   = el.getBoundingClientRect().top + start - offset;
  const dist  = end - start;

  if (Math.abs(dist) < 1 || prefersReduce) {
    window.scrollTo(0, end);
    return;
  }

  const dur = 650; // ms
  const ease = t => (t < 0.5 ? 4*t*t*t : 1 - Math.pow(-2*t + 2, 3)/2); // easeInOutCubic

  let t0 = null, cancelled = false;
  const cancel = () => { cancelled = true; };
  window.addEventListener('wheel', cancel, { passive: true, once: true });
  window.addEventListener('touchmove', cancel, { passive: true, once: true });
  window.addEventListener('keydown', cancel, { once: true });
  window.addEventListener('resize', cancel, { once: true });

  function step(ts){
    if (cancelled) return;
    if (t0 == null) t0 = ts;
    const p = Math.min(1, (ts - t0)/dur);
    window.scrollTo(0, start + dist * ease(p));
    if (p < 1) requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}

export function onAnchorClick(e, options = {}) {
  const href = e.currentTarget.getAttribute('href');
  if (!href || !href.startsWith('#')) return;
  e.preventDefault();
  smoothScrollToId(href.slice(1), options);
  history.replaceState(null, '', href); // keep URL hash in sync without a native jump
}
