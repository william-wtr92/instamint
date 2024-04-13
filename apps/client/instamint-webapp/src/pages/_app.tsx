import Head from "next/head"
import "@/styles/globals.css"
import { appWithTranslation } from "next-i18next"
import { SWRConfig } from "swr"
import type { ReactNode } from "react"
import { Toaster } from "@instamint/ui-kit"

import BaseLayout from "@/web/components/layout/BaseLayout"
import { AppContextProvider } from "@/web/contexts/useAppContext"
import { globalFetcher } from "@/web/utils/api/globalFetcher"
import { ActionsProvider } from "@/web/contexts/useActionsContext"
import type { AppPropsWithLayout } from "@/types"

const MyApp = ({ Component, pageProps }: AppPropsWithLayout) => {
  const renderWithLayout =
    Component.getLayout ||
    ((page: ReactNode) => {
      return <BaseLayout>{page}</BaseLayout>
    })

  return (
    <SWRConfig value={{ fetcher: globalFetcher }}>
      <AppContextProvider>
        <ActionsProvider>
          <Head>
            <meta
              name="description"
              content="💻 Social Sharing platform based around NFTs, includes web3 technologies"
            />
            <meta
              name="viewport"
              content="width=device-width, initial-scale=1"
            />
            <link rel="icon" href="/favicon.ico" />
            <title>{Component.title}</title>
          </Head>
          <Toaster />

          {renderWithLayout(<Component {...pageProps} />)}
        </ActionsProvider>
      </AppContextProvider>
    </SWRConfig>
  )
}

export default appWithTranslation(MyApp)
