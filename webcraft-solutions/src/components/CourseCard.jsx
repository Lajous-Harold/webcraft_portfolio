export default function CourseCard({ course, onOpen }) {
  const img =
    course.image || "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==";
  return (
    <article className='card'>
      <img
        className='card__img'
        src={img}
        alt={`Aperçu de la formation ${course.title || ""}`}
        loading='lazy'
        decoding='async'
      />
      <div className='card__body'>
        <h3 className='card__title'>{course.title || "Formation"}</h3>
        <p className='card__subtitle'>
          {course.category || "Catégorie"} •{" "}
          <span className='badge badge--level'>{course.level || "Niveau"}</span>
        </p>
        <div className='card__actions'>
          <button className='btn btn--primary' onClick={() => onOpen(course)}>
            Voir détails
          </button>
          <a className='btn' href='/inscription'>
            S'inscrire
          </a>
        </div>
      </div>
    </article>
  );
}
