import { type CreateTeaBags } from "@instamint/shared-types"
import { Button, Text } from "@instamint/ui-kit"
import type { GetServerSideProps } from "next"
import { useTranslation } from "next-i18next"
import { serverSideTranslations } from "next-i18next/serverSideTranslations"
import React, { useCallback } from "react"

import { CreateTeaBagsForm } from "@/web/components/forms/CreateTeaBags"
import useActionsContext from "@/web/contexts/useActionsContext"
import useAppContext from "@/web/contexts/useAppContext"
import { useGetTeaBags } from "@/web/hooks/teaBags/useGetTeabags"
import { routes } from "@/web/routes"
import getTranslationBaseImports from "@/web/utils/helpers/getTranslationBaseImports"

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { locale } = context

  return {
    props: {
      ...(await serverSideTranslations(locale ?? "en", [
        ...getTranslationBaseImports(),
        "teabags",
      ])),
    },
  }
}

const TeabagsPage = () => {
  const { t } = useTranslation("teabags")

  const {
    services: {
      teaBags: { createTeaBags },
    },
  } = useAppContext()

  const { data, isLoading, isValidating, size, setSize } = useGetTeaBags()

  const teaBags = data ? data.flatMap((page) => page.result.teabags) : []

  const { redirect, toast } = useActionsContext()

  const loadMoreResults = useCallback(async () => {
    if (!isValidating) {
      await setSize(size + 1)
    }
  }, [isValidating, size, setSize])

  const handleScroll = useCallback(
    async (e: React.UIEvent<HTMLDivElement>) => {
      const bottom =
        e.currentTarget.scrollHeight - e.currentTarget.scrollTop ===
        e.currentTarget.clientHeight

      if (bottom) {
        await loadMoreResults()
      }
    },
    [loadMoreResults]
  )

  const handleModifyPasswordSubmit = useCallback(
    async (values: CreateTeaBags) => {
      const [err] = await createTeaBags(values)

      if (err) {
        toast({
          variant: "error",
          description: t(`errors:teabags.create.${err.message}`),
        })

        return
      }

      toast({
        variant: "success",
        description: t("teabags:create.success"),
      })

      redirect(routes.client.home, 1000)
    },
    [toast, redirect, createTeaBags, t]
  )

  return (
    <>
      <div>
        <Text type="heading" variant="neutral" className="text-center">
          {t("title")}
        </Text>
        <div className=" flex gap-6 xl:w-[10%]">
          <Button className="text-accent-500 border-accent-500 hover:bg-accent-500 ml-2 mt-6 rounded-md border-2 bg-white py-2.5 font-semibold hover:text-white">
            <CreateTeaBagsForm onSubmit={handleModifyPasswordSubmit} />
          </Button>
        </div>
        <div>
          <div
            className="scrollbar-none mt-4 h-96 overflow-y-scroll xl:h-[800px]"
            onScroll={handleScroll}
          >
            {!isLoading && teaBags.length === 0 && <p>No TeaBags found</p>}
            {teaBags.length > 0 &&
              teaBags.map((data) => (
                <div
                  key={data.id}
                  className="border-accent-500 m-2 rounded-md border p-4"
                >
                  <span className="mb-2 text-lg font-medium">{data.name}</span>
                  <div className="flex justify-between">
                    <p>Bio: {data.bio}</p>
                    <p>cook: {data.cookNumber}</p>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
    </>
  )
}
TeabagsPage.title = "Teabags"

export default TeabagsPage
