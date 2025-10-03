// js/ui.js
import { state, getFilteredProjects } from "./state.js";
import { openProjectModal } from "./modal.js";

const grid = document.getElementById("grid");
const filtersCtn = document.getElementById("filters");
const loader = document.getElementById("loader");
const errorBox = document.getElementById("error");
const toast = document.getElementById("toast");

export function renderLoader(show) {
  if (!loader) return;
  loader.classList.toggle("hidden", !show);
}

export function renderError(msg) {
  if (!errorBox) return;
  errorBox.textContent = msg;
  errorBox.classList.remove("hidden");
}

export function clearError() {
  if (!errorBox) return;
  errorBox.classList.add("hidden");
  errorBox.textContent = "";
}

export function renderMessage(msg) {
  if (!toast) return;
  toast.textContent = msg;
  toast.classList.remove("hidden");
}

export function hideMessage() {
  if (!toast) return;
  toast.classList.add("hidden");
  toast.textContent = "";
}

export function badge(tech) {
  const safe = escapeHtml(tech);
  return `<span class="inline-flex items-center rounded-full bg-slate-800 border border-slate-700 px-2 py-0.5 text-xs">${safe}</span>`;
}

export function renderFilters(technologies) {
  if (!filtersCtn) return;
  const buttons = [
    `<button type="button" data-tech="ALL" class="filter-btn aria-pressed-true rounded-full border border-slate-700 bg-slate-800 px-3 py-1 text-sm hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-primary">Tous</button>`,
    ...technologies.map((t) => {
      const safe = escapeHtml(t);
      return `<button type="button" data-tech="${safe}" class="filter-btn rounded-full border border-slate-700 bg-slate-900 px-3 py-1 text-sm hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-primary">${safe}</button>`;
    }),
  ];
  filtersCtn.innerHTML = buttons.join("");
}

export function renderGrid(projects) {
  if (!grid) return;
  hideMessage();
  if (!projects || projects.length === 0) {
    grid.innerHTML = "";
    renderMessage("Aucun projet trouvé.");
    return;
  }

  const cards = projects
    .map((p) => {
      const techs = (p.technologies || []).map(badge).join(" ");
      const imgAlt = `Aperçu du projet ${escapeHtml(p.title || "")}`;
      return `
      <article class="group rounded-2xl border border-slate-800 bg-slate-900 overflow-hidden hover:border-slate-700 transition">
        <div class="aspect-video bg-slate-800">
          <img src="${escapeAttr(
            p.image || ""
          )}" alt="${imgAlt}" class="h-full w-full object-cover">
        </div>
        <div class="p-4 space-y-2">
          <h3 class="text-lg font-semibold">${escapeHtml(p.title || "Projet")}</h3>
          <p class="text-sm text-slate-400">Client — ${escapeHtml(p.client || "N. C.")}</p>
          <div class="flex flex-wrap gap-2">${techs}</div>
          <div class="pt-2">
            <button type="button"
                    class="open-modal rounded-lg bg-primary px-3 py-1.5 font-medium text-slate-900 hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-primary"
                    data-id="${String(p.id)}">
              Voir détails
            </button>
          </div>
        </div>
      </article>
    `;
    })
    .join("");

  grid.innerHTML = cards;

  // Bind events
  grid.querySelectorAll(".open-modal").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const id = e.currentTarget.getAttribute("data-id");
      const project = state.projects.find((p) => String(p.id) === String(id));
      if (project) {
        state.lastFocusedButton = e.currentTarget;
        openProjectModal(project);
      }
    });
  });
}

export function updateActiveFilterButton(tech) {
  const btns = filtersCtn?.querySelectorAll(".filter-btn") || [];
  btns.forEach((b) => {
    const isActive = b.getAttribute("data-tech") === tech;
    if (isActive) {
      b.classList.add("bg-slate-800", "border-slate-600");
      b.setAttribute("aria-pressed", "true");
    } else {
      b.classList.remove("bg-slate-800", "border-slate-600");
      b.setAttribute("aria-pressed", "false");
    }
  });
}

function escapeHtml(str) {
  return String(str).replace(
    /[&<>"']/g,
    (s) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[s])
  );
}
function escapeAttr(str) {
  return escapeHtml(str);
}
