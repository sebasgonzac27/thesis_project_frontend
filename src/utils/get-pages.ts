export function getPages(totalPages: number, currentPage: number) {
  const pages = []

  // Siempre mostramos las primeras 2 páginas
  pages.push(1)
  if (totalPages > 1) pages.push(2)

  // Determinar el rango dinámico
  const start = Math.max(3, currentPage - 1) // Mostrar 1 antes de la actual
  const end = Math.min(totalPages - 2, currentPage + 1) // Mostrar 1 después de la actual

  // Si el rango dinámico no incluye algunas páginas, mostramos el ellipsis
  if (start > 3) {
    pages.push('...')
  }

  // Agregamos el rango de páginas dinámico
  for (let i = start; i <= end; i++) {
    pages.push(i)
  }

  // Si el rango dinámico no llega hasta el final, mostramos ellipsis antes de las últimas dos páginas
  if (end < totalPages - 2) {
    pages.push('...')
  }

  // Siempre mostramos las últimas dos páginas
  if (totalPages > 2) pages.push(totalPages - 1)
  if (totalPages > 1) pages.push(totalPages)

  return pages
}
