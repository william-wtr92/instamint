import { z } from "zod"

export const twoFactorAuthenticateSchema = z.object({
  password: z.string(),
})

export const activateTwoFactorAuthSchema = z.object({
  code: z.string().min(6).max(6),
})

export type ActivateTwoFactorAuthResult = {
  backupCodes: string[]
}

export type ActivateTwoFactorAuthResponse = {
  result: ActivateTwoFactorAuthResult
}

export type TwoFactorGenerateResult = {
  token: string
  qrCode: string
}

export type TwoFactorGenerateResponse = {
  result: TwoFactorGenerateResult
}

export type TwoFactorAuthenticate = z.infer<typeof twoFactorAuthenticateSchema>
export type ActivateTwoFactorAuth = z.infer<typeof activateTwoFactorAuthSchema>
