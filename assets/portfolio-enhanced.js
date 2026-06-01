/**
 * VALORANT-INSPIRED PORTFOLIO ENHANCEMENTS
 * Advanced animations, interactions, and performance optimizations
 */

// ============================================
// DOM ELEMENT REFERENCES
// ============================================
const loader = document.getElementById("loader");
const progress = document.getElementById("scroll-progress");
const mouseLight = document.getElementById("mouse-light");
const navLinks = document.getElementById("nav-links");
const menuToggle = document.getElementById("menu-toggle");
const typingText = document.getElementById("typing-text");

// ============================================
// CONFIGURATION
// ============================================
const phrases = [
  "orchestrating ETL workflows",
  "modeling analytics-ready warehouses",
  "streaming events with Kafka",
  "validating data before dashboards break",
  "building intelligent machine learning pipelines",
  "architecting scalable data systems",
  "optimizing data ingestion pipelines",
];

// Smooth scroll performance settings
const SCROLL_THROTTLE = 15;
const REVEAL_THRESHOLD = 0.16;
let lastScrollTime = 0;

// ============================================
// LOADER & PAGE INITIALIZATION
// ============================================
window.addEventListener("load", () => {
  window.setTimeout(() => {
    loader?.classList.add("is-hidden");
    // Trigger reveal animations after loader is hidden
    triggerReveals();
  }, 650);
});

// ============================================
// SCROLL PROGRESS BAR
// ============================================
function updateProgress() {
  if (!progress) return;
  const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
  const ratio = maxScroll > 0 ? window.scrollY / maxScroll : 0;
  progress.style.transform = `scaleX(${Math.min(Math.max(ratio, 0), 1)})`;
}

// Throttled scroll event for performance
window.addEventListener(
  "scroll",
  () => {
    const now = Date.now();
    if (now - lastScrollTime >= SCROLL_THROTTLE) {
      updateProgress();
      lastScrollTime = now;
    }
  },
  { passive: true },
);

updateProgress();

// ============================================
// MOUSE LIGHT EFFECT
// ============================================
let mouseX = 0;
let mouseY = 0;

window.addEventListener(
  "pointermove",
  (event) => {
    mouseX = event.clientX;
    mouseY = event.clientY;

    if (mouseLight) {
      mouseLight.style.left = `${mouseX}px`;
      mouseLight.style.top = `${mouseY}px`;
    }
  },
  { passive: true },
);

// ============================================
// MOBILE MENU TOGGLE
// ============================================
menuToggle?.addEventListener("click", () => {
  const isOpen = navLinks?.classList.toggle("is-open");
  menuToggle.setAttribute("aria-expanded", String(Boolean(isOpen)));
  menuToggle.innerHTML = isOpen
    ? '<i class="ph ph-x"></i>'
    : '<i class="ph ph-list"></i>';
});

// Close menu when link clicked
navLinks?.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    navLinks.classList.remove("is-open");
    menuToggle?.setAttribute("aria-expanded", "false");
    if (menuToggle) menuToggle.innerHTML = '<i class="ph ph-list"></i>';
  });
});

// ============================================
// SCROLL REVEAL ANIMATIONS
// ============================================
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: REVEAL_THRESHOLD },
);

function triggerReveals() {
  document.querySelectorAll(".reveal").forEach((item) => {
    revealObserver.observe(item);
  });
}

// Initial call if loader is already hidden
if (!loader?.classList.contains("is-hidden")) {
  document.querySelectorAll(".reveal").forEach((item) => {
    revealObserver.observe(item);
  });
}

// ============================================
// ANIMATED COUNTERS
// ============================================
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
        // Ease-out cubic for smooth animation
        const eased = 1 - Math.pow(1 - progressValue, 3);
        counter.textContent = String(Math.round(target * eased));

        if (progressValue < 1) {
          requestAnimationFrame(animateCounter);
        }
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

// ============================================
// TYPING ANIMATION
// ============================================
let phraseIndex = 0;
let charIndex = 0;
let deleting = false;
let typeLoopTimeout;

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
    typeLoopTimeout = window.setTimeout(typeLoop, 1200);
    return;
  }

  if (deleting && charIndex === 0) {
    deleting = false;
    phraseIndex = (phraseIndex + 1) % phrases.length;
  }

  const speed = deleting ? 42 : 72;
  typeLoopTimeout = window.setTimeout(typeLoop, speed);
}

typeLoop();

// Cleanup on page unload
window.addEventListener("beforeunload", () => {
  if (typeLoopTimeout) clearTimeout(typeLoopTimeout);
});

// ============================================
// 3D TILT CARD EFFECT
// ============================================
document.querySelectorAll(".tilt-card").forEach((card) => {
  card.addEventListener("pointermove", (event) => {
    const rect = card.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    // Calculate rotation based on mouse position
    const rotateX = (y / rect.height - 0.5) * -7;
    const rotateY = (x / rect.width - 0.5) * 7;

    // Apply smooth 3D transform
    card.style.transform = `perspective(900px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
  });

  card.addEventListener("pointerleave", () => {
    card.style.transform = "";
  });
});

// ============================================
// SMOOTH LINK SCROLLING WITH OFFSET
// ============================================
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    const href = this.getAttribute("href");
    if (href === "#" || href === "#top") return;

    e.preventDefault();
    const targetId = href.substring(1);
    const targetElement = document.getElementById(targetId);

    if (targetElement) {
      const navHeight = 100; // Approximate nav height
      const targetPosition =
        targetElement.getBoundingClientRect().top + window.scrollY - navHeight;

      window.scrollTo({
        top: targetPosition,
        behavior: "smooth",
      });
    }
  });
});

// ============================================
// ENHANCED LINK HOVER EFFECTS
// ============================================
document.querySelectorAll(".v-links a").forEach((link) => {
  link.addEventListener("mouseenter", function () {
    this.style.textShadow = "0 0 18px rgba(225, 29, 72, 0.75)";
  });

  link.addEventListener("mouseleave", function () {
    this.style.textShadow = "";
  });
});

// ============================================
// BUTTON RIPPLE EFFECT
// ============================================
document.querySelectorAll(".v-btn, .project-actions a").forEach((button) => {
  button.addEventListener("click", function (e) {
    const rect = this.getBoundingClientRect();
    const ripple = document.createElement("span");

    const size = Math.max(rect.width, rect.height);
    const x = e.clientX - rect.left - size / 2;
    const y = e.clientY - rect.top - size / 2;

    ripple.style.width = ripple.style.height = size + "px";
    ripple.style.left = x + "px";
    ripple.style.top = y + "px";
    ripple.classList.add("ripple");
    ripple.style.position = "absolute";
    ripple.style.borderRadius = "50%";
    ripple.style.background = "rgba(255, 255, 255, 0.6)";
    ripple.style.transform = "scale(0)";
    ripple.style.animation = "rippleEffect 0.6s ease-out";
    ripple.style.pointerEvents = "none";

    this.style.position = "relative";
    this.style.overflow = "hidden";
    this.appendChild(ripple);

    setTimeout(() => ripple.remove(), 600);
  });
});

// Ripple animation keyframe
if (!document.getElementById("ripple-style")) {
  const style = document.createElement("style");
  style.id = "ripple-style";
  style.textContent = `
    @keyframes rippleEffect {
      to {
        transform: scale(4);
        opacity: 0;
      }
    }
  `;
  document.head.appendChild(style);
}

// ============================================
// PARALLAX SCROLL EFFECT (OPTIONAL)
// ============================================
const parallaxElements = document.querySelectorAll("[data-parallax]");
if (parallaxElements.length > 0) {
  window.addEventListener(
    "scroll",
    () => {
      parallaxElements.forEach((element) => {
        const speed = element.getAttribute("data-parallax") || 0.5;
        element.style.transform = `translateY(${window.scrollY * speed}px)`;
      });
    },
    { passive: true },
  );
}

// ============================================
// FORM VALIDATION (FOR CONTACT)
// ============================================
document.querySelectorAll("form").forEach((form) => {
  form.addEventListener("submit", function (e) {
    const inputs = this.querySelectorAll("input, textarea");
    let isValid = true;

    inputs.forEach((input) => {
      if (!input.value.trim()) {
        isValid = false;
        input.style.borderColor = "#e11d48";
      } else {
        input.style.borderColor = "";
      }
    });

    if (!isValid) {
      e.preventDefault();
    }
  });
});

// ============================================
// INTERSECTION OBSERVER FOR IMAGES
// ============================================
const imageObserver = new IntersectionObserver((entries, observer) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      const img = entry.target;
      if (img.dataset.src) {
        img.src = img.dataset.src;
        img.removeAttribute("data-src");
      }
      observer.unobserve(img);
    }
  });
});

document.querySelectorAll("img[data-src]").forEach((img) => {
  imageObserver.observe(img);
});

// ============================================
// KEYBOARD NAVIGATION IMPROVEMENTS
// ============================================
document.addEventListener("keydown", (e) => {
  // ESC to close mobile menu
  if (e.key === "Escape") {
    navLinks?.classList.remove("is-open");
    menuToggle?.setAttribute("aria-expanded", "false");
    if (menuToggle) menuToggle.innerHTML = '<i class="ph ph-list"></i>';
  }

  // Skip to main content (for accessibility)
  if (e.key === "s" && (e.ctrlKey || e.metaKey)) {
    e.preventDefault();
    document.querySelector("main")?.focus();
  }
});

// ============================================
// PERFORMANCE: DISABLE MOUSE LIGHT ON TOUCH DEVICES
// ============================================
if (window.matchMedia("(hover: none)").matches) {
  if (mouseLight) mouseLight.style.display = "none";
}

// ============================================
// DYNAMIC PAGE TITLE UPDATE
// ============================================
window.addEventListener("focus", () => {
  document.title = "Alip Kamate | Data Engineer Portfolio";
});

window.addEventListener("blur", () => {
  document.title = "👋 Come back! | Data Engineer Portfolio";
});

// ============================================
// PERFORMANCE MONITORING (Optional)
// ============================================
if (window.performance && window.performance.now) {
  const startTime = performance.now();
  window.addEventListener("load", () => {
    const endTime = performance.now();
    console.log(`Portfolio loaded in ${Math.round(endTime - startTime)}ms`);
  });
}

// ============================================
// LAZY LOADING FOR SECTIONS
// ============================================
const sectionObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("loaded");
        sectionObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.1 },
);

document.querySelectorAll(".section-panel").forEach((section) => {
  sectionObserver.observe(section);
});

// ============================================
// EXPORT DEBUGGING UTILITIES (Development)
// ============================================
if (window.location.hostname === "localhost") {
  window.portfolioDebug = {
    revealAll: () => {
      document.querySelectorAll(".reveal").forEach((el) => {
        el.classList.add("is-visible");
      });
    },
    logStats: () => {
      console.log({
        sections: document.querySelectorAll(".section-panel").length,
        projects: document.querySelectorAll(".v-project").length,
        reveals: document.querySelectorAll(".reveal").length,
      });
    },
  };
}

console.log("🎮 Valorant Portfolio initialized successfully!");
