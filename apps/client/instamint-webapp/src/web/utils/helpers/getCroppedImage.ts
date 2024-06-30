export const createImage = (url: string): Promise<HTMLImageElement> =>
  new Promise((resolve, reject) => {
    const image = new Image()
    image.addEventListener("load", () => resolve(image))
    image.addEventListener("error", (error) => reject(error))
    image.setAttribute("crossOrigin", "anonymous")
    image.src = url
  })

export const getRadianAngle = (degreeValue: number): number => {
  return (degreeValue * Math.PI) / 180
}

export const rotateSize = (
  width: number,
  height: number,
  rotation: number
): { width: number; height: number } => {
  const rotRad = getRadianAngle(rotation)

  return {
    width:
      Math.abs(Math.cos(rotRad) * width) + Math.abs(Math.sin(rotRad) * height),
    height:
      Math.abs(Math.sin(rotRad) * width) + Math.abs(Math.cos(rotRad) * height),
  }
}

export type Area = {
  x: number
  y: number
  width: number
  height: number
}

type Flip = {
  horizontal: boolean
  vertical: boolean
}

const getCroppedImg = async (
  imageSrc: string,
  pixelCrop: Area,
  rotation = 0,
  flip: Flip = { horizontal: false, vertical: false }
): Promise<File | null> => {
  const image: HTMLImageElement = await createImage(imageSrc)
  const canvas: HTMLCanvasElement = document.createElement("canvas")
  const ctx: CanvasRenderingContext2D | null = canvas.getContext("2d")

  if (!ctx) {
    return null
  }

  const rotRad: number = getRadianAngle(rotation)

  const { width: bBoxWidth, height: bBoxHeight } = rotateSize(
    image.width,
    image.height,
    rotation
  )

  canvas.width = bBoxWidth
  canvas.height = bBoxHeight

  ctx.translate(bBoxWidth / 2, bBoxHeight / 2)
  ctx.rotate(rotRad)
  ctx.scale(flip.horizontal ? -1 : 1, flip.vertical ? -1 : 1)
  ctx.translate(-image.width / 2, -image.height / 2)

  ctx.drawImage(image, 0, 0)

  const croppedCanvas: HTMLCanvasElement = document.createElement("canvas")
  const croppedCtx: CanvasRenderingContext2D | null =
    croppedCanvas.getContext("2d")

  if (!croppedCtx) {
    return null
  }

  croppedCanvas.width = pixelCrop.width
  croppedCanvas.height = pixelCrop.height

  croppedCtx.drawImage(
    canvas,
    pixelCrop.x,
    pixelCrop.y,
    pixelCrop.width,
    pixelCrop.height,
    0,
    0,
    pixelCrop.width,
    pixelCrop.height
  )

  // As a file
  return new Promise<File | null>((resolve, reject) => {
    croppedCanvas.toBlob((blob: Blob | null) => {
      if (blob) {
        const file = new File([blob], "croppedImage.jpeg", {
          type: "image/jpeg",
        })

        resolve(file)
      } else {
        reject(null)
      }
    }, "image/jpeg")
  })
}

export default getCroppedImg
