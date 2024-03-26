import { GetServerSideProps, InferGetServerSidePropsType } from "next"
import { useRouter } from "next/router"
import { useCallback, useState } from "react"

import { queryParamsHelper } from "@/web/utils/queryParamsHelper"
import { Button } from "@instamint/ui-kit"
import { UserEmailToken } from "@instamint/shared-types"
import { EnvelopeIcon } from "@heroicons/react/24/outline"
import useAppContext from "@/web/contexts/useAppContext"

export const getServerSideProps: GetServerSideProps<UserEmailToken> = async (
  context
) => {
  const { validation } = context.query

  const validationValue = queryParamsHelper(validation)

  return {
    props: {
      validation: validationValue,
    },
  }
}

const UsersEmailValidationPage = (
  _props: InferGetServerSidePropsType<typeof getServerSideProps>
) => {
  const { validation } = _props

  const router = useRouter()
  const [error, setError] = useState<Error | string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const {
    services: {
      users: { emailValidation },
    },
  } = useAppContext()

  const onSubmit = useCallback(async () => {
    if (validation != null) {
      const [err] = await emailValidation({ validation })

      if (err) {
        setError(err)

        return
      }

      setSuccess("Email validated successfully. You'll be redirected shortly!")

      setInterval(async () => {
        await router.push("/")
      }, 3000)
    } else {
      setError(
        "Please check your mail and click on 'Verify Email Now', you'll be redirected shortly!"
      )

      setInterval(async () => {
        await router.push("/")
      }, 20000)
    }
  }, [emailValidation, validation, router])

  return (
    <>
      <div className="mt-10 flex justify-center">
        <div className="w-[90%] flex flex-col gap-6 items-center shadow-md shadow-gray-300 rounded-md p-10 sm:w-[70%] xl:w-1/3">
          <h1 className="font-bold text-center">
            Please validate your email address to access Instamint
          </h1>
          <Button
            className="flex gap-3 border-2 border-black"
            onClick={onSubmit}
          >
            <EnvelopeIcon className="w-5 h-5" />
            <span>Valid your email</span>
          </Button>
          {success ? (
            <p className="text-sm text-center text-black">{success}</p>
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

export default UsersEmailValidationPage
