import React, { useCallback, useState } from "react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@instamint/ui-kit"
import { useTranslation } from "next-i18next"
import Loader from "../utils/Loader"

type Props = {
  isOpen: boolean
}

const TwoFactorAuthModal = (props: Props) => {
  const { isOpen } = props
  const { t } = useTranslation("profile-settings-security")

  const [step, setStep] = useState<number>(1)
  const [showLoader, setShowLoader] = useState<boolean>(false)

  const handleNextStep = useCallback(() => {
    setShowLoader(true)

    setTimeout(() => {
      setShowLoader(false)
      setStep(step + 1)
    }, 3000)
  }, [step])

  return (
    <AlertDialog open={isOpen}>
      <AlertDialogContent className="bg-white">
        {step === 1 && (
          <>
            <AlertDialogHeader>
              <AlertDialogTitle className="text-center">
                {t("modal.stepOne.title")}
              </AlertDialogTitle>
              <AlertDialogDescription>
                {t("modal.stepOne.description")}
              </AlertDialogDescription>
            </AlertDialogHeader>

            <AlertDialogFooter className="flex flex-row items-center justify-center sm:justify-center">
              {showLoader ? (
                <Loader />
              ) : (
                <AlertDialogAction onClick={handleNextStep}>
                  {t("modal.cta.generate2faOtp")}
                </AlertDialogAction>
              )}
            </AlertDialogFooter>
          </>
        )}

        {step === 2 && (
          <>
            <AlertDialogHeader>
              <AlertDialogTitle>{t("modal.stepTwo.title")}</AlertDialogTitle>
            </AlertDialogHeader>

            <AlertDialogFooter>
              {showLoader ? (
                <Loader />
              ) : (
                <AlertDialogAction onClick={handleNextStep}>
                  {t("modal.cta.activate-2fa")}
                </AlertDialogAction>
              )}
            </AlertDialogFooter>
          </>
        )}
      </AlertDialogContent>
    </AlertDialog>
  )
}

export default TwoFactorAuthModal
