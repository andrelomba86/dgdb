'use client'
//type DateOrNull = Date | null

export const formatDateFromString = (dateString: string): Date | undefined => {
  // console.log('data::::::::', dateString != null ? new Date(dateString) : undefined)
  // console.log(typeof dateString)

  return dateString !== 'null' ? new Date(dateString) : undefined
}

// export const formatDatesFromObject = <T extends Record<string, unknown>>(
export const formatDatesFromObject = <T>(data: T, dateFields: (keyof T)[]): T => {
  const formattedData = { ...data }
  dateFields.forEach(
    field => (formattedData[field] = formatDateFromString(String(data[field])) as T[keyof T])
  )

  return formattedData
}
