import type { AxiosError } from "axios"

export const handleApiErrors = (error: unknown): Error => {
  if ((error as AxiosError).isAxiosError) {
    const axiosError = error as AxiosError
    let errorMessage = "Oops. Something went wrong"

    if (
      axiosError.response?.data &&
      typeof axiosError.response?.data === "object"
    ) {
      if ("errorCode" in axiosError.response.data) {
        // eslint-disable-next-line
        errorMessage = (axiosError.response.data as any).errorCode
      } else {
        // eslint-disable-next-line
        const message = (axiosError.response.data as any).message
        errorMessage =
          typeof message === "string"
            ? message
            : JSON.stringify(axiosError.response.data)
      }
    }

    return new Error(errorMessage)
  } else {
    return new Error("An unexpected error occurred")
  }
}
