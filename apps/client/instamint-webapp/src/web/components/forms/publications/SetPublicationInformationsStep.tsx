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
  Textarea,
} from "@instamint/ui-kit"
import Image from "next/image"
import React, { useCallback, useEffect, useRef } from "react"
import type { UseFormReturn } from "react-hook-form"
import { useTranslation } from "react-i18next"

import countries from "@/web/utils/countries.json"

type Props = {
  form: UseFormReturn<AddPublication>
  handleNextStep: () => void
}

const SetPublicationInformationsStep = (props: Props) => {
  const { form, handleNextStep } = props

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

  return (
    <AlertDialogFooter className="flex h-[70vh] w-[100vw] flex-col gap-4 p-8 md:flex-row">
      <div className="relative aspect-square flex-1 overflow-hidden rounded border border-neutral-200">
        <Image
          src={URL.createObjectURL(form.getValues("image"))}
          className="h-full w-full object-cover"
          alt="Uploaded publication image"
          fill
        />
      </div>

      <div className="flex flex-1 flex-col gap-4">
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel className="relative left-1 font-bold">
                {t("add-publication-modal.step-two.description-input.label")}
              </FormLabel>
              <FormControl>
                <Textarea
                  className="focus-visible:outline-accent-500 mt-2 max-h-[10rem] px-4 py-2 focus-visible:border-0 focus-visible:ring-0"
                  placeholder={t(
                    "add-publication-modal.step-two.description-input.placeholder"
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
                      "add-publication-modal.step-two.description-input.error"
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
                {t("add-publication-modal.step-two.location-input.label")}
              </FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger className="w-[250px]">
                    <SelectValue
                      placeholder={t(
                        "add-publication-modal.step-two.location-input.placeholder"
                      )}
                    />
                  </SelectTrigger>
                </FormControl>
                <SelectContent className="bg-white" position={"popper"}>
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
                    {t("add-publication-modal.step-two.location-input.error")}
                  </span>
                ) : null}
              </FormMessage>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="hashtags"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="relative left-1 font-bold">
                {t("add-publication-modal.step-two.hashtags-input.label")}
              </FormLabel>

              {form.getValues("hashtags").length > 0 && (
                <div className="flex flex-row gap-2 rounded-sm p-1">
                  {form.getValues("hashtags").map((hashtag, index) => (
                    <button
                      type="button"
                      key={index}
                      className="bg-accent-500 group/hashtag flex flex-row items-center justify-between gap-2 rounded-sm p-1 text-white"
                      onClick={() => removeHashtag(index)}
                    >
                      <span>{hashtag}</span>
                      <span>
                        <XMarkIcon className="hidden size-5 group-hover/hashtag:block" />
                      </span>
                    </button>
                  ))}
                </div>
              )}

              <FormControl>
                <Input
                  ref={inputRef}
                  placeholder={t(
                    "add-publication-modal.step-two.hashtags-input.placeholder"
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
