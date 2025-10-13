export default function Footer() {
  const y = new Date().getFullYear();
  return (
    <footer className='footer'>
      <div className='container footer__inner'>
        <p>© {y} WebCraft Solutions</p>
        <div className='socials'>
          <a href='#' aria-label='Twitter'>
            Twitter
          </a>
          <a href='#' aria-label='LinkedIn'>
            LinkedIn
          </a>
          <a href='#' aria-label='Dribbble'>
            Dribbble
          </a>
        </div>
      </div>
    </footer>
  );
}
