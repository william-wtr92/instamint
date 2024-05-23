import { addPublicationSchema } from "@instamint/shared-types"
import { AlertDialog, AlertDialogContent } from "@instamint/ui-kit"
import { useState } from "react"

import AddPublicationModalHeader from "@/web/components/forms/publications/AddPublicationModalHeader"
import CropImageStep from "@/web/components/forms/publications/CropImageStep"
import SetPublicationInformationsStep from "@/web/components/forms/publications/SetPublicationInformationsStep"
import UploadImageStep from "@/web/components/forms/publications/UploadImageStep"
import { useUser } from "@/web/hooks/auth/useUser"

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

  const { data, isLoading } = useUser()
  const user = !isLoading && data

  const [step, setStep] = useState<number>(1)
  const [description, setDescription] = useState<string>("")
  const [location, setLocation] = useState<string>("")
  const [hashtags, setHashtags] = useState<string[]>([])
  const [baseImage, setBaseImage] = useState<File | null>(null)
  const [croppedImage, setCroppedImage] = useState<File | null>(null)

  const handleNextStep = () => {
    setStep((prevState) => prevState + 1)
  }

  const handlePreviousStep = () => {
    setStep((prevState) => prevState - 1)
  }

  const removeHashtag = (index: number) => {
    setHashtags((prevState: string[]) =>
      prevState.filter((_, i) => i !== index)
    )
  }

  const handleBaseImage = (image: File | null) => {
    setBaseImage(image)
    setCroppedImage(null)
  }

  const handleCroppedImage = (image: File | null) => {
    setCroppedImage(image)
  }

  const isFormValid = () => {
    if (!user) {
      return false
    }

    try {
      addPublicationSchema.parse({
        author: user.username,
        description,
        image: croppedImage,
        location,
        hashtags,
      })

      return true
    } catch (error) {
      return false
    }
  }

  return (
    <AlertDialog open={isOpen}>
      <AlertDialogContent
        variant="fit"
        className="flex flex-col gap-0 overflow-hidden bg-white p-0"
      >
        <AddPublicationModalHeader
          step={step}
          baseImage={baseImage}
          croppedImage={croppedImage}
          isFormValid={isFormValid}
          handleNextStep={handleNextStep}
          handleShowAddPublicationModal={handleShowAddPublicationModal}
          handlePreviousStep={handlePreviousStep}
        />

        <div className="size-full">
          {step === steps.one && (
            <UploadImageStep
              baseImage={baseImage}
              handleBaseImage={handleBaseImage}
            />
          )}

          {step === steps.two && (
            <CropImageStep
              baseImage={baseImage!}
              croppedImage={croppedImage}
              handleCroppedImage={handleCroppedImage}
            />
          )}

          {step === steps.three && (
            <SetPublicationInformationsStep
              croppedImage={croppedImage!}
              location={location}
              hashtags={hashtags}
              setDescription={setDescription}
              setLocation={setLocation}
              setHashtags={setHashtags}
              removeHashtag={removeHashtag}
            />
          )}
        </div>
      </AlertDialogContent>
    </AlertDialog>
  )
}

export default AddPublicationModal
