import { AlertDialog } from "@instamint/ui-kit"
import React, { useState } from "react"

import DisableTwoFactorAuthModal from "@/web/components/users/settings/DisableTwoFactorAuthModal"
import EnableTwoFactorAuthModal from "@/web/components/users/settings/EnableTwoFactorAuthModal"

type Props = {
  isOpen: boolean
  handleModal: () => void
  is2faEnabled: boolean | undefined
}

const TwoFactorAuthModal = (props: Props) => {
  const { isOpen, handleModal, is2faEnabled } = props

  const [is2faActive] = useState<boolean | undefined>(is2faEnabled)

  return (
    <AlertDialog open={isOpen}>
      {is2faActive ? (
        <DisableTwoFactorAuthModal handleModal={handleModal} />
      ) : (
        <EnableTwoFactorAuthModal handleModal={handleModal} />
      )}
    </AlertDialog>
  )
}

export default TwoFactorAuthModal
