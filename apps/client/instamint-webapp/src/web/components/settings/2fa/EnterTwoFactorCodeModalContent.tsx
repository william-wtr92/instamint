import { ChevronLeftIcon, XMarkIcon } from "@heroicons/react/24/outline"
import {
  AlertDialogCancel,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  Button,
  Checkbox,
  Input,
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
  Text,
} from "@instamint/ui-kit"
import { useTranslation } from "next-i18next"
import React, { useEffect } from "react"

type Props = {
  title: string
  description: string
  otpCode: string
  handleOtpCode: (otpCode: string) => void
  handleTwoFactorCodeValidation: (value?: boolean) => void
  handleModal: () => void

  backupCode?: string
  handleBackupCode?: (backupCode: string) => void
  authorizeDevice?: boolean
  handleAuthorizeDevice?: () => void
  isSignInWithBackupCode?: boolean
  handleIsSignInWithBackupCode?: () => void
  canUseBackupCode?: boolean
}

const otpCodeLength = 6

const EnterTwoFactorCodeModalContent = (props: Props) => {
  const {
    title,
    description,
    otpCode,
    handleOtpCode,
    backupCode,
    handleBackupCode,
    handleModal,
    handleAuthorizeDevice,
    authorizeDevice,
    handleTwoFactorCodeValidation,
    isSignInWithBackupCode,
    handleIsSignInWithBackupCode,
    canUseBackupCode,
  } = props

  const { t } = useTranslation("sign-in")

  useEffect(() => {
    if (otpCode.length === otpCodeLength) {
      if (authorizeDevice) {
        handleTwoFactorCodeValidation(authorizeDevice)

        return
      }

      handleTwoFactorCodeValidation()
    }
  }, [otpCode, authorizeDevice, handleTwoFactorCodeValidation])

  return (
    <>
      {isSignInWithBackupCode && (
        <AlertDialogCancel
          onClick={handleIsSignInWithBackupCode}
          className="absolute left-0 top-0 rounded-tl-md border-0 p-[5px]"
        >
          <ChevronLeftIcon className="size-7" />
        </AlertDialogCancel>
      )}

      <AlertDialogCancel
        onClick={handleModal}
        className="absolute right-0 top-0 rounded-tr-md border-0 p-[5px]"
      >
        <XMarkIcon className="size-7" />
      </AlertDialogCancel>

      <AlertDialogHeader>
        <AlertDialogTitle className="mx-auto w-[85%] text-center">
          {title}
        </AlertDialogTitle>

        <AlertDialogDescription className="text-center">
          {description}
        </AlertDialogDescription>
      </AlertDialogHeader>

      <AlertDialogFooter className="mt-4 flex flex-col items-center gap-4 pb-4 sm:flex-col sm:justify-center">
        {!isSignInWithBackupCode ? (
          <InputOTP
            maxLength={6}
            value={otpCode}
            onChange={(value) => handleOtpCode(value)}
          >
            <InputOTPGroup>
              <InputOTPSlot index={0} />
              <InputOTPSlot index={1} />
              <InputOTPSlot index={2} />
            </InputOTPGroup>
            <InputOTPSeparator />
            <InputOTPGroup>
              <InputOTPSlot index={3} />
              <InputOTPSlot index={4} />
              <InputOTPSlot index={5} />
            </InputOTPGroup>
          </InputOTP>
        ) : (
          <>
            <Input
              type="text"
              placeholder={t("modal.backup-code-placeholder")}
              className="w-[85%] text-center"
              onChange={(e) => handleBackupCode!(e.target.value)}
            />

            <Button
              disabled={backupCode!.length < 24}
              onClick={() => handleTwoFactorCodeValidation()}
            >
              {t("cta.submit")}
            </Button>
          </>
        )}
      </AlertDialogFooter>

      {authorizeDevice !== undefined &&
        (!isSignInWithBackupCode ? (
          <AlertDialogFooter className="flex flex-row items-start gap-2 sm:justify-start">
            <Checkbox
              checked={authorizeDevice}
              onCheckedChange={handleAuthorizeDevice}
            />
            <Text variant="neutral" type="medium">
              {t("modal.checkbox-description")}
            </Text>
          </AlertDialogFooter>
        ) : null)}

      {canUseBackupCode && !isSignInWithBackupCode && (
        <AlertDialogFooter className="border-t-1 flex flex-col items-center gap-2 p-4 pb-0 sm:flex-col">
          <Text variant="neutral" type="body" className="w-[85%] text-center">
            {t("modal.cant-access-2fa-app")}
          </Text>

          <Text
            variant="accent"
            type="medium"
            className="cursor-pointer"
            onClick={handleIsSignInWithBackupCode}
          >
            {t("modal.sign-in-with-backup-code")}
          </Text>
        </AlertDialogFooter>
      )}
    </>
  )
}

export default EnterTwoFactorCodeModalContent
