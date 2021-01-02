export const normalizePath = (path: string) => {
  if (path.endsWith('.js') || path.endsWith('.css')) {
    return 'static-resource'
  }

  const withoutUUID = path.replace(
    /\b[0-9a-f]{8}\b-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-\b[0-9a-f]{12}\b/,
    ':id'
  )

  return withoutUUID
}
