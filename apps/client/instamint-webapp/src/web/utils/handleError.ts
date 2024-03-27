import type { AxiosError } from "axios"

export const handleError = (error: unknown): Error => {
  if ((error as AxiosError).isAxiosError) {
    const axiosError = error as AxiosError
    let errorMessage = "Oops. Something went wrong"

    if (typeof axiosError.response?.data === "string") {
      errorMessage = axiosError.response.data
    } else if (
      axiosError.response?.data &&
      typeof axiosError.response?.data === "object"
    ) {
      // eslint-disable-next-line
      const message = (axiosError.response.data as any).message
      errorMessage =
        typeof message === "string"
          ? message
          : JSON.stringify(axiosError.response.data)
    }

    return new Error(errorMessage)
  } else {
    return new Error("An unexpected error occurred")
  }
}
