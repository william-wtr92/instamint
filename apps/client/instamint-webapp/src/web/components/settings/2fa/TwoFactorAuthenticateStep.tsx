import useActionsContext from "@/web/contexts/useActionsContext"
import useAppContext from "@/web/contexts/useAppContext"
import { useUser } from "@/web/hooks/auth/useUser"
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline"
import { zodResolver } from "@hookform/resolvers/zod"
import {
  type TwoFactorAuthenticate,
  twoFactorAuthenticateSchema,
} from "@instamint/shared-types"
import {
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
  Button,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  Input,
} from "@instamint/ui-kit"
import { useTranslation } from "next-i18next"
import React, { useCallback, useState } from "react"
import { useForm } from "react-hook-form"

type Props = {
  handleNextStep: () => void
}

const TwoFactorAuthenticateStep = (props: Props) => {
  const { handleNextStep } = props
  const { t } = useTranslation("profile-settings-security")

  const {
    services: {
      users: { twoFactorAuthentication },
    },
  } = useAppContext()
  const { toast } = useActionsContext()

  const { data, error, isLoading } = useUser()
  const user = !isLoading && !error ? data : null
  const is2faEnabled = user?.twoFactorAuthentication

  const [showPassword, setShowPassword] = useState<boolean>(false)

  const form = useForm<TwoFactorAuthenticate>({
    resolver: zodResolver(twoFactorAuthenticateSchema),
    mode: "onBlur",
    defaultValues: {
      password: "",
    },
  })

  const authenticate = useCallback(
    async (values: TwoFactorAuthenticate) => {
      const [err] = await twoFactorAuthentication(values)

      if (err) {
        toast({
          variant: "error",
          description: t(`errors:auth.invalidPassword`),
        })

        return
      }

      handleNextStep()
    },
    [handleNextStep, twoFactorAuthentication, toast, t]
  )

  return (
    <>
      <AlertDialogHeader>
        <AlertDialogTitle className="xs:w-[90%] mx-auto text-center">
          {is2faEnabled
            ? t("modal.deactivate-2fa.step-zero.title")
            : t("modal.activate-2fa.step-zero.title")}
        </AlertDialogTitle>

        <AlertDialogDescription className="text-center">
          {is2faEnabled
            ? t("modal.deactivate-2fa.step-zero.description")
            : t("modal.activate-2fa.step-zero.description")}
        </AlertDialogDescription>
      </AlertDialogHeader>

      <AlertDialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(authenticate)}
            className="flex w-full flex-col items-center space-y-8 rounded-md bg-white"
          >
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem className="relative w-full">
                  <FormLabel className="relative left-1 flex items-center gap-2 font-bold">
                    <span>
                      {t("modal.activate-2fa.step-zero.password.label")}
                    </span>
                  </FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        className="focus-visible:outline-accent-500 mt-2 px-4 py-2 focus-visible:border-0 focus-visible:ring-0"
                        type={showPassword ? "text" : "password"}
                        placeholder={t(
                          "modal.activate-2fa.step-zero.password.placeholder"
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
                </FormItem>
              )}
            />
            <Button
              className={`bg-accent-500 w-1/2 py-2.5 font-semibold text-white hover:cursor-pointer`}
              type="submit"
            >
              {t("modal.cta.authenticate")}
            </Button>
          </form>
        </Form>
      </AlertDialogHeader>
    </>
  )
}

export default TwoFactorAuthenticateStep
