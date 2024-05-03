import { AlertDialog, AlertDialogContent } from "@instamint/ui-kit"
import { useTranslation } from "next-i18next"
import React, { useCallback, useState } from "react"
import EnterTwoFactorCodeModalContent from "./2fa/EnterTwoFactorCodeModalContent"

type Props = {
  isOpen: boolean
  handleCloseModal: () => void
  otpCode: string
  setOtpCode: (value: string) => void
  signInWith2fa: (value?: boolean) => void
}

const TwoFactorLoginModal = (props: Props) => {
  const { isOpen, handleCloseModal, otpCode, setOtpCode, signInWith2fa } = props
  const { t } = useTranslation("sign-in")

  const [authorizeDevice, setAuthorizeDevice] = useState<boolean>(false)

  const handleCheckbox = useCallback(() => {
    setAuthorizeDevice((prevState) => !prevState)
  }, [])

  return (
    <AlertDialog open={isOpen}>
      <AlertDialogContent className="bg-white pt-8">
        <EnterTwoFactorCodeModalContent
          title={t("modal.title")}
          description={t("modal.description")}
          otpCode={otpCode}
          setOtpCode={setOtpCode}
          handleCloseModal={handleCloseModal}
          authorizeDevice={authorizeDevice}
          handleCheckbox={handleCheckbox}
          handleTwoFactorCodeValidation={signInWith2fa}
        />
      </AlertDialogContent>
    </AlertDialog>
  )
}

export default TwoFactorLoginModal
