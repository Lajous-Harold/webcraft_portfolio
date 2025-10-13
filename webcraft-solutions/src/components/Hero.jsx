export default function Hero({ title, subtitle, small = false }) {
  return (
    <section className={`hero ${small ? "hero--small" : ""}`}>
      <div className='container'>
        <h1 className='hero__title'>{title}</h1>
        {subtitle && <p className='hero__subtitle'>{subtitle}</p>}
        <div className='hero__bubbles' aria-hidden='true'>
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>
    </section>
  );
}
