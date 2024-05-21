import { PlusCircleIcon } from "@heroicons/react/24/outline"
import { zodResolver } from "@hookform/resolvers/zod"
import {
  type UploadPublication,
  UploadPublicationSchema,
} from "@instamint/shared-types"
import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
  Label,
  Textarea,
} from "@instamint/ui-kit"
import { useTranslation } from "next-i18next"
import { useCallback } from "react"
import { useForm } from "react-hook-form"

type Props = {
  onSubmit: (values: UploadPublication) => void
}

export const UploadPublicationForm = (props: Props) => {
  const { onSubmit } = props

  const { t } = useTranslation("profile")

  const form = useForm<UploadPublication>({
    resolver: zodResolver(UploadPublicationSchema),
    mode: "onBlur",
    defaultValues: {
      description: "",
      image: undefined,
    },
  })

  const {
    formState: { errors },
  } = form

  const handleClearAvatar = useCallback(() => {
    form.setValue("image", undefined)
  }, [form])

  return (
    <>
      <Form {...form}>
        <Dialog onOpenChange={() => form.reset()}>
          <DialogTrigger asChild>
            <PlusCircleIcon className="text-accent-500 xs:size-12 size-6 stroke-[0.125rem]" />
          </DialogTrigger>
          <DialogContent className="flex flex-col gap-5 bg-white">
            <DialogHeader className="flex flex-col gap-3">
              <DialogTitle className="font-extrabold">
                {t("profile:add-publication.title")}
              </DialogTitle>
              <DialogDescription className="flex flex-col gap-2">
                <span>{t("profile:add-publication.p1")}</span>
              </DialogDescription>
            </DialogHeader>
            <div className="gap grid">
              <form onSubmit={form.handleSubmit(onSubmit)}>
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem className="relative w-full">
                      <FormLabel className="relative left-1 flex items-center gap-2 font-bold">
                        <span>
                          {t("profile:add-publication.description.label")}
                        </span>
                      </FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Textarea
                            className="focus-visible:outline-accent-500 mt-4 px-4 py-2 focus-visible:border-0 focus-visible:ring-0"
                            placeholder={t(
                              "profile:add-publication.description.placeholder"
                            )}
                            {...field}
                          />
                        </div>
                      </FormControl>
                      <FormMessage
                        className="text-error-primary relative left-2"
                        useCustomError={true}
                      >
                        {errors.description ? (
                          <span>
                            {t("profile:add-publication.description.error")}
                          </span>
                        ) : null}
                      </FormMessage>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="image"
                  render={({ field: { value, onChange, ...fieldProps } }) => (
                    <FormItem className="w-full">
                      <FormLabel
                        className="relative left-1 font-bold"
                        htmlFor={"image"}
                      >
                        {t("profile:add-publication.image.label")}
                      </FormLabel>
                      <FormControl>
                        <div>
                          <Input
                            {...fieldProps}
                            id={"image"}
                            type={"file"}
                            className="hidden"
                            placeholder={t(
                              "profile:add-publication.image.placeholder"
                            )}
                            accept="image/png, image/jpeg, image/jpg"
                            onChange={(event) =>
                              onChange(
                                event.target.files && event.target.files[0]
                              )
                            }
                          />
                          <div className="relative left-1.5 mt-4 flex items-center gap-3">
                            <Label
                              htmlFor={"image"}
                              className="rounded-md p-3 outline-dashed outline-2 hover:cursor-pointer"
                            >
                              {t("profile:add-publication.image.placeholder")}
                            </Label>
                            <span>{value ? value.name : ""} </span>
                            {value && (
                              <span
                                onClick={handleClearAvatar}
                                className="hover:cursor-pointer"
                              >
                                {t("profile:add-publication.image.delete")}
                              </span>
                            )}
                          </div>
                        </div>
                      </FormControl>
                      <FormMessage
                        className="text-error-primary relative left-2"
                        useCustomError={true}
                      >
                        {errors.image ? (
                          <span>
                            {t("profile:add-publication.image.error")}
                          </span>
                        ) : null}
                      </FormMessage>
                    </FormItem>
                  )}
                />
                <DialogFooter>
                  <Button
                    disabled={!form.formState.isValid}
                    type="submit"
                    className="bg-accent-500 mt-6 py-2.5 font-semibold text-white"
                  >
                    {t("profile:cta.submit")}
                  </Button>
                </DialogFooter>
              </form>
            </div>
          </DialogContent>
        </Dialog>
      </Form>
    </>
  )
}
