import React, { useCallback, useEffect, useState } from "react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  Button,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  Input,
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
  Text,
} from "@instamint/ui-kit"
import { useTranslation } from "next-i18next"
import Image from "next/image"
import { zodResolver } from "@hookform/resolvers/zod"

import Loader from "../utils/Loader"
import useAppContext from "@/web/contexts/useAppContext"
import useActionsContext from "@/web/contexts/useActionsContext"
import {
  ChevronLeftIcon,
  EyeIcon,
  EyeSlashIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline"
import { useForm } from "react-hook-form"
import {
  type TwoFactorAuthenticate,
  twoFactorAuthenticateSchema,
} from "@instamint/shared-types"
import { useUser } from "@/web/hooks/auth/useUser"

type Props = {
  isOpen: boolean
  closeModal: () => void
}

const otpCodeLength = 6

const TwoFactorAuthModal = (props: Props) => {
  const { isOpen, closeModal } = props
  const { t } = useTranslation("profile-settings-security")

  const {
    services: {
      users: {
        twoFactorAuthentication,
        twoFactorCodeGeneration,
        twoFactorActivation,
      },
    },
  } = useAppContext()
  const { toast } = useActionsContext()

  const { mutate } = useUser()

  const form = useForm<TwoFactorAuthenticate>({
    resolver: zodResolver(twoFactorAuthenticateSchema),
    mode: "onBlur",
    defaultValues: {
      password: "",
    },
  })

  const [showPassword, setShowPassword] = useState<boolean>(false)
  const [step, setStep] = useState<number>(0)
  const [showLoader, setShowLoader] = useState<boolean>(false)
  const [qrCode, setQrCode] = useState<string>("")
  const [otpCode, setOtpCode] = useState<string>("")
  const [backupCodes, setBackupCodes] = useState<string[]>([])

  const handlePreviousStep = useCallback(async () => {
    setStep((prevState) => prevState - 1)
  }, [])

  const handleNextStep = useCallback(async () => {
    setStep((prevState) => prevState + 1)
  }, [])

  const handleCloseModal = useCallback(() => {
    setStep(1)
    setQrCode("")
    setOtpCode("")
    closeModal()
  }, [closeModal])

  const handleRedirection = useCallback(() => {
    mutate()
    handleCloseModal()
  }, [mutate, handleCloseModal])

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

  const generateCode = useCallback(async () => {
    setShowLoader(true)

    const [err, data] = await twoFactorCodeGeneration(null)

    if (err) {
      setShowLoader(false)

      toast({
        variant: "error",
        description: t(
          `errors:users.profile-settings.security.2fa.${err.message}`
        ),
      })

      return
    }

    if (!data) {
      return
    }

    setQrCode(data.qrCode)

    handleNextStep()
    setShowLoader(false)
  }, [twoFactorCodeGeneration, toast, t, handleNextStep])

  const activateTwoFactorAuth = useCallback(async () => {
    setShowLoader(true)

    const [err, data] = await twoFactorActivation(otpCode)

    if (err) {
      setShowLoader(false)

      toast({
        variant: "error",
        description: t(
          `errors:users.profile-settings.security.2fa.${err.message}`
        ),
      })

      return
    }

    if (!data) {
      return
    }

    setBackupCodes(data.backupCodes)

    handleNextStep()
    setShowLoader(false)
  }, [twoFactorActivation, otpCode, toast, t, handleNextStep])

  useEffect(() => {
    if (otpCode.length === otpCodeLength) {
      activateTwoFactorAuth()
    }
  }, [otpCode, activateTwoFactorAuth])

  return (
    <AlertDialog open={isOpen}>
      <AlertDialogContent className="h-fit gap-6 bg-white pt-8">
        {step === 2 ||
          (step === 3 && (
            <AlertDialogCancel
              onClick={handlePreviousStep}
              className="absolute left-0 top-0 rounded-tl-md border-0 p-[5px]"
            >
              <ChevronLeftIcon className="size-7" />
            </AlertDialogCancel>
          ))}

        <AlertDialogCancel
          onClick={handleCloseModal}
          className="absolute right-0 top-0 rounded-tr-md border-0 p-[5px]"
        >
          <XMarkIcon className="size-7" />
        </AlertDialogCancel>

        {step === 0 && (
          <>
            <AlertDialogHeader>
              <AlertDialogTitle className="xs:w-[90%] mx-auto text-center">
                {t("modal.step-zero.title")}
              </AlertDialogTitle>
              <AlertDialogDescription className="text-center">
                {t("modal.step-zero.description")}
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
                          <span>{t("modal.step-zero.password.label")}</span>
                        </FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Input
                              className="focus-visible:outline-accent-500 mt-2 px-4 py-2 focus-visible:border-0 focus-visible:ring-0"
                              type={showPassword ? "text" : "password"}
                              placeholder={t(
                                "modal.step-zero.password.placeholder"
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
        )}

        {step === 1 && (
          <>
            <AlertDialogHeader>
              <AlertDialogTitle className="text-center">
                {t("modal.step-one.title")}
              </AlertDialogTitle>
              <AlertDialogDescription>
                {t("modal.step-one.description")}
              </AlertDialogDescription>
            </AlertDialogHeader>

            <AlertDialogFooter className="flex flex-row items-center justify-center sm:justify-center">
              {showLoader ? (
                <Loader />
              ) : (
                <AlertDialogAction onClick={generateCode}>
                  {t("modal.cta.generate-2fa-otp")}
                </AlertDialogAction>
              )}
            </AlertDialogFooter>
          </>
        )}

        {step === 2 && (
          <>
            <AlertDialogHeader>
              <AlertDialogTitle className="mx-auto w-[85%] text-center">
                {t("modal.step-two.title")}
              </AlertDialogTitle>
            </AlertDialogHeader>

            <AlertDialogFooter className="items-center sm:flex-col sm:items-center sm:justify-center">
              <Image
                src={qrCode}
                width={200}
                height={200}
                alt="Two-factor authentication QR code"
              />
            </AlertDialogFooter>

            <AlertDialogFooter className="sm:justify-center">
              {showLoader ? (
                <Loader />
              ) : (
                <AlertDialogAction onClick={handleNextStep}>
                  {t("modal.cta.i-have-my-2fa-code")}
                </AlertDialogAction>
              )}
            </AlertDialogFooter>
          </>
        )}

        {step === 3 && (
          <>
            <AlertDialogHeader>
              <AlertDialogTitle className="mx-auto w-[85%] text-center">
                {t("modal.step-three.title")}
              </AlertDialogTitle>

              <AlertDialogDescription className="text-center">
                {t("modal.step-three.description")}
              </AlertDialogDescription>
            </AlertDialogHeader>

            <AlertDialogFooter className="mt-4 pb-4 sm:justify-center">
              <InputOTP
                maxLength={6}
                value={otpCode}
                onChange={(value) => setOtpCode(value)}
              >
                <InputOTPGroup>
                  <InputOTPSlot index={0} />
                  <InputOTPSlot index={1} />
                  <InputOTPSlot index={2} />
                </InputOTPGroup>
                <InputOTPSeparator />
                <InputOTPGroup>
                  <InputOTPSlot index={3} />
                  <InputOTPSlot index={4} />
                  <InputOTPSlot index={5} />
                </InputOTPGroup>
              </InputOTP>
            </AlertDialogFooter>
          </>
        )}

        {step === 4 && (
          <>
            <AlertDialogHeader className="gap-4">
              <AlertDialogTitle className="mx-auto w-[85%] text-center">
                {t("modal.step-four.title")}
              </AlertDialogTitle>

              <AlertDialogDescription className="xs:block hidden text-center">
                {t("modal.step-four.description")}
              </AlertDialogDescription>
            </AlertDialogHeader>

            <AlertDialogHeader>
              <AlertDialogDescription className="text-error-primary text-center font-bold">
                {t("modal.step-four.backup-codes-description")}
              </AlertDialogDescription>
            </AlertDialogHeader>

            <AlertDialogHeader className="gap-4">
              <AlertDialogTitle className="mx-auto w-[85%] text-center">
                {t("modal.step-four.backup-codes-title")}
              </AlertDialogTitle>

              <div className="flex flex-col gap-2">
                <div className="flex flex-row justify-center gap-2">
                  <Text
                    variant="neutral"
                    type="medium"
                    className="flex-1 rounded-md bg-neutral-100 p-1.5 text-center font-light"
                  >
                    {backupCodes[0]}
                  </Text>
                  <Text
                    variant="neutral"
                    type="medium"
                    className="flex-1 rounded-md bg-neutral-100 p-1.5 text-center font-light"
                  >
                    {backupCodes[1]}
                  </Text>
                </div>
                <div className="flex flex-row justify-center gap-2">
                  <Text
                    variant="neutral"
                    type="medium"
                    className="flex-1 rounded-md bg-neutral-100 p-1.5 text-center font-light"
                  >
                    {backupCodes[2]}
                  </Text>
                  <Text
                    variant="neutral"
                    type="medium"
                    className="flex-1 rounded-md bg-neutral-100 p-1.5 text-center font-light"
                  >
                    {backupCodes[3]}
                  </Text>
                </div>
                <div className="flex flex-row justify-center gap-2">
                  <Text
                    variant="neutral"
                    type="medium"
                    className="flex-1 rounded-md bg-neutral-100 p-1.5 text-center font-light"
                  >
                    {backupCodes[4]}
                  </Text>
                  <Text
                    variant="neutral"
                    type="medium"
                    className="flex-1 rounded-md bg-neutral-100 p-1.5 text-center font-light"
                  >
                    {backupCodes[5]}
                  </Text>
                </div>
              </div>
            </AlertDialogHeader>

            <AlertDialogFooter className="sm:justify-center">
              <Button onClick={handleRedirection}>
                {t("modal.cta.back-to-settings")}
              </Button>
            </AlertDialogFooter>
          </>
        )}
      </AlertDialogContent>
    </AlertDialog>
  )
}

export default TwoFactorAuthModal
