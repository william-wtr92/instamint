import {
  createContext,
  type FC,
  type PropsWithChildren,
  useContext,
} from "react"

import type { AppContextProviderProps, AppContextType } from "@/types"
import { config } from "@/web/config"
import { prepareServices } from "@/web/services/prepareServices"
import { createApiClient } from "@/web/utils/api/createApiClient"

const AppContext = createContext<AppContextType | undefined>(undefined)

export const AppContextProvider: FC<
  PropsWithChildren<AppContextProviderProps>
> = ({ children }) => {
  const api = createApiClient({ baseURL: config.api.baseUrl })

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
