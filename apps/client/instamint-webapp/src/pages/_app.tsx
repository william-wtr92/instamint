import { Toaster } from "@instamint/ui-kit"
import type { GetServerSideProps } from "next"
import Head from "next/head"
import "@/styles/globals.css"
import { appWithTranslation, useTranslation } from "next-i18next"
import { serverSideTranslations } from "next-i18next/serverSideTranslations"
import type { ReactNode } from "react"
import { SWRConfig } from "swr"

import type { AppPropsWithLayout } from "@/types"
import BaseLayout from "@/web/components/layout/BaseLayout"
import { ActionsProvider } from "@/web/contexts/useActionsContext"
import { AppContextProvider } from "@/web/contexts/useAppContext"
import { globalFetcher } from "@/web/utils/api/globalFetcher"

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { locale } = context

  return {
    props: {
      ...(await serverSideTranslations(locale ?? "en", "titles")),
    },
  }
}

const MyApp = ({ Component, pageProps }: AppPropsWithLayout) => {
  const { t } = useTranslation("titles")

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
            <title>{t(Component.title)}</title>
          </Head>
          <Toaster />

          {renderWithLayout(<Component {...pageProps} />)}
        </ActionsProvider>
      </AppContextProvider>
    </SWRConfig>
  )
}

export default appWithTranslation(MyApp)
