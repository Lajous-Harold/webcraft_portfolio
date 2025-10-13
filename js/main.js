// ===== Config & State =====
const API_PROJECTS = 'https://webcraft-api.vercel.app/data/projects.json';
const API_COURSES  = 'https://webcraft-api.vercel.app/data/courses.json';

const state = {
  projects: [],
  projectsTech: [],
  projectsCat: [],
  courses: [],
  courseCats: [],
  courseLevels: [],
  courseTechs: [],
  lastFocusedButton: null
};

// ===== Helpers =====
const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

const onePxGif = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==';

const escHtml = (s='') => String(s).replace(/[&<>"']/g, m=>({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;', "'":'&#39;' }[m]));
const escAttr = (s='') => escHtml(s);

// Simple debounce pour recherche temps réel
function debounce(fn, wait=200){
  let t; return (...args)=>{ clearTimeout(t); t=setTimeout(()=>fn(...args), wait); };
}

// ===== INIT =====
document.addEventListener('DOMContentLoaded', () => {
  // Footer dates
  const y1 = $('#year'); if (y1) y1.textContent = new Date().getFullYear();
  const y2 = $('#year2'); if (y2) y2.textContent = new Date().getFullYear();

  // Page: index => charger APIs
  if ($('#projects-grid') || $('#courses-grid')) {
    loadAll();
    initProjectModal();
    initCourseModal();
  }

  // Page: inscription => validation
  if ($('#inscriptionForm')) {
    populateCoursesSelect();
    initInscriptionValidation();
  }
});

// ===== LOADERS / ERRORS =====
function show(el){ el?.removeAttribute('hidden'); }
function hide(el){ el?.setAttribute('hidden',''); }

// ===== FETCH APIs =====
async function loadAll(){
  const pl = $('#projects-loader'), pe = $('#projects-error');
  const cl = $('#courses-loader'), ce = $('#courses-error');
  show(pl); hide(pe); show(cl); hide(ce);

  try{
    const [pRes, cRes] = await Promise.all([fetch(API_PROJECTS), fetch(API_COURSES)]);
    if (!pRes.ok) throw new Error(`API Projets: ${pRes.status}`);
    if (!cRes.ok) throw new Error(`API Formations: ${cRes.status}`);

    const pData = await pRes.json();
    const cData = await cRes.json();

    state.projects      = pData.projects || [];
    state.projectsTech  = pData.technologies || [];
    state.projectsCat   = pData.categories || [];

    state.courses       = cData.courses || [];
    state.courseCats    = cData.categories || [];
    state.courseLevels  = cData.levels || [];
    state.courseTechs   = cData.technologies || [];

    renderProjectFilters();
    renderProjects(state.projects);
    renderCourseFilters();
    renderCourses(state.courses);
    bindProjectTools();
    bindCourseTools();
  }catch(err){
    console.error(err);
    pe.textContent = "Impossible de charger les projets. Réessayez plus tard.";
    ce.textContent = "Impossible de charger les formations. Réessayez plus tard.";
    show(pe); show(ce);
  }finally{
    hide(pl); hide(cl);
  }
}

// ===== RENDER – PROJECTS =====
function renderProjectFilters(){
  const techSel = $('#filter-project-tech');
  const catSel  = $('#filter-project-cat');
  if (!techSel || !catSel) return;

  techSel.innerHTML = `<option value="">Toutes technologies</option>` +
    state.projectsTech.map(t=>`<option value="${escAttr(t)}">${escHtml(t)}</option>`).join('');

  catSel.innerHTML = `<option value="">Toutes catégories</option>` +
    state.projectsCat.map(c=>`<option value="${escAttr(c)}">${escHtml(c)}</option>`).join('');
}

function badge(label, extra=''){
  const text = escHtml(label);
  return `<span class="badge ${extra}">${text}</span>`;
}

function projectCard(p){
  const techs = (p.technologies||[]).map(t=>badge(t)).join(' ');
  const img = p.image || onePxGif;
  return `
    <article class="card">
      <img class="card__img" src="${escAttr(img)}" alt="${escAttr('Aperçu du projet '+(p.title||''))}">
      <div class="card__body">
        <h3 class="card__title">${escHtml(p.title||'Projet')}</h3>
        <p class="card__subtitle">Client — ${escHtml(p.client||'N.C.')}</p>
        <div class="badges">${techs}${p.category? ' ' + badge(p.category,'badge--status'): ''}</div>
        <div class="card__actions">
          <button class="btn btn--primary open-project" data-id="${escAttr(String(p.id))}">Voir détails</button>
        </div>
      </div>
    </article>
  `;
}

function renderProjects(list){
  const grid = $('#projects-grid'); if(!grid) return;
  if (!list || !list.length){
    grid.innerHTML = `<p class="muted">Aucun projet trouvé.</p>`;
  } else {
    grid.innerHTML = list.map(projectCard).join('');
  }
  const count = $('#projects-count');
  if (count){ const n=list?.length||0; count.textContent = `${n} projet${n>1?'s':''} affiché${n>1?'s':''}.`; }

  $$('.open-project', grid).forEach(btn=>{
    btn.addEventListener('click', e=>{
      const id = btn.getAttribute('data-id');
      const p = state.projects.find(x => String(x.id)===String(id));
      if (p){ state.lastFocusedButton = btn; openProjectModal(p); }
    });
  });
}

function bindProjectTools(){
  const q = $('#search-projects');
  const sTech = $('#filter-project-tech');
  const sCat  = $('#filter-project-cat');
  const apply = ()=> {
    const term = (q?.value||'').toLowerCase().trim();
    const tech = sTech?.value || '';
    const cat  = sCat?.value  || '';
    const filtered = state.projects.filter(p=>{
      const matchesTerm = !term || [
        p.title, p.client, ...(p.technologies||[])
      ].filter(Boolean).join(' ').toLowerCase().includes(term);
      const matchesTech = !tech || (p.technologies||[]).includes(tech);
      const matchesCat  = !cat || p.category===cat;
      return matchesTerm && matchesTech && matchesCat;
    });
    renderProjects(filtered);
  };
  q?.addEventListener('input', debounce(apply, 200));
  sTech?.addEventListener('change', apply);
  sCat?.addEventListener('change', apply);
}

// ===== PROJECT MODAL (accessibilité + couleurs badge déjà gérées via CSS) =====
const pModal = $('#projectModal');
const pOverlay = $('#modalOverlay');
const pCloseTop = $('#modalClose');
const pCloseBottom = $('#modalCloseBottom');
const pTitle = $('#modalTitle');
const pImg = $('#modalImage');
const pDesc = $('#modalDesc');
const pFeatures = $('#modalFeatures');
const pBadges = $('#modalBadges');
const pLink = $('#modalLink');

function initProjectModal(){
  if (!pModal) return;
  pOverlay.addEventListener('click', closeProjectModal);
  pCloseTop.addEventListener('click', closeProjectModal);
  pCloseBottom.addEventListener('click', closeProjectModal);
  document.addEventListener('keydown', e=>{
    if (pModal.getAttribute('aria-hidden')==='false' && e.key==='Escape') closeProjectModal();
  });
}

function openProjectModal(p){
  pTitle.textContent = p.title || 'Détails du projet';
  pImg.src = p.image || onePxGif;
  pImg.alt = `Aperçu du projet ${p.title || ''}`;
  pDesc.textContent = p.description || 'Pas de description disponible.';
  pFeatures.innerHTML = Array.isArray(p.features)&&p.features.length
    ? p.features.map(f=>`<li>${escHtml(f)}</li>`).join('')
    : `<li>Fonctionnalités non précisées.</li>`;
  pBadges.innerHTML = (p.technologies||[]).map(t=>badge(t)).join(' ') + (p.category? ' '+badge(p.category,'badge--status'):'');
  if (p.url){ pLink.href = p.url; pLink.removeAttribute('aria-disabled'); }
  else { pLink.href = '#'; pLink.setAttribute('aria-disabled','true'); }

  pModal.setAttribute('aria-hidden','false');
  document.body.style.overflow='hidden';
  pCloseTop.focus();
}

function closeProjectModal(){
  pModal.setAttribute('aria-hidden','true');
  document.body.style.overflow='';
  state.lastFocusedButton?.focus?.();
}

// ===== RENDER – COURSES =====
function renderCourseFilters(){
  const cCat = $('#filter-course-cat');
  const cLvl = $('#filter-course-level');
  const cTec = $('#filter-course-tech');
  if (cCat) cCat.innerHTML = `<option value="">Toutes catégories</option>` + state.courseCats.map(c=>`<option value="${escAttr(c)}">${escHtml(c)}</option>`).join('');
  if (cLvl) cLvl.innerHTML = `<option value="">Tous niveaux</option>` + state.courseLevels.map(l=>`<option value="${escAttr(l)}">${escHtml(l)}</option>`).join('');
  if (cTec) cTec.innerHTML = `<option value="">Toutes technologies</option>` + state.courseTechs.map(t=>`<option value="${escAttr(t)}">${escHtml(t)}</option>`).join('');
}

function courseCard(c){
  const img = c.image || onePxGif;
  const techs = (c.technologies||[]).map(t=>badge(t)).join(' ');
  const lvl = badge(c.level || 'Niveau', 'badge--level');
  const status = badge(c.available ? 'Disponible' : 'Complet', 'badge--status');
  return `
    <article class="card">
      <img class="card__img" src="${escAttr(img)}" alt="${escAttr('Aperçu de la formation '+(c.title||''))}">
      <div class="card__body">
        <h3 class="card__title">${escHtml(c.title||'Formation')}</h3>
        <p class="card__subtitle">${escHtml(c.category||'Catégorie')} • ${lvl}</p>
        <div class="card__meta">
          <span>Durée : ${escHtml(c.duration||'N.C.')}</span>
          <span>Prix : ${escHtml(c.price||'N.C.')}</span>
          <span>Note : ${escHtml(String(c.rating||'N.C.'))} ⭐</span>
          <span>Étudiants : ${escHtml(String(c.students||'N.C.'))}</span>
        </div>
        <div class="badges">${techs} ${status}</div>
        <div class="card__actions">
          <button class="btn btn--primary open-course" data-id="${escAttr(String(c.id))}">Voir détails</button>
          <a class="btn" href="./inscription.html">S'inscrire</a>
        </div>
      </div>
    </article>
  `;
}

function renderCourses(list){
  const grid = $('#courses-grid'); if(!grid) return;
  if (!list || !list.length){
    grid.innerHTML = `<p class="muted">Aucune formation trouvée.</p>`;
  } else {
    grid.innerHTML = list.map(courseCard).join('');
  }
  const count = $('#courses-count');
  if (count){ const n=list?.length||0; count.textContent = `${n} formation${n>1?'s':''} affichée${n>1?'s':''}.`; }

  $$('.open-course', grid).forEach(btn=>{
    btn.addEventListener('click', ()=>{
      const id = btn.getAttribute('data-id');
      const c = state.courses.find(x => String(x.id)===String(id));
      if (c){ state.lastFocusedButton = btn; openCourseModal(c); }
    });
  });
}

function bindCourseTools(){
  const q = $('#search-courses');
  const sCat = $('#filter-course-cat');
  const sLvl = $('#filter-course-level');
  const sTec = $('#filter-course-tech');
  const apply = ()=>{
    const term = (q?.value||'').toLowerCase().trim();
    const cat = sCat?.value || '';
    const lvl = sLvl?.value || '';
    const tec = sTec?.value || '';
    const filtered = state.courses.filter(c=>{
      const matchesTerm = !term || [c.title, ...(c.technologies||[])].filter(Boolean).join(' ').toLowerCase().includes(term);
      const mCat = !cat || c.category===cat;
      const mLvl = !lvl || c.level===lvl;
      const mTec = !tec || (c.technologies||[]).includes(tec);
      return matchesTerm && mCat && mLvl && mTec;
    });
    renderCourses(filtered);
  };
  q?.addEventListener('input', debounce(apply, 200));
  sCat?.addEventListener('change', apply);
  sLvl?.addEventListener('change', apply);
  sTec?.addEventListener('change', apply);
}

// ===== COURSE MODAL =====
const cModal = $('#courseModal');
const cOverlay = $('#courseOverlay');
const cCloseTop = $('#courseClose');
const cCloseBottom = $('#courseCloseBottom');
const cTitle = $('#courseTitle');
const cImg = $('#courseImage');
const cDesc = $('#courseDesc');
const cBadges = $('#courseBadges');
const cModules = $('#courseModules');
const cTrainer = $('#courseTrainer');

function initCourseModal(){
  if (!cModal) return;
  cOverlay.addEventListener('click', closeCourseModal);
  cCloseTop.addEventListener('click', closeCourseModal);
  cCloseBottom.addEventListener('click', closeCourseModal);
  document.addEventListener('keydown', e=>{
    if (cModal.getAttribute('aria-hidden')==='false' && e.key==='Escape') closeCourseModal();
  });
}

function openCourseModal(c){
  cTitle.textContent = c.title || 'Détails de la formation';
  cImg.src = c.image || onePxGif;
  cImg.alt = `Aperçu de la formation ${c.title || ''}`;
  cDesc.textContent = c.description || 'Pas de description disponible.';
  cBadges.innerHTML = (c.technologies||[]).map(t=>badge(t)).join(' ') + ' ' + badge(c.level||'Niveau','badge--level');
  cModules.innerHTML = Array.isArray(c.modules)&&c.modules.length
    ? c.modules.map(m=>`<li>${escHtml(m)}</li>`).join('')
    : `<li>Programme non précisé.</li>`;
  cTrainer.textContent = c.trainer ? `Formateur : ${c.trainer}` : '';

  cModal.setAttribute('aria-hidden','false');
  document.body.style.overflow='hidden';
  cCloseTop.focus();
}

function closeCourseModal(){
  cModal.setAttribute('aria-hidden','true');
  document.body.style.overflow='';
  state.lastFocusedButton?.focus?.();
}

// ===== PAGE INSCRIPTION – Peupler le select + Validation =====
async function populateCoursesSelect(){
  const sel = $('#course'); if (!sel) return;
  try{
    const res = await fetch(API_COURSES);
    if (!res.ok) throw new Error(res.status);
    const data = await res.json();
    const options = (data.courses||[]).map(c=>`<option value="${escAttr(c.title)}">${escHtml(c.title)}</option>`).join('');
    sel.insertAdjacentHTML('beforeend', options);
  }catch(_e){
    // non bloquant, l’utilisateur peut saisir autrement
  }
}

// Regex imposées
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phoneRegex = /^\+?[0-9][0-9\s\-().]{6,}$/;

function initInscriptionValidation(){
  const form = $('#inscriptionForm'); if (!form) return;

  const fields = {
    firstname: { el: $('#firstname'),  err: $('#error-firstname'),  validator: v => v.trim().length >= 2 || 'Au moins 2 caractères.' },
    lastname:  { el: $('#lastname'),   err: $('#error-lastname'),   validator: v => v.trim().length >= 2 || 'Au moins 2 caractères.' },
    email:     { el: $('#email'),      err: $('#error-email'),      validator: v => emailRegex.test(v) || 'Email invalide.' },
    phone:     { el: $('#phone'),      err: $('#error-phone'),      validator: v => phoneRegex.test(v) || 'Format international attendu.' },
    course:    { el: $('#course'),     err: $('#error-course'),     validator: v => v.trim().length>0 || 'Sélectionnez une formation.' },
    level:     { el: $('#level'),      err: $('#error-level'),      validator: v => v.trim().length>0 || 'Choisissez un niveau.' },
    motivation:{ el: $('#motivation'), err: $('#error-motivation'), validator: v => v.trim().length >= 50 || 'Au moins 50 caractères.' }
  };

  // Validation temps réel
  Object.values(fields).forEach(({el, err, validator})=>{
    el.addEventListener('input', debounce(()=>{
      const res = validator(el.value);
      if (res === true){ err.textContent=''; el.classList.remove('invalid'); el.classList.add('valid'); }
      else { err.textContent = res; el.classList.add('invalid'); el.classList.remove('valid'); }
    }, 150));
  });

  const loader = $('#form-loader');
  const success = $('#form-success');
  const globalErr = $('#form-error');

  form.addEventListener('submit', e=>{
    e.preventDefault();
    hide(success); hide(globalErr);

    // Validation globale
    let ok = true;
    Object.values(fields).forEach(({el, err, validator})=>{
      const res = validator(el.value);
      if (res===true){ err.textContent=''; el.classList.remove('invalid'); }
      else { err.textContent=res; el.classList.add('invalid'); ok=false; }
    });

    if (!ok){
      globalErr.textContent = 'Veuillez corriger les champs en rouge.';
      show(globalErr);
      return;
    }

    // Simulation envoi + reset
    show(loader);
    setTimeout(()=>{
      hide(loader);
      form.reset();
      Object.values(fields).forEach(({el, err})=>{ el.classList.remove('invalid','valid'); err.textContent=''; });
      show(success);
      window.scrollTo({top: form.offsetTop-20, behavior:'smooth'});
    }, 800);
  });
}
