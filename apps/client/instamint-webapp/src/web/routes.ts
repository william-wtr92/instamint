import { defineRoutes } from "@/types"

export const routes = defineRoutes({
  auth: {
    signUp: "/auth/sign-up",
    emailValidation: "/auth/email-validation",
    resendEmailValidation: "/auth/resend-email-validation",
    signIn: "/auth/sign-in",
    me: "/auth/me",
  },
})
