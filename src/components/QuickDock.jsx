import React, { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import LangSwitch from "./LangDropdown.jsx";
import ThemeSwitch from "./ThemeSwitch.jsx";

export default function QuickDock() {
  const { t, i18n } = useTranslation();
  const lang = (i18n.resolvedLanguage || i18n.language || "en").split("-")[0];

  const [show, setShow] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const popRef = useRef(null);
  const btnRef = useRef(null);

  // Show the dock when header leaves
  useEffect(() => {
    const header = document.querySelector(".header");
    let cleanup = () => {};
    if (header && "IntersectionObserver" in window) {
      const io = new IntersectionObserver(
        (entries) => setShow(entries[0].isIntersecting === false),
        { root: null, rootMargin: "-60px 0px 0px 0px", threshold: [0, 1] }
      );
      io.observe(header);
      cleanup = () => io.disconnect();
    } else {
      const onScroll = () => setShow(window.scrollY > 140);
      onScroll();
      window.addEventListener("scroll", onScroll, { passive: true });
      cleanup = () => window.removeEventListener("scroll", onScroll);
    }
    return cleanup;
  }, []);

  // Close popover on outside click (robust)
  useEffect(() => {
    const onPointerDown = (e) => {
      if (!menuOpen) return;
      if (popRef.current && popRef.current.contains(e.target)) return;
      if (btnRef.current && btnRef.current.contains(e.target)) return;
      setMenuOpen(false);
    };
    window.addEventListener("pointerdown", onPointerDown);
    return () => window.removeEventListener("pointerdown", onPointerDown);
  }, [menuOpen]);

  const labels = {
    products:  t("nav.products",  { defaultValue: "Products" }),
    services:  t("nav.services",  { defaultValue: "Services" }),
    portfolio: t("nav.portfolio", { defaultValue: "Cases" }),
    contact:   t("nav.contact",   { defaultValue: "Contact" }),
    careers:   t("nav.careers",   { defaultValue: "Careers" }),
    team:      t("nav.team",      { defaultValue: "Team" }),
    blog:      t("nav.blog",      { defaultValue: "Blog" }),
    faq:       t("nav.faq",       { defaultValue: "FAQ" }),
    more:      t("nav.more",      { defaultValue: "More" }),
    quick:     t("nav.quick",     { defaultValue: "Quick navigation" })
  };

  const dockFx = {
    initial: { y: 24, opacity: 0, filter: "blur(8px)" },
    animate: { y: 0,  opacity: 1, filter: "blur(0px)" },
    exit:    { y: 24, opacity: 0, filter: "blur(8px)" },
    transition: { duration: 0.35, ease: [0.22,1,0.36,1] }
  };

  return (
    <AnimatePresence>
      {show && (
        <motion.nav aria-label={labels.quick} className="quickdock rb" {...dockFx}>
          {/* the bar (keyed for smooth i18n crossfade) */}
          <motion.div
            className="dock"
            key={lang}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
          >
            <a className="dock-btn" href="#products"   title={labels.products}><BoxIcon /><span className="label">{labels.products}</span></a>
            <a className="dock-btn" href="#services"   title={labels.services}><SparkIcon /><span className="label">{labels.services}</span></a>
            <a className="dock-btn" href="#portfolio"  title={labels.portfolio}><CaseIcon /><span className="label">{labels.portfolio}</span></a>
            <a className="dock-btn" href="#contact"    title={labels.contact}><MailIcon /><span className="label">{labels.contact}</span></a>

            {/* More */}
            <button
              ref={btnRef}
              type="button"
              className="dock-btn more"
              onClick={() => setMenuOpen(v => !v)}
              aria-expanded={menuOpen}
              aria-haspopup="menu"
              title={labels.more}
            >
              <DotsIcon /><span className="label">{labels.more}</span>
            </button>

            {/* --- DOCK POP (the popover) --- */}
            <AnimatePresence>
              {menuOpen && (
                <motion.div
                  key={lang}
                  ref={popRef}
                  className="dock-pop"
                  initial={{ opacity: 0, y: 8, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 8, scale: 0.98 }}
                  transition={{ duration: 0.18, ease: [0.22,1,0.36,1] }}
                  role="menu"
                >
                  <div className="pop-grid">
                    <a href="#team"     className="pop-item" role="menuitem">{labels.team}</a>
                    <a href="#careers"  className="pop-item" role="menuitem">{labels.careers}</a>
                    <a href="#blog"     className="pop-item" role="menuitem">{labels.blog}</a>
                    <a href="#faq"      className="pop-item" role="menuitem">{labels.faq}</a>
                  </div>

                  <div className="pop-row">
                    <LangSwitch
                      value={lang}
                      onChange={(code) => i18n.changeLanguage(code)}
                      size="md"
                      ariaLabel={t("lang.select", { defaultValue: "Language" })}
                    />
                    <ThemeSwitch size="md" />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
            {/* --- /DOCK POP --- */}
          </motion.div>
        </motion.nav>
      )}
    </AnimatePresence>
  );
}

/* tiny inline icons */
const DotsIcon = () => (<svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true"><circle cx="5" cy="12" r="2" fill="currentColor"/><circle cx="12" cy="12" r="2" fill="currentColor"/><circle cx="19" cy="12" r="2" fill="currentColor"/></svg>);
const BoxIcon  = () => (<svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true"><path d="M3 7l9 5 9-5-9-4-9 4z" fill="none" stroke="currentColor" strokeWidth="2"/><path d="M3 7v10l9 5 9-5V7" fill="none" stroke="currentColor" strokeWidth="2"/></svg>);
const SparkIcon= () => (<svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2l2.5 7.5L22 12l-7.5 2.5L12 22l-2.5-7.5L2 12l7.5-2.5L12 2z" fill="none" stroke="currentColor" strokeWidth="2"/></svg>);
const CaseIcon = () => (<svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="7" width="18" height="12" rx="2" fill="none" stroke="currentColor" strokeWidth="2"/><path d="M9 7V5h6v2" fill="none" stroke="currentColor" strokeWidth="2"/></svg>);
const MailIcon = () => (<svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="5" width="18" height="14" rx="2" fill="none" stroke="currentColor" strokeWidth="2"/><path d="M3 7l9 6 9-6" fill="none" stroke="currentColor" strokeWidth="2"/></svg>);
