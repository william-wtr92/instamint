import {
  type FC,
  type PropsWithChildren,
  useState,
  createContext,
  useContext,
  useCallback,
} from "react"
import { useTranslation } from "next-i18next"

import type { ActionsContextType, AppContextProviderProps } from "@/types"
import { useShowTemp } from "@/web/hooks/customs/useShowTemp"
import { useRouter } from "next/router"
import type { ClientRoutes } from "@/web/routes"

const ActionsContext = createContext<ActionsContextType | undefined>(undefined)

export const ActionsProvider: FC<
  PropsWithChildren<AppContextProviderProps>
> = ({ children }) => {
  const router = useRouter()
  const { i18n } = useTranslation()
  const [language, setLanguage] = useState<string>("en")
  const changeLanguage = useCallback(
    async (newLanguage: string) => {
      setLanguage(newLanguage)
      await i18n.changeLanguage(newLanguage)
    },
    [i18n]
  )

  const [error, setError] = useShowTemp<Error | string | null>(null, 6000)
  const [success, setSuccess] = useShowTemp<string | null>(null, 3000)

  const redirect = useCallback(
    (link: ClientRoutes, delay = 3000) => {
      const timeoutId = setTimeout(() => {
        router.push(link)
      }, delay)

      return () => clearTimeout(timeoutId)
    },
    [router]
  )

  const value = {
    language,
    changeLanguage,
    redirect,
    error,
    setError,
    success,
    setSuccess,
  }

  return (
    <ActionsContext.Provider value={value}>{children}</ActionsContext.Provider>
  )
}

const useActionsContext = () => {
  const context = useContext(ActionsContext)

  if (context === undefined) {
    throw new Error("useActionsContext must be used within an ActionsProvider")
  }

  return context
}

export default useActionsContext
