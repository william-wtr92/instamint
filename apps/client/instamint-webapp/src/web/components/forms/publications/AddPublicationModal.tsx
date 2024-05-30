import { addPublicationSchema } from "@instamint/shared-types"
import { AlertDialog, AlertDialogContent } from "@instamint/ui-kit"
import { useRouter } from "next/router"
import { useState } from "react"
import { useTranslation } from "react-i18next"

import AddPublicationModalHeader from "@/web/components/forms/publications/AddPublicationModalHeader"
import CropImageStep from "@/web/components/forms/publications/CropImageStep"
import SetPublicationInformationsStep from "@/web/components/forms/publications/SetPublicationInformationsStep"
import UploadImageStep from "@/web/components/forms/publications/UploadImageStep"
import useActionsContext from "@/web/contexts/useActionsContext"
import useAppContext from "@/web/contexts/useAppContext"
import { useGetPublicationsFromUser } from "@/web/hooks/publications/useGetPublicationsFromUser"
import { useUserByUsername } from "@/web/hooks/users/useUserByUsername"

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

  const { t } = useTranslation("navbar")

  const router = useRouter()
  const username = router.query.username as string

  const {
    services: {
      users: { uploadPublication },
    },
  } = useAppContext()

  const { toast } = useActionsContext()

  const { mutate: refreshUserStats } = useUserByUsername({
    username: username,
  })

  const { mutate: refreshPublications } = useGetPublicationsFromUser(username)

  const [step, setStep] = useState<number>(1)
  const [description, setDescription] = useState<string>("")
  const [location, setLocation] = useState<string | undefined>(undefined)
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
    try {
      addPublicationSchema.parse({
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

  const onSubmit = async () => {
    const [err] = await uploadPublication({
      description,
      image: croppedImage!,
      location,
      hashtags,
    })

    if (err) {
      toast({
        variant: "error",
        description: t(`errors.publications.${err.message}`),
      })

      return
    }

    if (router.query.username) {
      await refreshUserStats()
      await refreshPublications()
    }

    toast({
      variant: "success",
      description: t("add-publication-modal.step-three.success"),
    })
    handleShowAddPublicationModal()
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
          handlePreviousStep={handlePreviousStep}
          handleShowAddPublicationModal={handleShowAddPublicationModal}
          onSubmit={onSubmit}
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
