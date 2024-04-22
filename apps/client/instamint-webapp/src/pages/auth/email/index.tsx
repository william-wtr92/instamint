import type { GetServerSideProps, InferGetServerSidePropsType } from "next"
import { type ReactElement, useCallback } from "react"
import { serverSideTranslations } from "next-i18next/serverSideTranslations"
import { useTranslation } from "next-i18next"
import { EnvelopeIcon } from "@heroicons/react/24/outline"
import { Button } from "@instamint/ui-kit"
import type { UserEmailToken } from "@instamint/shared-types"

import { queryParamsHelper } from "@/web/utils/helpers/queryParamsHelper"
import useAppContext from "@/web/contexts/useAppContext"
import useActionsContext from "@/web/contexts/useActionsContext"
import AuthLayout from "@/web/components/layout/AuthLayout"
import getTranslationBaseImports from "@/web/utils/helpers/getTranslationBaseImports"
import { routes } from "@/web/routes"

export const getServerSideProps: GetServerSideProps<UserEmailToken> = async (
  context
) => {
  const {
    locale,
    query: { validation },
  } = context

  const validationValue = queryParamsHelper(validation)

  return {
    props: {
      validation: validationValue,
      ...(await serverSideTranslations(locale ?? "en", [
        ...getTranslationBaseImports(),
        "email",
      ])),
    },
  }
}

const EmailValidationPage = (
  _props: InferGetServerSidePropsType<typeof getServerSideProps>
) => {
  const { validation } = _props
  const { t } = useTranslation(["errors", "email"])

  const {
    services: {
      auth: { emailValidation },
    },
  } = useAppContext()

  const { redirect, toast } = useActionsContext()

  const onSubmit = useCallback(async () => {
    if (validation != null) {
      const [err] = await emailValidation({ validation })

      if (err) {
        toast({
          variant: "error",
          description: t(`errors:auth.${err.message}`),
        })

        return
      }

      toast({
        variant: "success",
        description: t("email:validation.success"),
      })
      redirect(routes.client.home, 3000)
    } else {
      toast({
        variant: "error",
        description: t("email:validation.errorNoToken"),
      })
    }

    redirect(routes.client.home, 6000)
  }, [redirect, emailValidation, validation, t, toast])

  return (
    <>
      <div className="mt-10 flex justify-center">
        <div className="flex w-[90%] flex-col items-center gap-6 rounded-md p-10 shadow-xl sm:w-[70%] xl:w-1/3">
          <h1 className="text-center font-bold">
            {t("email:validation.title")}
          </h1>
          <Button
            className="bg-accent-500 flex gap-3 py-2.5 font-semibold text-white hover:cursor-pointer"
            onClick={onSubmit}
          >
            <EnvelopeIcon className="h-5 w-5" />
            <span>{t("email:validation.cta.button")}</span>
          </Button>
        </div>
      </div>
    </>
  )
}
EmailValidationPage.title = "auth.email.confirmation"

EmailValidationPage.getLayout = (page: ReactElement) => {
  return <AuthLayout>{page}</AuthLayout>
}

export default EmailValidationPage
