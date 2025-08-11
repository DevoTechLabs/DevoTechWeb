import React from "react";

export default function LangSwitch({ value, onChange, size = "sm", ariaLabel = "Language" }) {
  const langs = [
    { id: "en", label: "EN" },
    { id: "zh", label: "中文" },
    { id: "fr", label: "FR" }
  ];
  return (
    <div className={`seg seg-${size}`} role="group" aria-label={ariaLabel}>
      {langs.map(l => (
        <button
          key={l.id}
          type="button"
          className={`seg-btn ${value === l.id ? "active" : ""}`}
          aria-pressed={value === l.id}
          onClick={() => value !== l.id && onChange(l.id)}
        >
          {l.label}
        </button>
      ))}
    </div>
  );
}
