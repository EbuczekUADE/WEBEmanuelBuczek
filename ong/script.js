// ========================================
// MENU TOGGLE
// ========================================
const menuToggle = document.querySelector(".menu-toggle");
const navLinks = document.querySelector("#navLinks");
const navDropdown = document.querySelector(".nav-dropdown");
const navDropdownToggle = document.querySelector(".nav-dropdown-toggle");
const navDropdownMenu = document.querySelector(".nav-dropdown-menu");
const forms = document.querySelectorAll("form");
const contactForm = document.querySelector("#contactForm");
const contactStatus = document.querySelector("#contactStatus");
const downloadButtons = document.querySelectorAll(".download-btn");
const openDonationModal = document.querySelector("#openDonationModal");
const closeDonationModal = document.querySelector("#closeDonationModal");
const donationModal = document.querySelector("#donationModal");
const donationAmount = document.querySelector("#donationAmount");
const donationResult = document.querySelector("#donationResult");

function showToast(message) {
  const toast = document.createElement("div");
  toast.className = "toast";
  toast.textContent = message;
  document.body.appendChild(toast);

  window.setTimeout(() => {
    toast.classList.add("is-visible");
  }, 10);

  window.setTimeout(() => {
    toast.classList.remove("is-visible");
  }, 2600);

  window.setTimeout(() => {
    toast.remove();
  }, 3000);
}

menuToggle.addEventListener("click", () => {
  const isOpen = navLinks.classList.toggle("is-open");
  menuToggle.setAttribute("aria-expanded", String(isOpen));
  // Cerrar dropdown cuando se cierra el menú
  navDropdown.classList.remove("is-open");
  navDropdownToggle.setAttribute("aria-expanded", "false");
});

// Dropdown behavior with small delay to avoid accidental closes
let closeDropdownTimeout = null;
function openDropdown() {
  if (closeDropdownTimeout) {
    clearTimeout(closeDropdownTimeout);
    closeDropdownTimeout = null;
  }
  navDropdown.classList.add("is-open");
  navDropdownToggle.setAttribute("aria-expanded", "true");
}

function closeDropdown() {
  if (closeDropdownTimeout) {
    clearTimeout(closeDropdownTimeout);
    closeDropdownTimeout = null;
  }
  navDropdown.classList.remove("is-open");
  navDropdownToggle.setAttribute("aria-expanded", "false");
}

// Desktop: open on hover/focus, close with small delay
navDropdown.addEventListener("mouseenter", () => {
  if (window.innerWidth > 960) openDropdown();
});
navDropdown.addEventListener("mouseleave", () => {
  if (window.innerWidth > 960) {
    closeDropdownTimeout = setTimeout(() => closeDropdown(), 220);
  }
});

navDropdownToggle.addEventListener("focus", () => {
  if (window.innerWidth > 960) openDropdown();
});
navDropdownToggle.addEventListener("blur", () => {
  if (window.innerWidth > 960) {
    closeDropdownTimeout = setTimeout(() => closeDropdown(), 220);
  }
});

// Keep open when moving into the menu itself
if (navDropdownMenu) {
  navDropdownMenu.addEventListener("mouseenter", () => {
    if (window.innerWidth > 960) {
      if (closeDropdownTimeout) { clearTimeout(closeDropdownTimeout); closeDropdownTimeout = null; }
      openDropdown();
    }
  });
  navDropdownMenu.addEventListener("mouseleave", () => {
    if (window.innerWidth > 960) {
      closeDropdownTimeout = setTimeout(() => closeDropdown(), 220);
    }
  });
}

// Mobile: toggle on click (unchanged behavior)
navDropdownToggle.addEventListener("click", (e) => {
  if (window.innerWidth <= 960) {
    e.preventDefault();
    const isOpen = navDropdown.classList.toggle("is-open");
    navDropdownToggle.setAttribute("aria-expanded", String(isOpen));
  }
});

// Close dropdown when clicking outside
document.addEventListener("click", (e) => {
  if (!navDropdown.contains(e.target)) {
    closeDropdown();
  }
});

// Close/cleanup on resize
window.addEventListener("resize", () => {
  if (window.innerWidth <= 960) {
    // ensure dropdown isn't stuck open when switching to mobile
    navDropdown.classList.remove("is-open");
    navDropdownToggle.setAttribute("aria-expanded", "false");
  }
  if (closeDropdownTimeout) { clearTimeout(closeDropdownTimeout); closeDropdownTimeout = null; }
});

// Cerrar dropdown al hacer click en un link
navDropdownMenu.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    navLinks.classList.remove("is-open");
    navDropdown.classList.remove("is-open");
    menuToggle.setAttribute("aria-expanded", "false");
    navDropdownToggle.setAttribute("aria-expanded", "false");
  });
});

// Cerrar dropdown al hacer click en otros links del menú
navLinks.querySelectorAll(".nav-link-main").forEach((link) => {
  link.addEventListener("click", () => {
    navLinks.classList.remove("is-open");
    menuToggle.setAttribute("aria-expanded", "false");
  });
});


forms.forEach((form) => {
  if (form === contactForm) {
    return;
  }

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    form.reset();
    showToast("Gracias. Recibimos tu mensaje y lo revisaremos pronto.");
  });
});

if (contactForm) {
  contactForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    if (!contactForm.checkValidity()) {
      contactForm.reportValidity();
      return;
    }

    const submitButton = contactForm.querySelector('button[type="submit"]');
    const formData = new FormData(contactForm);

    contactStatus.textContent = "Enviando...";
    submitButton.disabled = true;

    try {
      const response = await fetch(contactForm.action, {
        method: contactForm.method,
        body: formData,
        headers: {
          Accept: "application/json",
        },
      });

      if (!response.ok) {
        const data = await response.json().catch(() => null);
        const formspreeError = data?.errors?.[0]?.message;
        throw new Error(formspreeError || "No se pudo enviar el formulario.");
      }

      contactForm.reset();
      contactStatus.textContent = "Consulta enviada con éxito";
    } catch (error) {
      contactStatus.textContent = error.message || "Hubo un error al enviar";
    } finally {
      submitButton.disabled = false;
    }
  });
}

downloadButtons.forEach((button) => {
  button.addEventListener("click", () => {
    showToast("Recurso preparado para descargar en la version final.");
  });
});

// ========================================
// DONATION CALCULATOR
// ========================================
const donationBaseAmount = 200000;

function formatCurrency(amount) {
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    maximumFractionDigits: 0,
  }).format(amount);
}

function updateDonationResult() {
  if (!donationAmount || !donationResult) return;

  const amount = Number(donationAmount.value) || 0;
  const helpedBusinesses = amount / donationBaseAmount;
  const impactText = helpedBusinesses.toLocaleString("es-AR", {
    maximumFractionDigits: 2,
  });

  donationResult.textContent = `Con ${formatCurrency(amount)} ayudas aproximadamente a ${impactText} PyME${helpedBusinesses === 1 ? "" : "s"} a mejorar su negocio.`;
}

function setDonationModal(open) {
  if (!donationModal) return;

  donationModal.classList.toggle("is-open", open);
  donationModal.setAttribute("aria-hidden", String(!open));

  if (open) {
    updateDonationResult();
    donationAmount.focus();
  }
}

if (openDonationModal && closeDonationModal && donationModal) {
  openDonationModal.addEventListener("click", () => setDonationModal(true));
  closeDonationModal.addEventListener("click", () => setDonationModal(false));

  donationModal.addEventListener("click", (event) => {
    if (event.target === donationModal) {
      setDonationModal(false);
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && donationModal.classList.contains("is-open")) {
      setDonationModal(false);
    }
  });
}

if (donationAmount) {
  donationAmount.addEventListener("input", updateDonationResult);
}

// ========================================
// REVEAL ANIMATIONS (IntersectionObserver)
// ========================================
const revealElements = document.querySelectorAll(".reveal, .reveal-left, .reveal-right");

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("is-visible");
      revealObserver.unobserve(entry.target);
    }
  });
}, {
  threshold: 0.12,
  rootMargin: "0px 0px -40px 0px"
});

revealElements.forEach((el) => revealObserver.observe(el));

// ========================================
// ANIMATED COUNTERS
// ========================================
const counterNumbers = document.querySelectorAll(".counter-number");
let countersAnimated = false;

function animateCounters() {
  if (countersAnimated) return;
  countersAnimated = true;

  counterNumbers.forEach((counter) => {
    const target = parseInt(counter.getAttribute("data-target"), 10);
    const duration = 1800;
    const startTime = performance.now();

    function updateCounter(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(eased * target);
      counter.textContent = current;

      if (progress < 1) {
        requestAnimationFrame(updateCounter);
      } else {
        counter.textContent = target;
      }
    }

    requestAnimationFrame(updateCounter);
  });
}

const countersSection = document.querySelector(".section-impact");
if (countersSection) {
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        animateCounters();
        counterObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });

  counterObserver.observe(countersSection);
}

// ========================================
// TESTIMONIAL CAROUSEL
// ========================================
const track = document.getElementById("testimonialTrack");
const dots = document.querySelectorAll(".carousel-dot");
const prevBtn = document.getElementById("carouselPrev");
const nextBtn = document.getElementById("carouselNext");

if (track && dots.length > 0) {
  let currentSlide = 0;
  const totalSlides = dots.length;
  let autoplayInterval;

  function goToSlide(index) {
    currentSlide = ((index % totalSlides) + totalSlides) % totalSlides;
    track.style.transform = `translateX(-${currentSlide * 100}%)`;
    dots.forEach((d, i) => d.classList.toggle("active", i === currentSlide));
  }

  function nextSlide() {
    goToSlide(currentSlide + 1);
  }

  function startAutoplay() {
    stopAutoplay();
    autoplayInterval = setInterval(nextSlide, 5000);
  }

  function stopAutoplay() {
    clearInterval(autoplayInterval);
  }

  prevBtn.addEventListener("click", () => {
    goToSlide(currentSlide - 1);
    startAutoplay();
  });

  nextBtn.addEventListener("click", () => {
    goToSlide(currentSlide + 1);
    startAutoplay();
  });

  dots.forEach((dot, i) => {
    dot.addEventListener("click", () => {
      goToSlide(i);
      startAutoplay();
    });
  });

  startAutoplay();
}

// ========================================
// HERO PARTICLES
// ========================================
const heroCanvas = document.getElementById("heroParticles");
if (heroCanvas) {
  const ctx = heroCanvas.getContext("2d");
  let width, height;
  let mouse = { x: -9999, y: -9999 };

  const COLORS = [
    "rgba(67, 217, 200,",
    "rgba(47, 100, 255,",
    "rgba(109, 93, 252,",
    "rgba(96, 239, 255,",
  ];

  const PARTICLE_COUNT = 70;
  const MOUSE_RADIUS = 140;
  let particles = [];

  function resize() {
    const hero = heroCanvas.parentElement;
    width = heroCanvas.width = hero.offsetWidth;
    height = heroCanvas.height = hero.offsetHeight;
  }

  class Particle {
    constructor() {
      this.reset();
    }

    reset() {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.baseX = this.x;
      this.baseY = this.y;
      this.size = Math.random() * 3 + 1;
      this.color = COLORS[Math.floor(Math.random() * COLORS.length)];
      this.opacity = Math.random() * 0.5 + 0.15;
      this.vx = (Math.random() - 0.5) * 0.3;
      this.vy = (Math.random() - 0.5) * 0.3;
      this.drift = Math.random() * Math.PI * 2;
      this.driftSpeed = Math.random() * 0.006 + 0.002;
      this.driftRadius = Math.random() * 25 + 8;
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = this.color + this.opacity + ")";
      ctx.fill();
    }

    update() {
      this.drift += this.driftSpeed;
      let targetX = this.baseX + Math.cos(this.drift) * this.driftRadius;
      let targetY = this.baseY + Math.sin(this.drift) * this.driftRadius;

      let dx = mouse.x - this.x;
      let dy = mouse.y - this.y;
      let dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < MOUSE_RADIUS) {
        let force = (MOUSE_RADIUS - dist) / MOUSE_RADIUS;
        let angle = Math.atan2(dy, dx);
        targetX -= Math.cos(angle) * force * 60;
        targetY -= Math.sin(angle) * force * 60;
        this.opacity = Math.min(0.8, this.opacity + 0.015);
      } else {
        this.opacity += (0.2 + Math.random() * 0.2 - this.opacity) * 0.01;
      }

      this.x += (targetX - this.x) * 0.04;
      this.y += (targetY - this.y) * 0.04;

      this.baseX += this.vx;
      this.baseY += this.vy;

      if (this.baseX < 0 || this.baseX > width) this.vx *= -1;
      if (this.baseY < 0 || this.baseY > height) this.vy *= -1;

      this.draw();
    }
  }

  function initParticles() {
    resize();
    particles = [];
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      particles.push(new Particle());
    }
  }

  function drawLines() {
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        let dx = particles[i].x - particles[j].x;
        let dy = particles[i].y - particles[j].y;
        let dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 90) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = "rgba(47, 100, 255," + (1 - dist / 90) * 0.08 + ")";
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
    }
  }

  function animate() {
    ctx.clearRect(0, 0, width, height);
    particles.forEach((p) => p.update());
    drawLines();
    requestAnimationFrame(animate);
  }

  window.addEventListener("resize", () => {
    resize();
    particles.forEach((p) => {
      p.baseX = Math.random() * width;
      p.baseY = Math.random() * height;
    });
  });

  window.addEventListener("mousemove", (e) => {
    const rect = heroCanvas.getBoundingClientRect();
    mouse.x = e.clientX - rect.left;
    mouse.y = e.clientY - rect.top;
  });

  window.addEventListener("mouseleave", () => {
    mouse.x = -9999;
    mouse.y = -9999;
  });

  window.addEventListener("touchmove", (e) => {
    const rect = heroCanvas.getBoundingClientRect();
    mouse.x = e.touches[0].clientX - rect.left;
    mouse.y = e.touches[0].clientY - rect.top;
  });

  window.addEventListener("touchend", () => {
    mouse.x = -9999;
    mouse.y = -9999;
  });

  initParticles();
  animate();
}
