export const queryParamsHelper = (params: string | string[] | undefined) => {
  let validationValue: string | null = null

  if (params === null) {
    return null
  }

  if (typeof params === "string") {
    validationValue = params
  } else if (Array.isArray(params)) {
    validationValue = params[0]
  }

  return validationValue
}
