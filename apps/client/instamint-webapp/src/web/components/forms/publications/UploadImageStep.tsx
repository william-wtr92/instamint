import { PhotoIcon } from "@heroicons/react/24/outline"
import type { AddPublication } from "@instamint/shared-types"
import {
  AlertDialogDescription,
  AlertDialogFooter,
  Button,
  FormControl,
  FormField,
  FormItem,
  Input,
  Label,
} from "@instamint/ui-kit"
import Image from "next/image"
import { useTranslation } from "next-i18next"
import React from "react"
import type { UseFormReturn } from "react-hook-form"

type Props = {
  form: UseFormReturn<AddPublication>
  handleNextStep: () => void
}

const UploadImageStep = (props: Props) => {
  const { form, handleNextStep } = props

  const { t } = useTranslation("navbar")

  return (
    <AlertDialogFooter className="flex h-[70vh] w-[100vw] flex-col items-center justify-center gap-4 p-8 pt-0 sm:flex-col sm:justify-center">
      {!form.watch("image") && (
        <>
          <PhotoIcon className="size-14" />

          <AlertDialogDescription>
            {t("add-publication-modal.step-one.description")}
          </AlertDialogDescription>
        </>
      )}

      <FormField
        control={form.control}
        name="image"
        render={({ field: { value, onChange, ...fieldProps } }) => (
          <FormItem className="flex w-full flex-col items-center justify-center gap-4">
            {value && (
              <div className="relative mt-8 aspect-square w-full overflow-hidden rounded border border-neutral-200 md:w-[80%]">
                <Image
                  src={URL.createObjectURL(value)}
                  className="h-full w-full object-cover"
                  alt="Uploaded publication image"
                  fill
                />
              </div>
            )}

            <FormControl>
              <div className="mt-0">
                <Input
                  {...fieldProps}
                  id={"avatar"}
                  type={"file"}
                  className="hidden"
                  placeholder={t(
                    "profile-settings-edit:update-account.avatar.placeholder"
                  )}
                  accept=".jpg,.png,.webp,.ogg,.flac"
                  onChange={(event) =>
                    onChange(event.target.files && event.target.files[0])
                  }
                />

                <div className="flex flex-col items-center gap-3">
                  <Label
                    htmlFor={"avatar"}
                    className="rounded-md p-3 outline-dashed outline-[0.5px] hover:cursor-pointer"
                  >
                    {form.watch("image") === undefined
                      ? t("add-publication-modal.cta.select-image")
                      : t("add-publication-modal.cta.change-image")}
                  </Label>
                </div>
              </div>
            </FormControl>
          </FormItem>
        )}
      />

      {form.watch("image") !== undefined && (
        <Button onClick={handleNextStep}>
          {t("add-publication-modal.cta.next")}
        </Button>
      )}
    </AlertDialogFooter>
  )
}

export default UploadImageStep
