// src/utils/smartScroll.js

// cubic ease-in-out
const ease = t => (t < 0.5 ? 4*t*t*t : 1 - Math.pow(-2*t + 2, 3)/2);

function scroller() {
  return document.scrollingElement || document.documentElement;
}
function currentY() {
  return scroller().scrollTop;
}
function setY(y) {
  scroller().scrollTop = y;
}
function headerOffset() {
  const header = document.querySelector(".header");
  return (header?.offsetHeight || 68) + 12;
}

function animateScrollTo(yTarget, done) {
  const yStart = currentY();
  const distance = Math.abs(yTarget - yStart);
  const duration = Math.min(1400, Math.max(350, (distance / 1600) * 1000)); // ms
  const t0 = performance.now();

  function step(now) {
    const t = Math.min(1, (now - t0) / duration);
    const v = ease(t);
    setY(yStart + (yTarget - yStart) * v);
    if (t < 1) requestAnimationFrame(step);
    else done?.();
  }
  requestAnimationFrame(step);
}

export function onAnchorClick(e) {
  const href = e.currentTarget.getAttribute("href") || "";
  if (!href || href[0] !== "#") return;

  const id = decodeURIComponent(href.slice(1));
  const el = document.getElementById(id);
  if (!el) return;

  e.preventDefault();

  // wait a frame (menus/dock might close and change layout)
  requestAnimationFrame(() => {
    const y = Math.max(0, currentY() + el.getBoundingClientRect().top - headerOffset());

    if (Math.abs(y - currentY()) < 2) {
      history.pushState(null, "", "#" + id);
      return;
    }

    animateScrollTo(y, () => history.pushState(null, "", "#" + id));

    // watchdog fallback (native smooth) if something blocked animation
    setTimeout(() => {
      if (Math.abs(currentY() - y) < 2) {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
        setTimeout(() => setY(Math.max(0, currentY() - headerOffset())), 60);
      }
    }, 60);
  });
}
