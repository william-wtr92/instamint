import {
  AlertDialogAction,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@instamint/ui-kit"
import React, { useCallback } from "react"
import Loader from "../../utils/Loader"
import { useTranslation } from "next-i18next"
import useActionsContext from "@/web/contexts/useActionsContext"
import useAppContext from "@/web/contexts/useAppContext"

type Props = {
  handleNextStep: () => void
  showLoader: boolean
  setShowLoader: (bool: boolean) => void
  setQrCode(qrCode: string): void
}

const GenerateCodeStep = (props: Props) => {
  const { handleNextStep, showLoader, setShowLoader, setQrCode } = props
  const { t } = useTranslation("profile-settings-security")

  const {
    services: {
      users: { twoFactorCodeGeneration },
    },
  } = useAppContext()
  const { toast } = useActionsContext()

  const generateCode = useCallback(async () => {
    setShowLoader(true)

    const [err, data] = await twoFactorCodeGeneration(null)

    if (err) {
      setShowLoader(false)

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

    setQrCode(data.qrCode)

    handleNextStep()
    setShowLoader(false)
  }, [
    twoFactorCodeGeneration,
    toast,
    t,
    handleNextStep,
    setQrCode,
    setShowLoader,
  ])

  return (
    <>
      <AlertDialogHeader>
        <AlertDialogTitle className="text-center">
          {t("modal.activate-2fa.step-one.title")}
        </AlertDialogTitle>
        <AlertDialogDescription>
          {t("modal.activate-2fa.step-one.description")}
        </AlertDialogDescription>
      </AlertDialogHeader>

      <AlertDialogFooter className="flex flex-row items-center justify-center sm:justify-center">
        {showLoader ? (
          <Loader />
        ) : (
          <AlertDialogAction onClick={generateCode}>
            {t("modal.cta.generate-2fa-otp")}
          </AlertDialogAction>
        )}
      </AlertDialogFooter>
    </>
  )
}

export default GenerateCodeStep
