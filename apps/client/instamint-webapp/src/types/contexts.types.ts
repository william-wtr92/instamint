import { ReactNode } from "react"

import {
  SignUpTypes,
  UserEmailToken,
  UserResendEmail,
} from "@instamint/shared-types"

export type AppContextProviderProps = {
  children: ReactNode
}

type AppContextActionsType<T> = (data: T) => Promise<[Error | null, T?]>

export type AppContextType = {
  services: {
    users: {
      signup: AppContextActionsType<SignUpTypes>
      emailValidation: AppContextActionsType<UserEmailToken>
      resendEmailValidation: AppContextActionsType<UserResendEmail>
    }
  }
}
