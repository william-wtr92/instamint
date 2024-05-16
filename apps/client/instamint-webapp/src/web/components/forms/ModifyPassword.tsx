import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline"
import { zodResolver } from "@hookform/resolvers/zod"
import {
  type ModifyPassword,
  modifyPasswordSchema,
} from "@instamint/shared-types"
import {
  Button,
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
  Label,
} from "@instamint/ui-kit"
import { useTranslation } from "next-i18next"
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"

import { checkPasswordHelper } from "@/web/utils/helpers/checkPasswordHelper"

type Props = {
  onSubmit: (values: ModifyPassword) => void
}

export const ModifyPasswordForm = (props: Props) => {
  const { onSubmit } = props

  const { t } = useTranslation("profile-settings-security")

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

  const form = useForm<ModifyPassword>({
    resolver: zodResolver(modifyPasswordSchema),
    mode: "onBlur",
    defaultValues: {
      oldPassword: "",
      newPassword: "",
      confirmNewPassword: "",
    },
  })

  const {
    watch,
    formState: { errors },
  } = form

  const password = watch("newPassword")
  const checkPassword = Object.values(passwordCriteria).every(Boolean)

  useEffect(() => {
    setPasswordCriteria(checkPasswordHelper(password))
  }, [password])

  return (
    <>
      <Form {...form}>
        <Dialog onOpenChange={() => form.reset()}>
          <DialogTrigger asChild>
            <Label className="font-semibold hover:cursor-pointer">
              {t(`modify-password.triggerLabel`)}
            </Label>
          </DialogTrigger>
          <DialogContent className="bg-white">
            <DialogHeader className="mb-6">
              <DialogTitle className="font-extrabold">
                {t(`modify-password.title`)}
              </DialogTitle>
            </DialogHeader>
            <div className="flex flex-col">
              <form onSubmit={form.handleSubmit(onSubmit)}>
                <FormField
                  control={form.control}
                  name="oldPassword"
                  render={({ field }) => (
                    <FormItem className="relative w-full">
                      <FormLabel className="relative left-1 flex items-center gap-2 font-bold">
                        <span>{t(`modify-password.oldPassword.label`)}</span>
                      </FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            className="focus-visible:outline-accent-500 mt-4 px-4 py-2 focus-visible:border-0 focus-visible:ring-0"
                            type="password"
                            placeholder={t(
                              `modify-password.oldPassword.placeholder`
                            )}
                            {...field}
                          />
                        </div>
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="newPassword"
                  render={({ field }) => (
                    <FormItem className="relative w-full">
                      <FormLabel className="relative left-1 mt-6 flex items-center gap-2 font-bold">
                        <span>{t(`modify-password.newPassword.label`)}</span>
                      </FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            className="focus-visible:outline-accent-500 mt-4 px-4 py-2 focus-visible:border-0 focus-visible:ring-0"
                            type={showPassword ? "text" : "password"}
                            placeholder={t(
                              `modify-password.newPassword.placeholder`
                            )}
                            {...field}
                            onFocus={() => {
                              setIsFocused(true)
                            }}
                            onBlur={() => {
                              setIsFocused(false)
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
                        className={`relative mt-6 rounded-md  bg-white xl:absolute xl:-bottom-5 xl:left-[-50%] xl:px-8 xl:py-4 ${isFocused ? "xl:block" : "xl:hidden"}`}
                        tabIndex={-1}
                      >
                        {Object.entries(passwordCriteria).map(
                          ([key, value]) => (
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
                                  `modify-password.newPassword.criteria.${key}`
                                )}
                              </span>
                            </span>
                          )
                        )}
                      </div>
                      <FormMessage
                        className="text-error-primary relative left-2"
                        useCustomError={true}
                      >
                        {errors.newPassword ? (
                          <span>{t(`modify-password.newPassword.error`)}</span>
                        ) : null}
                      </FormMessage>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="confirmNewPassword"
                  render={({ field }) => (
                    <FormItem className="relative w-full">
                      <FormLabel className="relative left-1 mt-6 flex items-center gap-2 font-bold">
                        <span>
                          {t(`modify-password.confirmNewPassword.label`)}
                        </span>
                      </FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            className="focus-visible:outline-accent-500 mt-4 px-4 py-2 focus-visible:border-0 focus-visible:ring-0"
                            type="password"
                            placeholder={t(
                              `modify-password.confirmNewPassword.placeholder`
                            )}
                            {...field}
                          />
                        </div>
                      </FormControl>
                      <FormMessage
                        className="text-error-primary relative left-2"
                        useCustomError={true}
                      >
                        {errors.confirmNewPassword ? (
                          <span>
                            {t(`modify-password.confirmNewPassword.error`)}
                          </span>
                        ) : null}
                      </FormMessage>
                    </FormItem>
                  )}
                />
                <DialogFooter>
                  <Button
                    disabled={!form.formState.isValid && !checkPassword}
                    type="submit"
                    className="bg-accent-500 mt-6 py-2.5 font-semibold text-white"
                  >
                    Submit
                  </Button>
                </DialogFooter>
              </form>
            </div>
          </DialogContent>
        </Dialog>
      </Form>
    </>
  )
}
