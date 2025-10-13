export const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
export const phoneRegex = /^\+?[0-9][0-9\s\-().]{6,}$/;

export const validators = {
  firstname: (v) => v.trim().length >= 2 || "Au moins 2 caractères.",
  lastname: (v) => v.trim().length >= 2 || "Au moins 2 caractères.",
  email: (v) => emailRegex.test(v) || "Email invalide.",
  phone: (v) => phoneRegex.test(v) || "Format international attendu.",
  course: (v) => v.trim().length > 0 || "Sélectionnez une formation.",
  level: (v) => v.trim().length > 0 || "Choisissez un niveau.",
  motivation: (v) => v.trim().length >= 50 || "Au moins 50 caractères.",
};
