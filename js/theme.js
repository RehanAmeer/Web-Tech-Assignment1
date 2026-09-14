/* =========================================================
   Moonpure — light / dark theme toggle
   Persists choice in localStorage. Defaults to light mode.
   ========================================================= */

const THEME_KEY = "moonpure-theme";

function getStoredTheme() {
  const saved = localStorage.getItem(THEME_KEY);
  return saved === "light" || saved === "dark" ? saved : null;
}

function applyTheme(theme) {
  document.documentElement.setAttribute("data-theme", theme);
  localStorage.setItem(THEME_KEY, theme);

  const btn = document.getElementById("themeToggle");
  if (!btn) return;

  const isDark = theme === "dark";
  btn.setAttribute("aria-label", isDark ? "Switch to light mode" : "Switch to dark mode");
  btn.setAttribute("title", isDark ? "Light mode" : "Dark mode");
  btn.querySelector(".theme-icon-light")?.toggleAttribute("hidden", isDark);
  btn.querySelector(".theme-icon-dark")?.toggleAttribute("hidden", !isDark);
}

/* Run before first paint when loaded from <head> */
applyTheme(getStoredTheme() || "light");

document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("themeToggle")?.addEventListener("click", () => {
    const current = document.documentElement.getAttribute("data-theme") || "light";
    applyTheme(current === "dark" ? "light" : "dark");
  });
});
