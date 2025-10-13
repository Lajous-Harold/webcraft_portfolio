import { useMemo, useState } from "react";
import useFetch from "../hooks/UseFetch.jsx";
import Hero from "../components/Hero.jsx";
import Loader from "../components/Loader.jsx";
import Modal from "../components/Modal.jsx";
import SearchBar from "../components/SearchBar.jsx";
import FilterBar from "../components/FilterBar.jsx";
import ProjectCard from "../components/ProjectCard.jsx";
import CourseCard from "../components/CourseCard.jsx";

const API_PROJECTS = "https://webcraft-api.vercel.app/data/projects.json";
const API_COURSES = "https://webcraft-api.vercel.app/data/courses.json";

export default function Home() {
  // Fetch
  const { data: pData, loading: pLoading, error: pError } = useFetch(API_PROJECTS);
  const { data: cData, loading: cLoading, error: cError } = useFetch(API_COURSES);

  const projects = pData?.projects ?? [];
  const pTechs = pData?.technologies ?? [];
  const pCats = pData?.categories ?? [];

  const courses = cData?.courses ?? [];
  const cCats = cData?.categories ?? [];
  const cLvls = cData?.levels ?? [];
  const cTechs = cData?.technologies ?? [];

  // UI state projets
  const [qP, setQP] = useState("");
  const [fPT, setFPT] = useState("");
  const [fPC, setFPC] = useState("");
  const filteredProjects = useMemo(() => {
    const t = qP.toLowerCase().trim();
    return projects.filter((p) => {
      const matchesTerm =
        !t ||
        [p.title, p.client, ...(p.technologies || [])]
          .filter(Boolean)
          .join(" ")
          .toLowerCase()
          .includes(t);
      const matchesTech = !fPT || (p.technologies || []).includes(fPT);
      const matchesCat = !fPC || p.category === fPC;
      return matchesTerm && matchesTech && matchesCat;
    });
  }, [projects, qP, fPT, fPC]);

  // UI state formations
  const [qC, setQC] = useState("");
  const [fCC, setFCC] = useState("");
  const [fCL, setFCL] = useState("");
  const [fCT, setFCT] = useState("");
  const filteredCourses = useMemo(() => {
    const t = qC.toLowerCase().trim();
    return courses.filter((c) => {
      const matchesTerm =
        !t ||
        [c.title, ...(c.technologies || [])].filter(Boolean).join(" ").toLowerCase().includes(t);
      const mCat = !fCC || c.category === fCC;
      const mLvl = !fCL || c.level === fCL;
      const mTec = !fCT || (c.technologies || []).includes(fCT);
      return matchesTerm && mCat && mLvl && mTec;
    });
  }, [courses, qC, fCC, fCL, fCT]);

  // Modals
  const [openProject, setOpenProject] = useState(null);
  const [openCourse, setOpenCourse] = useState(null);

  return (
    <main>
      <Hero title='Portail WebCraft' subtitle='Projets clients & Formations techniques' />

      {/* PROJETS */}
      <section id='projets' className='section'>
        <div className='container'>
          <header className='section__header'>
            <h2>Projets</h2>
            <p>Vitrine des réalisations clients (API).</p>
          </header>

          <div className='toolbar' role='group' aria-labelledby='projets-tools-title'>
            <h3 id='projets-tools-title' className='sr-only'>
              Outils de filtrage des projets
            </h3>
            <SearchBar
              value={qP}
              onChange={setQP}
              placeholder='Recherche projet (titre, client, techno)…'
            />
            <FilterBar
              selects={[
                {
                  id: "p-tech",
                  labelSr: "Filtrer par technologie",
                  value: fPT,
                  onChange: setFPT,
                  options: pTechs,
                  placeholder: "Toutes technologies",
                },
                {
                  id: "p-cat",
                  labelSr: "Filtrer par catégorie",
                  value: fPC,
                  onChange: setFPC,
                  options: pCats,
                  placeholder: "Toutes catégories",
                },
              ]}
            />
          </div>

          {pLoading && <Loader>Chargement des projets…</Loader>}
          {pError && (
            <div className='alert alert--error' role='alert'>
              Impossible de charger les projets.
            </div>
          )}

          <div className='grid' aria-live='polite'>
            {filteredProjects.map((p) => (
              <ProjectCard key={p.id} project={p} onOpen={setOpenProject} />
            ))}
          </div>

          <p className='sr-only'>{filteredProjects.length} projet(s) affiché(s).</p>
        </div>
      </section>

      {/* MODAL PROJET */}
      <Modal
        open={Boolean(openProject)}
        title={openProject?.title}
        onClose={() => setOpenProject(null)}>
        {openProject && (
          <>
            <img
              className='modal__image'
              src={
                openProject.image ||
                "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw=="
              }
              alt={`Aperçu du projet ${openProject.title || ""}`}
            />
            <p>{openProject.description || "Pas de description."}</p>
            <ul className='list'>
              {(openProject.features?.length
                ? openProject.features
                : ["Fonctionnalités non précisées."]
              ).map((f, i) => (
                <li key={i}>{f}</li>
              ))}
            </ul>
            <div className='badges'>
              {(openProject.technologies || []).map((t) => (
                <span key={t} className='badge'>
                  {t}
                </span>
              ))}
              {openProject.category && (
                <span className='badge badge--status'>{openProject.category}</span>
              )}
            </div>
            {openProject.url && (
              <a className='btn btn--primary' href={openProject.url} target='_blank' rel='noopener'>
                Visiter le site
              </a>
            )}
          </>
        )}
      </Modal>

      {/* FORMATIONS */}
      <section id='formations' className='section'>
        <div className='container'>
          <header className='section__header'>
            <h2>Formations</h2>
            <p>Catalogue interne (API).</p>
          </header>

          <div className='toolbar' role='group' aria-labelledby='courses-tools-title'>
            <h3 id='courses-tools-title' className='sr-only'>
              Outils de filtrage des formations
            </h3>
            <SearchBar
              value={qC}
              onChange={setQC}
              placeholder='Recherche formation (titre, techno)…'
            />
            <FilterBar
              selects={[
                {
                  id: "c-cat",
                  labelSr: "Filtrer par catégorie",
                  value: fCC,
                  onChange: setFCC,
                  options: cCats,
                  placeholder: "Toutes catégories",
                },
                {
                  id: "c-level",
                  labelSr: "Filtrer par niveau",
                  value: fCL,
                  onChange: setFCL,
                  options: cLvls,
                  placeholder: "Tous niveaux",
                },
                {
                  id: "c-tech",
                  labelSr: "Filtrer par technologie",
                  value: fCT,
                  onChange: setFCT,
                  options: cTechs,
                  placeholder: "Toutes technologies",
                },
              ]}
            />
          </div>

          {cLoading && <Loader>Chargement des formations…</Loader>}
          {cError && (
            <div className='alert alert--error' role='alert'>
              Impossible de charger les formations.
            </div>
          )}

          <div className='grid' aria-live='polite'>
            {filteredCourses.map((c) => (
              <CourseCard key={c.id} course={c} onOpen={setOpenCourse} />
            ))}
          </div>

          <p className='sr-only'>{filteredCourses.length} formation(s) affichée(s).</p>
        </div>
      </section>

      {/* MODAL FORMATION */}
      <Modal
        open={Boolean(openCourse)}
        title={openCourse?.title}
        onClose={() => setOpenCourse(null)}>
        {openCourse && (
          <>
            <img
              className='modal__image'
              src={
                openCourse.image ||
                "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw=="
              }
              alt={`Aperçu de la formation ${openCourse.title || ""}`}
            />
            <p>{openCourse.description || "Pas de description."}</p>
            <div className='badges'>
              {(openCourse.technologies || []).map((t) => (
                <span key={t} className='badge'>
                  {t}
                </span>
              ))}
              <span className='badge badge--level'>{openCourse.level || "Niveau"}</span>
            </div>
            <ul className='list'>
              {(openCourse.modules?.length ? openCourse.modules : ["Programme non précisé."]).map(
                (m, i) => (
                  <li key={i}>{m}</li>
                )
              )}
            </ul>
            {openCourse.trainer && <p className='muted'>Formateur : {openCourse.trainer}</p>}
            <a className='btn btn--primary' href='/inscription'>
              S'inscrire maintenant
            </a>
          </>
        )}
      </Modal>
    </main>
  );
}
