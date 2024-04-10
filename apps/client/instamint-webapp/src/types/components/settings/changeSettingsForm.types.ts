import {type UsernameEmailSettingsSchema } from "@instamint/shared-types"

// @/types
export type User = {
  id: number
  username: string;
  email: string;
} 

export type ChangeSettingsFormProps = {
    settingsRequired: string,
    translation: (arg1: string) => string,
    user: User | undefined, 
    onSubmit: (values: UsernameEmailSettingsSchema) => Promise<void>
  }