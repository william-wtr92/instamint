import {
  type FC,
  type PropsWithChildren,
  useState,
  createContext,
  useContext,
  useCallback,
} from "react"
import { useTranslation } from "next-i18next"
import { useToast } from "@instamint/ui-kit"
import { useRouter } from "next/router"

import type { ActionsContextType, AppContextProviderProps } from "@/types"

const ActionsContext = createContext<ActionsContextType | undefined>(undefined)

export const ActionsProvider: FC<
  PropsWithChildren<AppContextProviderProps>
> = ({ children }) => {
  const router = useRouter()
  const { i18n } = useTranslation()
  const { toast } = useToast()

  const [language, setLanguage] = useState<string>("en")
  const changeLanguage = useCallback(
    async (newLanguage: string) => {
      setLanguage(newLanguage)
      await i18n.changeLanguage(newLanguage)
    },
    [i18n]
  )

  const redirect = useCallback(
    (link: string, delay = 3000) => {
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
    toast,
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
