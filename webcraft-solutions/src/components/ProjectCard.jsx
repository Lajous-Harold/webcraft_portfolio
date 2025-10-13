export default function ProjectCard({ project, onOpen }) {
  const img =
    project.image || "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==";
  return (
    <article className='card'>
      <img
        className='card__img'
        src={img}
        alt={`Aperçu du projet ${project.title || ""}`}
        loading='lazy'
        decoding='async'
      />
      <div className='card__body'>
        <h3 className='card__title'>{project.title || "Projet"}</h3>
        <p className='card__subtitle'>Client — {project.client || "N.C."}</p>
        <div className='badges'>
          {(project.technologies || []).map((t) => (
            <span key={t} className='badge'>
              {t}
            </span>
          ))}
          {project.category && <span className='badge badge--status'>{project.category}</span>}
        </div>
        <div className='card__actions'>
          <button className='btn btn--primary' onClick={() => onOpen(project)}>
            Voir détails
          </button>
        </div>
      </div>
    </article>
  );
}
