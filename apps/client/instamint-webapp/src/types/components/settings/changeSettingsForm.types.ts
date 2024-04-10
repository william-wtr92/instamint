import { type UsernameEmailSettingsSchema } from "@instamint/shared-types"

export type ChangeSettingsFormProps = {
  settingsRequired: string
  user: UsernameEmailSettingsSchema | undefined
  onSubmit: (values: UsernameEmailSettingsSchema) => Promise<void>
}
