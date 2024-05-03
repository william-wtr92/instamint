import { XMarkIcon } from "@heroicons/react/24/outline"
import {
  AlertDialogCancel,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  Checkbox,
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
  setOtpCode: (otpCode: string) => void
  handleCloseModal: () => void
  authorizeDevice?: boolean
  handleCheckbox?: () => void
  handleTwoFactorCodeValidation: (value?: boolean) => void
}

const otpCodeLength = 6

const EnterTwoFactorCodeModalContent = (props: Props) => {
  const {
    title,
    description,
    otpCode,
    setOtpCode,
    handleCloseModal,
    handleCheckbox,
    authorizeDevice,
    handleTwoFactorCodeValidation,
  } = props

  const { t } = useTranslation("sign-in")

  useEffect(() => {
    if (otpCode.length === otpCodeLength) {
      if (authorizeDevice) {
        handleTwoFactorCodeValidation(authorizeDevice)
      }

      handleTwoFactorCodeValidation()
    }
  }, [otpCode, authorizeDevice, handleTwoFactorCodeValidation])

  return (
    <>
      <AlertDialogCancel
        onClick={handleCloseModal}
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

      <AlertDialogFooter className="mt-4 pb-4 sm:justify-center">
        <InputOTP
          maxLength={6}
          value={otpCode}
          onChange={(value) => setOtpCode(value)}
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
      </AlertDialogFooter>

      {authorizeDevice !== undefined && (
        <AlertDialogFooter className="flex sm:justify-start">
          <Checkbox
            checked={authorizeDevice}
            onCheckedChange={handleCheckbox}
          />
          <Text variant="neutral" type="medium">
            {t("modal.checkbox-description")}
          </Text>
        </AlertDialogFooter>
      )}
    </>
  )
}

export default EnterTwoFactorCodeModalContent
