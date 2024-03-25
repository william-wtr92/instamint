import { defineRoutes } from "@/types"

export const routes = defineRoutes({
  users: {
    signup: "/users",
    emailValidation: "/users/emailValidation",
    resendEmailValidation: "/users/resendEmailValidation",
  },
})
