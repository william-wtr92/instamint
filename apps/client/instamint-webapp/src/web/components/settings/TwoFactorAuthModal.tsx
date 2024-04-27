import React, { useCallback, useState } from "react"
import { AlertDialog, AlertDialogContent } from "@instamint/ui-kit"

import TwoFactorAuthenticateStep from "./2fa/TwoFactorAuthenticateStep"
import GenerateCodeStep from "./2fa/GenerateCodeStep"
import ModalHeader from "./2fa/ModalHeader"
import DisplayQrCodeStep from "./2fa/DisplayQrCodeStep"
import ActivateTwoFactorAuthStep from "./2fa/ActivateTwoFactorAuthStep"
import TwoFactorAuthSuccessStep from "./2fa/TwoFactorAuthSuccessStep"

type Props = {
  isOpen: boolean
  closeModal: () => void
}

const TwoFactorAuthModal = (props: Props) => {
  const { isOpen, closeModal } = props

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
    setStep(0)
    setQrCode("")
    setOtpCode("")
    closeModal()
  }, [closeModal])

  return (
    <AlertDialog open={isOpen}>
      <AlertDialogContent className="h-fit gap-6 bg-white pt-8">
        <ModalHeader
          step={step}
          handleCloseModal={handleCloseModal}
          handlePreviousStep={handlePreviousStep}
        />

        {step === 0 && (
          <TwoFactorAuthenticateStep handleNextStep={handleNextStep} />
        )}

        {step === 1 && (
          <GenerateCodeStep
            handleNextStep={handleNextStep}
            setQrCode={setQrCode}
            showLoader={showLoader}
            setShowLoader={setShowLoader}
          />
        )}

        {step === 2 && (
          <DisplayQrCodeStep
            handleNextStep={handleNextStep}
            showLoader={showLoader}
            qrCode={qrCode}
          />
        )}

        {step === 3 && (
          <ActivateTwoFactorAuthStep
            handleNextStep={handleNextStep}
            otpCode={otpCode}
            setOtpCode={setOtpCode}
            setBackupCodes={setBackupCodes}
          />
        )}

        {step === 4 && (
          <TwoFactorAuthSuccessStep
            handleCloseModal={handleCloseModal}
            backupCodes={backupCodes}
          />
        )}
      </AlertDialogContent>
    </AlertDialog>
  )
}

export default TwoFactorAuthModal
