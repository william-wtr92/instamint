import { AlertDialogContent } from "@instamint/ui-kit"
import React, { useCallback, useState } from "react"
import ModalHeader from "./2fa/ModalHeader"
import TwoFactorAuthenticateStep from "./2fa/TwoFactorAuthenticateStep"
import DisableTwoFactorAuthSuccessStep from "./2fa/DisableTwoFactorAuthSuccessStep"
import EnterTwoFactorCodeModalContent from "./2fa/EnterTwoFactorCodeModalContent"
import useAppContext from "@/web/contexts/useAppContext"
import useActionsContext from "@/web/contexts/useActionsContext"
import { useTranslation } from "next-i18next"

type Props = {
  handleCloseModal: () => void
}

const DisableTwoFactorAuthModal = (props: Props) => {
  const { handleCloseModal } = props

  const { t } = useTranslation("profile-settings-security")

  const {
    services: {
      users: { twoFactorDeactivation },
    },
  } = useAppContext()
  const { toast } = useActionsContext()

  const [step, setStep] = useState<number>(0)
  const [otpCode, setOtpCode] = useState<string>("")

  const handlePreviousStep = useCallback(async () => {
    setStep((prevState) => prevState - 1)
  }, [])

  const handleNextStep = useCallback(async () => {
    setStep((prevState) => prevState + 1)
  }, [])

  const closeModal = useCallback(() => {
    handleCloseModal()
    setStep(0)
    setOtpCode("")
  }, [handleCloseModal])

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

        {step === 0 && (
          <TwoFactorAuthenticateStep handleNextStep={handleNextStep} />
        )}

        {step === 1 && (
          <EnterTwoFactorCodeModalContent
            title={t("modal.deactivate-2fa.step-one.title")}
            description={t("modal.deactivate-2fa.step-one.description")}
            otpCode={otpCode}
            setOtpCode={setOtpCode}
            handleCloseModal={closeModal}
            handleTwoFactorCodeValidation={deactivateTwoFactorAuth}
          />
        )}

        {step === 2 && (
          <DisableTwoFactorAuthSuccessStep closeModal={closeModal} />
        )}
      </AlertDialogContent>
    </>
  )
}

export default DisableTwoFactorAuthModal
