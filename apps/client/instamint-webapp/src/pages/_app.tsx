import "@/styles/globals.css"
import type { AppProps } from "next/app"
import { appWithTranslation } from "next-i18next"
import { SWRConfig } from "swr"

import { AppContextProvider } from "@/web/contexts/useAppContext"
import { globalFetcher } from "@/web/utils/api/globalFetcher"

const MyApp = ({ Component, pageProps }: AppProps) => {
  return (
    <SWRConfig value={{ fetcher: globalFetcher }}>
      <AppContextProvider>
        <Component {...pageProps} />
      </AppContextProvider>
    </SWRConfig>
  )
}

export default appWithTranslation(MyApp)
