// components/SearchBar.jsx
import { FaSearch } from 'react-icons/fa';

export function SearchBar({ value, onChange, placeholder }) {
  return (
    <div className="relative mb-4 md:w-1/2">
      <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
      <input
        type="text"
        placeholder={placeholder}
        className="pl-10 pr-8 py-2 border rounded w-full"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
      {value && (
        <button
          onClick={() => onChange('')}
          className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
          title="Limpiar"
        >
          ✕
        </button>
      )}
    </div>
  );
}