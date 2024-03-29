export const redisKeys = {
  users: {
    emailToken: (token: string) => `users:email_token:${token}`,
    emailValidation: (email: string) => `users:email_validation:${email}`,
  },
} as const
