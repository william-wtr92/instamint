import {
  AlertDialogAction,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@instamint/ui-kit"
import Image from "next/image"
import { useTranslation } from "next-i18next"
import React from "react"

import Loader from "@/web/components/utils/Loader"

type Props = {
  handleNextStep: () => void
  showLoader: boolean
  qrCode: string
}

const DisplayQrCodeStep = (props: Props) => {
  const { handleNextStep, showLoader, qrCode } = props
  const { t } = useTranslation("profile-settings-security")

  return (
    <>
      <AlertDialogHeader>
        <AlertDialogTitle className="mx-auto w-[85%] text-center">
          {t("modal.activate-2fa.step-two.title")}
        </AlertDialogTitle>
      </AlertDialogHeader>

      <AlertDialogFooter className="items-center sm:flex-col sm:items-center sm:justify-center">
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
            {t("modal.cta.i-have-my-2fa-code")}
          </AlertDialogAction>
        )}
      </AlertDialogFooter>
    </>
  )
}

export default DisplayQrCodeStep
