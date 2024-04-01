export const redisKeys = {
  auth: {
    emailToken: (token: string) => `auth:email_token:${token}`,
    emailValidation: (email: string) => `auth:email_validation:${email}`,
    authSession: (email: string) => `auth:session:${email}`,
  },
  users: {
    resetPassword: (email: string) => `users:reset_password:${email}`,
    resetPasswordToken: (token: string) =>
      `users:reset_password_token:${token}`,
    lastResetPassword: (email: string) => `users:last_reset_password:${email}`,
  },
} as const
