import "@/styles/globals.css"
import type { AppProps } from "next/app"
import { appWithTranslation } from "next-i18next"
import { SWRConfig } from "swr"

import { AppContextProvider } from "@/web/contexts/useAppContext"
import { globalFetcher } from "@/web/utils/api/globalFetcher"
import { ActionsProvider } from "@/web/contexts/useActionsContext"

const MyApp = ({ Component, pageProps }: AppProps) => {
  return (
    <SWRConfig value={{ fetcher: globalFetcher }}>
      <AppContextProvider>
        <ActionsProvider>
          <Component {...pageProps} />
        </ActionsProvider>
      </AppContextProvider>
    </SWRConfig>
  )
}

export default appWithTranslation(MyApp)
