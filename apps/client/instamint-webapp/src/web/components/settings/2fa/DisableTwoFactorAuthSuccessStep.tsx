import { useUser } from "@/web/hooks/auth/useUser"
import {
  AlertDialogAction,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@instamint/ui-kit"
import { useTranslation } from "next-i18next"
import React, { useCallback } from "react"

type Props = {
  closeModal: () => void
}

const DisableTwoFactorAuthSuccessStep = (props: Props) => {
  const { closeModal } = props
  const { t } = useTranslation("profile-settings-security")

  const { mutate } = useUser()

  const handleRedirection = useCallback(() => {
    mutate()
    closeModal()
  }, [mutate, closeModal])

  return (
    <>
      <AlertDialogHeader className="gap-4">
        <AlertDialogTitle className="mx-auto w-[85%] text-center">
          {t("modal.activate-2fa.step-four.title")}
        </AlertDialogTitle>

        <AlertDialogDescription className="xs:block hidden text-center">
          {t("modal.activate-2fa.step-four.description")}
        </AlertDialogDescription>
      </AlertDialogHeader>

      <AlertDialogHeader>
        <AlertDialogDescription className="text-error-primary text-center font-bold">
          {t("modal.activate-2fa.step-four.backup-codes-description")}
        </AlertDialogDescription>
      </AlertDialogHeader>

      <AlertDialogFooter className="sm:justify-center">
        <AlertDialogAction onClick={handleRedirection}>
          {t("modal.cta.back-to-settings")}
        </AlertDialogAction>
      </AlertDialogFooter>
    </>
  )
}

export default DisableTwoFactorAuthSuccessStep
