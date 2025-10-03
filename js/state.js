// js/state.js
export const state = {
  projects: [],
  technologies: [],
  categories: [],
  activeTech: "ALL",
  lastFocusedButton: null,
};

export function setData({ projects, technologies, categories }) {
  state.projects = projects;
  state.technologies = technologies;
  state.categories = categories;
}

export function setActiveTech(tech) {
  state.activeTech = tech;
}

export function getFilteredProjects() {
  if (state.activeTech === "ALL") return state.projects;
  return state.projects.filter(
    (p) => Array.isArray(p.technologies) && p.technologies.includes(state.activeTech)
  );
}
