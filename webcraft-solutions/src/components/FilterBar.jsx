export default function FilterBar({ selects = [] }) {
  return (
    <div className='filters'>
      {selects.map(({ id, labelSr, value, onChange, options, placeholder }, idx) => (
        <label key={id || idx}>
          <span className='sr-only'>{labelSr}</span>
          <select
            id={id}
            className='select'
            value={value}
            onChange={(e) => onChange(e.target.value)}>
            <option value=''>{placeholder}</option>
            {options.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        </label>
      ))}
    </div>
  );
}
