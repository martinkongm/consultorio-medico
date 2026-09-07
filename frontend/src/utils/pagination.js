// Genera la lista de páginas visibles con "…" cuando hay muchas.
// Siempre incluye primera y última, y una ventana alrededor de la actual.
export function buildPageItems(currentPage, totalPages) {
  if (totalPages <= 0) return [];

  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  const neighbors = 1; // páginas a cada lado de la actual
  const pages = new Set([1, totalPages]);
  for (let p = currentPage - neighbors; p <= currentPage + neighbors; p += 1) {
    if (p >= 1 && p <= totalPages) pages.add(p);
  }

  const sorted = [...pages].sort((a, b) => a - b);
  const items = [];
  let prev = 0;

  for (const page of sorted) {
    if (page - prev > 1) items.push('…');
    items.push(page);
    prev = page;
  }

  return items;
}
