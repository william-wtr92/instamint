import { useUser } from "@/web/hooks/auth/useUser"
import {
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  Button,
  Text,
} from "@instamint/ui-kit"
import { useTranslation } from "next-i18next"
import React, { useCallback } from "react"

type Props = {
  handleCloseModal: () => void
  backupCodes: string[]
}

const TwoFactorAuthSuccessStep = (props: Props) => {
  const { handleCloseModal, backupCodes } = props
  const { t } = useTranslation("profile-settings-security")

  const { mutate } = useUser()

  const handleRedirection = useCallback(() => {
    mutate()
    handleCloseModal()
  }, [mutate, handleCloseModal])

  return (
    <>
      <AlertDialogHeader className="gap-4">
        <AlertDialogTitle className="mx-auto w-[85%] text-center">
          {t("modal.step-four.title")}
        </AlertDialogTitle>

        <AlertDialogDescription className="xs:block hidden text-center">
          {t("modal.step-four.description")}
        </AlertDialogDescription>
      </AlertDialogHeader>

      <AlertDialogHeader>
        <AlertDialogDescription className="text-error-primary text-center font-bold">
          {t("modal.step-four.backup-codes-description")}
        </AlertDialogDescription>
      </AlertDialogHeader>

      <AlertDialogHeader className="gap-4">
        <AlertDialogTitle className="mx-auto w-[85%] text-center">
          {t("modal.step-four.backup-codes-title")}
        </AlertDialogTitle>

        <div className="flex flex-col gap-2">
          <div className="flex flex-row justify-center gap-2">
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
          <div className="flex flex-row justify-center gap-2">
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
          <div className="flex flex-row justify-center gap-2">
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
        <Button onClick={handleRedirection}>
          {t("modal.cta.back-to-settings")}
        </Button>
      </AlertDialogFooter>
    </>
  )
}

export default TwoFactorAuthSuccessStep
