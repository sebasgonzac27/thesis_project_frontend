export function replaceEmptyStringsWithNull<T>(data: T): T {
  if (typeof data === 'object' && data !== null) {
    // Manejamos objetos
    const transformedData = Array.isArray(data) ? [] : ({} as Record<string, unknown>)
    for (const key in data) {
      transformedData[key] = replaceEmptyStringsWithNull(data[key])
    }
    return transformedData as T
  }

  if (Array.isArray(data)) {
    // Manejamos arrays
    return data.map(item => replaceEmptyStringsWithNull(item)) as any[]
  }

  if (data === '') {
    // Reemplazamos strings vacíos con null
    return null
  }

  // Retornamos otros valores sin cambios
  return data
}
