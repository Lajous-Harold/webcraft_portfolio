// js/modal.js
import { state } from "./state.js";

const modal = document.getElementById("projectModal");
const overlay = document.getElementById("modalOverlay");
const btnCloseTop = document.getElementById("modalClose");
const btnCloseBottom = document.getElementById("modalCloseBottom");
const titleEl = document.getElementById("modalTitle");
const imgEl = document.getElementById("modalImage");
const descEl = document.getElementById("modalDesc");
const featuresEl = document.getElementById("modalFeatures");
const badgesEl = document.getElementById("modalBadges");
const linkEl = document.getElementById("modalLink");

let focusable = [];
let firstFocusable = null;
let lastFocusable = null;

export function initModal() {
  if (!modal) return;
  overlay.addEventListener("click", closeModal);
  btnCloseTop.addEventListener("click", closeModal);
  btnCloseBottom.addEventListener("click", closeModal);
  document.addEventListener("keydown", (e) => {
    if (modal.classList.contains("hidden")) return;
    if (e.key === "Escape") closeModal();
    if (e.key === "Tab") trapFocus(e);
  });
}

export function openProjectModal(p) {
  titleEl.textContent = p.title || "Détails du projet";
  imgEl.src = p.image || "";
  imgEl.alt = `Aperçu du projet ${p.title || ""}`;
  descEl.textContent = p.description || "Pas de description disponible.";
  badgesEl.innerHTML = (p.technologies || [])
    .map(
      (t) =>
        `<span class="inline-flex items-center rounded-full bg-slate-800 border border-slate-700 px-2 py-0.5 text-xs">${escapeHtml(
          t
        )}</span>`
    )
    .join(" ");
  featuresEl.innerHTML =
    Array.isArray(p.features) && p.features.length
      ? p.features.map((f) => `<li>${escapeHtml(f)}</li>`).join("")
      : `<li>Fonctionnalités non précisées.</li>`;
  if (p.url) {
    linkEl.href = p.url;
    linkEl.classList.remove("pointer-events-none", "opacity-50");
  } else {
    linkEl.href = "#";
    linkEl.classList.add("pointer-events-none", "opacity-50");
  }

  document.body.classList.add("overflow-hidden");
  modal.setAttribute("aria-hidden", "false");
  modal.classList.remove("hidden");

  refreshFocusable();
  firstFocusable?.focus();
}

export function closeModal() {
  modal.classList.add("hidden");
  modal.setAttribute("aria-hidden", "true");
  document.body.classList.remove("overflow-hidden");
  // rendre le focus au bouton déclencheur
  if (state.lastFocusedButton) state.lastFocusedButton.focus();
}

function refreshFocusable() {
  focusable = modal.querySelectorAll('a, button, input, textarea, [tabindex]:not([tabindex="-1"])');
  firstFocusable = focusable[0];
  lastFocusable = focusable[focusable.length - 1];
}

function trapFocus(e) {
  if (focusable.length === 0) return;
  if (e.shiftKey && document.activeElement === firstFocusable) {
    e.preventDefault();
    lastFocusable.focus();
  } else if (!e.shiftKey && document.activeElement === lastFocusable) {
    e.preventDefault();
    firstFocusable.focus();
  }
}

function escapeHtml(str) {
  return String(str).replace(
    /[&<>"']/g,
    (s) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[s])
  );
}
