import React, { useCallback, useState } from "react"
import { AlertDialog, AlertDialogContent } from "@instamint/ui-kit"

import TwoFactorAuthenticateStep from "./2fa/TwoFactorAuthenticateStep"
import GenerateCodeStep from "./2fa/GenerateCodeStep"
import ModalHeader from "./2fa/ModalHeader"
import DisplayQrCodeStep from "./2fa/DisplayQrCodeStep"
import ActivateTwoFactorAuthStep from "./2fa/ActivateTwoFactorAuthStep"
import EnableTwoFactorAuthSuccessStep from "./2fa/EnableTwoFactorAuthSuccessStep"

type Props = {
  isOpen: boolean
  handleCloseModal: () => void
}

const EnableTwoFactorAuthModal = (props: Props) => {
  const { isOpen, handleCloseModal } = props

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

  const closeModal = useCallback(() => {
    handleCloseModal()
    setStep(0)
    setQrCode("")
    setOtpCode("")
  }, [handleCloseModal])

  return (
    <AlertDialog open={isOpen}>
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
            isEnable2faModal={true}
          />
        )}

        {step === 4 && (
          <EnableTwoFactorAuthSuccessStep
            closeModal={closeModal}
            backupCodes={backupCodes}
          />
        )}
      </AlertDialogContent>
    </AlertDialog>
  )
}

export default EnableTwoFactorAuthModal
