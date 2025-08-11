// src/utils/smartScroll.js

// cubic ease-in-out
const ease = t => (t < 0.5 ? 4*t*t*t : 1 - Math.pow(-2*t + 2, 3)/2);

function headerOffset() {
  const header = document.querySelector(".header");
  return (header?.offsetHeight || 68) + 12;
}

function animateScrollTo(yTarget, done) {
  const yStart = window.pageYOffset;
  const distance = Math.abs(yTarget - yStart);
  const duration = Math.min(1400, Math.max(350, (distance / 1600) * 1000)); // ms
  const t0 = performance.now();

  function step(now) {
    const t = Math.min(1, (now - t0) / duration);
    const v = ease(t);
    window.scrollTo(0, yStart + (yTarget - yStart) * v);
    if (t < 1) requestAnimationFrame(step);
    else done?.();
  }
  requestAnimationFrame(step);
}

export function onAnchorClick(e) {
  const href = e.currentTarget.getAttribute("href") || "";
  if (!href || href.charAt(0) !== "#") return; // let browser handle normal links

  const id = decodeURIComponent(href.slice(1));
  const el = document.getElementById(id);
  if (!el) return; // let browser handle (or noop) if missing

  e.preventDefault();

  // defer until after any menu/dock close reflow
  requestAnimationFrame(() => {
    const y = Math.max(
      0,
      window.pageYOffset + el.getBoundingClientRect().top - headerOffset()
    );

    // if distance is tiny, still update hash and bail
    if (Math.abs(y - window.pageYOffset) < 2) {
      history.pushState(null, "", "#" + id);
      return;
    }

    animateScrollTo(y, () => history.pushState(null, "", "#" + id));

    // watchdog: if something blocked animation, fallback to native smooth
    setTimeout(() => {
      if (Math.abs(window.pageYOffset - y) < 2) {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
        setTimeout(() =>
          window.scrollTo(0, Math.max(0, window.pageYOffset - headerOffset()))
        , 60);
      }
    }, 60);
  });
}
