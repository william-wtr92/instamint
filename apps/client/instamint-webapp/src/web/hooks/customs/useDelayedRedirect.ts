import { useRouter } from "next/router"
import { useEffect } from "react"

import useActionsContext from "@/web/contexts/useActionsContext"

export const useDelayedRedirect = () => {
  const router = useRouter()
  const { redirectDelay, redirectLink, redirectTrigger } = useActionsContext()

  useEffect(() => {
    if (redirectTrigger) {
      const timeout = setTimeout(async () => {
        await router.push(redirectLink)
      }, redirectDelay)

      return () => clearTimeout(timeout)
    }
  }, [router, redirectLink, redirectDelay, redirectTrigger])
}
