import { ArrowLeftIcon, XMarkIcon } from "@heroicons/react/24/outline"
import {
  AlertDialogCancel,
  AlertDialogHeader,
  AlertDialogTitle,
  Button,
} from "@instamint/ui-kit"
import { useTranslation } from "next-i18next"
import { useCallback } from "react"

import { steps } from "./AddPublicationModal"

type Props = {
  step: number
  baseImage: File | null
  croppedImage: File | null
  isFormValid: () => boolean
  handleNextStep: () => void
  handleShowAddPublicationModal: () => void
  handlePreviousStep: () => void
}

const AddPublicationModalHeader = (props: Props) => {
  const {
    step,
    baseImage,
    croppedImage,
    isFormValid,
    handleNextStep,
    handleShowAddPublicationModal,
    handlePreviousStep,
  } = props

  const { t } = useTranslation("navbar")

  const getModalTitle = useCallback(() => {
    switch (step) {
      case steps.one:
        return t("add-publication-modal.step-one.title")

      case steps.two:
        return t("add-publication-modal.step-two.title")

      case steps.three:
        return t("add-publication-modal.step-three.title")

      default:
        return t("add-publication-modal.step-one.title")
    }
  }, [step, t])

  const handleNextButtonDisabled = useCallback(() => {
    switch (step) {
      case steps.one:
        return baseImage === null

      case steps.two:
        return croppedImage === null

      case steps.three:
        return !isFormValid()

      default:
        return true
    }
  }, [baseImage, croppedImage, isFormValid, step])

  return (
    <AlertDialogHeader className="border-b-1 flex w-full flex-row items-center justify-between border-neutral-200">
      {step !== steps.one ? (
        <div className="flex flex-row flex-nowrap">
          <AlertDialogCancel
            className="space-0 mt-0 h-full border-0 bg-none"
            onClick={handleShowAddPublicationModal}
          >
            <XMarkIcon className="size-7" />
          </AlertDialogCancel>

          <AlertDialogCancel
            className="space-0 mt-0 h-full border-0 bg-none"
            onClick={handlePreviousStep}
          >
            <ArrowLeftIcon className="size-7" />
          </AlertDialogCancel>
        </div>
      ) : (
        <div>
          <AlertDialogCancel
            className="space-0 mt-0 h-full border-0 bg-none"
            onClick={handleShowAddPublicationModal}
          >
            <XMarkIcon className="size-7" />
          </AlertDialogCancel>
        </div>
      )}

      <AlertDialogTitle className="text-body">
        {getModalTitle()}
      </AlertDialogTitle>

      <Button
        className="space-0 mr-1 mt-0 h-full rounded-md border-0 bg-none"
        onClick={handleNextStep}
        disabled={handleNextButtonDisabled()}
      >
        {t("add-publication-modal.cta.next")}
      </Button>
    </AlertDialogHeader>
  )
}

export default AddPublicationModalHeader
