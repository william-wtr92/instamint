import { z } from "zod"

export const signInSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8, "Enter your password"),
})

export const twoFactorSignInSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8, "Enter your password"),
  code: z.string().length(6, "Enter your 6-digit code"),
  authorizeDevice: z.boolean(),
})

export const twoFactorSignInWithBackupCodeSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8, "Enter your password"),
  backupCode: z.string().min(1, "Enter your backup code"),
})

export type SignIn = z.infer<typeof signInSchema>
export type TwoFactorSignIn = z.infer<typeof twoFactorSignInSchema>
export type TwoFactorSignInWithBackupCode = z.infer<
  typeof twoFactorSignInWithBackupCodeSchema
>
