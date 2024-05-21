import {
  AlertDialogAction,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  Text,
} from "@instamint/ui-kit"
import { useTranslation } from "next-i18next"
import React, { useCallback } from "react"

import { useUser } from "@/web/hooks/auth/useUser"

type Props = {
  closeModal: () => void
  backupCodes: string[]
}

const EnableTwoFactorAuthSuccessStep = (props: Props) => {
  const { closeModal, backupCodes } = props
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

      <AlertDialogHeader className="gap-4">
        <AlertDialogTitle className="mx-auto w-[85%] text-center">
          {t("modal.activate-2fa.step-four.backup-codes-title")}
        </AlertDialogTitle>

        <div className="xs:flex-row flex flex-col flex-wrap gap-2">
          {backupCodes.map((code) => (
            <Text
              key={code}
              variant="neutral"
              type="medium"
              className="xs:max-w-[calc(50%-0.5rem)] h-fit flex-1 rounded-md bg-neutral-100 p-1.5 text-center font-light"
            >
              {code}
            </Text>
          ))}
        </div>
      </AlertDialogHeader>

      <AlertDialogFooter className="sm:justify-center">
        <AlertDialogAction onClick={handleRedirection}>
          {t("modal.cta.back-to-settings")}
        </AlertDialogAction>
      </AlertDialogFooter>
    </>
  )
}

export default EnableTwoFactorAuthSuccessStep
