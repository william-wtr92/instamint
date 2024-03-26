import "@/styles/globals.css"
import type { AppProps } from "next/app"
import { appWithTranslation } from "next-i18next"

import { AppContextProvider } from "@/web/contexts/useAppContext"

const MyApp = ({ Component, pageProps }: AppProps) => {
  return (
    <AppContextProvider>
      <Component {...pageProps} />
    </AppContextProvider>
  )
}

export default appWithTranslation(MyApp)
