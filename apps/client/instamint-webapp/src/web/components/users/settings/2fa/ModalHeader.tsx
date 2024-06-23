import { ChevronLeftIcon, XMarkIcon } from "@heroicons/react/24/outline"
import { AlertDialogCancel } from "@instamint/ui-kit"
import React from "react"

type Props = {
  step: number
  closeModal: () => void
  handlePreviousStep: () => void
}

const ModalHeader = (props: Props) => {
  const { step, closeModal, handlePreviousStep } = props

  return (
    <>
      {step === 2 ||
        (step === 3 && (
          <AlertDialogCancel
            onClick={handlePreviousStep}
            className="absolute left-0 top-0 rounded-tl-md border-0 p-[5px]"
          >
            <ChevronLeftIcon className="size-7" />
          </AlertDialogCancel>
        ))}

      <AlertDialogCancel
        onClick={closeModal}
        className="absolute right-0 top-0 rounded-tr-md border-0 p-[5px]"
      >
        <XMarkIcon className="size-7" />
      </AlertDialogCancel>
    </>
  )
}

export default ModalHeader
