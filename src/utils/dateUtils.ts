type DateOrUndefined = Date | undefined

export const formatDateFromString = (dateString: string | undefined): DateOrUndefined => {
  return dateString ? new Date(dateString) : undefined
}

// export const formatDatesFromObject = <T extends Record<string, unknown>>(
export const formatDatesFromObject = <T>(data: T, dateFields: (keyof T)[]): T => {
  const formattedData = { ...data }
  dateFields.forEach(
    field => (formattedData[field] = formatDateFromString(String(data[field])) as T[keyof T])
  )

  return formattedData
}
