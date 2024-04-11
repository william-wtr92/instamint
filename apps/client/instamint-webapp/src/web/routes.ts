import { defineRoutes } from "@/types"

export const routes = defineRoutes({
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
    updateFieldsAccount: (id) => `/users/${id}/update-account`,
    deleteAccount: "/users/delete-account",
    reactivateAccount: "/users/reactivate-account",
  },
  profile: {
    settings: "/profile/settings",
  },
})
