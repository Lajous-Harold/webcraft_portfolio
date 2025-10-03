// js/filters.js
import { state, setActiveTech, getFilteredProjects } from "./state.js";
import { renderGrid, updateActiveFilterButton } from "./ui.js";

export function initFilters() {
  const container = document.getElementById("filters");
  if (!container) return;

  container.addEventListener("click", (e) => {
    const btn = e.target.closest("button[data-tech]");
    if (!btn) return;
    const tech = btn.getAttribute("data-tech");
    setActiveTech(tech);
    updateActiveFilterButton(tech);
    renderGrid(getFilteredProjects());
  });

  // set default
  updateActiveFilterButton("ALL");
}
