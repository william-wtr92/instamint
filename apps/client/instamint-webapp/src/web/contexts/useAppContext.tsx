import {
  createContext,
  type FC,
  type PropsWithChildren,
  useContext,
  useState,
} from "react"

import { createApiClient } from "@/web/services/createApiClient"
import { config } from "@/web/config"
import type { AppContextProviderProps, AppContextType } from "@/types"
import { prepareServices } from "@/web/services/prepareServices"

const AppContext = createContext<AppContextType | undefined>(undefined)

export const AppContextProvider: FC<
  PropsWithChildren<AppContextProviderProps>
> = ({ children }) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [jwt, setJwt] = useState<string | undefined>(undefined)
  const api = createApiClient({ jwt, baseURL: config.api.baseUrl })

  const services = prepareServices({ api })

  return <AppContext.Provider value={services}>{children}</AppContext.Provider>
}

const useAppContext = () => {
  const context = useContext(AppContext)

  if (context === undefined) {
    throw new Error("useAppContext must be used within an AppContextProvider")
  }

  return context
}

export default useAppContext
