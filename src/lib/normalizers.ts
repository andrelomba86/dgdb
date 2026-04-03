const collapseWhitespace = (value: string) => value.trim().replace(/\s+/g, ' ')

export const normalizeText = (value: string) => collapseWhitespace(value)

export const normalizeOptionalText = (value: string | null | undefined) => {
  if (value == null) {
    return null
  }

  const normalized = collapseWhitespace(value)
  return normalized.length > 0 ? normalized : null
}

export const normalizeEmail = (value: string | null | undefined) => {
  if (value == null) {
    return null
  }

  const normalized = collapseWhitespace(value).toLowerCase()
  return normalized.length > 0 ? normalized : null
}

export const normalizeDocumentValue = (value: string) => collapseWhitespace(value).toUpperCase()

export const normalizeBankCode = (value: string) => collapseWhitespace(value).toUpperCase()

export const normalizeCompactValue = (value: string) => collapseWhitespace(value).replace(/\s+/g, '')
