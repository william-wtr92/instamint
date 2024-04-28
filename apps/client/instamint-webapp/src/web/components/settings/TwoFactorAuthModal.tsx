import { AlertDialog } from "@instamint/ui-kit"
import React, { useState } from "react"
import EnableTwoFactorAuthModal from "./EnableTwoFactorAuthModal"
import DisableTwoFactorAuthModal from "./DisableTwoFactorAuthModal"

type Props = {
  isOpen: boolean
  handleCloseModal: () => void
  is2faEnabled: boolean | undefined
}

const TwoFactorAuthModal = (props: Props) => {
  const { isOpen, handleCloseModal, is2faEnabled } = props

  const [is2faActive] = useState<boolean | undefined>(is2faEnabled)

  return (
    <AlertDialog open={isOpen}>
      {is2faActive ? (
        <DisableTwoFactorAuthModal handleCloseModal={handleCloseModal} />
      ) : (
        <EnableTwoFactorAuthModal handleCloseModal={handleCloseModal} />
      )}
    </AlertDialog>
  )
}

export default TwoFactorAuthModal
