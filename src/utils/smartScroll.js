// easeInOutCubic
const ease = t => (t < 0.5 ? 4*t*t*t : 1 - Math.pow(-2*t + 2, 3)/2);

export function animateScrollTo(yTarget) {
  const yStart = window.pageYOffset;
  const distance = Math.abs(yTarget - yStart);
  const duration = Math.min(1400, Math.max(350, (distance / 1600) * 1000)); // ms
  const t0 = performance.now();

  function step(now) {
    const t = Math.min(1, (now - t0) / duration);
    const v = ease(t);
    window.scrollTo(0, yStart + (yTarget - yStart) * v);
    if (t < 1) requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}

export function onAnchorClick(e) {
  const href = e.currentTarget.getAttribute("href");
  if (!href || href.charAt(0) !== "#") return;

  const id = decodeURIComponent(href.slice(1));
  const el = document.getElementById(id);
  if (!el) return;

  e.preventDefault();

  const header = document.querySelector(".header");
  const offset = (header?.offsetHeight || 68) + 12;
  const y = Math.max(0, window.scrollY + el.getBoundingClientRect().top - offset);

  animateScrollTo(y);

  // update hash without native jump
  history.pushState(null, "", "#" + id);
}
