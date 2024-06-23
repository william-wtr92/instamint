import Image from "next/image"
import { memo } from "react"

type Props = {
  src: string
}

const ImageDisplay = memo(({ src }: Props) => (
  <div className="relative aspect-square h-full min-h-[25vh] flex-1 self-center overflow-hidden bg-neutral-800 md:h-full md:w-[60%] md:self-start">
    <Image
      src={src}
      className="h-full w-full object-contain"
      alt="Uploaded publication image"
      fill
    />
  </div>
))

ImageDisplay.displayName = "ImageDisplay"

export default ImageDisplay
