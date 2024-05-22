export const pluralCheckNumber = (data: number | undefined) => {
  if (data !== undefined && data > 1) {
    return true
  }

  return false
}

export const pluralCheckArray = (data: unknown[]) => {
  if (data.length) {
    return true
  }

  return false
}
