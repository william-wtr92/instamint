import { AlertDialogContent } from "@instamint/ui-kit"
import { useTranslation } from "next-i18next"
import React, { useCallback, useState } from "react"

import DisableTwoFactorAuthSuccessStep from "@/web/components/settings/2fa/DisableTwoFactorAuthSuccessStep"
import EnterTwoFactorCodeModalContent from "@/web/components/settings/2fa/EnterTwoFactorCodeModalContent"
import ModalHeader from "@/web/components/settings/2fa/ModalHeader"
import TwoFactorAuthenticateStep from "@/web/components/settings/2fa/TwoFactorAuthenticateStep"
import useActionsContext from "@/web/contexts/useActionsContext"
import useAppContext from "@/web/contexts/useAppContext"

const steps = {
  zero: 0,
  one: 1,
  two: 2,
} as const

type Props = {
  handleModal: () => void
}

const DisableTwoFactorAuthModal = (props: Props) => {
  const { handleModal } = props

  const { t } = useTranslation("profile-settings-security")

  const {
    services: {
      users: { twoFactorDeactivation },
    },
  } = useAppContext()
  const { toast } = useActionsContext()

  const [step, setStep] = useState<number>(0)
  const [otpCode, setOtpCode] = useState<string>("")

  const handlePreviousStep = useCallback(() => {
    setStep((prevState) => prevState - 1)
  }, [])

  const handleNextStep = useCallback(() => {
    setStep((prevState) => prevState + 1)
  }, [])

  const handleOtpCode = useCallback((code: string) => {
    setOtpCode(code)
  }, [])

  const closeModal = useCallback(() => {
    handleModal()
    setStep(0)
    setOtpCode("")
  }, [handleModal])

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

  return (
    <>
      <AlertDialogContent className="h-fit gap-6 bg-white pt-8">
        <ModalHeader
          step={step}
          closeModal={closeModal}
          handlePreviousStep={handlePreviousStep}
        />

        {step === steps.zero && (
          <TwoFactorAuthenticateStep handleNextStep={handleNextStep} />
        )}

        {step === steps.one && (
          <EnterTwoFactorCodeModalContent
            title={t("modal.deactivate-2fa.step-one.title")}
            description={t("modal.deactivate-2fa.step-one.description")}
            otpCode={otpCode}
            handleOtpCode={handleOtpCode}
            handleModal={closeModal}
            handleTwoFactorCodeValidation={deactivateTwoFactorAuth}
          />
        )}

        {step === steps.two && (
          <DisableTwoFactorAuthSuccessStep closeModal={closeModal} />
        )}
      </AlertDialogContent>
    </>
  )
}

export default DisableTwoFactorAuthModal
