import { NavLink, Link } from "react-router-dom";

export default function Header() {
  return (
    <header className='header'>
      <div className='container header__inner'>
        <Link to='/' className='brand'>
          <img src='/logo.jfif' alt='Logo WebCraft Solutions' className='brand__logo' />
          <span className='brand__name'>WebCraft Solutions</span>
        </Link>
        <nav aria-label='Navigation principale'>
          <ul className='nav__list'>
            <li>
              <NavLink to='/' end className={({ isActive }) => (isActive ? "active" : undefined)}>
                Accueil
              </NavLink>
            </li>
            <li>
              <a href='#projets'>Projets</a>
            </li>
            <li>
              <a href='#formations'>Formations</a>
            </li>
            <li>
              <NavLink
                to='/inscription'
                className={({ isActive }) => (isActive ? "active" : undefined)}>
                Inscription
              </NavLink>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}
