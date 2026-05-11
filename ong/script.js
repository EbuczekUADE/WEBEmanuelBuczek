const menuToggle = document.querySelector(".menu-toggle");
const navLinks = document.querySelector("#navLinks");
const forms = document.querySelectorAll("form");
const downloadButtons = document.querySelectorAll(".download-btn");

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
});

navLinks.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    navLinks.classList.remove("is-open");
    menuToggle.setAttribute("aria-expanded", "false");
  });
});

forms.forEach((form) => {
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    form.reset();
    showToast("Gracias. Recibimos tu mensaje y lo revisaremos pronto.");
  });
});

downloadButtons.forEach((button) => {
  button.addEventListener("click", () => {
    showToast("Recurso preparado para descargar en la version final.");
  });
});
