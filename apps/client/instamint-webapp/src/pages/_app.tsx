import { AppContextProvider } from "@/web/contexts/useAppContext"
import { globalFetcher } from "@/web/utils/api/globalFetcher"
import { ActionsProvider } from "@/web/contexts/useActionsContext"
import BaseLayout from "@/web/components/layout/BaseLayout"
import Head from "next/head"
import { Toaster } from "@instamint/ui-kit"

import "@/styles/globals.css"
import { appWithTranslation } from "next-i18next"
import { SWRConfig } from "swr"
import type { AppPropsWithLayout } from "@/types/app.types"
import type { ReactNode } from "react"

const MyApp = ({ Component, pageProps }: AppPropsWithLayout) => {
  const renderWithLayout =
    Component.getLayout ||
    ((page: ReactNode) => {
      return <BaseLayout>{page}</BaseLayout>
    })

  return renderWithLayout(
    <SWRConfig value={{ fetcher: globalFetcher }}>
      <AppContextProvider>
        <Head>
          <meta name="description" content="Generated by create next app" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <link rel="icon" href="/favicon.ico" />
          <title>{Component.title}</title>
        </Head>
        <Toaster />

        <ActionsProvider>
          <Component {...pageProps} />
        </ActionsProvider>
      </AppContextProvider>
    </SWRConfig>
  )
}

export default appWithTranslation(MyApp)
