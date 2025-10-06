// components/Pagination.jsx
export function Pagination({ currentPage, totalPages, onPageChange }) {
  return (
    <div className="mt-4 flex justify-center gap-2">
      <button
        className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
        onClick={() => onPageChange((prev) => Math.max(prev - 1, 1))}
        disabled={currentPage === 1}
      >
        « Anterior
      </button>

      {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
        <button
          key={pageNum}
          className={`px-3 py-1 rounded ${
            pageNum === currentPage
              ? 'bg-blue-600 text-white'
              : 'bg-gray-200 hover:bg-gray-300'
          }`}
          onClick={() => onPageChange(pageNum)}
        >
          {pageNum}
        </button>
      ))}

      <button
        className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
        onClick={() => onPageChange((prev) => Math.min(prev + 1, totalPages))}
        disabled={currentPage === totalPages}
      >
        Siguiente »
      </button>
    </div>
  );
}