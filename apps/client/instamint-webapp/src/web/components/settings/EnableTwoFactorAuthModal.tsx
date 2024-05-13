import React, { useCallback, useState } from "react"
import { AlertDialogContent } from "@instamint/ui-kit"

import TwoFactorAuthenticateStep from "./2fa/TwoFactorAuthenticateStep"
import GenerateCodeStep from "./2fa/GenerateCodeStep"
import ModalHeader from "./2fa/ModalHeader"
import DisplayQrCodeStep from "./2fa/DisplayQrCodeStep"
import EnableTwoFactorAuthSuccessStep from "./2fa/EnableTwoFactorAuthSuccessStep"
import EnterTwoFactorCodeModalContent from "./2fa/EnterTwoFactorCodeModalContent"
import { useTranslation } from "next-i18next"
import useAppContext from "@/web/contexts/useAppContext"
import useActionsContext from "@/web/contexts/useActionsContext"

type Props = {
  handleCloseModal: () => void
}

const EnableTwoFactorAuthModal = (props: Props) => {
  const { handleCloseModal } = props
  const { t } = useTranslation("profile-settings-security")

  const {
    services: {
      users: { twoFactorActivation },
    },
  } = useAppContext()

  const { toast } = useActionsContext()

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
          <EnterTwoFactorCodeModalContent
            title={t("modal.activate-2fa.step-three.title")}
            description={t("modal.activate-2fa.step-three.description")}
            otpCode={otpCode}
            setOtpCode={setOtpCode}
            handleCloseModal={closeModal}
            handleTwoFactorCodeValidation={activateTwoFactorAuth}
          />
        )}

        {step === 4 && (
          <EnableTwoFactorAuthSuccessStep
            closeModal={closeModal}
            backupCodes={backupCodes}
          />
        )}
      </AlertDialogContent>
    </>
  )
}

export default EnableTwoFactorAuthModal