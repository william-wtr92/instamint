import "@/styles/globals.css"
import type { AppProps } from "next/app"
import { appWithTranslation } from "next-i18next"

import { AppContextProvider } from "@/web/contexts/useAppContext"
import BaseLayout from "@/web/components/layout/BaseLayout"
import type { ReactElement, ReactNode } from "react"
import type { NextPage } from "next"
import { Poppins, Montserrat } from "@next/font/google"

export const poppins = Poppins({
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  style: ["normal", "italic"],
  subsets: ["latin"],
})

export const montserrat = Montserrat({
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  style: ["normal", "italic"],
  subsets: ["latin"],
})

export type NextPageWithLayout<P = object, IP = P> = NextPage<P, IP> & {
  getLayout?: (page: ReactElement) => ReactNode
}

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout
}

const MyApp = ({ Component, pageProps }: AppPropsWithLayout) => {
  const renderWithLayout =
    Component.getLayout ||
    ((page: ReactNode) => {
      return <BaseLayout>{page}</BaseLayout>
    })

  return renderWithLayout(
    <AppContextProvider>
      <Component {...pageProps} />
    </AppContextProvider>
  )
}

export default appWithTranslation(MyApp)
