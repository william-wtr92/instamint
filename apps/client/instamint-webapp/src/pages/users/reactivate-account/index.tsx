import type { GetServerSideProps, InferGetServerSidePropsType } from "next"
import { useTranslation } from "next-i18next"
import { serverSideTranslations } from "next-i18next/serverSideTranslations"
import { useCallback, useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import {
  reactivateAccountSchema,
  type ReactivateAccountValidation,
  type ReactivateAccount,
} from "@instamint/shared-types"
import {
  Button,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
} from "@instamint/ui-kit"
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline"

import { queryParamsHelper } from "@/web/utils/helpers/queryParamsHelper"
import useActionsContext from "@/web/contexts/useActionsContext"
import useAppContext from "@/web/contexts/useAppContext"
import { useDelayedRedirect } from "@/web/hooks/customs/useDelayedRedirect"

export const getServerSideProps: GetServerSideProps<
  ReactivateAccountValidation
> = async (context) => {
  const {
    locale,
    query: { validation },
  } = context

  const validationValue = queryParamsHelper(validation)

  return {
    props: {
      validation: validationValue,
      ...(await serverSideTranslations(locale ?? "en", [
        "errors",
        "reactivate-account",
      ])),
    },
  }
}

const ReactivateAccountPage = (
  _props: InferGetServerSidePropsType<typeof getServerSideProps>
) => {
  const { validation } = _props

  const {
    services: {
      users: { reactivateAccount },
    },
  } = useAppContext()

  const { redirect, success, setSuccess, error, setError } = useActionsContext()

  const { t } = useTranslation(["errors", "reactivate-account"])

  useDelayedRedirect()

  const form = useForm<ReactivateAccount>({
    resolver: zodResolver(reactivateAccountSchema),
    mode: "onBlur",
    defaultValues: {
      email: "",
      password: "",
    },
  })

  const {
    formState: { errors },
  } = form

  const [showPassword, setShowPassword] = useState<boolean>(false)

  const onSubmit = useCallback(
    async (values: ReactivateAccount) => {
      if (validation != null) {
        const reactivateAccountValues = {
          ...values,
          validation,
        }

        const [err] = await reactivateAccount(reactivateAccountValues)

        if (err) {
          setError(t(`errors:users.reactivate-account.${err.message}`))

          return
        }

        setSuccess(t("reactivate-account:success"))
        redirect("/", 3000)
      } else {
        setError(t("errors:users.reactivate-account.errorNoToken"))
      }

      redirect("/sign-in", 6000)
    },
    [validation, redirect, setError, setSuccess, reactivateAccount, t]
  )

  return (
    <div className="h-screen flex flex-col items-center justify-center">
      <div className="w-[95%] sm:w-[70%] xl:w-[40%]">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="w-full flex items-center flex-col p-text-large-screen space-y-8 bg-white rounded-md shadow-xl"
          >
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel className="relative left-1 font-bold">
                    {t("reactivate-account:email.label")}
                  </FormLabel>
                  <FormControl>
                    <Input
                      className="mt-2 py-2 px-4 focus-visible:ring-0 focus-visible:border-0 focus-visible:outline-accent-500"
                      type="email"
                      placeholder={t("reactivate-account:email.placeholder")}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage
                    className="relative left-2 text-error-primary"
                    useCustomError={true}
                  >
                    {errors.email ? (
                      <span>{t("reactivate-account:email.error")}</span>
                    ) : null}
                  </FormMessage>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem className="relative w-full">
                  <FormLabel className="relative left-1 font-bold flex gap-2 items-center">
                    <span>{t("reactivate-account:password.label")}</span>
                  </FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        className="mt-2 py-2 px-4 focus-visible:ring-0 focus-visible:border-0 focus-visible:outline-accent-500"
                        type={showPassword ? "text" : "password"}
                        placeholder={t(
                          "reactivate-account:password.placeholder"
                        )}
                        {...field}
                      />
                      {showPassword ? (
                        <EyeSlashIcon
                          className="absolute right-2 top-1/4 w-4 h-5 hover:cursor-pointer"
                          onClick={() => setShowPassword(!showPassword)}
                        />
                      ) : (
                        <EyeIcon
                          className="absolute right-2 top-1/4 w-4 h-5 hover:cursor-pointer"
                          onClick={() => setShowPassword(!showPassword)}
                        />
                      )}
                    </div>
                  </FormControl>
                  <FormMessage
                    className="relative left-2 text-error-primary"
                    useCustomError={true}
                  >
                    {errors.password ? (
                      <span>{t("reactivate-account:password.error")}</span>
                    ) : null}
                  </FormMessage>
                </FormItem>
              )}
            />
            <Button
              disabled={!form.formState.isValid}
              className={`bg-accent-500 text-white font-semibold py-2.5 w-1/2 ${!form.formState.isValid ? "cursor-not-allowed opacity-50" : "hover:cursor-pointer"}`}
              type="submit"
            >
              {t("reactivate-account:cta.submit")}
            </Button>
            {success ? (
              <p className="text-sm text-center text-accent-600">{success}</p>
            ) : null}
            {error ? (
              <p className="text-md text-center text-error-primary">
                {error instanceof Error ? error.message : error}
              </p>
            ) : null}
          </form>
        </Form>
      </div>
    </div>
  )
}

export default ReactivateAccountPage
