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
  const { t } = useTranslation(["errors", "reactivate-account"])

  const {
    services: {
      users: { reactivateAccount },
    },
  } = useAppContext()

  const { redirect, success, setSuccess, error, setError } = useActionsContext()

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
    <div className="flex h-screen flex-col items-center justify-center">
      <div className="w-[95%] sm:w-[70%] xl:w-[40%]">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="p-text-large-screen flex w-full flex-col items-center space-y-8 rounded-md bg-white shadow-xl"
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
                      className="focus-visible:outline-accent-500 mt-2 px-4 py-2 focus-visible:border-0 focus-visible:ring-0"
                      type="email"
                      placeholder={t("reactivate-account:email.placeholder")}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage
                    className="text-error-primary relative left-2"
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
                  <FormLabel className="relative left-1 flex items-center gap-2 font-bold">
                    <span>{t("reactivate-account:password.label")}</span>
                  </FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        className="focus-visible:outline-accent-500 mt-2 px-4 py-2 focus-visible:border-0 focus-visible:ring-0"
                        type={showPassword ? "text" : "password"}
                        placeholder={t(
                          "reactivate-account:password.placeholder"
                        )}
                        {...field}
                      />
                      {showPassword ? (
                        <EyeSlashIcon
                          className="absolute right-2 top-1/4 h-5 w-4 hover:cursor-pointer"
                          onClick={() => setShowPassword(!showPassword)}
                        />
                      ) : (
                        <EyeIcon
                          className="absolute right-2 top-1/4 h-5 w-4 hover:cursor-pointer"
                          onClick={() => setShowPassword(!showPassword)}
                        />
                      )}
                    </div>
                  </FormControl>
                  <FormMessage
                    className="text-error-primary relative left-2"
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
              className={`bg-accent-500 w-1/2 py-2.5 font-semibold text-white ${!form.formState.isValid ? "cursor-not-allowed opacity-50" : "hover:cursor-pointer"}`}
              type="submit"
            >
              {t("reactivate-account:cta.submit")}
            </Button>
            {success ? (
              <p className="text-accent-600 text-center text-sm">{success}</p>
            ) : null}
            {error ? (
              <p className="text-md text-error-primary text-center">
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
