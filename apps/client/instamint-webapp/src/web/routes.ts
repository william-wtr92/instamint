import { defineRoutes } from "@/types"

const clientRoutes = {
  home: "/",
  signUp: "/sign-up",
  signIn: "/sign-in",
  authEmailConfirmation: "/auth/email",
  authEmailResend: "/auth/email/resend",
  profileSettings: "/profile/settings",
  resetPasswordRequest: "/reset-password/request",
  resetPasswordConfirm: "/reset-password/confirm",
} as const

const apiRoutes = {
  auth: {
    signUp: "/auth/sign-up",
    emailValidation: "/auth/email-validation",
    resendEmailValidation: "/auth/resend-email-validation",
    signIn: "/auth/sign-in",
    signOut: "/auth/sign-out",
    me: "/auth/me",
  },
  users: {
    requestResetPassword: "/users/reset-password/request",
    confirmResetPassword: "/users/reset-password/confirm",
    deleteAccount: "/users/delete-account",
    reactivateAccount: "/users/reactivate-account",
  },
} as const

export const routes = defineRoutes({
  client: clientRoutes,
  api: apiRoutes,
})

export type ClientRoutes = (typeof clientRoutes)[keyof typeof clientRoutes]
