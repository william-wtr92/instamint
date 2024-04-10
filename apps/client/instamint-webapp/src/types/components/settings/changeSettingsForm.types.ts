import { type UsernameEmailSettingsSchema } from "@instamint/shared-types"

export type ChangeSettingsFormProps = {
  settingsRequired: string
  translation: (arg1: string) => string
  user: UsernameEmailSettingsSchema | undefined
  onSubmit: (values: UsernameEmailSettingsSchema) => Promise<void>
}
