const loader = document.getElementById("loader");
const progress = document.getElementById("scroll-progress");
const mouseLight = document.getElementById("mouse-light");
const navLinks = document.getElementById("nav-links");
const menuToggle = document.getElementById("menu-toggle");
const typingText = document.getElementById("typing-text");
const switchTrack = document.getElementById("switch-track");

const phrases = [
  "mapping raw data into trusted ledgers",
  "crafting warehouse models with discipline",
  "orchestrating Airflow pipelines like clockwork",
  "guarding data quality before reports are trusted",
  "turning machine learning pipelines into reliable systems",
];

window.addEventListener("load", () => {
  window.setTimeout(() => {
    loader?.classList.add("is-hidden");
  }, 650);
});

function updateProgress() {
  if (!progress) return;
  const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
  const ratio = maxScroll > 0 ? window.scrollY / maxScroll : 0;
  progress.style.transform = `scaleX(${Math.min(Math.max(ratio, 0), 1)})`;
}

window.addEventListener("scroll", updateProgress, { passive: true });
updateProgress();

window.addEventListener("pointermove", (event) => {
  if (!mouseLight) return;
  mouseLight.style.left = `${event.clientX}px`;
  mouseLight.style.top = `${event.clientY}px`;
});

menuToggle?.addEventListener("click", () => {
  const isOpen = navLinks?.classList.toggle("is-open");
  menuToggle.setAttribute("aria-expanded", String(Boolean(isOpen)));
  menuToggle.innerHTML = isOpen
    ? '<i class="ph ph-x"></i>'
    : '<i class="ph ph-list"></i>';
});

navLinks?.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    navLinks.classList.remove("is-open");
    menuToggle?.setAttribute("aria-expanded", "false");
    if (menuToggle) menuToggle.innerHTML = '<i class="ph ph-list"></i>';
  });
});

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.16 },
);

document.querySelectorAll(".reveal").forEach((item) => {
  revealObserver.observe(item);
});

const counterObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const counter = entry.target;
      const target = Number(counter.getAttribute("data-count") || "0");
      const duration = 1100;
      const startTime = performance.now();

      function animateCounter(now) {
        const progressValue = Math.min((now - startTime) / duration, 1);
        const eased = 1 - Math.pow(1 - progressValue, 3);
        counter.textContent = String(Math.round(target * eased));
        if (progressValue < 1) requestAnimationFrame(animateCounter);
      }

      requestAnimationFrame(animateCounter);
      counterObserver.unobserve(counter);
    });
  },
  { threshold: 0.5 },
);

document.querySelectorAll(".counter").forEach((counter) => {
  counterObserver.observe(counter);
});

let phraseIndex = 0;
let charIndex = 0;
let deleting = false;

function typeLoop() {
  if (!typingText) return;
  const phrase = phrases[phraseIndex];

  if (deleting) {
    charIndex -= 1;
  } else {
    charIndex += 1;
  }

  typingText.textContent = phrase.slice(0, charIndex);

  if (!deleting && charIndex === phrase.length) {
    deleting = true;
    window.setTimeout(typeLoop, 1200);
    return;
  }

  if (deleting && charIndex === 0) {
    deleting = false;
    phraseIndex = (phraseIndex + 1) % phrases.length;
  }

  window.setTimeout(typeLoop, deleting ? 42 : 72);
}

typeLoop();

document.querySelectorAll(".tilt-card").forEach((card) => {
  card.addEventListener("pointermove", (event) => {
    const rect = card.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    const rotateX = ((y / rect.height) - 0.5) * -7;
    const rotateY = ((x / rect.width) - 0.5) * 7;
    card.style.transform = `perspective(900px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
  });

  card.addEventListener("pointerleave", () => {
    card.style.transform = "";
  });
});

document.querySelectorAll(".switch-btn").forEach((button) => {
  button.addEventListener("click", () => {
    const view = Number(button.getAttribute("data-view") || "0");
    document.querySelectorAll(".switch-btn").forEach((item) => {
      item.classList.toggle("is-active", item === button);
    });
    if (switchTrack) {
      switchTrack.style.transform = `translateX(-${view * 33.3333}%)`;
    }
  });
});
