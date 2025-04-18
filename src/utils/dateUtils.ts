'use client'
//type DateOrNull = Date | null

export const dateFromString = (dateString: string): Date | undefined => {
  return dateString != 'null' ? new Date(dateString) : undefined
}

// export const formatDatesFromObject = <T extends Record<string, unknown>>(
export const formatDateFields = <T>(data: T, dateFields: (keyof T)[]): T => {
  const formattedData = { ...data }
  dateFields.forEach(field => (formattedData[field] = dateFromString(String(data[field])) as T[keyof T]))

  return formattedData
}
