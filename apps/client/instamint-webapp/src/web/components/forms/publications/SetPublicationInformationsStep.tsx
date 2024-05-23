import { XMarkIcon } from "@heroicons/react/24/outline"
import { type AddPublication } from "@instamint/shared-types"
import {
  AlertDialogFooter,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Text,
  Textarea,
} from "@instamint/ui-kit"
import Image from "next/image"
import React, { useCallback, useEffect, useRef } from "react"
import type { UseFormReturn } from "react-hook-form"
import { useTranslation } from "react-i18next"

import countries from "@/web/utils/countries.json"

type Props = {
  form: UseFormReturn<AddPublication>
  croppedImage: File
}

const SetPublicationInformationsStep = (props: Props) => {
  const { form, croppedImage } = props

  const { t } = useTranslation("navbar")

  const inputRef = useRef<HTMLInputElement>(null)

  const {
    formState: { errors },
  } = form

  const removeHashtag = useCallback(
    (index: number) => {
      form.setValue(
        "hashtags",
        form.getValues("hashtags").filter((_, i) => i !== index)
      )
    },
    [form]
  )

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

        const currentHashtags = form.getValues("hashtags")

        const hashtag = "#" + input.value.trim()
        const newHashtags = [...currentHashtags, hashtag]

        if (newHashtags.length <= 5) {
          form.setValue("hashtags", newHashtags)
        }

        input.value = ""
      }
    }

    input.addEventListener("keydown", handleKeyDown)

    return () => {
      input.removeEventListener("keydown", handleKeyDown)
    }
  }, [form])

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
      <div className="relative aspect-square h-full min-h-[25vh] flex-1 self-center overflow-hidden bg-neutral-800 md:h-full md:w-[60%] md:self-start">
        <Image
          src={URL.createObjectURL(croppedImage)}
          className="h-full w-full object-contain"
          alt="Uploaded publication image"
          fill
        />
      </div>

      <div className="flex flex-col gap-4 p-4 md:w-[40%] md:overflow-scroll">
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel className="relative left-1 font-bold">
                {t("add-publication-modal.step-three.description-input.label")}
              </FormLabel>
              <FormControl>
                <Textarea
                  className="focus-visible:outline-accent-500 mt-2 max-h-[10rem] px-4 py-2 focus-visible:border-0 focus-visible:ring-0"
                  placeholder={t(
                    "add-publication-modal.step-three.description-input.placeholder"
                  )}
                  {...field}
                />
              </FormControl>
              <FormMessage
                className="text-error-primary relative left-2"
                useCustomError={true}
              >
                {errors.description ? (
                  <span>
                    {t(
                      "add-publication-modal.step-three.description-input.error"
                    )}
                  </span>
                ) : null}
              </FormMessage>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="location"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel className="relative left-1 font-bold">
                {t("add-publication-modal.step-three.location-input.label")}
              </FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger className="w-full">
                    <SelectValue
                      placeholder={t(
                        "add-publication-modal.step-three.location-input.placeholder"
                      )}
                    />
                  </SelectTrigger>
                </FormControl>
                <SelectContent className="w-full bg-white" position={"popper"}>
                  {countries.map((country, index) => (
                    <SelectItem key={index} value={country.name}>
                      {t(`countries:${country.name}`)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage
                className="text-error-primary relative left-2"
                useCustomError={true}
              >
                {errors.location ? (
                  <span>
                    {t("add-publication-modal.step-three.location-input.error")}
                  </span>
                ) : null}
              </FormMessage>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="hashtags"
          render={() => (
            <FormItem>
              <FormLabel className="relative left-1 font-bold">
                {t("add-publication-modal.step-three.hashtags-input.label")}
              </FormLabel>

              {form.getValues("hashtags").length > 0 && (
                <div className="flex flex-row flex-wrap gap-2 rounded-sm p-1">
                  {form.getValues("hashtags").map((hashtag, index) => (
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

              <FormControl>
                <Input
                  type="text"
                  ref={inputRef}
                  placeholder={t(
                    "add-publication-modal.step-three.hashtags-input.placeholder"
                  )}
                  min={2}
                  maxLength={20}
                />
              </FormControl>
            </FormItem>
          )}
        />
      </div>
    </AlertDialogFooter>
  )
}

export default SetPublicationInformationsStep
