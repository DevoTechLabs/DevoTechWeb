import React, { useEffect, useState } from "react";

export default function ThemeSwitch({ size = "sm", ariaLabel = "Theme" }) {
  const getTheme = () => (document.documentElement.getAttribute("data-theme") || "dark");
  const [theme, setTheme] = useState(getTheme());

  // watch for theme changes done elsewhere (header button etc.)
  useEffect(() => {
    const obs = new MutationObserver(() => setTheme(getTheme()));
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
    return () => obs.disconnect();
  }, []);

  const set = (v) => {
    document.documentElement.setAttribute("data-theme", v);
    setTheme(v);
  };

  return (
    <div className={`seg seg-${size}`} role="group" aria-label={ariaLabel}>
      <button type="button" className={`seg-btn ${theme === "dark" ? "active" : ""}`} aria-pressed={theme === "dark"} onClick={() => set("dark")}>Dark</button>
      <button type="button" className={`seg-btn ${theme === "light" ? "active" : ""}`} aria-pressed={theme === "light"} onClick={() => set("light")}>Light</button>
    </div>
  );
}
