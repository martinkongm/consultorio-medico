// components/Pagination.jsx
import { buildPageItems } from '../utils/pagination';

export function Pagination({ currentPage, totalPages, onPageChange }) {
  const items = buildPageItems(currentPage, totalPages);

  return (
    <nav
      className="flex flex-wrap items-center justify-center gap-1.5 mt-4"
      aria-label="Paginación"
    >
      <button
        className="px-3 py-1.5 bg-gray-200 rounded text-sm disabled:opacity-40 hover:bg-gray-300 disabled:hover:bg-gray-200"
        onClick={() => onPageChange((prev) => Math.max(prev - 1, 1))}
        disabled={currentPage <= 1}
        aria-label="Página anterior"
      >
        « Anterior
      </button>

      {items.map((item, index) =>
        item === '…' ? (
          <span
            key={`ellipsis-${index}`}
            className="px-1.5 text-gray-400 select-none"
            aria-hidden="true"
          >
            …
          </span>
        ) : (
          <button
            key={item}
            className={`px-3 py-1.5 rounded text-sm min-w-[2rem] ${
              item === currentPage
                ? 'bg-blue-600 text-white font-medium'
                : 'bg-gray-200 hover:bg-gray-300'
            }`}
            onClick={() => onPageChange(item)}
            aria-current={item === currentPage ? 'page' : undefined}
          >
            {item}
          </button>
        )
      )}

      <button
        className="px-3 py-1.5 bg-gray-200 rounded text-sm disabled:opacity-40 hover:bg-gray-300 disabled:hover:bg-gray-200"
        onClick={() => onPageChange((prev) => Math.min(prev + 1, totalPages))}
        disabled={currentPage >= totalPages}
        aria-label="Página siguiente"
      >
        Siguiente »
      </button>
    </nav>
  );
}
