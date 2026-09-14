/* =========================================================
   Moonpure — responsive navigation behaviour
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {
  const hamburger = document.getElementById("hamburgerBtn");
  const navLinks = document.getElementById("navLinks");

  hamburger?.addEventListener("click", () => {
    hamburger.classList.toggle("is-open");
    navLinks.classList.toggle("is-open");
    const expanded = hamburger.classList.contains("is-open");
    hamburger.setAttribute("aria-expanded", expanded);
  });

  // Close mobile menu after a link is tapped
  navLinks?.querySelectorAll("a").forEach(link => {
    link.addEventListener("click", () => {
      hamburger?.classList.remove("is-open");
      navLinks.classList.remove("is-open");
    });
  });

  // Highlight the current page in the nav
  const current = window.location.pathname.split("/").pop() || "index.html";
  navLinks?.querySelectorAll("a").forEach(link => {
    if (link.getAttribute("href") === current) link.classList.add("active");
  });

  // Footer year
  const yearEl = document.getElementById("footerYear");
  if (yearEl) yearEl.textContent = new Date().getFullYear();
});
