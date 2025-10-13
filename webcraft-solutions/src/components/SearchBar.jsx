export default function SearchBar({ value, onChange, placeholder = "Rechercher…", id }) {
  return (
    <input
      id={id}
      type='search'
      className='input'
      placeholder={placeholder}
      aria-label={placeholder}
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
  );
}
