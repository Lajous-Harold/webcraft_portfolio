// js/api.js
export const API_URL = "https://gabistam.github.io/Demo_API/data/projects.json";

export async function fetchProjects() {
  try {
    const res = await fetch(API_URL, { method: "GET" });
    if (!res.ok) throw new Error(`Erreur serveur ${res.status}`);
    const data = await res.json();
    // Assure la structure attendue
    if (!data.projects || !Array.isArray(data.projects)) {
      throw new Error("Format de données invalide");
    }
    return {
      projects: data.projects,
      technologies: Array.isArray(data.technologies) ? data.technologies : [],
      categories: Array.isArray(data.categories) ? data.categories : [],
    };
  } catch (err) {
    console.error("fetchProjects error:", err);
    throw err;
  }
}
