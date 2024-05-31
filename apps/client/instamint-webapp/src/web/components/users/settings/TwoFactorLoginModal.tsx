import { AlertDialog, AlertDialogContent } from "@instamint/ui-kit"
import { useTranslation } from "next-i18next"
import React, { useCallback, useState } from "react"

import EnterTwoFactorCodeModalContent from "@/web/components/users/settings/2fa/EnterTwoFactorCodeModalContent"

type Props = {
  isOpen: boolean
  handleModal: () => void
  otpCode: string
  handleOtpCode: (value: string) => void
  backupCode: string
  handleBackupCode: (value: string) => void
  signInWith2fa: (value?: boolean) => void
  signInWith2faBackupCode: (value?: boolean) => void
  isSignInWithBackupCode: boolean
  handleIsSignInWithBackupCode: () => void
}

const TwoFactorLoginModal = (props: Props) => {
  const {
    isOpen,
    handleModal,
    otpCode,
    handleOtpCode,
    backupCode,
    handleBackupCode,
    signInWith2fa,
    signInWith2faBackupCode,
    isSignInWithBackupCode,
    handleIsSignInWithBackupCode,
  } = props
  const { t } = useTranslation("sign-in")

  const [authorizeDevice, setAuthorizeDevice] = useState<boolean>(false)

  const handleAuthorizeDevice = useCallback(() => {
    setAuthorizeDevice((prevState) => !prevState)
  }, [])

  return (
    <AlertDialog open={isOpen}>
      <AlertDialogContent className="bg-white pt-8">
        <EnterTwoFactorCodeModalContent
          title={
            !isSignInWithBackupCode
              ? t("modal.title")
              : t("modal.backup-code-title")
          }
          description={
            !isSignInWithBackupCode
              ? t("modal.description")
              : t("modal.backup-code-description")
          }
          otpCode={otpCode}
          handleOtpCode={handleOtpCode}
          backupCode={backupCode}
          handleBackupCode={handleBackupCode}
          handleModal={handleModal}
          authorizeDevice={authorizeDevice}
          handleAuthorizeDevice={handleAuthorizeDevice}
          handleTwoFactorCodeValidation={
            !isSignInWithBackupCode ? signInWith2fa : signInWith2faBackupCode
          }
          isSignInWithBackupCode={isSignInWithBackupCode}
          handleIsSignInWithBackupCode={handleIsSignInWithBackupCode}
          canUseBackupCode={true}
        />
      </AlertDialogContent>
    </AlertDialog>
  )
}

export default TwoFactorLoginModal
