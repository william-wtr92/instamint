import { zodResolver } from "@hookform/resolvers/zod"
import { visibilitySchema, type Visibility } from "@instamint/shared-types"
import {
  Button,
  FormControl,
  Switch,
  FormDescription,
  Form,
  FormField,
  FormItem,
  FormLabel,
} from "@instamint/ui-kit"
import { useTranslation } from "next-i18next"
import { useEffect } from "react"
import { useForm } from "react-hook-form"

type Props = {
  isPrivate: boolean | undefined
  onSubmit: (values: Visibility) => void
}

export const VisibilityAccount = ({ isPrivate, onSubmit }: Props) => {
  const { t } = useTranslation()

  const form = useForm<Visibility>({
    resolver: zodResolver(visibilitySchema),
  })

  useEffect(() => {
    form.setValue("isPrivate", isPrivate!)
  }, [form, isPrivate])

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-6">
        <div className="mt-6 space-y-4">
          <FormField
            control={form.control}
            name="isPrivate"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                <div className="space-y-0.5">
                  <FormLabel>
                    {t("profile-settings-security:visibility.label")}
                  </FormLabel>
                  <FormDescription className="text-small xl:text-medium xl:font-light">
                    {t("profile-settings-security:visibility.description")}
                  </FormDescription>
                </div>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
              </FormItem>
            )}
          />
        </div>

        <Button className="w-full" type="submit">
          {t("profile-settings-security:visibility.cta.submit")}
        </Button>
      </form>
    </Form>
  )
}
