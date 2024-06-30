import { AlertDialogContent } from "@instamint/ui-kit"
import { useTranslation } from "next-i18next"
import React, { useCallback, useState } from "react"

import DisplayQrCodeStep from "@/web/components/users/settings/2fa/DisplayQrCodeStep"
import EnableTwoFactorAuthSuccessStep from "@/web/components/users/settings/2fa/EnableTwoFactorAuthSuccessStep"
import EnterTwoFactorCodeModalContent from "@/web/components/users/settings/2fa/EnterTwoFactorCodeModalContent"
import GenerateCodeStep from "@/web/components/users/settings/2fa/GenerateCodeStep"
import ModalHeader from "@/web/components/users/settings/2fa/ModalHeader"
import TwoFactorAuthenticateStep from "@/web/components/users/settings/2fa/TwoFactorAuthenticateStep"
import useActionsContext from "@/web/contexts/useActionsContext"
import useAppContext from "@/web/contexts/useAppContext"

const steps = {
  zero: 0,
  one: 1,
  two: 2,
  three: 3,
  four: 4,
} as const

type Props = {
  handleModal: () => void
}

const EnableTwoFactorAuthModal = (props: Props) => {
  const { handleModal } = props
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
    setQrCode("")
    setOtpCode("")
  }, [handleModal])

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

    if (!data || !setBackupCodes) {
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

        {step === steps.zero && (
          <TwoFactorAuthenticateStep handleNextStep={handleNextStep} />
        )}

        {step === steps.one && (
          <GenerateCodeStep
            handleNextStep={handleNextStep}
            setQrCode={setQrCode}
            showLoader={showLoader}
            setShowLoader={setShowLoader}
          />
        )}

        {step === steps.two && (
          <DisplayQrCodeStep
            handleNextStep={handleNextStep}
            showLoader={showLoader}
            qrCode={qrCode}
          />
        )}

        {step === steps.three && (
          <EnterTwoFactorCodeModalContent
            title={t("modal.activate-2fa.step-three.title")}
            description={t("modal.activate-2fa.step-three.description")}
            otpCode={otpCode}
            handleOtpCode={handleOtpCode}
            handleModal={closeModal}
            handleTwoFactorCodeValidation={activateTwoFactorAuth}
          />
        )}

        {step === steps.four && (
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
