import { zodResolver } from "@hookform/resolvers/zod"
import {
  searchByEmailSchema,
  type SearchByEmail,
} from "@instamint/shared-types"
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
  searchByEmail: boolean | undefined
  onSubmit: (values: SearchByEmail) => void
}

export const SearchAccountByEmail = ({ searchByEmail, onSubmit }: Props) => {
  const { t } = useTranslation()

  const form = useForm<SearchByEmail>({
    resolver: zodResolver(searchByEmailSchema),
  })

  useEffect(() => {
    form.setValue("searchByEmail", searchByEmail!)
  }, [form, searchByEmail])

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-6">
        <div className="mt-6 space-y-4">
          <FormField
            control={form.control}
            name="searchByEmail"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                <div className="space-y-0.5">
                  <FormLabel>
                    {t("profile-settings-security:searchByEmail.label")}
                  </FormLabel>
                  <FormDescription className="text-small xl:text-medium xl:font-light">
                    {t("profile-settings-security:searchByEmail.description")}
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
          {t(`profile-settings-security:searchByEmail.cta.submit`)}
        </Button>
      </form>
    </Form>
  )
}
