const track = document.getElementById("archive-track");
const panels = Array.from(document.querySelectorAll(".archive-panel"));
const navLinks = Array.from(document.querySelectorAll("[data-panel]"));
const menuToggle = document.getElementById("menu-toggle");
const linkWrap = document.getElementById("nav-links");
const indicator = document.getElementById("panel-indicator");
const dustField = document.getElementById("dust-field");
const illumination = document.getElementById("illumination");
const inkLine = document.getElementById("ink-line");

let activeIndex = 0;
let locked = false;
let pointerX = window.innerWidth / 2;
let pointerY = window.innerHeight / 2;
let lightX = pointerX;
let lightY = pointerY;
let touchStartX = 0;
let touchStartY = 0;

const phrases = [
  "mapping raw data into trusted ledgers",
  "crafting warehouse models with discipline",
  "orchestrating Airflow pipelines like clockwork",
  "guarding data quality before reports are trusted",
  "turning machine learning pipelines into reliable systems",
];

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function closeMenu() {
  linkWrap?.classList.remove("is-open");
  menuToggle?.setAttribute("aria-expanded", "false");
  if (menuToggle) menuToggle.innerHTML = '<i class="ph ph-list"></i>';
}

function setPanel(index, updateHash = true) {
  const nextIndex = clamp(index, 0, panels.length - 1);
  activeIndex = nextIndex;
  if (track) track.style.transform = `translateX(-${activeIndex * 100}vw)`;

  panels.forEach((panel, panelIndex) => {
    panel.classList.toggle("is-current", panelIndex === activeIndex);
  });

  document.querySelectorAll(".archive-links a[data-panel]").forEach((link) => {
    link.classList.toggle(
      "is-active",
      Number(link.getAttribute("data-panel")) === activeIndex,
    );
  });

  document.querySelectorAll(".panel-dot").forEach((dot) => {
    dot.classList.toggle(
      "is-active",
      Number(dot.getAttribute("data-panel")) === activeIndex,
    );
  });

  if (updateHash) {
    const id = panels[activeIndex]?.id;
    if (id) history.replaceState(null, "", `#${id}`);
  }

  locked = true;
  window.setTimeout(() => {
    locked = false;
  }, 980);
}

navLinks.forEach((control) => {
  control.addEventListener("click", (event) => {
    const panel = control.getAttribute("data-panel");
    if (panel === null) return;
    event.preventDefault();
    closeMenu();
    setPanel(Number(panel));
  });
});

menuToggle?.addEventListener("click", () => {
  const isOpen = linkWrap?.classList.toggle("is-open");
  menuToggle.setAttribute("aria-expanded", String(Boolean(isOpen)));
  menuToggle.innerHTML = isOpen
    ? '<i class="ph ph-x"></i>'
    : '<i class="ph ph-list"></i>';
});

window.addEventListener(
  "wheel",
  (event) => {
    const intent = Math.abs(event.deltaX) > Math.abs(event.deltaY) ? event.deltaX : event.deltaY;
    if (Math.abs(intent) < 18 || locked) return;
    event.preventDefault();
    setPanel(activeIndex + (intent > 0 ? 1 : -1));
  },
  { passive: false },
);

window.addEventListener("keydown", (event) => {
  if (event.key === "ArrowRight" || event.key === "PageDown") setPanel(activeIndex + 1);
  if (event.key === "ArrowLeft" || event.key === "PageUp") setPanel(activeIndex - 1);
  if (event.key === "Home") setPanel(0);
  if (event.key === "End") setPanel(panels.length - 1);
});

window.addEventListener(
  "touchstart",
  (event) => {
    touchStartX = event.touches[0].clientX;
    touchStartY = event.touches[0].clientY;
  },
  { passive: true },
);

window.addEventListener(
  "touchend",
  (event) => {
    const touch = event.changedTouches[0];
    const deltaX = touchStartX - touch.clientX;
    const deltaY = touchStartY - touch.clientY;
    if (Math.abs(deltaX) > 48 && Math.abs(deltaX) > Math.abs(deltaY)) {
      setPanel(activeIndex + (deltaX > 0 ? 1 : -1));
    }
  },
  { passive: true },
);

function buildIndicator() {
  if (!indicator) return;
  panels.forEach((panel, index) => {
    const button = document.createElement("button");
    button.className = "panel-dot";
    button.type = "button";
    button.setAttribute("data-panel", String(index));
    button.setAttribute("aria-label", `Go to ${panel.id}`);
    button.addEventListener("click", () => setPanel(index));
    indicator.appendChild(button);
  });
}

function buildDust() {
  if (!dustField) return;
  const count = window.matchMedia("(max-width: 640px)").matches ? 34 : 64;
  for (let index = 0; index < count; index += 1) {
    const mote = document.createElement("span");
    mote.className = "dust";
    mote.style.left = `${Math.random() * 100}%`;
    mote.style.setProperty("--duration", `${10 + Math.random() * 18}s`);
    mote.style.setProperty("--opacity", `${0.18 + Math.random() * 0.58}`);
    mote.style.setProperty("--drift", `${-60 + Math.random() * 120}px`);
    mote.style.animationDelay = `${Math.random() * -22}s`;
    dustField.appendChild(mote);
  }
}

function animateLight() {
  lightX += (pointerX - lightX) * 0.08;
  lightY += (pointerY - lightY) * 0.08;
  if (illumination) {
    illumination.style.left = `${lightX}px`;
    illumination.style.top = `${lightY}px`;
  }
  requestAnimationFrame(animateLight);
}

window.addEventListener(
  "pointermove",
  (event) => {
    pointerX = event.clientX;
    pointerY = event.clientY;
  },
  { passive: true },
);

let phraseIndex = 0;
let charIndex = 0;
let deleting = false;

function inkType() {
  if (!inkLine) return;
  const phrase = phrases[phraseIndex];
  charIndex += deleting ? -1 : 1;
  inkLine.textContent = phrase.slice(0, charIndex);

  if (!deleting && charIndex === phrase.length) {
    deleting = true;
    window.setTimeout(inkType, 1300);
    return;
  }

  if (deleting && charIndex === 0) {
    deleting = false;
    phraseIndex = (phraseIndex + 1) % phrases.length;
  }

  window.setTimeout(inkType, deleting ? 42 : 74);
}

function hydrateFromHash() {
  const hash = window.location.hash.replace("#", "");
  const index = panels.findIndex((panel) => panel.id === hash);
  setPanel(index >= 0 ? index : 0, false);
}

buildIndicator();
buildDust();
hydrateFromHash();
inkType();
requestAnimationFrame(animateLight);
