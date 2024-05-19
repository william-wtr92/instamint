import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline"
import { zodResolver } from "@hookform/resolvers/zod"
import { signUpSchema, type SignUp } from "@instamint/shared-types"
import {
  Form,
  FormField,
  FormControl,
  FormItem,
  FormLabel,
  FormDescription,
  FormMessage,
  Input,
  Button,
  Checkbox,
} from "@instamint/ui-kit"
import type { GetServerSideProps } from "next"
import { useTranslation } from "next-i18next"
import { serverSideTranslations } from "next-i18next/serverSideTranslations"
import { useCallback, useEffect, useState } from "react"
import { useForm } from "react-hook-form"

import useActionsContext from "@/web/contexts/useActionsContext"
import useAppContext from "@/web/contexts/useAppContext"
import { routes } from "@/web/routes"
import { checkPasswordHelper } from "@/web/utils/helpers/checkPasswordHelper"
import getTranslationBaseImports from "@/web/utils/helpers/getTranslationBaseImports"
import getAuthLayout from "@/web/utils/layout/getAuthLayout"

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { locale } = context

  return {
    props: {
      ...(await serverSideTranslations(locale ?? "en", [
        ...getTranslationBaseImports(),
        "sign-up",
      ])),
    },
  }
}

const SignUpPage = () => {
  const { t } = useTranslation(["errors", "sign-up"])

  const {
    services: {
      auth: { signUp },
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

  const form = useForm<SignUp>({
    resolver: zodResolver(signUpSchema),
    mode: "onBlur",
    defaultValues: {
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
      gdprValidation: false,
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
    async (values: SignUp) => {
      const [err] = await signUp(values)

      if (err) {
        toast({
          variant: "error",
          description: t(`errors:auth.${err.message}`),
        })

        return
      }

      toast({
        variant: "success",
        description: t("sign-up:success"),
      })
      redirect(routes.client.signIn, 3000)
    },
    [redirect, signUp, t, toast]
  )

  const handleRedirect = useCallback(() => {
    redirect(routes.client.signIn, 0)
  }, [redirect])

  const disabled =
    form.formState.isValid && form.watch("gdprValidation") && checkPassword

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
              name="username"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel className="relative left-1 font-bold">
                    {t("sign-up:username.label")}
                  </FormLabel>
                  <FormControl>
                    <Input
                      className="focus-visible:outline-accent-500 mt-2 px-4 py-2 focus-visible:border-0 focus-visible:ring-0"
                      placeholder={t("sign-up:username.placeholder")}
                      onFocus={() => setIsFocused(false)}
                      {...field}
                    />
                  </FormControl>
                  <FormDescription className="text-medium relative left-2 mt-2">
                    {t("sign-up:username.description")}
                  </FormDescription>
                  <FormMessage
                    className="text-error-primary relative left-2"
                    useCustomError={true}
                  >
                    {errors.username ? (
                      <span>{t("sign-up:username.error")}</span>
                    ) : null}
                  </FormMessage>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel className="relative left-1 font-bold">
                    {t("sign-up:email.label")}
                  </FormLabel>
                  <FormControl>
                    <Input
                      className="focus-visible:outline-accent-500 mt-2 px-4 py-2 focus-visible:border-0 focus-visible:ring-0"
                      type="email"
                      placeholder={t("sign-up:email.placeholder")}
                      onFocus={() => setIsFocused(false)}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage
                    className="text-error-primary relative left-2"
                    useCustomError={true}
                  >
                    {errors.email ? (
                      <span>{t("sign-up:email.error")}</span>
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
                    <span>{t("sign-up:password.label")}</span>
                  </FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        className="focus-visible:outline-accent-500 mt-2 px-4 py-2 focus-visible:border-0 focus-visible:ring-0"
                        type={showPassword ? "text" : "password"}
                        placeholder={t("sign-up:password.placeholder")}
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
                            {t(`sign-up:password.criteria.${key}`)}
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
                    {t("sign-up:confirmPassword.label")}
                  </FormLabel>
                  <FormControl>
                    <Input
                      className="focus-visible:outline-accent-500 mt-2 px-4 py-2 focus-visible:border-0 focus-visible:ring-0"
                      type="password"
                      placeholder={t("sign-up:confirmPassword.placeholder")}
                      onFocus={() => setIsFocused(false)}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage
                    className="text-error-primary relative left-2"
                    useCustomError={true}
                  >
                    {errors.confirmPassword ? (
                      <span>{t("sign-up:confirmPassword.error")}</span>
                    ) : null}
                  </FormMessage>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="gdprValidation"
              render={({ field }) => (
                <FormItem className="flex w-full flex-row items-center space-x-3 space-y-0 rounded-md border p-4">
                  <FormControl>
                    <Checkbox
                      id="terms2"
                      className="border-1 data-[state=checked]:bg-accent-500 focus-visible:outline-accent-500 flex size-7 items-center justify-center justify-items-center rounded-md transition duration-700 data-[state=checked]:text-white"
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      onFocus={() => setIsFocused(false)}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>{t("sign-up:terms.label")}</FormLabel>
                    <FormDescription className="text-medium relative left-[0.1rem] mt-2">
                      {t("sign-up:terms.description")}
                    </FormDescription>
                  </div>
                </FormItem>
              )}
            />
            <Button
              disabled={!disabled}
              className={`bg-accent-500 w-1/2 py-2.5 font-semibold text-white ${!disabled ? "cursor-not-allowed opacity-50" : "hover:cursor-pointer"}`}
              type="submit"
            >
              {t("sign-up:cta.submit")}
            </Button>
            <div className="text-medium flex items-center gap-1.5">
              <p className="font-semibold">
                {t("sign-up:cta.redirect.description")}
              </p>
              <p
                className="text-accent-600 font-bold hover:scale-105 hover:cursor-pointer"
                onClick={handleRedirect}
              >
                {t("sign-up:cta.redirect.link")}
              </p>
            </div>
          </form>
        </Form>
      </div>
    </div>
  )
}
SignUpPage.title = "auth.register"

SignUpPage.getLayout = getAuthLayout

export default SignUpPage
