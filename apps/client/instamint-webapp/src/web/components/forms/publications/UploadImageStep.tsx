import { PhotoIcon } from "@heroicons/react/24/outline"
import type { AddPublication } from "@instamint/shared-types"
import {
  AlertDialogDescription,
  AlertDialogFooter,
  FormControl,
  FormField,
  FormItem,
  Input,
  Label,
} from "@instamint/ui-kit"
import Image from "next/image"
import { useTranslation } from "next-i18next"
import type { UseFormReturn } from "react-hook-form"

type Props = {
  form: UseFormReturn<AddPublication>
  baseImage: File | null
  handleBaseImage: (image: File | null) => void
}

const UploadImageStep = (props: Props) => {
  const { form, baseImage, handleBaseImage } = props

  const { t } = useTranslation("navbar")

  return (
    <AlertDialogFooter className="flex h-[60vh] w-[100vw] flex-col items-center justify-center gap-8 p-8 pt-0 sm:flex-col sm:justify-center md:w-[80vw] lg:w-[60vw]">
      {baseImage !== null ? (
        <div className="relative mt-4 aspect-square h-full overflow-hidden rounded border border-neutral-200">
          <Image
            src={URL.createObjectURL(baseImage)}
            className="h-full w-full object-cover"
            alt="Uploaded publication image"
            fill
          />
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center gap-3">
          <PhotoIcon className="size-14" />

          <AlertDialogDescription className="lg:text-heading text-subheading font-medium">
            {t("add-publication-modal.step-one.description")}
          </AlertDialogDescription>

          <AlertDialogDescription className="text-medium font-light">
            {t("add-publication-modal.step-one.sub-description")}
          </AlertDialogDescription>
        </div>
      )}

      <FormField
        control={form.control}
        name="image"
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        render={({ field: { value, onChange, ...fieldProps } }) => (
          <FormItem>
            <FormControl>
              <Input
                {...fieldProps}
                id={"publication-image"}
                type={"file"}
                className="hidden"
                accept=".jpg,.png,.webp,.ogg,.flac"
                onChange={(event) =>
                  handleBaseImage(event.target.files && event.target.files[0])
                }
              />
            </FormControl>
            <Label
              htmlFor={"publication-image"}
              className="lg:text-body rounded-md border border-dashed border-neutral-300 p-3 hover:cursor-pointer"
            >
              {baseImage !== null
                ? t("add-publication-modal.cta.select-image")
                : t("add-publication-modal.cta.change-image")}
            </Label>
          </FormItem>
        )}
      />
    </AlertDialogFooter>
  )
}

export default UploadImageStep
