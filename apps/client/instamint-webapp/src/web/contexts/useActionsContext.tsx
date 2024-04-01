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

const ActionsContext = createContext<ActionsContextType | undefined>(undefined)

export const ActionsProvider: FC<
  PropsWithChildren<AppContextProviderProps>
> = ({ children }) => {
  const { i18n } = useTranslation()
  const [language, setLanguage] = useState<string>("en")
  const changeLanguage = useCallback(
    async (newLanguage: string) => {
      setLanguage(newLanguage)
      await i18n.changeLanguage(newLanguage)
    },
    [i18n]
  )

  const [triggerRedirect, setTriggerRedirect] = useState(false)
  const [redirectLink, setRedirectLink] = useState("")
  const [redirectDelay, setRedirectDelay] = useState(0)
  const [error, setError] = useShowTemp<Error | string | null>(null, 6000)
  const [success, setSuccess] = useShowTemp<string | null>(null, 3000)

  const value = {
    language,
    changeLanguage,
    triggerRedirect,
    setTriggerRedirect,
    redirectLink,
    setRedirectLink,
    redirectDelay,
    setRedirectDelay,
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
