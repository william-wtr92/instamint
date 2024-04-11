import { type UsernameEmailSettingsSchema } from "@instamint/shared-types"

export type UpdateFieldsAccountProps = {
  settingsRequired: string
  user: UsernameEmailSettingsSchema | undefined | null
  onSubmit: (values: UsernameEmailSettingsSchema) => Promise<void>
  error: string | Error | null
  success: string | null
}
