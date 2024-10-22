import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline"
import { zodResolver } from "@hookform/resolvers/zod"
import {
  confirmResetPasswordSchema,
  type ConfirmResetPassword,
  type ConfirmResetPasswordValidation,
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
import type { GetServerSideProps, InferGetServerSidePropsType } from "next"
import { useTranslation } from "next-i18next"
import { serverSideTranslations } from "next-i18next/serverSideTranslations"
import { useCallback, useEffect, useState } from "react"
import { useForm } from "react-hook-form"

import useActionsContext from "@/web/contexts/useActionsContext"
import useAppContext from "@/web/contexts/useAppContext"
import { routes } from "@/web/routes"
import { checkPasswordHelper } from "@/web/utils/helpers/checkPasswordHelper"
import getTranslationBaseImports from "@/web/utils/helpers/getTranslationBaseImports"
import { queryParamsHelper } from "@/web/utils/helpers/queryParamsHelper"
import getAuthLayout from "@/web/utils/layout/getAuthLayout"

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
        ...getTranslationBaseImports(),
        "reset-password",
      ])),
    },
  }
}

const ConfirmResetPasswordPage = (
  _props: InferGetServerSidePropsType<typeof getServerSideProps>
) => {
  const { validation } = _props
  const { t } = useTranslation(["errors", "reset-password"])

  const {
    services: {
      users: { confirmResetPassword },
    },
  } = useAppContext()

  const { redirect, toast } = useActionsContext()

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
          toast({
            variant: "error",
            description: t(`errors:users.reset.${err.message}`),
          })

          return
        }

        toast({
          variant: "success",
          description: t("reset-password:confirm.success"),
        })

        redirect(routes.client.signIn, 3000)
      } else {
        toast({
          variant: "error",
          description: t("errors:users.reset.errorNoToken"),
        })
      }

      redirect(routes.client.signIn, 6000)
    },
    [validation, redirect, confirmResetPassword, t, toast]
  )

  const disabled = form.formState.isValid && checkPassword

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
              name="password"
              render={({ field }) => (
                <FormItem className="relative w-full">
                  <FormLabel className="relative left-1 flex items-center gap-2 font-bold">
                    <span>{t("reset-password:confirm.password.label")}</span>
                  </FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        className="focus-visible:outline-accent-500 mt-2 px-4 py-2 focus-visible:border-0 focus-visible:ring-0"
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
                  <div
                    className={`relative mt-6 rounded-md bg-white xl:absolute xl:-bottom-10 xl:-left-56 xl:z-[-1] xl:mt-0 xl:transform xl:bg-opacity-40 xl:p-4 xl:shadow-2xl xl:transition-transform xl:duration-700 xl:ease-in-out ${isFocused ? "xl:translate-x-0" : "xl:translate-x-[115%]"}`}
                    tabIndex={-1}
                  >
                    <div className={`w-full rounded-md px-4`}>
                      {Object.entries(passwordCriteria).map(([key, value]) => (
                        <span
                          key={key}
                          className={`text-medium flex items-center gap-3 ${value ? "opacity-100" : "opacity-60"}`}
                        >
                          <span
                            className={`border-input size-3 rounded-2xl border transition-colors  duration-500 ${value ? "bg-accent-600" : "bg-neutral-200"}`}
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
                      className="focus-visible:outline-accent-500 mt-2 px-4 py-2 focus-visible:border-0 focus-visible:ring-0"
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
                    className="text-error-primary relative left-2"
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
              className={`bg-accent-500 w-1/2 py-2.5 font-semibold text-white ${!disabled ? "cursor-not-allowed opacity-50" : "hover:cursor-pointer"}`}
              type="submit"
            >
              {t("reset-password:confirm.cta.submit")}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  )
}
ConfirmResetPasswordPage.title = "users.reset-password-confirm"

ConfirmResetPasswordPage.getLayout = getAuthLayout

export default ConfirmResetPasswordPage
