export const pluralCheckNumber = (data: number | undefined) => {
  return data !== undefined && data > 1
}

export const pluralCheckArray = (data: unknown[]) => {
  return data.length > 1
}
