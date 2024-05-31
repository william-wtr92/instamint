export const formatDate = (isoString: string) => {
  const date = new Date(isoString)

  const day = String(date.getUTCDate()).padStart(2, "0")
  const month = String(date.getUTCMonth() + 1).padStart(2, "0")
  const year = date.getUTCFullYear()

  return `${day}/${month}/${year}`
}

type TimePassed = {
  value: number
  type: "day" | "hour" | "minute"
}

export const timePassed = (isoString: string): TimePassed => {
  const date = new Date(isoString)
  const currentDate = new Date()

  const diff = currentDate.getTime() - date.getTime()

  const ONE_MINUTE = 1000 * 60
  const ONE_HOUR = 1000 * 60 * 60
  const ONE_DAY = 1000 * 60 * 60 * 24

  if (diff > ONE_DAY) {
    return {
      value: Math.floor(diff / ONE_DAY),
      type: "day",
    }
  }

  if (diff < ONE_HOUR) {
    return {
      value: Math.floor(diff / ONE_MINUTE),
      type: "minute",
    }
  }

  return {
    value: Math.floor(diff / ONE_HOUR),
    type: "hour",
  }
}

export const dateIntoString = (isoDate: string, locale: string) => {
  const [day, month, year] = isoDate.split("/").map(Number)

  // Création d'un objet Date
  const date = new Date(year, month - 1, day)

  // Options pour la mise en forme de la date
  const options: Intl.DateTimeFormatOptions = {
    day: "numeric",
    month: "long",
    year: "numeric",
  }

  const lang = locale === "en" ? "en-US" : "fr-FR"

  // Formater la date en français
  return new Intl.DateTimeFormat(lang, options).format(date)
}
