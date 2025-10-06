// hooks/usePagination.js
export function usePagination(items, currentPage, itemsPerPage) {
  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const paginatedItems = items.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(items.length / itemsPerPage);

  return { paginatedItems, totalPages, indexOfFirst, indexOfLast };
}