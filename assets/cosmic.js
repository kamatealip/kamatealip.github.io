document.documentElement.classList.add("js");

const body = document.body;
const navLinks = document.querySelector(".nav-links");
const navToggle = document.querySelector("[data-menu-toggle]");
const menuIcon = navToggle?.querySelector("i");
const cursorGlow = document.querySelector("[data-cursor-glow]");

function setMenu(open) {
  if (!navLinks || !navToggle) return;
  navLinks.classList.toggle("is-open", open);
  body.classList.toggle("menu-open", open);
  navToggle.setAttribute("aria-expanded", String(open));
  if (menuIcon) {
    menuIcon.className = open ? "ph ph-x" : "ph ph-list";
  }
}

navToggle?.addEventListener("click", () => {
  setMenu(!navLinks?.classList.contains("is-open"));
});

navLinks?.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => setMenu(false));
});

window.addEventListener("resize", () => {
  if (window.innerWidth > 980) setMenu(false);
});

if (cursorGlow) {
  window.addEventListener(
    "pointermove",
    (event) => {
      const x = `${event.clientX}px`;
      const y = `${event.clientY}px`;
      cursorGlow.style.setProperty("--cursor-x", x);
      cursorGlow.style.setProperty("--cursor-y", y);
    },
    { passive: true },
  );
}

const revealItems = document.querySelectorAll(".reveal");
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12 },
);

revealItems.forEach((item) => revealObserver.observe(item));

const sectionLinks = Array.from(document.querySelectorAll(".nav-links a[href^='#']"));
const sections = sectionLinks
  .map((link) => document.querySelector(link.getAttribute("href")))
  .filter(Boolean);

if (sections.length) {
  const activeObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        sectionLinks.forEach((link) => {
          link.classList.toggle(
            "is-active",
            link.getAttribute("href") === `#${entry.target.id}`,
          );
        });
      });
    },
    { rootMargin: "-42% 0px -48% 0px", threshold: 0.01 },
  );

  sections.forEach((section) => activeObserver.observe(section));
}
