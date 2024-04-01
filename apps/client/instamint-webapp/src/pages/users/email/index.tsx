import type { GetServerSideProps, InferGetServerSidePropsType } from "next"
import { useCallback, useState } from "react"
import { serverSideTranslations } from "next-i18next/serverSideTranslations"
import { useTranslation } from "next-i18next"
import { EnvelopeIcon } from "@heroicons/react/24/outline"

import { queryParamsHelper } from "@/web/utils/helpers/queryParamsHelper"
import { Button } from "@instamint/ui-kit"
import type { UserEmailToken } from "@instamint/shared-types"
import useAppContext from "@/web/contexts/useAppContext"
import { useShowTemp } from "@/web/hooks/customs/useShowTemp"
import { useDelayedRedirect } from "@/web/hooks/customs/useDelayedRedirect"

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

const UsersEmailValidationPage = (
  _props: InferGetServerSidePropsType<typeof getServerSideProps>
) => {
  const { validation } = _props

  const {
    services: {
      users: { emailValidation },
    },
  } = useAppContext()

  const { t } = useTranslation(["errors", "email"])

  const [triggerRedirect, setTriggerRedirect] = useState<boolean>(false)
  const [redirectDelay, setRedirectDelay] = useState<number>(0)
  const [error, setError] = useShowTemp<Error | string | null>(null, 8000)
  const [success, setSuccess] = useShowTemp<string | null>(null, 3000)

  useDelayedRedirect("/", redirectDelay, triggerRedirect)

  const onSubmit = useCallback(async () => {
    if (validation != null) {
      const [err] = await emailValidation({ validation })

      if (err) {
        setError(t(`errors:users.${err.message}`))

        return
      }

      setSuccess(t("email:validation.success"))
      setRedirectDelay(3000)
    } else {
      setError(t("email:validation.errorNoToken"))
    }

    setTriggerRedirect(true)
  }, [setError, setSuccess, setTriggerRedirect, emailValidation, validation, t])

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
            <span>{t("email:validation.button")}</span>
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

export default UsersEmailValidationPage
