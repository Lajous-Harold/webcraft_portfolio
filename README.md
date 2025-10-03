# WebCraft Solutions – Portfolio (Front-end sans framework)

Ce projet réalise un **portfolio interactif** pour l’agence _WebCraft Solutions_ en **HTML5 + CSS (Tailwind via CDN) + JavaScript natif (ES6 modules)**, sans framework.

---

## 🚀 Fonctionnalités

- Chargement des projets via `fetch()` depuis l’API publique : `https://gabistam.github.io/Demo_API/data/projects.json`
- Filtrage dynamique par **technologie** (sans rechargement)
- **Modal** accessible (focus trap, `Esc`, overlay, `aria-*`)
- **Loader**, gestion des erreurs réseau, messages utilisateur
- **Formulaire contact** avec validation côté client
- Design responsive + **palette pastel** (FAD0C9, FAD6A5, FFABAB, FFC3A0, D5AAFF)
- Accessibilité : `alt`, `role="dialog"`, `aria-modal`, `aria-labelledby`, **skip-link**, `aria-live`
- Images optimisées : `loading="lazy"`, `decoding="async"`

---

## 🗂️ Arborescence (extrait)

```
.
├── index.html
├── about.html
├── contact.html
├── js/
│   ├── app.js
│   ├── api.js
│   ├── modal.js
│   ├── state.js
│   ├── ui.js
│   └── form.js
├── assets/
│   └── img/
│       ├── logo.jfif
│       ├── hero-placeholder.jfif
│       ├── about-placeholder.jfif
│       ├── team1.jfif
│       ├── team2.jfif
│       └── team3.jfif
└── w3c/
    ├── capture1.png  (index.html)
    ├── capture2.png  (contact.html)
    └── capture3.png  (about.html)
```

---

## 🛠️ Lancer le projet

Aucun build requis (Tailwind via **CDN**).

- Ouvrir `index.html` dans un navigateur moderne (Chrome/Edge/Firefox).
- Recommandé : servir via un petit serveur local (ex. VSCode _Live Server_) pour les requêtes AJAX.

---

## ✅ Validation W3C

Les trois pages **passent sans erreur ni warning** (Nu Html Checker). Captures :

### index.html

![W3C validation — index](w3c/capture1.png)

### contact.html

![W3C validation — contact](w3c/capture2.png)

### about.html

![W3C validation — about](w3c/capture3.png)

---

## 📐 Bonnes pratiques clés

- **Accessibilité** : skip-link, rôles ARIA, `aria-live`, focus visible, fermeture `Esc`
- **Performance** : lazy loading images, une seule requête API (puis filtrage en mémoire)
- **Qualité JS** : ES6 modules, `try/catch`, `response.ok`, messages d’erreur clairs
- **Responsive** : grilles fluides, header sticky, contrôles tactiles ok

---

## 📄 Licence

Projet d’évaluation pédagogique — usage libre.
