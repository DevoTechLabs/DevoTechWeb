import React, { useEffect, useRef, useState } from "react";

export default function LangDropdown({
  value = "en",
  onChange,
  size = "sm",
  ariaLabel = "Language"
}) {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(() => ["en","zh","fr"].indexOf(value));
  const wrapRef = useRef(null);
  const btnRef = useRef(null);

  const items = [
    { id: "en", label: "EN" },
    { id: "zh", label: "中文" },
    { id: "fr", label: "FR" },
  ];

  // close on outside / Esc
  useEffect(() => {
    const onDown = (e) => {
      if (wrapRef.current?.contains(e.target)) return;
      setOpen(false);
    };
    const onEsc = (e) => { if (e.key === "Escape") setOpen(false); };
    window.addEventListener("pointerdown", onDown);
    window.addEventListener("keydown", onEsc);
    return () => {
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("keydown", onEsc);
    };
  }, []);

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
        ref={btnRef}
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
        <ul className="select-menu" role="listbox" aria-label={ariaLabel}>
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
