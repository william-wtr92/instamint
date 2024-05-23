import CroppableImage from "../../layout/CroppableImage"

type Props = {
  baseImage: File
  croppedImage: File | null
  handleCroppedImage: (croppedImage: File | null) => void
  handleFinalImage: (image: File) => void
}

const CropImageStep = (props: Props) => {
  const { baseImage, croppedImage, handleCroppedImage, handleFinalImage } =
    props

  return (
    <div className="h-[60vh] w-[100vw] md:w-[80vw] lg:w-[60vw]">
      <CroppableImage
        handleFinalImage={handleFinalImage}
        baseImage={URL.createObjectURL(baseImage)}
        croppedImage={croppedImage}
        handleCroppedImage={handleCroppedImage}
      />
    </div>
  )
}

export default CropImageStep
