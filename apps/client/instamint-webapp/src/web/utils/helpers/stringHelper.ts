export const firstLetterUppercase = (str: string | undefined) => {
  return str?.replace(/^\w/, (c) => c.toUpperCase())
}

export const firstLetter = (str: string | undefined) => {
  return str?.charAt(0).toUpperCase()
}
