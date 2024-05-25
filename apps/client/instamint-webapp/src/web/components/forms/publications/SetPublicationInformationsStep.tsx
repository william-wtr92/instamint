import { XMarkIcon } from "@heroicons/react/24/outline"
import {
  AlertDialogFooter,
  Input,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Text,
  Textarea,
} from "@instamint/ui-kit"
import { useEffect, useMemo, useRef } from "react"
import { useTranslation } from "react-i18next"

import ImageDisplay from "@/web/components/utils/ImageDisplay"
import countries from "@/web/utils/countries.json"

type Props = {
  croppedImage: File
  location: string | undefined
  hashtags: string[]
  setDescription: (description: string) => void
  setLocation: (location: string) => void
  setHashtags: (hashtags: string[]) => void
  removeHashtag: (index: number) => void
}

const SetPublicationInformationsStep = (props: Props) => {
  const {
    croppedImage,
    location,
    hashtags,
    setDescription: handleDescription,
    setLocation: handleLocation,
    setHashtags: handleHashtags,
    removeHashtag,
  } = props

  const { t } = useTranslation("navbar")

  const inputRef = useRef<HTMLInputElement>(null)

  const imageSrc = useMemo(() => {
    if (!croppedImage) {
      return ""
    }

    return URL.createObjectURL(croppedImage)
  }, [croppedImage])

  useEffect(() => {
    if (!inputRef.current) {
      return
    }

    const input = inputRef.current

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Enter") {
        event.preventDefault()

        if (input.value.trim() === "") {
          return
        }

        const currentHashtags = hashtags

        const hashtag = "#" + input.value.trim()
        const newHashtags = [...currentHashtags, hashtag]

        if (newHashtags.length <= 5) {
          handleHashtags(newHashtags)
        }

        input.value = ""
      }
    }

    input.addEventListener("keydown", handleKeyDown)

    return () => {
      input.removeEventListener("keydown", handleKeyDown)
    }
  }, [hashtags, handleHashtags])

  useEffect(() => {
    const input = inputRef.current

    if (!input) {
      return
    }

    const handleRegex = (event: Event) => {
      const regex = /^[a-zA-Z]*$/
      const input = event.target as HTMLInputElement

      if (!input) {
        return
      }

      if (!regex.test(input.value)) {
        input.value = input.value.slice(0, -1)
      }
    }

    input.addEventListener("input", handleRegex)

    return () => {
      input.removeEventListener("input", handleRegex)
    }
  }, [])

  return (
    <AlertDialogFooter className="flex h-[60vh] w-[100vw] flex-col overflow-scroll pt-4 md:h-[60vh] md:w-[80vw] md:flex-row md:overflow-auto md:pt-0 lg:w-[60vw]">
      <ImageDisplay src={imageSrc} />

      <div className="flex flex-col gap-4 p-4 md:w-[40%] md:overflow-scroll">
        <div className="flex w-full flex-col gap-2">
          <p className="relative left-1 font-bold text-inherit">
            {t("add-publication-modal.step-three.description-input.label")}
          </p>

          <Textarea
            className="focus-visible:outline-accent-500 max-h-[10rem] px-4 py-2 focus-visible:border-0 focus-visible:ring-0"
            placeholder={t(
              "add-publication-modal.step-three.description-input.placeholder"
            )}
            onChange={(event) => handleDescription(event.target.value)}
          />
        </div>

        <div className="flex w-full flex-col gap-2">
          <p className="relative left-1 font-bold">
            {t("add-publication-modal.step-three.location-input.label")}
          </p>

          <Select onValueChange={handleLocation} value={location}>
            <SelectTrigger className="w-full">
              <SelectValue
                placeholder={t(
                  "add-publication-modal.step-three.location-input.placeholder"
                )}
              />
            </SelectTrigger>
            <SelectContent
              className="w-full bg-white"
              position={"item-aligned"}
            >
              {countries.map((country, index) => (
                <SelectItem key={index} value={country.name}>
                  {t(`countries:${country.name}`)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex w-full flex-col gap-2">
          <p className="relative left-1 font-bold">
            {t("add-publication-modal.step-three.hashtags-input.label")}
          </p>

          {hashtags.length > 0 && (
            <div className="flex flex-row flex-wrap gap-2 rounded-sm p-1">
              {hashtags.map((hashtag, index) => (
                <button
                  type="button"
                  key={index}
                  className="bg-accent-500 group/hashtag flex flex-row flex-wrap items-center justify-between rounded-sm p-1 text-white hover:gap-2"
                  onClick={() => removeHashtag(index)}
                >
                  <Text type="medium" variant="none">
                    {hashtag}
                  </Text>
                  <span>
                    <XMarkIcon className="hidden size-4 group-hover/hashtag:block" />
                  </span>
                </button>
              ))}
            </div>
          )}

          <Input
            type="text"
            ref={inputRef}
            placeholder={t(
              "add-publication-modal.step-three.hashtags-input.placeholder"
            )}
            min={2}
            maxLength={20}
          />
        </div>
      </div>
    </AlertDialogFooter>
  )
}

export default SetPublicationInformationsStep
