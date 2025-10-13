export default function Loader({ children = "Chargement…", ...rest }) {
  return (
    <div className='loader' aria-live='polite' {...rest}>
      {children}
    </div>
  );
}
