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

  const {
    setTriggerRedirect,
    setRedirectLink,
    setRedirectDelay,
    error,
    setError,
    success,
    setSuccess,
  } = useActionsContext()

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
      setRedirectDelay(3000)
      setRedirectLink("/")
    } else {
      setError(t("email:validation.errorNoToken"))
    }

    setTriggerRedirect(true)
    setRedirectDelay(6000)
    setRedirectLink("/")
  }, [
    setError,
    setSuccess,
    setRedirectLink,
    setRedirectDelay,
    setTriggerRedirect,
    emailValidation,
    validation,
    t,
  ])

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
          {success ? (
            <p className="text-accent-600 text-center text-sm">{success}</p>
          ) : null}
          {error ? (
            <p className="text-md text-error-primary text-center">
              {error instanceof Error ? error.message : error}
            </p>
          ) : null}
        </div>
      </div>
    </>
  )
}

export default EmailValidationPage
