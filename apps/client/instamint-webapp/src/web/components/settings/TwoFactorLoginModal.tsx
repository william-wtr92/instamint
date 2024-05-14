import { AlertDialog, AlertDialogContent } from "@instamint/ui-kit"
import { useTranslation } from "next-i18next"
import React, { useCallback, useState } from "react"

import EnterTwoFactorCodeModalContent from "@/web/components/settings/2fa/EnterTwoFactorCodeModalContent"

type Props = {
  isOpen: boolean
  handleCloseModal: () => void
  otpCode: string
  setOtpCode: (value: string) => void
  backupCode: string
  setBackupCode: (value: string) => void
  signInWith2fa: (value?: boolean) => void
  signInWith2faBackupCode: (value?: boolean) => void
  isSignInWithBackupCode: boolean
  handleIsSignInWithBackupCode: () => void
}

const TwoFactorLoginModal = (props: Props) => {
  const {
    isOpen,
    handleCloseModal,
    otpCode,
    setOtpCode,
    backupCode,
    setBackupCode,
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
          setOtpCode={setOtpCode}
          backupCode={backupCode}
          setBackUpCode={setBackupCode}
          handleCloseModal={handleCloseModal}
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
