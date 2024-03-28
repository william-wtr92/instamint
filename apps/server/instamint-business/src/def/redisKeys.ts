export const redisKeys = {
  users: {
    emailToken: (token: string) => `email_token:${token}`,
    emailValidation: (email: string) => `email_validation:${email}`,
  },
} as const
