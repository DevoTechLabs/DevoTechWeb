import React, { useEffect, useLayoutEffect, useRef, useState } from "react";

export default function LangDropdown({
  value = "en",
  onChange,
  size = "sm",
  ariaLabel = "Language"
}) {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(() => ["en","zh","fr"].indexOf(value));
  const [placement, setPlacement] = useState("bottom"); // 'bottom' | 'top'
  const [menuMaxH, setMenuMaxH] = useState(undefined);

  const wrapRef = useRef(null);
  const menuRef = useRef(null);
  const items = [
    { id: "en", label: "EN" },
    { id: "zh", label: "中文" },
    { id: "fr", label: "FR" },
  ];

  // close on outside / Esc
  useEffect(() => {
    const onDown = (e) => { if (!wrapRef.current?.contains(e.target)) setOpen(false); };
    const onEsc = (e) => { if (e.key === "Escape") setOpen(false); };
    window.addEventListener("pointerdown", onDown);
    window.addEventListener("keydown", onEsc);
    return () => { window.removeEventListener("pointerdown", onDown); window.removeEventListener("keydown", onEsc); };
  }, []);

  // when opening: reset active to current, and decide top/bottom placement
  useLayoutEffect(() => {
    if (!open) return;
    const idx = items.findIndex(i => i.id === value);
    setActive(idx < 0 ? 0 : idx);

    const gap = 8; // px gap around menu
    const wrap = wrapRef.current;
    if (!wrap) return;
    const rect = wrap.getBoundingClientRect();
    const vh = window.innerHeight;

    // estimate desired popup height (fallback cap)
    const desired = 280;
    const spaceBelow = vh - (rect.top + rect.height) - gap;
    const spaceAbove = rect.top - gap;

    if (spaceBelow >= 160) {
      setPlacement("bottom");
      setMenuMaxH(Math.max(140, Math.min(desired, spaceBelow)));
    } else {
      setPlacement("top");
      setMenuMaxH(Math.max(140, Math.min(desired, spaceAbove)));
    }
  }, [open, value]);

  // keyboard nav
  const onKey = (e) => {
    if (!open && (e.key === "ArrowDown" || e.key === "Enter" || e.key === " ")){
      e.preventDefault(); setOpen(true); return;
    }
    if (!open) return;
    if (e.key === "ArrowDown"){ e.preventDefault(); setActive((i)=> (i+1)%items.length); }
    if (e.key === "ArrowUp"){ e.preventDefault(); setActive((i)=> (i-1+items.length)%items.length); }
    if (e.key === "Enter" || e.key === " "){
      e.preventDefault();
      const sel = items[active]; sel && onChange?.(sel.id);
      setOpen(false);
    }
  };

  const current = items.find(i => i.id === value) || items[0];

  return (
    <div ref={wrapRef} className={`select ${size}`} aria-label={ariaLabel}>
      <button
        type="button"
        className="select-btn"
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => setOpen(v => !v)}
        onKeyDown={onKey}
      >
        <span>{current.label}</span>
        <ChevronDown />
      </button>

      {open && (
        <ul
          ref={menuRef}
          className={`select-menu ${placement}`}
          role="listbox"
          aria-label={ariaLabel}
          style={{ maxHeight: menuMaxH ? `${menuMaxH}px` : undefined }}
        >
          {items.map((it, i) => {
            const isSel = it.id === value;
            const isAct = i === active;
            return (
              <li key={it.id}>
                <button
                  type="button"
                  role="option"
                  aria-selected={isSel}
                  className={`select-item ${isSel ? "selected" : ""} ${isAct ? "active" : ""}`}
                  onMouseEnter={() => setActive(i)}
                  onClick={() => { onChange?.(it.id); setOpen(false); }}
                >
                  {it.label}
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

const ChevronDown = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true">
    <path d="M6 9l6 6 6-6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
  </svg>
);
