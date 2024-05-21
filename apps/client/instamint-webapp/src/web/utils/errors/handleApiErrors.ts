import type { AxiosError } from "axios"

type ErrorData = {
  errorCode?: string
  message?: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any
}

export const handleApiErrors = (error: unknown): Error => {
  if (!(error as AxiosError).isAxiosError) {
    return new Error("An unexpected error occurred")
  }

  const axiosError = error as AxiosError

  if (
    !axiosError.response?.data ||
    typeof axiosError.response?.data !== "object"
  ) {
    return new Error(JSON.stringify(axiosError.response?.data))
  }

  const data: ErrorData = axiosError.response.data

  if (data.errorCode) {
    return new Error(data.errorCode)
  }

  const errorMessage = data.message ? data.message : JSON.stringify(data)

  return new Error(errorMessage)
}
