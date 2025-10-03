// js/app.js
import { fetchProjects } from "./api.js";
import { state, setData } from "./state.js";
import { renderLoader, renderError, clearError, renderFilters, renderGrid } from "./ui.js";
import { initFilters } from "./filters.js";
import { initModal } from "./modal.js";

document.addEventListener("DOMContentLoaded", async () => {
  // année footer
  const yearEls = document.querySelectorAll("#year");
  yearEls.forEach((el) => (el.textContent = new Date().getFullYear()));

  initModal();
  clearError();
  renderLoader(true);

  try {
    const data = await fetchProjects();
    setData(data);

    renderFilters(state.technologies || []);
    initFilters();

    renderGrid(state.projects || []);
  } catch (err) {
    renderError("Impossible de charger les projets. Veuillez réessayer.");
  } finally {
    renderLoader(false);
  }
});
