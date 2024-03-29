import { useRouter } from "next/router"
import { useEffect } from "react"

export const useDelayedRedirect = (
  path: string,
  duration: number,
  trigger: boolean
) => {
  const router = useRouter()

  useEffect(() => {
    if (trigger) {
      const timeout = setTimeout(async () => {
        await router.push(path)
      }, duration)

      return () => clearTimeout(timeout)
    }
  }, [path, duration, router, trigger])
}
