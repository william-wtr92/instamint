import { AlertDialogContent } from "@instamint/ui-kit"
import React, { useCallback, useState } from "react"
import ModalHeader from "./2fa/ModalHeader"
import ActivateTwoFactorAuthStep from "./2fa/ActivateTwoFactorAuthStep"
import TwoFactorAuthenticateStep from "./2fa/TwoFactorAuthenticateStep"
import DisableTwoFactorAuthSuccessStep from "./2fa/DisableTwoFactorAuthSuccessStep"

type Props = {
  handleCloseModal: () => void
}

const DisableTwoFactorAuthModal = (props: Props) => {
  const { handleCloseModal } = props

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
          <ActivateTwoFactorAuthStep
            handleNextStep={handleNextStep}
            otpCode={otpCode}
            setOtpCode={setOtpCode}
            isEnable2faModal={false}
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
