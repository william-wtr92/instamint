import appConfig from "@/db/config/config"

export const sgKeys = {
  auth: {
    emailValidation: appConfig.sendgrid.templates.emailValidation,
  },
  users: {
    resetPassword: appConfig.sendgrid.templates.resetPassword,
    confirmResetPassword: appConfig.sendgrid.templates.confirmResetPassword,
    modifyPassword: appConfig.sendgrid.templates.modifyPassword,
  },
} as const
