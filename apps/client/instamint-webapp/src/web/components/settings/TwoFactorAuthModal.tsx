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
import Image from "next/image"
import useAppContext from "@/web/contexts/useAppContext"
import useActionsContext from "@/web/contexts/useActionsContext"

type Props = {
  isOpen: boolean
}

const TwoFactorAuthModal = (props: Props) => {
  const { isOpen } = props
  const { t } = useTranslation("profile-settings-security")

  const {
    services: {
      users: { twoFactorCodeGeneration },
    },
  } = useAppContext()

  const { toast } = useActionsContext()

  const [step, setStep] = useState<number>(1)
  const [showLoader, setShowLoader] = useState<boolean>(false)
  const [qrCode, setQrCode] = useState<string>("")
  const [twoFactorCode, setTwoFactorCode] = useState<string>("")

  const handleNextStep = useCallback(async () => {
    setStep(step + 1)
  }, [step])

  const generateCode = useCallback(async () => {
    setShowLoader(true)

    const [err, data] = await twoFactorCodeGeneration()

    if (err) {
      toast({
        variant: "error",
        description: t(`errors:auth.${err.message}`),
      })
    } else {
      if (!data) {
        return
      }

      setQrCode(data.qrCode)
      handleNextStep()
    }

    setShowLoader(false)
  }, [twoFactorCodeGeneration, toast, t, handleNextStep])

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
                <AlertDialogAction onClick={generateCode}>
                  {t("modal.cta.generate2faOtp")}
                </AlertDialogAction>
              )}
            </AlertDialogFooter>
          </>
        )}

        {step === 2 && (
          <>
            <AlertDialogHeader>
              <AlertDialogTitle className="text-center">
                {t("modal.stepTwo.title")}
              </AlertDialogTitle>
            </AlertDialogHeader>

            <AlertDialogFooter className="sm:justify-center">
              {" "}
              <Image
                src={qrCode}
                width={200}
                height={200}
                alt="Two-factor authentication QR code"
              />
            </AlertDialogFooter>

            <AlertDialogFooter className="sm:justify-center">
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
