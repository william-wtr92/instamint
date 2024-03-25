import {
  createContext,
  FC,
  PropsWithChildren,
  useContext,
  useState,
} from "react"

import { createApiClient } from "@/web/services/createApiClient"
import { config } from "@/web/config"
import { AppContextProviderProps, AppContextType } from "@/types"
import signupService from "@/web/services/users/signupService"
import emailValidationService from "@/web/services/users/emailValidationService"
import resendEmailValidationService from "@/web/services/users/resendEmailValidationService"

const AppContext = createContext<AppContextType | undefined>(undefined)

export const AppContextProvider: FC<
  PropsWithChildren<AppContextProviderProps>
> = ({ children }) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [jwt, setJwt] = useState<string | undefined>(undefined)
  const api = createApiClient({ jwt, baseURL: config.api.baseUrl })

  const signup = signupService({ api })
  const emailValidation = emailValidationService({ api })
  const resendEmailValidation = resendEmailValidationService({ api })

  const value = {
    actions: {
      signup,
      emailValidation,
      resendEmailValidation,
    },
  }

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

const useAppContext = () => {
  const context = useContext(AppContext)

  if (context === undefined) {
    throw new Error("useAppContext must be used within an AppContextProvider")
  }

  return context
}

export default useAppContext
