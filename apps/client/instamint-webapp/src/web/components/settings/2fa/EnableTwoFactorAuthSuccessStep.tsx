import { useUser } from "@/web/hooks/auth/useUser"
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

        <div className="flex flex-col gap-2">
          <div className="flex flex-col justify-center gap-2 md:flex-row">
            <Text
              variant="neutral"
              type="medium"
              className="flex-1 rounded-md bg-neutral-100 p-1.5 text-center font-light"
            >
              {backupCodes[0]}
            </Text>
            <Text
              variant="neutral"
              type="medium"
              className="flex-1 rounded-md bg-neutral-100 p-1.5 text-center font-light"
            >
              {backupCodes[1]}
            </Text>
          </div>
          <div className="flex flex-col justify-center gap-2 md:flex-row">
            <Text
              variant="neutral"
              type="medium"
              className="flex-1 rounded-md bg-neutral-100 p-1.5 text-center font-light"
            >
              {backupCodes[2]}
            </Text>
            <Text
              variant="neutral"
              type="medium"
              className="flex-1 rounded-md bg-neutral-100 p-1.5 text-center font-light"
            >
              {backupCodes[3]}
            </Text>
          </div>
          <div className="flex flex-col justify-center gap-2 md:flex-row">
            <Text
              variant="neutral"
              type="medium"
              className="flex-1 rounded-md bg-neutral-100 p-1.5 text-center font-light"
            >
              {backupCodes[4]}
            </Text>
            <Text
              variant="neutral"
              type="medium"
              className="flex-1 rounded-md bg-neutral-100 p-1.5 text-center font-light"
            >
              {backupCodes[5]}
            </Text>
          </div>
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
