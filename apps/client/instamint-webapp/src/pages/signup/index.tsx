import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useCallback, useEffect, useState } from "react"
import { useRouter } from "next/router"
import type { GetServerSideProps } from "next"
import { useTranslation } from "next-i18next"
import { serverSideTranslations } from "next-i18next/serverSideTranslations"

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
import { signUpSchema, type SignUp } from "@instamint/shared-types"
import useAppContext from "@/web/contexts/useAppContext"
import { checkPasswordHelper } from "@/web/utils/helpers/checkPasswordHelper"

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { locale } = context

  return {
    props: {
      ...(await serverSideTranslations(locale ?? "en", ["signup"])),
    },
  }
}

const SignUpPage = () => {
  const router = useRouter()
  const {
    services: {
      users: { signUp },
    },
  } = useAppContext()

  const { t } = useTranslation("signup")

  const [error, setError] = useState<Error | string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [passwordCriteria, setPasswordCriteria] = useState<
    Record<string, boolean>
  >({
    uppercase: false,
    lowercase: false,
    number: false,
    specialCharacter: false,
    length: false,
  })

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

  useEffect(() => {
    setPasswordCriteria(checkPasswordHelper(password))
  }, [password])

  const onSubmit = useCallback(
    async (values: SignUp) => {
      const [err] = await signUp(values)

      if (err) {
        setError(err)

        return
      }

      setSuccess(t("success"))

      const timeout = setTimeout(async () => {
        await router.push("/")
      }, 3000)

      return () => clearTimeout(timeout)
    },
    [signUp, router, t]
  )

  const disabled =
    !form.formState.isValid ||
    !form.watch("gdprValidation") ||
    !Object.values(passwordCriteria).every(Boolean)

  return (
    <div className="h-screen flex flex-col items-center justify-center">
      <div className="w-[95%] sm:w-[70%] xl:w-[40%]">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="w-full flex items-center flex-col p-6 space-y-8 bg-white rounded-md shadow-xl"
          >
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel className="relative left-1 font-bold">
                    {t("username.label")}
                  </FormLabel>
                  <FormControl>
                    <Input
                      className="mt-2 py-2 px-4 focus-visible:outline-neutral-300"
                      placeholder={t("username.placeholder")}
                      {...field}
                    />
                  </FormControl>
                  <FormDescription className="relative left-2  mt-2 text-medium">
                    {t("username.description")}
                  </FormDescription>
                  <FormMessage
                    className="relative left-2 text-error-primary"
                    useCustomError={true}
                  >
                    {errors.username ? <div>{t("username.error")}</div> : null}
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
                    {t("email.label")}
                  </FormLabel>
                  <FormControl>
                    <Input
                      className="mt-2 py-2 px-4 focus-visible:outline-neutral-300"
                      type="email"
                      placeholder={t("email.placeholder")}
                      {...field}
                    />
                  </FormControl>
                  <FormDescription className="relative left-2  mt-2 text-medium">
                    {t("email.description")}
                  </FormDescription>
                  <FormMessage
                    className="relative left-2 text-error-primary"
                    useCustomError={true}
                  >
                    {errors.email ? <div>{t("email.error")}</div> : null}
                  </FormMessage>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel className="relative left-1 font-bold">
                    {t("password.label")}
                  </FormLabel>
                  <FormControl>
                    <Input
                      className="mt-2 py-2 px-4 focus-visible:outline-neutral-300"
                      type="password"
                      placeholder={t("password.placeholder")}
                      {...field}
                    />
                  </FormControl>
                  <FormDescription className="relative left-2 mt-2 text-medium">
                    {t("password.description")}
                  </FormDescription>
                  <div className="mt-4 w-full px-4 rounded-md xl:w-1/3">
                    {Object.entries(passwordCriteria).map(([key, value]) => (
                      <div
                        key={key}
                        className={`flex items-center gap-3 text-medium`}
                      >
                        <span
                          className={`w-3 h-3 border border-input  rounded-2xl ${
                            value ? "bg-accent-500" : "bg-neutral-700"
                          } `}
                        ></span>
                        <span
                          className={`${value ? "font-light" : "font-bold"} `}
                        >
                          {t(`password.criteria.${key}`)}
                        </span>
                      </div>
                    ))}
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
                    {t("confirmPassword.label")}
                  </FormLabel>
                  <FormControl>
                    <Input
                      className="mt-2 py-2 px-4 focus-visible:outline-neutral-300"
                      type="password"
                      placeholder={t("confirmPassword.placeholder")}
                      {...field}
                    />
                  </FormControl>
                  <FormDescription className="relative left-2 mt-2 text-medium">
                    {t("confirmPassword.description")}
                  </FormDescription>
                  <FormMessage
                    className="relative left-2 text-error-primary"
                    useCustomError={true}
                  >
                    {errors.confirmPassword ? (
                      <div>{t("confirmPassword.error")}</div>
                    ) : null}
                  </FormMessage>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="gdprValidation"
              render={({ field }) => (
                <FormItem className="w-full flex flex-row items-center space-x-3 space-y-0 rounded-md border p-4">
                  <FormControl>
                    <Checkbox
                      id="terms2"
                      className="flex justify-center justify-items-center items-center border-2 border-black w-7 h-7 rounded-md data-[state=checked]:bg-accent-400 data-[state=checked]:text-white data-[state=checked]:border-0"
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>{t("terms.label")}</FormLabel>
                    <FormDescription className="relative left-[0.1rem]  mt-2 text-medium">
                      {t("terms.description")}
                    </FormDescription>
                  </div>
                </FormItem>
              )}
            />
            <Button
              disabled={disabled}
              className={`border-2 border-black px-5 py-2 w-[60%] ${!form.formState.isValid ? "cursor-not-allowed" : ""}`}
              type="submit"
            >
              {t("submit")}
            </Button>
            {success ? (
              <p className="text-sm text-center text-black">{success}</p>
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

export default SignUpPage
