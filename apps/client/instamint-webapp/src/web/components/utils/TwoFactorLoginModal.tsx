import { XMarkIcon } from "@heroicons/react/24/outline"
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
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
import React, { useCallback, useEffect, useState } from "react"

type Props = {
  isOpen: boolean
  handleCloseModal: () => void
  otpCode: string
  setOtpCode: (value: string) => void
  signInWith2fa: (value: boolean) => void
}

const otpCodeLength = 6

const TwoFactorLoginModal = (props: Props) => {
  const { isOpen, handleCloseModal, otpCode, setOtpCode, signInWith2fa } = props
  const { t } = useTranslation("sign-in")

  const [authorizeDevice, setAuthorizeDevice] = useState<boolean>(false)

  const handleCheckbox = useCallback(() => {
    setAuthorizeDevice((prevState) => !prevState)
  }, [])

  useEffect(() => {
    if (otpCode.length === otpCodeLength) {
      signInWith2fa(authorizeDevice)
    }
  }, [otpCode, signInWith2fa, authorizeDevice])

  return (
    <AlertDialog open={isOpen}>
      <AlertDialogContent className="bg-white pt-8">
        <AlertDialogCancel
          onClick={handleCloseModal}
          className="absolute right-0 top-0 rounded-tr-md border-0 p-[5px]"
        >
          <XMarkIcon className="size-7" />
        </AlertDialogCancel>

        <AlertDialogHeader>
          <AlertDialogTitle className="mx-auto w-[85%] text-center">
            {t("modal.title")}
          </AlertDialogTitle>

          <AlertDialogDescription className="text-center">
            {t("modal.description")}
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

        <AlertDialogFooter className="flex sm:justify-start">
          <Checkbox
            checked={authorizeDevice}
            onCheckedChange={handleCheckbox}
          />
          <Text variant="neutral" type="medium">
            {t("modal.checkbox-description")}
          </Text>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

export default TwoFactorLoginModal
