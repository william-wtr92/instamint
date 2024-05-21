import {
  createContext,
  type FC,
  type PropsWithChildren,
  useContext,
} from "react"

import type { AppContextProviderProps, AppContextType } from "@/types"
import { config } from "@/web/config"
import { prepareApiServices } from "@/web/services/prepareApiServices"
import { prepareSocketServices } from "@/web/services/prepareSocketServices"
import { createApiClient } from "@/web/utils/api/createApiClient"
import { createSocketClient } from "@/web/utils/socket/createSocketClient"

const AppContext = createContext<AppContextType | undefined>(undefined)

export const AppContextProvider: FC<
  PropsWithChildren<AppContextProviderProps>
> = ({ children }) => {
  const api = createApiClient({ baseURL: config.api.baseUrl })
  const socket = createSocketClient({ baseUrl: config.api.baseUrl })

  const apiServices = prepareApiServices({ api })
  const socketServices = prepareSocketServices({ socket })

  return (
    <AppContext.Provider
      value={{
        ...apiServices,
        ...socketServices,
      }}
    >
      {children}
    </AppContext.Provider>
  )
}

const useAppContext = () => {
  const context = useContext(AppContext)

  if (context === undefined) {
    throw new Error("useAppContext must be used within an AppContextProvider")
  }

  return context
}

export default useAppContext
