import { Button, Slider } from "@instamint/ui-kit"
import Image from "next/image"
import { useTranslation } from "next-i18next"
import { useCallback, useState } from "react"
import Cropper, { type Area, type Point } from "react-easy-crop"

import getCroppedImg from "@/web/utils/helpers/getCroppedImage"

type Props = {
  baseImage: string
  croppedImage: File | null
  handleCroppedImage: (croppedImage: File | null) => void
}

const CroppableImage = (props: Props) => {
  const { baseImage, croppedImage, handleCroppedImage } = props

  const { t } = useTranslation("navbar")

  const [crop, setCrop] = useState<Point>({ x: 0, y: 0 })
  const [zoom, setZoom] = useState<number>(1)
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area>({
    x: 0,
    y: 0,
    width: 0,
    height: 0,
  })

  const handleCrop = useCallback((crop: Point) => {
    setCrop(crop)
  }, [])

  const handleZoom = useCallback((zoom: number) => {
    setZoom(zoom)
  }, [])

  const onCropComplete = useCallback(
    (croppedArea: Area, croppedAreaPixelsParam: Area) => {
      setCroppedAreaPixels(croppedAreaPixelsParam)
    },
    []
  )

  const cropImage = useCallback(async () => {
    const rotation = 0
    const flip = {
      horizontal: false,
      vertical: false,
    }
    const croppedImgFile = await getCroppedImg(
      baseImage,
      croppedAreaPixels,
      rotation,
      flip
    )

    if (!croppedImgFile) {
      return
    }

    handleCroppedImage(croppedImgFile)
  }, [croppedAreaPixels, baseImage, handleCroppedImage])

  const resetToOriginalImage = useCallback(() => {
    handleCroppedImage(null)
  }, [handleCroppedImage])

  return (
    <div className="size-full">
      <div className="relative size-full">
        {croppedImage !== null ? (
          <>
            <Image
              src={URL.createObjectURL(croppedImage)}
              className="h-full w-full object-contain"
              alt="Uploaded publication image"
              fill
            />

            <Button
              type="button"
              className="absolute bottom-4 left-1/2 translate-x-[-50%]"
              onClick={resetToOriginalImage}
            >
              {t("add-publication-modal.cta.back-to-original")}
            </Button>
          </>
        ) : (
          <>
            <Cropper
              image={baseImage}
              crop={crop}
              zoom={zoom}
              aspect={1 / 1}
              onCropChange={handleCrop}
              onCropComplete={onCropComplete}
              onZoomChange={handleZoom}
            />

            <Button
              type="button"
              className="absolute bottom-8 left-1/2 translate-x-[-50%]"
              onClick={cropImage}
            >
              {t("add-publication-modal.cta.crop-image")}
            </Button>

            <Slider
              className="absolute bottom-4 left-1/2 w-[40%] translate-x-[-50%]"
              value={[zoom]}
              min={1}
              max={3}
              step={0.1}
              aria-labelledby="Zoom"
              onValueChange={([zoom]: [number]) => handleZoom(zoom)}
            />
          </>
        )}
      </div>
    </div>
  )
}

export default CroppableImage
