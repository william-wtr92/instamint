import type { GetServerSideProps, InferGetServerSidePropsType } from "next"
import { useCallback } from "react"
import { serverSideTranslations } from "next-i18next/serverSideTranslations"
import { useTranslation } from "next-i18next"
import { EnvelopeIcon } from "@heroicons/react/24/outline"
import { Button } from "@instamint/ui-kit"
import type { UserEmailToken } from "@instamint/shared-types"

import { queryParamsHelper } from "@/web/utils/helpers/queryParamsHelper"
import useAppContext from "@/web/contexts/useAppContext"
import { useDelayedRedirect } from "@/web/hooks/customs/useDelayedRedirect"
import useActionsContext from "@/web/contexts/useActionsContext"

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
      ...(await serverSideTranslations(locale ?? "en", ["errors", "email"])),
    },
  }
}

const EmailValidationPage = (
  _props: InferGetServerSidePropsType<typeof getServerSideProps>
) => {
  const { validation } = _props

  const {
    services: {
      auth: { emailValidation },
    },
  } = useAppContext()

  const { redirect, error, setError, success, setSuccess } = useActionsContext()

  const { t } = useTranslation(["errors", "email"])

  useDelayedRedirect()

  const onSubmit = useCallback(async () => {
    if (validation != null) {
      const [err] = await emailValidation({ validation })

      if (err) {
        setError(t(`errors:auth.${err.message}`))

        return
      }

      setSuccess(t("email:validation.success"))
      redirect("/", 3000)
    } else {
      setError(t("email:validation.errorNoToken"))
    }

    redirect("/", 6000)
  }, [redirect, setError, setSuccess, emailValidation, validation, t])

  return (
    <>
      <div className="mt-10 flex justify-center">
        <div className="w-[90%] flex flex-col gap-6 items-center shadow-xl rounded-md p-10 sm:w-[70%] xl:w-1/3">
          <h1 className="font-bold text-center">
            {t("email:validation.title")}
          </h1>
          <Button
            className="flex gap-3 bg-accent-500 text-white font-semibold py-2.5 hover:cursor-pointer"
            onClick={onSubmit}
          >
            <EnvelopeIcon className="w-5 h-5" />
            <span>{t("email:validation.cta.button")}</span>
          </Button>
          {success ? (
            <p className="text-sm text-center text-accent-600">{success}</p>
          ) : null}
          {error ? (
            <p className="text-md text-center text-error-primary">
              {error instanceof Error ? error.message : error}
            </p>
          ) : null}
        </div>
      </div>
    </>
  )
}

export default EmailValidationPage
