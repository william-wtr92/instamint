import { ArrowLeftIcon, XMarkIcon } from "@heroicons/react/24/outline"
import {
  AlertDialogCancel,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@instamint/ui-kit"
import { useTranslation } from "next-i18next"
import React from "react"

const stepOne = 1

type Props = {
  handleShowAddPublicationModal: () => void
  step: number
  handlePreviousStep: () => void
}

const AddPublicationModalHeader = (props: Props) => {
  const { handleShowAddPublicationModal, step, handlePreviousStep } = props

  const { t } = useTranslation("navbar")

  return (
    <AlertDialogHeader className="border-b-1 flex w-full flex-row items-center justify-between border-neutral-200">
      {step !== stepOne ? (
        <AlertDialogCancel
          className="space-0 mt-0 h-full border-0 bg-none"
          onClick={handlePreviousStep}
        >
          <ArrowLeftIcon className="size-7" />
        </AlertDialogCancel>
      ) : (
        <div className="p-2">
          <div className="size-7" />
        </div>
      )}

      <AlertDialogTitle>
        {t("add-publication-modal.header.add-publication-title")}
      </AlertDialogTitle>

      <AlertDialogCancel
        className="space-0 mt-0 h-full border-0 bg-none"
        onClick={handleShowAddPublicationModal}
      >
        <XMarkIcon className="size-7" />
      </AlertDialogCancel>
    </AlertDialogHeader>
  )
}

export default AddPublicationModalHeader
