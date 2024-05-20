import { zodResolver } from "@hookform/resolvers/zod"
import {
  addPublicationSchema,
  type AddPublication,
} from "@instamint/shared-types"
import { AlertDialog, AlertDialogContent, Form } from "@instamint/ui-kit"
import { useTranslation } from "next-i18next"
import React, { useCallback, useState } from "react"
import { useForm } from "react-hook-form"

import AddPublicationModalHeader from "./AddPublicationModalHeader"
import SetPublicationInformationsStep from "./SetPublicationInformationsStep"
import UploadImageStep from "./UploadImageStep"

const steps = {
  one: 1,
  two: 2,
}

type Props = {
  isOpen: boolean
  handleShowAddPublicationModal: () => void
}

const AddPublicationModal = (props: Props) => {
  const { isOpen, handleShowAddPublicationModal } = props

  const { t } = useTranslation("navbar")

  const form = useForm<AddPublication>({
    resolver: zodResolver(addPublicationSchema),
    mode: "onBlur",
    defaultValues: {
      author: "",
      description: "",
      image: undefined,
      hashtags: [],
      location: undefined,
    },
  })

  const [step, setStep] = useState<number>(1)

  const handleNextStep = useCallback(() => {
    setStep((prevState) => prevState + 1)
  }, [])

  const handlePreviousStep = useCallback(() => {
    setStep((prevState) => prevState - 1)
  }, [])

  return (
    <AlertDialog open={isOpen}>
      <AlertDialogContent
        variant="fit"
        className="flex flex-col gap-0 overflow-hidden bg-white p-0"
      >
        <AddPublicationModalHeader
          handleShowAddPublicationModal={handleShowAddPublicationModal}
          step={step}
          handlePreviousStep={handlePreviousStep}
        />

        <Form {...form}>
          <form className="h-full w-full">
            {step === steps.one && (
              <UploadImageStep form={form} handleNextStep={handleNextStep} />
            )}

            {step === steps.two && (
              <SetPublicationInformationsStep
                form={form}
                handleNextStep={handleNextStep}
              />
            )}
          </form>
        </Form>
      </AlertDialogContent>
    </AlertDialog>
  )
}

export default AddPublicationModal
