import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useCallback, useState } from "react"
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

  const form = useForm<SignUp>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
      gdprValidation: false,
    },
  })

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
                    {t("usernameLabel")}
                  </FormLabel>
                  <FormControl>
                    <Input
                      className="mt-2 py-2 px-4 focus-visible:outline-neutral-tertiary"
                      placeholder={t("usernamePlaceholder")}
                      {...field}
                    />
                  </FormControl>
                  <FormDescription className="relative left-2  mt-2 text-xs">
                    {t("usernameDescription")}
                  </FormDescription>
                  <FormMessage className="relative left-2 text-error-primary" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel className="relative left-1 font-bold">
                    {t("emailLabel")}
                  </FormLabel>
                  <FormControl>
                    <Input
                      className="mt-2 py-2 px-4 focus-visible:outline-neutral-tertiary"
                      type="email"
                      placeholder={t("emailPlaceholder")}
                      {...field}
                    />
                  </FormControl>
                  <FormDescription className="relative left-2  mt-2 text-xs">
                    {t("emailDescription")}
                  </FormDescription>
                  <FormMessage className="relative left-2 text-error-primary" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel className="relative left-1 font-bold">
                    {t("passwordLabel")}
                  </FormLabel>
                  <FormControl>
                    <Input
                      className="mt-2 py-2 px-4 focus-visible:outline-neutral-tertiary"
                      type="password"
                      placeholder={t("passwordPlaceholder")}
                      {...field}
                    />
                  </FormControl>
                  <FormDescription className="relative left-2 mt-2 text-xs">
                    {t("passwordDescription")}
                  </FormDescription>
                  <FormMessage className="relative left-2 text-error-primary" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel className="relative left-1 font-bold">
                    {t("confirmPasswordLabel")}
                  </FormLabel>
                  <FormControl>
                    <Input
                      className="mt-2 py-2 px-4 focus-visible:outline-neutral-tertiary"
                      type="password"
                      placeholder={t("confirmPasswordPlaceholder")}
                      {...field}
                    />
                  </FormControl>
                  <FormDescription className="relative left-2 mt-2 text-xs">
                    {t("confirmPasswordDescription")}
                  </FormDescription>
                  <FormMessage className="relative left-2 text-error-primary" />
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
                      className="flex justify-center justify-items-center items-center border-2 border-black w-7 h-7 rounded-md"
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>{t("termsLabel")}</FormLabel>
                    <FormDescription className="relative left-1 mt-2 text-xs">
                      {t("termsDescription")}
                    </FormDescription>
                  </div>
                </FormItem>
              )}
            />
            <Button
              className="border-2 border-black px-5 py-2 w-[60%]"
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
