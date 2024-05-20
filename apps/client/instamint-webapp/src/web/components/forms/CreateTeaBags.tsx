import { zodResolver } from "@hookform/resolvers/zod"
import {
  type CreateTeaBags,
  createTeaBagsSchema,
} from "@instamint/shared-types"
import {
  Button,
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  Input,
  Label,
} from "@instamint/ui-kit"
import { useTranslation } from "next-i18next"
import { useForm } from "react-hook-form"

type Props = {
  onSubmit: (values: CreateTeaBags) => void
}

export const CreateTeaBagsForm = (props: Props) => {
  const { onSubmit } = props

  const { t } = useTranslation("teabags")

  const form = useForm<CreateTeaBags>({
    resolver: zodResolver(createTeaBagsSchema),
    mode: "onBlur",
    defaultValues: {
      name: "",
      bio: "",
      link: "",
    },
  })

  return (
    <>
      <Form {...form}>
        <Dialog onOpenChange={() => form.reset()}>
          <DialogTrigger asChild>
            <Label className="font-semibold hover:cursor-pointer">
              {t("create.triggerLabel")}
            </Label>
          </DialogTrigger>
          <DialogContent className="bg-white">
            <DialogHeader className="mb-6">
              <DialogTitle className="font-extrabold">
                {t("create.title")}
              </DialogTitle>
            </DialogHeader>
            <div className="flex flex-col">
              <form onSubmit={form.handleSubmit(onSubmit)}>
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem className="relative w-full">
                      <FormLabel className="relative left-1 flex items-center gap-2 font-bold">
                        <span>{t("create.name.label")}</span>
                      </FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            className="focus-visible:outline-accent-500 mt-4 px-4 py-2 focus-visible:border-0 focus-visible:ring-0"
                            type="text"
                            placeholder={t("create.name.placeholder")}
                            {...field}
                          />
                        </div>
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="bio"
                  render={({ field }) => (
                    <FormItem className="relative w-full">
                      <FormLabel className="relative left-1 mt-6 flex items-center gap-2 font-bold">
                        <span>{t("create.bio.label")}</span>
                      </FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            className="focus-visible:outline-accent-500 mt-4 px-4 py-2 focus-visible:border-0 focus-visible:ring-0"
                            type="text"
                            placeholder={t("create.bio.placeholder")}
                            {...field}
                          />
                        </div>
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="link"
                  render={({ field }) => (
                    <FormItem className="relative w-full">
                      <FormLabel className="relative left-1 mt-6 flex items-center gap-2 font-bold">
                        <span>{t("create.link.label")}</span>
                      </FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            className="focus-visible:outline-accent-500 mt-4 px-4 py-2 focus-visible:border-0 focus-visible:ring-0"
                            type="text"
                            placeholder={t("create.link.placeholder")}
                            {...field}
                          />
                        </div>
                      </FormControl>
                    </FormItem>
                  )}
                />
                <DialogFooter>
                  <Button
                    disabled={!form.formState.isValid}
                    type="submit"
                    className="bg-accent-500 mt-6 py-2.5 font-semibold text-white"
                  >
                    {t(`create.submit`)}
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
