import { defineRoutes } from "@/types"

export const routes = defineRoutes({
  users: {
    signUp: "/users",
    emailValidation: "/users/emailValidation",
    resendEmailValidation: "/users/resendEmailValidation",
  },
})
