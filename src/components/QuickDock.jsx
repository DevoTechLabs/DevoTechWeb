import React, { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useTranslation } from "react-i18next";

export default function QuickDock() {
  const { t, i18n } = useTranslation();
  const lang = (i18n.resolvedLanguage || i18n.language || "en").split("-")[0];

  const [show, setShow] = useState(false);

  useEffect(() => {
    // Try to observe the header; fall back to scroll threshold if not found
    const header = document.querySelector(".header");
    let cleanup = () => {};

    if (header && "IntersectionObserver" in window) {
      const io = new IntersectionObserver(
        (entries) => {
          const e = entries[0];
          // show when header is mostly out of view
          setShow(e.isIntersecting === false);
        },
        {
          root: null,
          // start hiding once ~60px of header has scrolled past
          rootMargin: "-60px 0px 0px 0px",
          threshold: [0, 0.1, 0.9, 1]
        }
      );
      io.observe(header);
      cleanup = () => io.disconnect();
    } else {
      // Fallback: simple scroll threshold
      const onScroll = () => setShow(window.scrollY > 140);
      onScroll();
      window.addEventListener("scroll", onScroll, { passive: true });
      cleanup = () => window.removeEventListener("scroll", onScroll);
    }

    return cleanup;
  }, []);

  const labels = {
    top:       t("nav.home",      { defaultValue: "Home" }),
    products:  t("nav.products",  { defaultValue: "Products" }),
    services:  t("nav.services",  { defaultValue: "Services" }),
    portfolio: t("nav.portfolio", { defaultValue: "Cases" }),
    contact:   t("nav.contact",   { defaultValue: "Contact" }),
  };

  const enterExit = {
    initial:    { y: 24, opacity: 0, filter: "blur(8px)" },
    animate:    { y: 0,  opacity: 1, filter: "blur(0px)" },
    exit:       { y: 24, opacity: 0, filter: "blur(8px)" },
    transition: { duration: 0.35, ease: [0.22, 1, 0.36, 1] }
  };

  return (
    <AnimatePresence>
      {show && (
        <motion.nav
          aria-label={t("nav.quick", { defaultValue: "Quick navigation" })}
          className="quickdock"
          {...enterExit}
        >
          {/* Key on lang so labels crossfade on language switch */}
          <motion.div
            className="dock"
            key={lang}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
          >
            <a className="dock-btn" href="#home" title={labels.top}>
              <UpIcon /><span className="label">{labels.top}</span>
            </a>
            <a className="dock-btn" href="#products" title={labels.products}>
              <BoxIcon /><span className="label">{labels.products}</span>
            </a>
            <a className="dock-btn" href="#services" title={labels.services}>
              <SparkIcon /><span className="label">{labels.services}</span>
            </a>
            <a className="dock-btn" href="#portfolio" title={labels.portfolio}>
              <CaseIcon /><span className="label">{labels.portfolio}</span>
            </a>
            <a className="dock-btn" href="#contact" title={labels.contact}>
              <MailIcon /><span className="label">{labels.contact}</span>
            </a>
          </motion.div>
        </motion.nav>
      )}
    </AnimatePresence>
  );
}

/* tiny inline icons */
const UpIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
    <path d="M12 5l7 7m-7-7l-7 7" fill="none" stroke="currentColor" strokeWidth="2" />
    <path d="M12 5v14" fill="none" stroke="currentColor" strokeWidth="2" />
  </svg>
);
const BoxIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
    <path d="M3 7l9 5 9-5-9-4-9 4z" fill="none" stroke="currentColor" strokeWidth="2" />
    <path d="M3 7v10l9 5 9-5V7" fill="none" stroke="currentColor" strokeWidth="2" />
  </svg>
);
const SparkIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
    <path d="M12 2l2.5 7.5L22 12l-7.5 2.5L12 22l-2.5-7.5L2 12l7.5-2.5L12 2z" fill="none" stroke="currentColor" strokeWidth="2" />
  </svg>
);
const CaseIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
    <rect x="3" y="7" width="18" height="12" rx="2" fill="none" stroke="currentColor" strokeWidth="2" />
    <path d="M9 7V5h6v2" fill="none" stroke="currentColor" strokeWidth="2" />
  </svg>
);
const MailIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
    <rect x="3" y="5" width="18" height="14" rx="2" fill="none" stroke="currentColor" strokeWidth="2" />
    <path d="M3 7l9 6 9-6" fill="none" stroke="currentColor" strokeWidth="2" />
  </svg>
);
