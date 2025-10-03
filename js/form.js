// js/form.js
const form = document.getElementById("contactForm");
const errName = document.getElementById("err-name");
const errEmail = document.getElementById("err-email");
const errMessage = document.getElementById("err-message");
const ok = document.getElementById("formSuccess");
const yearEls = document.querySelectorAll("#year");

yearEls.forEach((el) => (el.textContent = new Date().getFullYear()));

if (form) {
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    clearErrors();
    ok?.classList.add("hidden");

    const name = form.name.value.trim();
    const email = form.email.value.trim();
    const message = form.message.value.trim();

    let valid = true;
    if (name.length === 0) {
      showFieldError(errName, "Le nom est requis.");
      valid = false;
    }
    if (!isValidEmail(email)) {
      showFieldError(errEmail, "Email invalide.");
      valid = false;
    }
    if (message.length < 10) {
      showFieldError(errMessage, "Message trop court. 10 caractères minimum.");
      valid = false;
    }

    if (!valid) return;

    // Simulation d’envoi
    ok?.classList.remove("hidden");
    form.reset();
  });
}

function showFieldError(el, msg) {
  if (!el) return;
  el.textContent = msg;
  el.classList.remove("hidden");
}
function clearErrors() {
  [errName, errEmail, errMessage].forEach((el) => el && el.classList.add("hidden"));
}
function isValidEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}
