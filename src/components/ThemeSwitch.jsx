import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

export default function ThemeSwitch({ size = "sm", ariaLabel }) {
  const { t, i18n } = useTranslation();
  const lang = (i18n.resolvedLanguage || i18n.language || "en").split("-")[0];

  const getTheme = () =>
    document.documentElement.getAttribute("data-theme") || "dark";
  const [theme, setTheme] = useState(getTheme());

  useEffect(() => {
    const obs = new MutationObserver(() => setTheme(getTheme()));
    obs.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme"],
    });
    return () => obs.disconnect();
  }, []);

  const set = (v) => {
    document.documentElement.setAttribute("data-theme", v);
    setTheme(v);
  };

  return (
    <div
      key={lang} /* crossfade labels on language change */
      className={`seg seg-${size}`}
      role="group"
      aria-label={ariaLabel || t("theme.title", { defaultValue: "Theme" })}
    >
      <button
        type="button"
        className={`seg-btn ${theme === "dark" ? "active" : ""}`}
        aria-pressed={theme === "dark"}
        onClick={() => set("dark")}
      >
        {t("theme.dark", { defaultValue: "Dark" })}
      </button>
      <button
        type="button"
        className={`seg-btn ${theme === "light" ? "active" : ""}`}
        aria-pressed={theme === "light"}
        onClick={() => set("light")}
      >
        {t("theme.light", { defaultValue: "Light" })}
      </button>
    </div>
  );
}
