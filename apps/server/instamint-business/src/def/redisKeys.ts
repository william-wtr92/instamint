export const redisKeys = {
  auth: {
    emailToken: (token: string) => `auth:email_token:${token}`,
    emailValidation: (email: string) => `auth:email_validation:${email}`,
    authSession: (email: string, token: string) =>
      `auth:session:${email}${token ? `:${token}` : ""}`,
  },
} as const
