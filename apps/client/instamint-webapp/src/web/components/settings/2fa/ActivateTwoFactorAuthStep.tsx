import useActionsContext from "@/web/contexts/useActionsContext"
import useAppContext from "@/web/contexts/useAppContext"
import {
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@instamint/ui-kit"
import { useTranslation } from "next-i18next"
import React, { useCallback, useEffect } from "react"

type Props = {
  handleNextStep: () => void
  otpCode: string
  setOtpCode: (otpCode: string) => void
  setBackupCodes?: (backupCodes: string[]) => void
  isEnable2faModal: boolean
}

const otpCodeLength = 6

const ActivateTwoFactorAuthStep = (props: Props) => {
  const {
    handleNextStep,
    otpCode,
    setOtpCode,
    setBackupCodes,
    isEnable2faModal,
  } = props
  const { t } = useTranslation("profile-settings-security")

  const {
    services: {
      users: { twoFactorActivation, twoFactorDeactivation },
    },
  } = useAppContext()
  const { toast } = useActionsContext()

  const activateTwoFactorAuth = useCallback(async () => {
    const [err, data] = await twoFactorActivation(otpCode)

    if (err) {
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

    if (!setBackupCodes) {
      return
    }

    setBackupCodes(data.backupCodes)

    handleNextStep()
  }, [twoFactorActivation, otpCode, toast, t, handleNextStep, setBackupCodes])

  const deactivateTwoFactorAuth = useCallback(async () => {
    const [err] = await twoFactorDeactivation(otpCode)

    if (err) {
      toast({
        variant: "error",
        description: t(
          `errors:users.profile-settings.security.2fa.${err.message}`
        ),
      })

      return
    }

    handleNextStep()
  }, [handleNextStep, otpCode, toast, t, twoFactorDeactivation])

  useEffect(() => {
    if (otpCode.length === otpCodeLength) {
      isEnable2faModal ? activateTwoFactorAuth() : deactivateTwoFactorAuth()
    }
  }, [
    otpCode,
    activateTwoFactorAuth,
    deactivateTwoFactorAuth,
    isEnable2faModal,
  ])

  return (
    <>
      <AlertDialogHeader>
        <AlertDialogTitle className="mx-auto w-[85%] text-center">
          {isEnable2faModal
            ? t("modal.activate-2fa.step-three.title")
            : t("modal.deactivate-2fa.step-one.title")}
        </AlertDialogTitle>

        <AlertDialogDescription className="text-center">
          {isEnable2faModal
            ? t("modal.activate-2fa.step-three.description")
            : t("modal.deactivate-2fa.step-one.description")}
        </AlertDialogDescription>
      </AlertDialogHeader>

      <AlertDialogFooter className="mx-auto mt-4 pb-4 sm:justify-center">
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
  )
}

export default ActivateTwoFactorAuthStep
