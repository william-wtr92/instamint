import type { GetServerSideProps, InferGetServerSidePropsType } from "next"
import { useTranslation } from "next-i18next"
import { serverSideTranslations } from "next-i18next/serverSideTranslations"
import { useCallback, useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import type { ConfirmResetPasswordValidation } from "@instamint/shared-types"
import {
  confirmResetPasswordSchema,
  type ConfirmResetPassword,
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
import { checkPasswordHelper } from "@/web/utils/helpers/checkPasswordHelper"
import useAppContext from "@/web/contexts/useAppContext"
import { useDelayedRedirect } from "@/web/hooks/customs/useDelayedRedirect"

export const getServerSideProps: GetServerSideProps<
  ConfirmResetPasswordValidation
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
        "reset-password",
      ])),
    },
  }
}

const ConfirmResetPasswordPage = (
  _props: InferGetServerSidePropsType<typeof getServerSideProps>
) => {
  const { validation } = _props

  const {
    services: {
      users: { confirmResetPassword },
    },
  } = useAppContext()

  const { redirect, error, setError, success, setSuccess } = useActionsContext()

  const { t } = useTranslation(["errors", "reset-password"])

  useDelayedRedirect()

  const [passwordCriteria, setPasswordCriteria] = useState<
    Record<string, boolean>
  >({
    uppercase: false,
    lowercase: false,
    number: false,
    specialCharacter: false,
    length: false,
  })
  const [showPassword, setShowPassword] = useState<boolean>(false)
  const [isFocused, setIsFocused] = useState<boolean>(false)

  const form = useForm<ConfirmResetPassword>({
    resolver: zodResolver(confirmResetPasswordSchema),
    mode: "onBlur",
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  })

  const {
    watch,
    formState: { errors },
  } = form

  const password = watch("password")
  const checkPassword = Object.values(passwordCriteria).every(Boolean)

  useEffect(() => {
    setPasswordCriteria(checkPasswordHelper(password))
  }, [password])

  const onSubmit = useCallback(
    async (values: ConfirmResetPassword) => {
      if (validation != null) {
        const confirmResetPasswordValues = {
          ...values,
          validation,
        }

        const [err] = await confirmResetPassword(confirmResetPasswordValues)

        if (err) {
          setError(t(`errors:users.reset.${err.message}`))

          return
        }

        setSuccess(t("reset-password:confirm.success"))
        redirect("/sign-in", 3000)
      } else {
        setError(t(`reset-password:confirm.errorNoToken`))
      }

      redirect("/sign-in", 6000)
    },
    [validation, redirect, setError, setSuccess, confirmResetPassword, t]
  )

  const disabled = form.formState.isValid && checkPassword

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
              name="password"
              render={({ field }) => (
                <FormItem className="relative w-full">
                  <FormLabel className="relative left-1 font-bold flex gap-2 items-center">
                    <span>{t("reset-password:confirm.password.label")}</span>
                  </FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        className="mt-2 py-2 px-4 focus-visible:ring-0 focus-visible:border-0 focus-visible:outline-accent-500"
                        type={showPassword ? "text" : "password"}
                        placeholder={t(
                          "reset-password:confirm.password.placeholder"
                        )}
                        {...field}
                        onFocus={() => {
                          setIsFocused(true)
                        }}
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
                  <div
                    className={`relative rounded-md bg-white mt-6 xl:mt-0 xl:p-4 xl:z-[-1] xl:transition-transform xl:duration-700 xl:ease-in-out xl:transform xl:bg-opacity-40 xl:shadow-2xl xl:absolute xl:-bottom-10 xl:-left-56 ${isFocused ? "xl:translate-x-0" : "xl:translate-x-[115%]"}`}
                    tabIndex={-1}
                  >
                    <div className={`w-full px-4 rounded-md`}>
                      {Object.entries(passwordCriteria).map(([key, value]) => (
                        <span
                          key={key}
                          className={`flex items-center gap-3 text-medium ${value ? "opacity-100" : "opacity-60"}`}
                        >
                          <span
                            className={`transition-colors duration-500 size-3 border border-input  rounded-2xl ${value ? "bg-accent-600" : "bg-neutral-200"}`}
                          ></span>
                          <span
                            className={`${value ? "text-medium font-semibold" : "text-medium font-light"} `}
                          >
                            {t(
                              `reset-password:confirm.password.criteria.${key}`
                            )}
                          </span>
                        </span>
                      ))}
                    </div>
                  </div>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel className="relative left-1 font-bold">
                    {t("reset-password:confirm.confirmPassword.label")}
                  </FormLabel>
                  <FormControl>
                    <Input
                      className="mt-2 py-2 px-4 focus-visible:ring-0 focus-visible:border-0 focus-visible:outline-accent-500"
                      type="password"
                      placeholder={t(
                        "reset-password:confirm.confirmPassword.placeholder"
                      )}
                      onFocus={() => {
                        setIsFocused(false)
                      }}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage
                    className="relative left-2 text-error-primary"
                    useCustomError={true}
                  >
                    {errors.confirmPassword ? (
                      <span>
                        {t("reset-password:confirm.confirmPassword.error")}
                      </span>
                    ) : null}
                  </FormMessage>
                </FormItem>
              )}
            />
            <Button
              disabled={!disabled}
              className={`bg-accent-500 text-white font-semibold py-2.5 w-1/2 ${!disabled ? "cursor-not-allowed opacity-50" : "hover:cursor-pointer"}`}
              type="submit"
            >
              {t("reset-password:confirm.cta.submit")}
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

export default ConfirmResetPasswordPage
