import { defineRoutes } from "@/types"

const clientRoutes = {
  home: "/",
  signUp: "/sign-up",
  signIn: "/sign-in",
  auth: {
    email: {
      confirmation: "/auth/email",
      resend: "/auth/email/resend",
    },
  },
  profile: {
    settings: "/profile/settings",
  },
  users: {
    resetPasswordRequest: "/users/reset-password",
    resetPasswordConfirm: "/users/reset-password/confirm",
  },
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
    updateUserInfos: "/users/update-account",
    deleteAccount: "/users/delete-account",
    reactivateAccount: "/users/reactivate-account",
  },
} as const

export const routes = defineRoutes({
  client: clientRoutes,
  api: apiRoutes,
})
