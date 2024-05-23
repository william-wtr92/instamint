import { zodResolver } from "@hookform/resolvers/zod"
import {
  addPublicationSchema,
  type AddPublication,
} from "@instamint/shared-types"
import { AlertDialog, AlertDialogContent, Form } from "@instamint/ui-kit"
import { useCallback, useState } from "react"
import { useForm } from "react-hook-form"

import AddPublicationModalHeader from "./AddPublicationModalHeader"
import CropImageStep from "./CropImageStep"
import SetPublicationInformationsStep from "./SetPublicationInformationsStep"
import UploadImageStep from "./UploadImageStep"

export const steps = {
  one: 1,
  two: 2,
  three: 3,
}

type Props = {
  isOpen: boolean
  handleShowAddPublicationModal: () => void
}

const AddPublicationModal = (props: Props) => {
  const { isOpen, handleShowAddPublicationModal } = props

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
  const [baseImage, setBaseImage] = useState<File | null>(null)
  const [croppedImage, setCroppedImage] = useState<File | null>(null)

  const handleNextStep = useCallback(() => {
    setStep((prevState) => prevState + 1)
  }, [])

  const handlePreviousStep = useCallback(() => {
    setStep((prevState) => prevState - 1)
  }, [])

  const handleBaseImage = useCallback((image: File | null) => {
    setBaseImage(image)
    setCroppedImage(null)
  }, [])

  const handleCroppedImage = useCallback((image: File | null) => {
    setCroppedImage(image)
  }, [])

  const handleFinalImage = useCallback(
    (image: File) => {
      form.setValue("image", image)
    },
    [form]
  )

  return (
    <AlertDialog open={isOpen}>
      <AlertDialogContent
        variant="fit"
        className="flex flex-col gap-0 overflow-hidden bg-white p-0"
      >
        <AddPublicationModalHeader
          form={form}
          step={step}
          baseImage={baseImage}
          croppedImage={croppedImage}
          handleNextStep={handleNextStep}
          handleShowAddPublicationModal={handleShowAddPublicationModal}
          handlePreviousStep={handlePreviousStep}
        />

        <Form {...form}>
          <form className="h-full w-full">
            {step === steps.one && (
              <UploadImageStep
                form={form}
                baseImage={baseImage}
                handleBaseImage={handleBaseImage}
              />
            )}

            {step === steps.two && (
              <CropImageStep
                baseImage={baseImage!}
                croppedImage={croppedImage}
                handleCroppedImage={handleCroppedImage}
                handleFinalImage={handleFinalImage}
              />
            )}

            {step === steps.three && (
              <SetPublicationInformationsStep
                form={form}
                croppedImage={croppedImage!}
              />
            )}
          </form>
        </Form>
      </AlertDialogContent>
    </AlertDialog>
  )
}

export default AddPublicationModal
